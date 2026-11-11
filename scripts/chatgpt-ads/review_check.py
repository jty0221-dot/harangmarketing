# 하랑 ChatGPT 광고 심사 상태 조회 (읽기 전용). 이전 상태와 비교해 바뀐 것만 CHANGED 로 표시한다.
import json, pathlib, ads
STATE = pathlib.Path(__file__).with_name("review_state.json")
C = "cmpn_aeb6c4c1bb5c819c9d6d7f2a4b442e9a"
prev = json.loads(STATE.read_text(encoding="utf-8")) if STATE.exists() else {}
now = {}
st, groups = ads.call("GET", f"/ad_groups?campaign_id={C}&limit=100")
for g in groups.get("data", []):
    st, al = ads.call("GET", f"/ads?ad_group_id={g['id']}&limit=100")
    for a in al.get("data", []):
        now[a["id"]] = {"name": a["name"], "status": a["status"], "review": a["review_status"], "group": g["name"]}
STATE.write_text(json.dumps(now, ensure_ascii=False, indent=1), encoding="utf-8")
pending = [v for v in now.values() if v["review"] == "in_review"]
for k, v in now.items():
    flag = "CHANGED" if prev.get(k, {}).get("review") not in (None, v["review"]) else ""
    print(f"{v['group']} | {v['name']} | {v['status']} | {v['review']} {flag}")
print(f"SUMMARY total={len(now)} in_review={len(pending)} approved={sum(v['review']=='approved' for v in now.values())} rejected={sum(v['review']=='rejected' for v in now.values())}")
