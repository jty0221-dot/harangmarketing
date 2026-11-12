import p from "./persuasion.module.css";

/*
 * 설득 공정 시안 두 벌 (2026-11-12 루미 · 예린).
 * 재료 → 걱정 세 개 → 걱정마다 받는 섹션 순서로 짠 상세페이지 · 홈페이지 시안이다. 둘 다 가상 업체.
 * 시안 파일은 public/sian/persuasion/ 아래 정적 파일이다. href 가 비면 '준비 중' 으로만 선다.
 * 문구 원본 : 홈페이지공장/out/설득공정-시안/하랑반영_발행본문.md (원고검사 0) · 상세페이지 카드는 예린 04_인계.md 2절
 */
export const PERSUASION_SIANS = [
  {
    kind: "상세페이지 · 860px",
    title: "걱정 세 개를 먼저 정하고 짠 상세페이지 시안",
    lines: [
      "구매 전 걱정을 리뷰에서 세 개 찾고, 걱정마다 받아 주는 섹션을 정한 뒤에 순서를 짰습니다.",
      "예시 품목은 생들기름이며 업체명과 수치는 가상입니다.",
    ],
    href: "/sian/persuasion/detail.html",
  },
  {
    kind: "홈페이지 첫 화면",
    title: "걱정마다 받는 섹션을 붙인 홈페이지 첫 화면 시안",
    lines: [
      "누수탐지 업체를 예로 들어 전화하기 전 걱정 세 개를 첫 화면과 약속 세 줄, 자주 묻는 질문에서 받았습니다.",
      "공사 범위와 비용, 아랫집 배상 걱정이 각각 두 곳 이상에서 답해지는지 확인했습니다.",
    ],
    href: "/sian/persuasion/homepage/index.html",
  },
];

export default function PersuasionSians() {
  return (
    <ul className={p.sians}>
      {PERSUASION_SIANS.map((x) => (
        <li key={x.title}>
          <span className={p.tag}>{x.kind} · 시안 · 업체명과 수치는 가상</span>
          <h3>{x.title}</h3>
          {x.lines.map((l) => <p key={l}>{l}</p>)}
          {x.href
            ? <a className={p.open} href={x.href} target="_blank" rel="noopener">시안 열기</a>
            : <span className={p.wait}>준비 중</span>}
        </li>
      ))}
    </ul>
  );
}
