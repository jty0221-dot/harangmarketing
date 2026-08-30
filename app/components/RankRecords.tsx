import { ArrowRight, Clock, ShieldCheck, Database } from "lucide-react";
import {
  byIndustry, SUMMARY, SNAPSHOT_DATE, MEASURE_NOTE,
  type RankRecord,
} from "../lib/rank-records";

/**
 * 업종별 순위 계측 기록 블록.
 *
 * 이 컴포넌트를 만든 이유 하나 — 같은 숫자를 20곳에 손으로 적어 두었더니
 * 한 곳을 고쳐도 나머지가 옛 값을 계속 말했고, 기록이 없는 업종에는
 * 남의 업종 기록이 자기 성과처럼 걸려 있었다.
 *
 * 기록이 없으면 빈 배열이 오고, 그때는 숫자를 지어내지 않고
 * 계측 현황만 보여준다 (헌장 C-42 · 틀린 값이 빈 값보다 나쁘다).
 */
export default function RankRecords({
  industries,
  industryLabel,
  limit = 3,
}: {
  /** rank-records.ts 의 industry 값. 비우면 집계만 보여준다 */
  industries: string[];
  /** 화면에 쓰는 업종 이름 — 기록이 없을 때 문장에 들어간다 */
  industryLabel: string;
  limit?: number;
}) {
  const records: RankRecord[] = byIndustry(...industries).slice(0, limit);

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-2">
            {records.length ? `${industryLabel} 순위 계측 기록` : "하랑마케팅 순위 계측 현황"}
          </h2>
          <p className="text-gray-500 text-sm">
            네이버 플레이스 순위 · {SNAPSHOT_DATE} 스냅샷 기준
          </p>
        </div>

        {records.length > 0 ? (
          <div className={`grid grid-cols-1 gap-4 ${records.length >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
            {records.map((r, i) => (
              <div key={i} className="bg-gray-50 border border-gray-200 rounded-2xl p-5 text-center">
                <p className="text-xs text-gray-500 mb-3 font-medium">{r.keyword}</p>
                <div className="flex items-center justify-center gap-3 mb-3">
                  <span className="text-lg font-bold text-gray-400 line-through tabular-nums">{r.from}위</span>
                  <ArrowRight size={14} className="text-gray-400 shrink-0" />
                  <span className="text-2xl font-black tabular-nums" style={{ color: "var(--w-primary)" }}>{r.to}위</span>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-1.5">
                  <span className="inline-flex items-center gap-1 bg-white text-gray-600 text-xs font-bold px-2.5 py-1 rounded-full border border-gray-200">
                    <Clock size={10} strokeWidth={2.5} /> {r.days}일 계측
                  </span>
                  {r.heldPage1 && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border"
                      style={{ color: "var(--w-primary)", background: "#F0F6FF", borderColor: "#D6E4FF" }}>
                      <ShieldCheck size={10} strokeWidth={2.5} /> 1페이지 유지
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 md:p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
              {[
                { label: "계측 매장", value: `${SUMMARY.stores}곳` },
                { label: "계측 키워드", value: `${SUMMARY.keywords}개` },
                { label: "1페이지 유지", value: `${SUMMARY.page1Keywords}개` },
                { label: "누적 스냅샷", value: `${SUMMARY.snapshots}회` },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-lg md:text-xl font-black tabular-nums" style={{ color: "var(--w-primary)" }}>{s.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="flex items-start gap-2.5 bg-white border border-gray-200 rounded-xl p-3.5">
              <Database size={15} className="text-gray-400 shrink-0 mt-0.5" strokeWidth={2} />
              <p className="text-xs md:text-[13px] text-gray-600 leading-relaxed min-w-0">
                {industryLabel} 업종은 아직 공개할 순위 기록이 없습니다.
                다른 업종의 기록을 이 업종의 성과로 표시하지 않습니다.
                현황 진단부터 시작해 계측값이 쌓이면 그대로 공개합니다.
              </p>
            </div>
          </div>
        )}

        <p className="text-xs text-gray-400 leading-relaxed text-center mt-5 max-w-2xl mx-auto">
          {MEASURE_NOTE}
        </p>
      </div>
    </section>
  );
}
