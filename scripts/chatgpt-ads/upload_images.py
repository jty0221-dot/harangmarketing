# 서비스별 광고 이미지 8장을 광고 계정에 업로드하고 file_id 를 file_ids.json 에 저장한다.
import json, pathlib, uuid, urllib.request, urllib.error, ads
IMG = pathlib.Path(__file__).resolve().parents[2] / "docs/chatgpt-ads"
OUT = pathlib.Path(__file__).with_name("file_ids.json")
done = json.loads(OUT.read_text(encoding="utf-8")) if OUT.exists() else {}
for k in ["place", "blog", "cafe", "review", "instagram", "photo", "detail", "naver-ads", "homepage"]:
    if k in done: print(k, "skip", done[k]); continue
    data = (IMG / f"ad-{k}.png").read_bytes()
    b = uuid.uuid4().hex
    body = (f"--{b}\r\nContent-Disposition: form-data; name=\"file\"; filename=\"ad-{k}.png\"\r\nContent-Type: image/png\r\n\r\n").encode() + data + f"\r\n--{b}--\r\n".encode()
    req = urllib.request.Request(ads.BASE + "/upload", data=body, method="POST")
    req.add_header("Authorization", f"Bearer {ads.KEY}")
    req.add_header("User-Agent", "harang-ads/1.0 (+https://www.harangmarketing.com)")
    req.add_header("Content-Type", f"multipart/form-data; boundary={b}")
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            fid = json.loads(r.read())["file_id"]; done[k] = fid; print(k, r.status, fid)
    except urllib.error.HTTPError as e:
        print(k, "FAIL", e.code, e.read().decode("utf-8", "replace")[:300]); break
    OUT.write_text(json.dumps(done, indent=1), encoding="utf-8")
