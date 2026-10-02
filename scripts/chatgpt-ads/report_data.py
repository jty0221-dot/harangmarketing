# 하랑 ChatGPT 광고 성과 수집 (읽기 전용). 사용: python report_data.py 2026-10-02 2026-10-16
# 기간은 계정 시간대(Asia/Seoul) 기준 전일 포함, 끝 날짜 미포함.
import json, sys, datetime, urllib.parse, ads
KST = datetime.timezone(datetime.timedelta(hours=9))
def ts(d): return int(datetime.datetime.strptime(d, "%Y-%m-%d").replace(tzinfo=KST).timestamp())
start, end = sys.argv[1], sys.argv[2]
tr = json.dumps({"type": "unix_range", "start": ts(start), "end": ts(end)})
def q(params):
    return "&".join(f"{urllib.parse.quote(k)}={urllib.parse.quote(str(v))}" for k, v in params)
out = {"period": [start, end]}
fields = ["ad_group.id", "ad_group.name", "ad.id", "ad.name", "ad.impressions", "ad.clicks", "ad.spend", "ad.ctr", "ad.cpc"]
params = [("time_granularity", "none"), ("aggregation_level", "ad"), ("time_ranges[]", tr)] + [("fields[]", f) for f in fields]
st, d = ads.call("GET", "/ad_account/insights?" + q(params)); out["delivery_by_ad"] = d if st == 200 else {"error": st, "body": d}
ad_ids, names = [], {}
st, gs = ads.call("GET", "/ad_groups?campaign_id=cmpn_aeb6c4c1bb5c819c9d6d7f2a4b442e9a&limit=100")
for g in gs.get("data", []):
    st, al = ads.call("GET", f"/ads?ad_group_id={g['id']}&limit=100")
    for a in al.get("data", []):
        ad_ids.append(a["id"]); names[a["id"]] = {"group": g["name"], "ad": a["name"], "status": a["status"], "review": a["review_status"], "url": a["creative"]["target_url"]}
out["ads"] = names
st, d = ads.call("POST", "/conversions/insights", {"aggregation_level": "ad", "time_ranges": [tr], "entity_ids": ad_ids}); out["conversions_by_ad"] = d if st == 200 else {"error": st, "body": d}
st, c = ads.call("GET", "/campaigns/cmpn_aeb6c4c1bb5c819c9d6d7f2a4b442e9a?include[]=serving_issues")
out["campaign"] = {k: c.get(k) for k in ["status", "budget", "serving_issues"]} if st == 200 else {"error": st}
print(json.dumps(out, ensure_ascii=False, indent=1))
