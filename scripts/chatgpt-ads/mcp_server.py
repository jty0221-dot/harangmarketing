# 하랑 ChatGPT 광고 MCP 서버 (stdio, 표준 라이브러리만 사용)
#
# Claude Code·Codex 가 '커넥터'처럼 바로 부를 수 있게 OpenAI Ads API 를 도구로 묶는다.
# 키는 ads.py 와 같은 곳에서 읽고(OPENAI_ADS_API_KEY > OPENAI_ADS_API_KEY_FILE > 기본 파일), 어떤 응답에도 넣지 않는다.
# 쓰기 도구(설명이 [쓰기·광고비] 로 시작)는 실제 광고비에 영향을 준다. 클라이언트가 호출마다 승인을 받게 둔다.
import json, sys, datetime, urllib.parse, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import ads  # noqa: E402

CAMPAIGN = "cmpn_aeb6c4c1bb5c819c9d6d7f2a4b442e9a"
KST = datetime.timezone(datetime.timedelta(hours=9))
FILE_IDS = pathlib.Path(__file__).with_name("file_ids.json")


def _ok(st, body):
    if st != 200:
        raise RuntimeError(f"OpenAI Ads API {st}: {json.dumps(body, ensure_ascii=False)[:500]}")
    return body


def _ts(d):
    return int(datetime.datetime.strptime(d, "%Y-%m-%d").replace(tzinfo=KST).timestamp())


# ── 읽기 도구 ──────────────────────────────────────────────

def account_overview(_):
    acct = _ok(*ads.call("GET", "/ad_account"))
    camp = _ok(*ads.call("GET", f"/campaigns/{CAMPAIGN}?include[]=serving_issues"))
    groups = _ok(*ads.call("GET", f"/ad_groups?campaign_id={CAMPAIGN}&limit=100"))["data"]
    out = {"account": {k: acct.get(k) for k in ["id", "name", "status", "currency_code", "timezone", "review"]},
           "campaign": {k: camp.get(k) for k in ["id", "name", "status", "budget", "bidding_type", "serving_issues", "landing_page_configuration"]},
           "ad_groups": []}
    for g in groups:
        al = _ok(*ads.call("GET", f"/ads?ad_group_id={g['id']}&limit=100"))["data"]
        out["ad_groups"].append({
            "id": g["id"], "name": g["name"], "status": g["status"],
            "bid_krw": (g.get("bidding_config") or {}).get("max_bid_micros", 0) // 1_000_000,
            "context_hints": g.get("context_hints"),
            "utm": (g.get("landing_page_configuration") or {}).get("query_string_template"),
            "ads": [{"id": a["id"], "name": a["name"], "status": a["status"], "review": a["review_status"],
                     "title": a["creative"].get("title"), "body": a["creative"].get("body"),
                     "url": a["creative"].get("target_url")} for a in al]})
    return out


def performance(args):
    start, end = args["start_date"], args["end_date"]
    level = args.get("level", "ad_group")
    tr = json.dumps({"type": "unix_range", "start": _ts(start), "end": _ts(end)})
    fields = [f"{level}.id", f"{level}.name"] + [f"{level}.{m}" for m in ["impressions", "clicks", "spend", "ctr", "cpc"]]
    q = [("time_granularity", "none"), ("aggregation_level", level), ("time_ranges[]", tr)] + [("fields[]", f) for f in fields]
    delivery = _ok(*ads.call("GET", "/ad_account/insights?" + urllib.parse.urlencode(q)))
    # 응답 행의 엔티티 ID 는 '<level>_id' 키에 있다 ('id' 는 기간·플랜이 섞인 행 키라 쓰면 안 됨)
    ids = sorted({r.get(f"{level}_id") for r in delivery.get("data", []) if r.get(f"{level}_id")})
    conv = None
    if ids and level in ("campaign", "ad_group", "ad"):
        conv = _ok(*ads.call("POST", "/conversions/insights", {"aggregation_level": level, "time_ranges": [tr], "entity_ids": ids}))
    return {"period": f"{start} ~ {end} (끝 날짜 미포함)", "delivery": delivery, "conversions": conv}


def review_status(_):
    rows = []
    for g in _ok(*ads.call("GET", f"/ad_groups?campaign_id={CAMPAIGN}&limit=100"))["data"]:
        for a in _ok(*ads.call("GET", f"/ads?ad_group_id={g['id']}&limit=100"))["data"]:
            rows.append({"group": g["name"], "ad": a["name"], "id": a["id"], "status": a["status"],
                         "review": a["review_status"], "reason": (a.get("review") or {}).get("reason")})
    return {"total": len(rows), "in_review": sum(r["review"] == "in_review" for r in rows),
            "rejected": [r for r in rows if r["review"] == "rejected"], "ads": rows}


def recent_changes(args):
    n = min(int(args.get("limit", 30)), 100)
    rows = _ok(*ads.call("GET", f"/audit_logs?limit={n}"))["data"]
    return [{"when": datetime.datetime.fromtimestamp(e["ts"], KST).strftime("%Y-%m-%d %H:%M") if isinstance(e.get("ts"), (int, float)) else e.get("ts"),
             "actor": e.get("actor_id"), "action": e.get("audit_log_type"), "item": e.get("item_name")} for e in rows]


# ── 쓰기 도구 (광고비 영향) ─────────────────────────────────

def set_status(args):
    kind, oid, action = args["kind"], args["id"], args["action"]
    path = {"campaign": "campaigns", "ad_group": "ad_groups", "ad": "ads"}[kind]
    if action not in ("activate", "pause"):
        raise ValueError("action 은 activate 또는 pause 만 쓴다 (archive 는 되돌릴 수 없어 막아 둠)")
    return _ok(*ads.call("POST", f"/{path}/{oid}/{action}", {}))


def update_ad_group(args):
    body = {}
    if "context_hints" in args: body["context_hints"] = args["context_hints"]
    if "bid_krw" in args:
        body["bidding_config"] = {"billing_event_type": "click", "strategy": "fixed_bid", "max_bid_micros": int(args["bid_krw"]) * 1_000_000}
    if "name" in args: body["name"] = args["name"]
    if not body: raise ValueError("바꿀 값이 없다 (context_hints, bid_krw, name)")
    return _ok(*ads.call("POST", f"/ad_groups/{args['ad_group_id']}", body))


def update_campaign_budget(args):
    krw = int(args["lifetime_budget_krw"])
    return _ok(*ads.call("POST", f"/campaigns/{CAMPAIGN}", {"budget": {"lifetime_spend_limit_micros": krw * 1_000_000}}))


def create_ad(args):
    title, body = args["title"], args["body"]
    if not (3 <= len(title) <= 50) or len(body) > 100:
        raise ValueError(f"제목 3~50자, 본문 100자 이하 (지금 {len(title)}자 / {len(body)}자)")
    file_id = args.get("file_id")
    if not file_id:
        ids = json.loads(FILE_IDS.read_text(encoding="utf-8"))
        file_id = ids[args["image_key"]]
    payload = {"ad_group_id": args["ad_group_id"], "name": args.get("name", title[:40]), "status": args.get("status", "paused"),
               "creative": {"type": "chat_card", "title": title, "body": body, "target_url": args["target_url"], "file_id": file_id,
                            "image_crop": {"x": 0, "y": 0, "width": 1, "height": 1}}}
    return _ok(*ads.call("POST", "/ads", payload, idem=args.get("idempotency_key")))


def create_ad_group(args):
    payload = {"campaign_id": CAMPAIGN, "name": args["name"], "status": args.get("status", "paused"),
               "context_hints": args["context_hints"],
               "bidding_config": {"billing_event_type": "click", "strategy": "fixed_bid", "max_bid_micros": int(args.get("bid_krw", 100)) * 1_000_000}}
    if args.get("utm"): payload["landing_page_configuration"] = {"query_string_template": args["utm"]}
    return _ok(*ads.call("POST", "/ad_groups", payload, idem=args.get("idempotency_key")))


def S(**p):
    return {"type": "object", "properties": p}


STR, INT = {"type": "string"}, {"type": "integer"}
TOOLS = {
    "account_overview": (account_overview, "하랑 ChatGPT 광고 계정·캠페인·광고그룹·광고 전체 구조와 상태 (읽기)", S()),
    "performance": (performance, "기간 성과: 노출·클릭·비용·CTR·CPC·전환. 날짜는 YYYY-MM-DD, 끝 날짜 미포함 (읽기)",
                    {**S(start_date=STR, end_date=STR, level={"type": "string", "enum": ["campaign", "ad_group", "ad"]}), "required": ["start_date", "end_date"]}),
    "review_status": (review_status, "광고별 심사 상태와 반려 사유 (읽기)", S()),
    "recent_changes": (recent_changes, "광고 계정 감사 로그: 누가 언제 무엇을 바꿨는지 (읽기)", S(limit=INT)),
    "set_status": (set_status, "[쓰기·광고비] 캠페인/광고그룹/광고 켜기(activate)·끄기(pause)",
                   {**S(kind={"type": "string", "enum": ["campaign", "ad_group", "ad"]}, id=STR, action={"type": "string", "enum": ["activate", "pause"]}), "required": ["kind", "id", "action"]}),
    "update_ad_group": (update_ad_group, "[쓰기·광고비] 광고그룹 컨텍스트 힌트(전체 교체)·클릭당 입찰가(원)·이름 변경",
                        {**S(ad_group_id=STR, context_hints={"type": "array", "items": STR}, bid_krw=INT, name=STR), "required": ["ad_group_id"]}),
    "update_campaign_budget": (update_campaign_budget, "[쓰기·광고비] 캠페인 총예산(원) 변경",
                               {**S(lifetime_budget_krw=INT), "required": ["lifetime_budget_krw"]}),
    "create_ad_group": (create_ad_group, "[쓰기·광고비] 광고그룹 생성 (기본 일시중지, 입찰 기본 100원)",
                        {**S(name=STR, context_hints={"type": "array", "items": STR}, bid_krw=INT, utm=STR,
                             status={"type": "string", "enum": ["active", "paused"]}, idempotency_key=STR), "required": ["name", "context_hints"]}),
    "create_ad": (create_ad, "[쓰기·광고비] 광고 생성 (기본 일시중지). 이미지는 image_key(place·blog·cafe·review·instagram·photo·detail·naver-ads) 또는 file_id",
                  {**S(ad_group_id=STR, title=STR, body=STR, target_url=STR, image_key=STR, file_id=STR, name=STR,
                       status={"type": "string", "enum": ["active", "paused"]}, idempotency_key=STR),
                   "required": ["ad_group_id", "title", "body", "target_url"]}),
}


def _send(msg):
    sys.stdout.write(json.dumps(msg, ensure_ascii=False) + "\n")
    sys.stdout.flush()


def main():
    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
        try:
            req = json.loads(line)
        except json.JSONDecodeError:
            continue
        mid, method = req.get("id"), req.get("method")
        if mid is None:  # 알림(notifications/initialized 등)은 응답하지 않는다
            continue
        try:
            if method == "initialize":
                res = {"protocolVersion": req.get("params", {}).get("protocolVersion", "2025-06-18"),
                       "capabilities": {"tools": {}},
                       "serverInfo": {"name": "harang-openai-ads", "version": "1.0.0"}}
            elif method == "tools/list":
                res = {"tools": [{"name": n, "description": d, "inputSchema": s} for n, (_, d, s) in TOOLS.items()]}
            elif method == "tools/call":
                name = req["params"]["name"]
                fn = TOOLS[name][0]
                try:
                    data = fn(req["params"].get("arguments") or {})
                    res = {"content": [{"type": "text", "text": json.dumps(data, ensure_ascii=False, indent=1)}]}
                except Exception as e:  # 도구 오류는 프로토콜 오류가 아니라 결과로 돌려준다
                    res = {"content": [{"type": "text", "text": f"오류: {e}"}], "isError": True}
            elif method == "ping":
                res = {}
            else:
                _send({"jsonrpc": "2.0", "id": mid, "error": {"code": -32601, "message": f"unknown method {method}"}})
                continue
            _send({"jsonrpc": "2.0", "id": mid, "result": res})
        except Exception as e:
            _send({"jsonrpc": "2.0", "id": mid, "error": {"code": -32603, "message": str(e)}})


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stdin.reconfigure(encoding="utf-8")
    main()
