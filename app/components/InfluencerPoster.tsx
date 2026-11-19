import { BadgeCheck, LayoutList, History, Link2 } from "lucide-react";
import { INFLUENCER_OFFER as O } from "../lib/influencer-distribution";

/**
 * 인플루언서 배포 안내 카드 (하랑판 포스터). 팝업(InfluencerPopup)과 상품 블록이 같이 쓴다.
 *
 * 그림은 전부 HTML 과 CSS 다. 사람 이미지를 쓰지 않고, 검색 화면을 본뜬 작은 틀로 「글이 모이는 자리」 를 보여 준다.
 * 색은 --h-dark 바탕에 --w-primary 한 가지다. 그라데이션 아이콘 박스는 쓰지 않는다 (WDS).
 * 문장은 app/lib/influencer-distribution.ts 에 있다. 이 파일에는 문장을 적지 않는다.
 *
 * compact : 팝업용. 검색 화면 틀과 설명 줄을 빼고 제목만 남긴다 (좁은 화면에서 버튼이 밀리지 않게)
 */
const ICONS = [LayoutList, History, Link2];

export default function InfluencerPoster({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`relative overflow-hidden text-white ${compact ? "px-4 pb-4 pt-4 sm:px-5 sm:pt-5" : "rounded-2xl px-5 py-7 md:px-9 md:py-9"}`}
      style={{ background: "var(--h-dark)" }}
    >
      {/* 바탕의 옅은 원 하나. 장식은 이것뿐이다 */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full"
        style={{ background: "var(--w-primary)", opacity: 0.22 }}
      />

      <div className={compact ? "relative" : "relative grid grid-cols-1 items-center gap-7 md:grid-cols-[1fr_220px]"}>
        <div className="min-w-0">
          <div className="flex items-center gap-2 pr-10">
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg"
              style={{ background: "var(--w-primary)" }}
            >
              <BadgeCheck size={14} strokeWidth={2.5} className="text-white" />
            </span>
            <span className="text-[13px] font-bold" style={{ color: "var(--w-blue-70)" }}>
              {O.eyebrow}
            </span>
          </div>

          <h3
            className={`mt-3 font-black leading-[1.3] ${compact ? "text-[19px] sm:text-[21px]" : "text-[22px] md:text-[30px]"}`}
            style={{ letterSpacing: "-0.5px", textWrap: "balance" }}
          >
            {O.title}
          </h3>
          <p className={`mt-2 leading-relaxed ${compact ? "text-[14px]" : "text-[15px] md:text-[17px]"}`} style={{ color: "#c6cfe4" }}>
            {O.lead}
          </p>

          <ul className={`grid gap-2 ${compact ? "mt-3" : "mt-5"}`}>
            {O.points.map((p, i) => {
              const Icon = ICONS[i] ?? BadgeCheck;
              return (
                <li
                  key={p.title}
                  className="flex items-start gap-3 rounded-xl px-3 py-2.5"
                  style={{ background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.12)" }}
                >
                  <span
                    className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                    style={{ background: "var(--w-primary)" }}
                  >
                    <Icon size={15} strokeWidth={2.5} className="text-white" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[14px] font-semibold md:text-[15px]">{p.title}</span>
                    {!compact && (
                      <span className="mt-0.5 block text-[13px] leading-relaxed md:text-[14px]" style={{ color: "#c6cfe4" }}>
                        {p.desc}
                      </span>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>

          <p className={`leading-relaxed ${compact ? "mt-3 text-[13px]" : "mt-4 text-[14px]"}`} style={{ color: "#c6cfe4" }}>
            {O.roster}
          </p>
        </div>

        {/* 검색 화면을 본뜬 틀. 글자는 없고 자리만 보여 준다 */}
        {!compact && (
          <div aria-hidden className="mx-auto hidden w-[200px] md:block">
            <div className="rounded-[26px] p-2.5" style={{ background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.2)" }}>
              <div className="rounded-[18px] bg-white p-3">
                <div className="flex items-center gap-2 rounded-full px-2.5 py-2" style={{ background: "var(--w-fill)" }}>
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ background: "var(--w-primary)" }} />
                  <span className="h-2 flex-1 rounded-full" style={{ background: "var(--w-line-strong)" }} />
                </div>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="mt-2.5 rounded-xl p-2.5"
                    style={
                      i === 1
                        ? { border: "2px solid var(--w-primary)", background: "color-mix(in srgb, var(--w-primary) 8%, white)" }
                        : { border: "1px solid var(--w-line-strong)" }
                    }
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="h-4 w-4 rounded-full" style={{ background: i === 1 ? "var(--w-primary)" : "var(--w-line-strong)" }} />
                      <span className="h-1.5 w-12 rounded-full" style={{ background: "var(--w-line-strong)" }} />
                    </div>
                    <div className="mt-2 h-2 w-full rounded-full" style={{ background: i === 1 ? "var(--w-primary)" : "var(--w-line-strong)", opacity: i === 1 ? 0.75 : 1 }} />
                    <div className="mt-1.5 h-1.5 w-3/4 rounded-full" style={{ background: "var(--w-line-strong)" }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
