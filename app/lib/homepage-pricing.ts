/* 홈페이지 제작 · 관리 가격 · 화면 정본 (app/services/homepage/page.tsx 에서 옮김 · 2026-10-23 (금) · 숫자 변경 없음)
   가격 : 홈페이지 공장 data/pricing.json 과 같은 숫자 (2026-10-04 · 근거 data/price_market.md). 바꾸면 C 결재
   2026-10-16 (금) 대표 결정 「홈페이지까지 전부 미포함」 : 제작비 1,100,000 · 1,650,000 · 2,200,000 은 부가세 포함 금액이었고
   받는 돈은 그대로 두고 공급가(1,000,000 · 1,500,000 · 2,000,000) 부가세 별도로 적는다. 월 관리비도 부가세 별도
   /services/homepage 와 /services/homepage/tax 가 같이 쓴다. 한쪽에만 다른 숫자를 적지 않는다. */
export interface HomepageTier {
  name: string;
  build: string;
  monthly: string;
  pages: string;
  points: string[];
  rec?: boolean;
}

export const HOMEPAGE_TIERS: HomepageTier[] = [
  { name: "라이트", build: "1,000,000원", monthly: "월 50,000원", pages: "메인 + 서브 3장", points: ["문의 전환 동선 포함", "검색 노출 기본 세팅", "수정 월 1회 (관리 선택 시)"] },
  { name: "스탠다드", build: "1,500,000원", monthly: "월 100,000원", pages: "메인 + 서브 5장", points: ["관리자 화면 · 블로그 연동", "키워드 노출 리포트 (관리)", "수정 월 3회 (관리 선택 시)"], rec: true },
  { name: "프리미엄", build: "2,000,000원", monthly: "월 200,000원", pages: "메인 + 서브 10장", points: ["새 콘텐츠 페이지 월 1장 (관리)", "AI 답변 노출 점검 (관리)", "수정 월 10회 (관리 선택 시)"] },
];
