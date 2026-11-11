# OpenAI Ads API helper. 키는 파일에서 읽고 절대 출력하지 않는다.
import json, sys, urllib.request, urllib.error, pathlib
import os
# 키는 저장소에 두지 않는다. 우선순위: 환경변수 OPENAI_ADS_API_KEY > 키 파일(OPENAI_ADS_API_KEY_FILE) > 기본 위치
_KEY_FILE = os.environ.get("OPENAI_ADS_API_KEY_FILE", r"C:/Users/pc/Downloads/ads-manager-api-key.txt")
KEY = os.environ.get("OPENAI_ADS_API_KEY") or pathlib.Path(_KEY_FILE).read_text().strip()
BASE = "https://api.ads.openai.com/v1"
def call(method, path, body=None, idem=None):
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(BASE + path, data=data, method=method)
    req.add_header("Authorization", f"Bearer {KEY}")
    req.add_header("User-Agent", "harang-ads/1.0 (+https://www.harangmarketing.com)")
    if data is not None: req.add_header("Content-Type", "application/json")
    if idem: req.add_header("Idempotency-Key", idem)
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return r.status, json.loads(r.read() or b"{}")
    except urllib.error.HTTPError as e:
        txt = e.read().decode("utf-8", "replace")
        try: return e.code, json.loads(txt)
        except Exception: return e.code, txt
if __name__ == "__main__":
    m, p = sys.argv[1], sys.argv[2]
    body = json.loads(sys.argv[3]) if len(sys.argv) > 3 and sys.argv[3] else None
    idem = sys.argv[4] if len(sys.argv) > 4 else None
    st, out = call(m, p, body, idem)
    print("HTTP", st); print(json.dumps(out, ensure_ascii=False, indent=1))
