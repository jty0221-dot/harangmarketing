import { PLACE_RANK_AS_OF, PLACE_RANK_NOTE } from "../lib/place-rank-cases";

/**
 * 노출 현황 · 관리 방식 — 순위를 어떻게 재고 어떻게 손보는지를 한 자리에서 보여준다.
 *
 * 왜 있나 (2026-09-04 (금) 대표 지시)
 *   「실시간으로 계속 관리 어떻게 하고 있고 노출 되는지도 체크해서 올려놔」
 *
 * 숫자 타일을 걷었다 (2026-09-07 (월) 대표 지시)
 *   「이런 멘트 자체를 넣지마 고객이 보았을 때 이것밖에 안하는 매장처럼 보이잖아」
 *   여기 있던 타일 넉 장(1~5위 기록 · 올라온 키워드 · 자리를 지킨 키워드 · 업종)은 화면에 실은
 *   카드를 센 값이었다. 발췌한 장수를 옆에 적어 두면 보는 사람이 그것을 회사가 맡은 전부로
 *   읽는다. 그래서 세는 값은 빼고 재는 방식만 남긴다. 회사 규모를 말해야 하는 자리에는
 *   app/lib/track-record.ts 의 값을 쓴다.
 *
 * 지키는 것
 *   `실시간` 이라고 쓰지 않는다 — 실제로는 하루 한 번 저장한다 (C-42 · 틀린 값이 빈 값보다 나쁘다).
 *   깜빡이는 표시 · 가짜 실시간 알림을 쓰지 않는다 (WDS · 재촉형 UI 금지).
 *   앞으로 몇 위가 된다는 말을 적지 않는다 (C-36 · D-0177).
 */

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
          플레이스 순위는 올린 날이 끝이 아니라 시작입니다. 매일 같은 시각에 재서 남기고, 내려간
          키워드는 그날 찾아 손보고, 손본 다음 날부터 다시 잽니다.
        </p>

        <div className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
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
          마지막으로 저장한 계측값은 {PLACE_RANK_AS_OF} 기준입니다. {PLACE_RANK_NOTE}
        </p>
      </div>
    </section>
  );
}
