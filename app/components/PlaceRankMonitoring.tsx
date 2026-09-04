import { CalendarCheck, Eye, LineChart, Store } from "lucide-react";
import {
  PLACE_RANK_AS_OF,
  PLACE_RANK_NOTE,
  PLACE_RANK_TOTALS,
} from "../lib/place-rank-cases";

/**
 * 노출 현황 · 관리 방식 — 계측하고 있는 전체 규모를 한 자리에서 보여준다.
 *
 * 왜 있나 (2026-09-04 (금) 대표 지시)
 *   「실시간으로 계속 관리 어떻게 하고 있고 노출 되는지도 체크해서 올려놔」
 *   사례 카드는 올라간 건만 보여주므로, 재고 있는 전체가 몇인지가 안 보였다.
 *
 * 지키는 것
 *   숫자는 app/lib/place-rank-cases.ts 한 곳에서만 온다. 여기서 만들지 않는다.
 *   `실시간` 이라고 쓰지 않는다 — 실제로는 하루 한 번 저장한다 (C-42 · 틀린 값이 빈 값보다 나쁘다).
 *   깜빡이는 표시 · 가짜 실시간 알림을 쓰지 않는다 (WDS · 재촉형 UI 금지).
 *   앞으로 몇 위가 된다는 말을 적지 않는다 (C-36 · D-0177).
 */

const STATS = [
  { icon: Store, label: "매일 재는 매장", value: `${PLACE_RANK_TOTALS.stores}곳` },
  { icon: LineChart, label: "매일 재는 키워드", value: `${PLACE_RANK_TOTALS.keywords}개` },
  { icon: Eye, label: "1~5위를 지키는 키워드", value: `${PLACE_RANK_TOTALS.page1Keywords}개` },
  { icon: CalendarCheck, label: "그 키워드를 가진 매장", value: `${PLACE_RANK_TOTALS.page1Stores}곳` },
];

const STEPS = [
  {
    title: "하루 한 번 저장합니다",
    body: "관리 중인 키워드 순위를 매일 같은 시각에 재서 그날 파일로 남깁니다. 지나간 하루는 다시 잴 수 없어서, 빠진 날이 생기면 그것부터 확인합니다.",
  },
  {
    title: "떨어진 키워드를 그날 봅니다",
    body: "어제와 오늘을 맞대 본 뒤 내려간 키워드만 따로 뽑습니다. 순위가 흔들리는 이유는 매장마다 달라서, 무엇이 바뀌었는지를 먼저 찾습니다.",
  },
  {
    title: "고친 뒤 다시 잽니다",
    body: "손을 본 다음 날부터 같은 키워드를 계속 재서 되돌아왔는지 봅니다. 되돌아오지 않으면 방법을 바꾸고, 그 과정도 그대로 기록에 남습니다.",
  },
];

export default function PlaceRankMonitoring({
  background = "bg-gray-50",
}: {
  background?: string;
}) {
  return (
    <section className={`py-12 md:py-16 border-t border-gray-100 ${background}`}>
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
        <p
          className="text-xs font-bold uppercase tracking-widest mb-2"
          style={{ color: "var(--w-primary)" }}
        >
          Monitoring
        </p>
        <h2 className="text-xl md:text-2xl font-black text-gray-900">
          올린 뒤에도 매일 재고 있습니다
        </h2>
        <p className="mt-2 text-sm text-gray-500 leading-relaxed max-w-2xl">
          플레이스 순위는 올린 날이 끝이 아니라 시작입니다. 지금 재고 있는 전체 규모와,
          그중 1~5위를 지키고 있는 만큼을 계측한 그대로 적었습니다.
        </p>

        <div className="mt-6 md:mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {STATS.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="bg-white border border-gray-200 rounded-2xl p-4 md:p-5 shadow-sm min-w-0"
              >
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gray-900">
                  <Icon size={16} className="text-white" strokeWidth={2.5} />
                </span>
                <p className="mt-3 text-2xl md:text-3xl font-black text-gray-900 tabular-nums">
                  {s.value}
                </p>
                <p className="mt-1 text-xs md:text-[13px] text-gray-500 leading-snug">{s.label}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-4 md:mt-6 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          {STEPS.map((s, i) => (
            <div
              key={s.title}
              className="bg-white border border-gray-200 rounded-2xl p-4 md:p-5 shadow-sm min-w-0"
            >
              <span
                className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-black text-white tabular-nums"
                style={{ backgroundColor: "var(--w-primary)" }}
              >
                {i + 1}
              </span>
              <p className="mt-3 text-sm md:text-base font-bold text-gray-900">{s.title}</p>
              <p className="mt-1.5 text-xs md:text-[13px] text-gray-500 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>

        <p className="mt-5 text-xs text-gray-500 leading-relaxed max-w-3xl">
          위 숫자는 마지막으로 저장한 {PLACE_RANK_AS_OF} 계측값입니다. {PLACE_RANK_NOTE}
        </p>
      </div>
    </section>
  );
}
