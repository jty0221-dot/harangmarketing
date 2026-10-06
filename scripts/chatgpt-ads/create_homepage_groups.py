# 홈페이지 제작 광고 4종 (본부장/광고/홈페이지제작_ChatGPT_2026-10-05/광고소재_홈페이지제작_4종.md) 을 만든다.
# 이미지 업로드 → 광고그룹 → 광고. 결과는 hp_created.json (재실행 시 만든 것은 건너뛴다).
#   python create_homepage_groups.py            전부 일시중지로 등록 (기본 · D-0608 2 승인 범위)
#   python create_homepage_groups.py --active   hp01 · hp03 · hp04 켬 (hp02 병의원은 늘 일시중지) · 대표 켜기 승인 뒤에만
# 쓰기 스크립트다. 등록 · 켜기는 대표가 직접 돌린다. 진우 재판정 (그림 1 · 2) 과 C-52 이름 교체 뒤에 등록한다.
import json, pathlib, sys, uuid, urllib.request, urllib.error, ads

IMG = pathlib.Path("E:/하랑/본부장/광고/홈페이지제작_ChatGPT_2026-10-05")
OUT = pathlib.Path(__file__).with_name("hp_created.json")
done = json.loads(OUT.read_text(encoding="utf-8")) if OUT.exists() else {}
C = "cmpn_aeb6c4c1bb5c819c9d6d7f2a4b442e9a"
LP = "https://www.harangmarketing.com/services/homepage"
UTM = "utm_source=chatgpt&utm_medium=cpc&utm_campaign=hp&utm_content={ad_id}"
ACTIVE = "--active" in sys.argv

GROUPS = [
    ("hp01", "홈페이지제작_업종시안", "01_업종시안.png", LP,
     "업종별 시안 보고 고르는 홈페이지", "업종 114개 · 시안 256개를 먼저 보고 마음에 드는 디자인을 고르세요.",
     ["가게 홈페이지를 처음 만들려고 비용과 방식을 알아보는 대화", "소상공인 홈페이지 제작 업체를 비교하는 대화", "업종에 맞는 홈페이지 디자인 예시를 찾는 대화"]),
    ("hp02", "홈페이지제작_병의원", "02_병의원.png", LP + "?group=medical",
     "진료과목별 병원 홈페이지 시안", "피부과 · 치과 · 안과 · 소아청소년과처럼 과목마다 시안을 준비했습니다. 시안 속 병원은 가상입니다.",
     ["병원 · 의원 홈페이지 제작이나 리뉴얼을 알아보는 대화", "개원 준비 중 홈페이지 만드는 방법을 묻는 대화", "의원 홈페이지에 무엇을 넣어야 하는지 묻는 대화"]),
    ("hp03", "홈페이지제작_자동차", "03_자동차.png", LP + "?group=car",
     "정비 · PPF · 썬팅 업체 홈페이지", "판금도색 · 디테일링까지 작업마다 다른 시안을 먼저 보세요.",
     ["자동차 정비소 홍보 방법을 묻는 대화", "PPF · 썬팅 · 랩핑 업체 홈페이지를 만들려는 대화", "카센터 · 디테일링 매장 손님을 늘리는 방법을 묻는 대화"]),
    ("hp04", "홈페이지제작_사진없이시작", "04_동네가게.png", LP,
     "사진이 없어도 시작하는 홈페이지", "휴대폰 사진이면 충분합니다. 업종 시안을 고르면 대표님 업체로 바꿔 드립니다.",
     ["가게 사진이나 자료 없이 홈페이지를 만들 수 있는지 묻는 대화", "동네 가게 홈페이지를 싸고 빠르게 만드는 방법을 묻는 대화", "카페 · 빵집 · 네일샵 홈페이지 예시를 찾는 대화"]),
]


def upload(path):
    data = path.read_bytes()
    b = uuid.uuid4().hex
    body = (f"--{b}\r\nContent-Disposition: form-data; name=\"file\"; filename=\"ad-{path.stem[:2]}.png\"\r\n"
            "Content-Type: image/png\r\n\r\n").encode() + data + f"\r\n--{b}--\r\n".encode()
    req = urllib.request.Request(ads.BASE + "/upload", data=body, method="POST")
    req.add_header("Authorization", f"Bearer {ads.KEY}")
    req.add_header("User-Agent", "harang-ads/1.0 (+https://www.harangmarketing.com)")
    req.add_header("Content-Type", f"multipart/form-data; boundary={b}")
    with urllib.request.urlopen(req, timeout=120) as r:
        return json.loads(r.read())["file_id"]


for key, name, img, url, title, body, hints in GROUPS:
    assert 3 <= len(title) <= 50 and len(body) <= 100, (key, len(title), len(body))
    status = "active" if (ACTIVE and key != "hp02") else "paused"
    rec = done.setdefault(key, {})
    try:
        if "file" not in rec:
            rec["file"] = upload(IMG / img)
        if "group" not in rec:
            st, g = ads.call("POST", "/ad_groups", {"campaign_id": C, "name": name, "status": status, "context_hints": hints,
                "bidding_config": {"billing_event_type": "click", "strategy": "fixed_bid", "max_bid_micros": 100000000},
                "landing_page_configuration": {"query_string_template": UTM}}, idem=f"harang-hp-group-{key}-v1")
            if st != 200:
                print("GROUP FAIL", key, st, g); break
            rec["group"] = g["id"]
        if "ad" not in rec:
            st, a = ads.call("POST", "/ads", {"ad_group_id": rec["group"], "name": f"{name}_A", "status": status,
                "creative": {"type": "chat_card", "title": title, "body": body, "target_url": url, "file_id": rec["file"],
                             "image_crop": {"x": 0, "y": 0, "width": 1, "height": 1}}}, idem=f"harang-hp-ad-{key}-v1")
            if st != 200:
                print("AD FAIL", key, st, a); break
            rec["ad"] = a["id"]
        rec["status"] = status
        print(key, name, status, rec.get("group"), rec.get("ad"))
    except urllib.error.HTTPError as e:
        print("UPLOAD FAIL", key, e.code, e.read().decode("utf-8", "replace")[:300]); break
    finally:
        OUT.write_text(json.dumps(done, ensure_ascii=False, indent=1), encoding="utf-8")
