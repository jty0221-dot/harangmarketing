import Header from "../components/Header";
import Footer from "../components/Footer";
import JsonLd from "../components/JsonLd";
import {
  SianMain, PageHead, AnswerRow, Section, LinkList, RankSection, Fold, CloseBand,
} from "../components/sian/Sian";
import { companyYear, itemListLd, webPageLd, updatedAt, breadcrumbLd } from "../lib/seo";
import { TRACK_RECORD, TRACK_TOTALS } from "../lib/track-record";
import {
  PLACE_RANK_AS_OF,
  PLACE_RANK_CASES,
  PLACE_RANK_GENERATED,
  PLACE_RANK_TOP_LINES,
  fmtMoveDays,
} from "../lib/place-rank-cases";
import CasesFilter from "./CasesFilter";

/*
 * 이 페이지가 인용하는 대장은 하나다 — app/lib/place-rank-cases.ts.
 *
 * 예전에는 카드만 이 대장에서 오고 정답 블록과 아래 타일은 rank-records 에서 왔다.
 * 두 대장은 세는 범위가 달라서(54개 키워드 · 61개 키워드) 같은 화면에 다른 총계가 붙었고,
 * 「72위 → 2위」와 「72위에서 4위」가 같은 맛집으로 읽혔다. 실제로는 다른 매장이다.
 * 숫자를 새로 만든 게 아니라 인용하는 대장을 카드와 같은 것으로 맞췄다.
 * rank-records 는 카드 격자가 없는 다른 페이지들의 정본으로 그대로 남는다.
 *
 * 성과 문장에 들어가는 순위도 손으로 적지 않는다. 대장에서 빠진 기록이 화면에 남지 않도록
 * 계단 수 상위 6건을 PLACE_RANK_TOP_LINES 가 매번 다시 뽑는다.
 */

/*
 * 사례 목록 — 손으로 적은 사례를 두지 않는다.
 *
 * 여기 여덟 건이 손으로 적혀 있었다. 방문객 +167% · 배달 매출 +113% · 신규 예약 +300% 같은
 * 값인데 어느 계측에서 나온 숫자인지 댈 수가 없었고, 둘은 병원이라 예약 건수를 적은 것만으로
 * D-0177 에 걸렸다. 대체안을 기다리지 않고 걷는다 (D-0181 · 빼기 먼저 · 채우기 나중).
 *
 * 대신 매일 잰 순위 기록을 싣는다. 카드 하나가 키워드 하나이고, 한 매장이 키워드 셋을
 * 올렸으면 카드도 셋이다 (2026-09-04 (금) 대표 지시 — 겹치는 게 있다면 그래도 추가해).
 */
/*
 * 2026-11-12 시안 틀로 다시 짰다. 업종 탭과 검색은 CasesFilter(클라이언트)로 빼고 이 파일은 서버에서 그린다.
 * 예전 순위표(PlaceRankTable)는 순위 절(RankSection)과 겹쳐 뺐고, 키워드 카드 전체는 접힌 목록으로 남겼다 (ItemList 항목과 짝).
 */

/*
 * 회사 연차 타일은 app/lib/seo.ts 의 companyYear() 를 쓴다 — 개업한 해를 1년차로 센다 (2020년 개업 → 2026년 7년차 · 전역 규칙 1-C).
 * 대표 경력 10년과 다른 숫자다. 해가 바뀌면 저절로 는다.
 * 재계약률 타일이 서던 자리다 (2026-09-25 결재 · 기준일과 분모를 확인하기 전까지 화면에서 뺀다).
 */

/* ─── 구조화 데이터 ───────────────────────────────
   ItemList 로 사례 목록을 노출하면 AI 가 "어떤 성과 사례가 있나" 질의에
   개별 사례를 항목 단위로 인용할 수 있다. */
const CASES_LD = [
  itemListLd({
    path: "/cases",
    name: "하랑마케팅 마케팅 성공 사례",
    items: PLACE_RANK_CASES.map((c) => ({
      name: `${c.industry} · ${c.keywords[0].detail}`,
      path: "/cases",
      description: `${c.label} ${c.keywords[0].detail} 키워드 ${fmtMoveDays(c.keywords[0])}. ${c.asOf} 계측분입니다.`,
    })),
  }),
  webPageLd({
    path: "/cases",
    type: "CollectionPage",
    name: "순위 계측 기록 · 하랑마케팅",
    description:
      "하랑마케팅이 직접 잰 네이버 플레이스 순위 기록. 키워드마다 시작 순위 · 확인된 순위 · 계측 일수만 적었습니다.",
    dateModified: updatedAt("/cases", PLACE_RANK_GENERATED),
  }),
  breadcrumbLd([
    { name: "홈", path: "/" },
    { name: "진행 사례", path: "/cases" },
  ]),
];

/* 내 업종 안내 · 예전 업종 버튼 여섯 개를 링크 목록으로 옮겼다 */
const INDUSTRY_LINKS = [
  { name: "카페·베이커리", result: "플레이스 SEO" },
  { name: "음식점·식당", result: "리뷰 마케팅" },
  { name: "미용·뷰티", result: "인스타그램" },
  { name: "의원·한의원", result: "블로그 마케팅" },
  { name: "학원·교육", result: "맘카페 바이럴" },
  { name: "온라인 쇼핑몰", result: "블로그 SEO" },
].map((ind) => ({ href: `/contact?industry=${encodeURIComponent(ind.name)}`, label: `${ind.name} · ${ind.result}` }));

export default function CasesPage() {
  return (
    <>
      <JsonLd data={CASES_LD} />
      <Header />
      <SianMain>
        {/* 머리 사실 줄 · 예전 요약 타일 네 칸을 옮겼다 */}
        <PageHead
          where="진행 사례 · 순위 계측 기록"
          title={<>직접 잰 순위를<br />그대로 옮긴 기록</>}
          lead="키워드 하나가 몇 위에서 몇 위가 됐는지, 며칠 걸렸는지만 적었습니다. 상호와 지역명은 적지 않고 업종과 행정단위까지만 적었습니다. 방문객과 매출은 계측 대상이 아니어서 수치로 적지 않습니다. 몇 위까지 올려 드린다는 말을 하지 않습니다."
          primary={{ href: "/contact", label: "무료 진단 신청하기" }}
          link={{ href: "/cases/place-rank", label: "계측 방법과 제외 기준 보기" }}
          facts={[
            { label: "완료 프로젝트 · 10년 누적", value: "500+" },
            { label: "개업 · 2020년 4월", value: `${companyYear()}년차` },
            { label: "특화 업종", value: "6개+" },
            { label: "맡아온 매장 · 계약 대장 기준", value: `${TRACK_TOTALS.stores}곳` },
          ]}
        />

        {/* AEO · 성과 질의 한 줄 정답 (speakable) */}
        <AnswerRow
          question="하랑마케팅의 실제 마케팅 성과는 어느 정도인가요?"
          answer={`하랑마케팅이 계측하는 네이버 플레이스 순위 기록입니다. ${PLACE_RANK_TOP_LINES}. 순위는 정해진 시각에 저장한 스냅샷 실측값이며 업종·지역 경쟁 강도에 따라 달라집니다. 여기 실린 카드는 ${PLACE_RANK_AS_OF} 계측분에서 고른 발췌이고 하랑마케팅이 맡아 온 전체 물량이 아닙니다. 맡아 온 매장은 ${TRACK_TOTALS.stores}곳, 업종은 ${TRACK_TOTALS.trades}종입니다. 방문객과 매출은 계측 대상이 아니어서 수치로 제시하지 않습니다.`}
        />

        {/* 순위 · 숫자는 app/lib/place-rank-cases.ts 한 곳에서만 온다. 전체 목록과 계측 방법은 /cases/place-rank */}
        <RankSection
          soft
          label="업종"
          title="키워드별 플레이스 순위"
          desc="검색수가 큰 키워드부터 넷을 옮겼습니다. 줄 하나가 키워드 하나이고, 상호와 지역명은 적지 않습니다."
          more={{ href: "/cases/place-rank", label: "계측 사례 전체 보기" }}
        />

        <Section
          id="place-rank-cards"
          title="키워드마다 한 장씩 실은 계측 기록"
          desc={`마지막 계측에서 1~5위 안에 있던 키워드를(가장 최근 계측 ${PLACE_RANK_AS_OF}) 한 장에 하나씩 옮겼습니다. 카드 하나가 키워드 하나여서, 한 매장이 키워드 셋을 올렸으면 카드도 셋으로 남습니다.`}
          more={{ href: "/cases/place-rank", label: "계측 방법과 제외 기준 보기" }}
        >
          <Fold summary="업종별로 골라 보기">
            <CasesFilter />
          </Fold>
        </Section>

        {/* 관리 매장 이력 요약 · 전체 행은 /portfolio 에 있다 */}
        <Section
          soft
          id="track-record"
          title="순위 말고, 맡아온 매장 자체를 세어 봤습니다"
          desc="계약 대장(구글 시트)과 견적 · 계약 서류를 맞대어 확인한 것만 옮겼습니다. 상호 · 지점명 · 지역은 밝히지 않고 업종과 맡아서 한 일만 적습니다."
          more={{ href: "/portfolio", label: "업종별 매장과 진행 항목 전부 보기" }}
        >
          <ul className="space-y-3">
            <li className="font-semibold" style={{ color: "var(--w-label-strong)" }}>
              맡아온 매장 {TRACK_TOTALS.stores}곳 · 업종 {TRACK_TOTALS.trades}종 · 맡아서 한 일 {TRACK_TOTALS.workKinds}종
            </li>
            {TRACK_RECORD.map((group) => (
              <li key={group.key} className="border-t pt-3" style={{ borderColor: "var(--w-line)" }}>
                {group.name} <span className="w-num" style={{ color: "var(--w-label-alt)" }}>{group.items.length}곳</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section
          id="my-industry"
          title="내 업종은 무엇부터 해야 할까요?"
          desc="업종별 상권 난이도와 추천 서비스를 무료로 안내해드립니다"
        >
          <LinkList links={INDUSTRY_LINKS} />
        </Section>

        <CloseBand
          title="다음 성공 사례의 주인공이 되세요"
          text="상담과 진단은 0원입니다. 카카오톡 문의는 24시간 접수하고, 하랑 대표가 직접 연락드립니다."
          primary={{ href: "/contact", label: "무료 진단 신청하기" }}
        />
      </SianMain>
      <Footer bands={false} />
    </>
  );
}
