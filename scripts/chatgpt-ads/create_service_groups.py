# 광고그룹_세팅표.md 를 그대로 읽어 서비스별 광고그룹·광고를 만든다. 결과는 created.json 에 남긴다(재실행 시 건너뜀).
import json, re, pathlib, sys, ads
REPO = pathlib.Path(__file__).resolve().parents[2]
SHEET = (REPO / "docs/chatgpt-ads/광고그룹_세팅표.md").read_text(encoding="utf-8")
FILES = json.loads(pathlib.Path(__file__).with_name("file_ids.json").read_text(encoding="utf-8"))
OUT = pathlib.Path(__file__).with_name("created.json")
done = json.loads(OUT.read_text(encoding="utf-8")) if OUT.exists() else {}
C = "cmpn_aeb6c4c1bb5c819c9d6d7f2a4b442e9a"
STATUS = sys.argv[1] if len(sys.argv) > 1 else "active"
groups = []
for sec in re.split(r"\n## \d+\. ", SHEET)[1:]:
    name = sec.split("\n", 1)[0].strip()
    key = re.search(r"이미지: `ad-(.+?)\.png`", sec).group(1)
    url = re.search(r"랜딩: `(.+?)`", sec).group(1)
    utm = re.search(r"UTM: `(.+?)`", sec).group(1)
    # 힌트 문장이 '광고'로 시작할 수 있어 구분자는 줄 전체 '- 광고' 로 잡는다
    hints = re.findall(r"\n  - (.+)", sec.split("- 컨텍스트 힌트", 1)[1].split("\n- 광고\n", 1)[0])
    adl = re.findall(r"- ([AB]) 제목: (.+)\n\s+본문: (.+)", sec)
    groups.append((key, name, url, utm, hints, adl))
assert len(groups) == 8 and all(len(g[5]) == 2 and len(g[4]) >= 3 for g in groups), "세팅표 파싱 실패"
for key, name, url, utm, hints, adl in groups:
    rec = done.setdefault(key, {"ads": {}})
    if "group" not in rec:
        st, g = ads.call("POST", "/ad_groups", {"campaign_id": C, "name": name, "status": STATUS, "context_hints": hints,
            "bidding_config": {"billing_event_type": "click", "strategy": "fixed_bid", "max_bid_micros": 100000000},
            "landing_page_configuration": {"query_string_template": utm}}, idem=f"harang-svcgrp-{key}-v2")
        if st != 200: print("GROUP FAIL", key, st, g); OUT.write_text(json.dumps(done, ensure_ascii=False, indent=1), encoding="utf-8"); sys.exit(1)
        rec["group"] = g["id"]
    for ab, title, body in adl:
        if ab in rec["ads"]: continue
        assert 3 <= len(title) <= 50 and len(body) <= 100
        st, a = ads.call("POST", "/ads", {"ad_group_id": rec["group"], "name": f"{name}_{ab}", "status": STATUS,
            "creative": {"type": "chat_card", "title": title, "body": body, "target_url": url, "file_id": FILES[key],
                         "image_crop": {"x": 0, "y": 0, "width": 1, "height": 1}}}, idem=f"harang-svcad-{key}-{ab}-v2")
        if st != 200: print("AD FAIL", key, ab, st, a); continue
        rec["ads"][ab] = a["id"]
    OUT.write_text(json.dumps(done, ensure_ascii=False, indent=1), encoding="utf-8")
    print(name, rec["group"], rec["ads"])
