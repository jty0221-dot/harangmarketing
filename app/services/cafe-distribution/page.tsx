import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import JsonLd from "../../components/JsonLd";
import { SITE, ORG_ID, LOCAL_ID, PAGE_UPDATED, faqLd, breadcrumbLd, webPageLd, type FaqItem } from "../../lib/seo";
import { CAFE_GROUPS, CAFE_GROUPS_TOTAL, CAFE_NEW_TOTAL } from "../../lib/cafe-notice";
import {
  SianMain, PageHead, AnswerRow, Section, ItemList, LinkList, Steps,
  QuestionList, CostLine, CloseBand, Fold, Table,
} from "../../components/sian/Sian";
import c from "./cafe-distribution.module.css";
import CafeNoticeReopen from "../../components/CafeNoticeReopen";
import { SEARCH_CARE_OFFER } from "../../lib/search-care-offer";
import {
  PACKAGES,
  PACKAGE_SIZES,
  CAFE_TIERS,
  CAFE_COPY_FEE,
  PRICE_NOTE,
  PRICE_MIN,
  PRICE_MAX,
  CAFE_TIER_MIN,
  packageLabel,
  unitPrice,
  copyDiscount,
  WHY_CAFE,
  PROCESS_STEPS,
  CAFE_FAQ,
  REF_CATEGORIES,
  REF_TOTAL,
  won,
  PROOF_SAMPLES,
  GUARANTEES,
  PRICE_REVISED_AT,
  PRICE_NOTICE,
  CAFE_HOW,
} from "../../lib/cafe-distribution";

/**
 * 블로그 원고 · 카페 게시 대행 상품 상세페이지
 *
 * 2026-11-12 (목) 세부 카테고리 시안 틀(app/components/sian)로 옮겼다 (TR-0214). 예전 860px 인계 디자인은 git 이력에 있다.
 * .cafe-dist 토큰은 이제 카페 목록 다시 보기 버튼만 읽는다.
 * 2026-09-07 (월) 가격·구성 갱신 — 이벤트·회차·잔여 슬롯 장치를 걷고 10건·30건 패키지 두 가격 체계로 바꿨다.
 * 2026-09-08 (화) 대표 지시 — 히어로 후킹 문장 · 달라진 점(UPDATE) 섹션 · 단가 조정 안내 · FAQ 문답을 더했다.
 * 2026-09-08 (화) 대표 지시 — 단가 조정 사유를 경쟁 심화에서 물가 상승으로 바꿨다. 금액은 그대로다.
 * 2026-09-08 (화) 대표 지시 — 사유를 다시 물가 상승에서 네이버 로직 변화로 바꿨다. 금액은 그대로다.
 * 2026-09-08 (화) 대표 지시 — 지역 + 업종 키워드를 월 단위로 이어서 관리하는 구간(MONTHLY)을 더했다. 기존 금액은 그대로다.
 * 2026-09-09 (수) 대표 지시 — 카페 단건의 대표 카페 설명(주제 · 고르는 기준 · 올리는 순서)을 보강했다. 금액은 그대로다.
 * 2026-09-10 (목) 대표 지적 · 달라진 점(UPDATE) 아홉 장을 걷었다. 고객이 보는 자리에 작업 이력이 적혀 있었다. 금액은 그대로다.
 */

const PATH = "/services/cafe-distribution";
const URL = `${SITE.base}${PATH}`;

/*
 * 화면 FAQ 와 FAQPage 가 같은 배열을 읽는다. 마지막 문답은 배포처 현황이고 카페 이름과 단가는 적지 않는다 -
 * 묶음 이름과 개수만 cafe-notice.ts 에서 세어 오므로 카페가 늘면 답도 같이 바뀐다 (2026-09-20 · 요청 68).
 * cafe-distribution.ts 가 cafe-notice.ts 를 import 하면 순환이 생겨 lib 의 CAFE_FAQ 에 넣지 않고 여기서 합친다.
 */
const PAGE_FAQ: FaqItem[] = [
  ...CAFE_FAQ,
  {
    q: "지금 배포할 수 있는 카페는 어떤 곳인가요?",
    a: `${CAFE_GROUPS.map((g) => `${g.label} ${g.cafes.length}곳`).join(", ")}, 모두 ${CAFE_GROUPS_TOTAL}곳입니다. 그중 ${CAFE_NEW_TOTAL}곳은 새로 더해진 카페입니다. 카페 이름은 이 페이지의 대표카페 운영 변경 안내에 표로 적어 두었고, 이 페이지의 카페 목록 다시 보기 버튼으로 언제든 다시 열 수 있습니다. 어느 카페에 올릴지는 업종과 키워드를 보고 상담에서 정하고, 목록은 카페 규정에 따라 바뀔 수 있어 상담 시점 기준으로 안내드립니다.`,
  },
];

const CTA_HREF = "/contact?service=cafe-distribution";

const LD = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${URL}#service`,
    name: "블로그 원고 · 카페 게시 대행",
    alternateName: ["카페 배포", "블로그 원고·게시 대행", "최블 카페 배포"],
    serviceType: "네이버 카페·블로그 배포 대행",
    provider: { "@id": LOCAL_ID },
    brand: { "@id": ORG_ID },
    url: URL,
    inLanguage: "ko-KR",
    description:
      "블로그 원고를 작성하고 게시가 허용된 채널에 정한 건수만큼 게시하는 서비스입니다. 업종·지역·목표 키워드에 맞는 카페에 순차 게시하고 전체 게시 URL을 정리해 전달합니다.",
    areaServed: { "@type": "Country", name: "대한민국" },
    serviceOutput: {
      "@type": "Thing",
      name: "카페 배포 협력망 노출 캡처",
      description: `${REF_CATEGORIES.length}개 업종 ${REF_TOTAL}개 키워드의 네이버 모바일 통합검색 카페 영역 노출 실사 캡처를 공개합니다. 하랑이 함께 쓰는 협력 배포망의 게시 실적입니다.`,
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "KRW",
      lowPrice: PRICE_MIN,
      highPrice: PRICE_MAX,
      offerCount: PACKAGES.length * 2 + CAFE_TIERS.length,
      description: "표기 금액은 부가세 별도입니다.",
      offers: [
        ...PACKAGES.map((p) => ({
          "@type": "Offer",
          name: `${p.size}건 ${p.kind} (${packageLabel(p)}) · 원고 작성 포함`,
          price: p.withCopy,
          priceCurrency: "KRW",
          description: `총 ${p.size}건, 1건당 ${unitPrice(p.withCopy, p.size).toLocaleString("ko-KR")}원. 원고 작성 포함.`,
          availability: "https://schema.org/InStock",
        })),
        ...PACKAGES.map((p) => ({
          "@type": "Offer",
          name: `${p.size}건 ${p.kind} (${packageLabel(p)}) · 원고 직접 제공`,
          price: p.withoutCopy,
          priceCurrency: "KRW",
          description: `총 ${p.size}건, 1건당 ${unitPrice(p.withoutCopy, p.size).toLocaleString("ko-KR")}원. 원고를 직접 제공하는 경우.`,
          availability: "https://schema.org/InStock",
        })),
        ...CAFE_TIERS.map((t) => ({
          "@type": "Offer",
          name: `카페 단건 배포 · ${t.grade}`,
          price: t.price,
          priceCurrency: "KRW",
          description: `${t.desc} 건당 금액, 원고 작성까지 맡기면 ${CAFE_COPY_FEE.toLocaleString("ko-KR")}원 추가.`,
          availability: "https://schema.org/InStock",
        })),
      ],
    },
  },
  webPageLd({
    path: PATH,
    name: "블로그 원고 · 카페 게시 대행 | 하랑마케팅",
    description:
      "원고 작성과 블로그·카페 게시 대행 상품. 구성별 가격과 업종별 실사 레퍼런스를 공개합니다.",
    dateModified: PAGE_UPDATED[PATH],
  }),
  faqLd(PAGE_FAQ, URL),
  breadcrumbLd([
    { name: "홈", path: "/" },
    { name: "서비스", path: "/services" },
    { name: "블로그 원고 · 카페 게시 대행", path: PATH },
  ]),
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${URL}#reference-categories`,
    name: "카페 정보 정비 레퍼런스 업종",
    numberOfItems: REF_CATEGORIES.length,
    itemListElement: REF_CATEGORIES.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      description: `${c.keywords.length}개 키워드 카페 영역 노출 실사 캡처`,
      url: `${URL}/reference?category=${c.slug}`,
    })),
  },
];

/* 2026-11-12 시안 틀로 옮김 (TR-0214). 가격 · 먼저 권하는 구성 표시 · 부가세 별도 문구는 lib 값을 그대로 찍는다.
   팝업 둘(SearchCarePopup · CafeNoticePopup)은 SiteChrome 이 경로를 보고 띄운다. 이 페이지는 다시 보기 버튼만 둔다. */
const PACKAGE_HEAD = ["구성", "원고 작성 포함", "원고 직접 제공", "1건당 · 원고 포함"];

export default function CafeDistributionPage() {
  return (
    <>
      <JsonLd data={LD} />
      <Header />
      <SianMain>
        <PageHead
          where="서비스 · 네이버 블로그 원고 · 카페 게시 대행"
          title={<>블로그 원고 · 카페 게시 대행,<br />발행 뒤 노출 확인까지</>}
          lead="블로그 탭에서 멈추는 고객도, 카페 탭까지 넘어가는 고객도 있습니다. 두 곳 모두에 우리 이야기를 두는 배포입니다."
          primary={{ href: CTA_HREF, label: "가능 여부 문의하기" }}
          link={{ href: "#price", label: "구성과 가격 보기" }}
          facts={[
            { label: "패키지", value: "10건 · 30건 · 월 단위" },
            { label: "가격", value: "원고 포함 · 직접 제공" },
            { label: "카페 단건", value: "등급별 건당 단가" },
            { label: "결과", value: "노출 확인 · URL 보고" },
          ]}
        />

        <AnswerRow
          question="블로그는 올리고 있는데 왜 문의는 그대로일까요"
          answer="블로그 탭에서 본 사람은 이미 봤습니다. 문제는 블로그를 건너뛰고 카페 탭부터 여는 사람들입니다. 후기를 찾는 그 자리에 우리 이야기가 없습니다."
        />

        <Section
          soft
          title="소비자의 검색은 블로그 한 곳에서 끝나지 않습니다"
          desc="같은 키워드라도 카페 탭까지 넘어가 보는 사람이 따로 있습니다. 실사용자 후기가 모이는 자리라 여기서 한 번 더 보이면 신뢰가 달라집니다."
        >
          <ItemList
            items={[
              { title: "블로그만 진행했을 때", desc: "블로그 탭에서만 노출. 카페 탭으로 넘어간 고객에게는 우리 매장이 보이지 않습니다." },
              { title: "카페 배포를 함께 했을 때", desc: "블로그와 카페에 게시. 어느 탭을 열든 우리 이야기가 한 번은 보입니다." },
              ...WHY_CAFE.map((w) => ({ title: w.title, desc: w.desc })),
            ]}
          />
        </Section>

        <Section
          id="proof"
          title="말로 설명하지 않겠습니다. 실제 검색 화면입니다"
          desc="몇 건 올렸는지보다 어디에 떴는지가 결과를 가릅니다. 그래서 발행 뒤 키워드마다 노출 위치를 확인하고 캡처와 URL을 남깁니다."
          more={{ href: `${PATH}/reference`, label: `레퍼런스 ${REF_TOTAL}건 전체 보기` }}
        >
          <p className={c.p}>
            아래는 네이버 모바일 통합검색에서 카페 영역에 노출된 실제 화면입니다.
            보정하지 않았습니다. 여기 캡처는 하랑이 함께 쓰는 협력 배포망의 게시 실적입니다. 하랑이 단독으로 진행한 건만 모은 것은 아닙니다. 하랑이 진행한 건은 이런 캡처와 게시 URL을 함께 드립니다.
          </p>
          <p className={c.p}>
            모바일 통합검색 카페 영역 노출 · 실제 게시 화면을 캡처한 자료 · 지역맘 카페 · 대형 카페 커뮤니티 배포.
            이 외에 {REF_CATEGORIES.length}개 업종 {REF_TOTAL}개 키워드를 모두 공개하고 있습니다.
          </p>
          <Fold summary={`업종별 대표 캡처 ${PROOF_SAMPLES.length}장 보기`}>
            {PROOF_SAMPLES.map((s) => (
              <figure key={s.image} className={c.fig}>
                <figcaption>
                  <span>{s.keyword}</span>
                  <Link href={`${PATH}/reference?category=${s.slug}`}>{s.industry} {s.count}건 보기</Link>
                </figcaption>
                <img
                  src={s.image}
                  alt={`'${s.keyword}' 검색 시 네이버 카페 영역 노출 화면 (${s.industry})`}
                  width={1000}
                  height={290}
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            ))}
          </Fold>
          <h3 className={c.h3}>업종별 레퍼런스</h3>
          <LinkList
            links={REF_CATEGORIES.map((cat) => ({
              href: `${PATH}/reference?category=${cat.slug}`,
              label: `${cat.label} ${cat.keywords.length}`,
            }))}
          />
        </Section>

        <Section
          soft
          id="price"
          title="구성과 가격"
          desc={`금액을 먼저 공개합니다. ${PRICE_REVISED_AT} 개정 단가 기준. 표기 금액은 부가세 별도이며, 업종에 따라 진행이 어려운 경우 상담 때 먼저 말씀드립니다.`}
        >
          <p className={c.p}>
            10건 · 30건 패키지는 상담 뒤에 견적이 달라지지 않도록 표에 적힌 기준 그대로 안내합니다. 통합검색 월 관리는 키워드마다 단가가 달라 키워드를 받은 뒤 안내합니다.
            10건과 30건, 두 크기에서 최적화 블로그와 카페의 비율을 고릅니다.
            원고 작성을 맡기는 경우와 원고를 직접 주시는 경우의 금액을 나란히 적었습니다.
          </p>
          <div className={c.notice}>
            <p className={c.noticeTitle}>{PRICE_NOTICE.title}</p>
            {PRICE_NOTICE.lines.map((line) => <p key={line}>{line}</p>)}
          </div>

          {PACKAGE_SIZES.map((size) => (
            <div key={size}>
              <h3 className={c.h3}>{size}건 패키지</h3>
              <p className={c.sub}>원고를 직접 주시면 {won(copyDiscount(size))} 내려갑니다</p>
              <Table
                label={`${size}건 패키지 가격`}
                head={PACKAGE_HEAD}
                rows={PACKAGES.filter((p) => p.size === size).map((p) => [
                  <span key="k">
                    {p.kind} · {packageLabel(p)}
                    {p.featured && <em className={c.best}>먼저 권하는 구성</em>}
                  </span>,
                  <b key="a" className={c.num}>{won(p.withCopy)}</b>,
                  <b key="b" className={c.num}>{won(p.withoutCopy)}</b>,
                  <span key="u" className={c.num}>{won(unitPrice(p.withCopy, p.size))}</span>,
                ])}
              />
            </div>
          ))}
          <p className={c.sub}>표에 없는 건수도 상담에서 조합해 드립니다.</p>

          <h3 className={c.h3}>카페만 단건으로</h3>
          <p className={c.sub}>원고 작성까지 맡기시면 건당 {won(CAFE_COPY_FEE)} 추가</p>
          <Table
            label="카페 단건 등급별 건당 단가"
            head={["등급", "설명 · 카페 주제", "건당"]}
            rows={CAFE_TIERS.map((t) => [
              t.grade,
              <span key="d">{t.desc}<small className={c.topics}>{t.topics.join(" · ")}</small></span>,
              <b key="p" className={c.num}>{won(t.price)}</b>,
            ])}
          />

          {/* 대표 카페 안내 · 카페 이름은 적지 않고 고르는 기준과 올리는 순서만 밝힌다 (2026-09-09 (수) 대표 지시) */}
          <div className={c.gap}>
            <Fold summary="카페는 이렇게 고르고 이렇게 올립니다">
              <p>
                대표 카페는 그 주제에서 회원이 많고 매일 새 글이 올라오는 카페입니다.{" "}
                등급마다 어떤 주제의 카페가 있는지 위 표에 적었고, 카페를 고르는 기준과 올리는 순서는 아래와 같습니다.
              </p>
              <ItemList one items={CAFE_HOW.map((h) => ({ title: h.title, desc: h.desc }))} />
            </Fold>
          </div>
          <p className={c.sub}>
            지금 올릴 수 있는 카페 목록은 대표카페 운영 변경 안내에 있습니다. 닫았던 안내는 아래 버튼으로 다시 열 수 있습니다.
          </p>
          {/* 버튼 색이 .cafe-dist 의 --cd-* 토큰을 읽는다 */}
          <div className="cafe-dist"><CafeNoticeReopen /></div>

          <p className={c.note}>{PRICE_NOTE.map((n) => `· ${n}`).join(" ")}</p>

          <h3 className={c.h3}>건수 패키지와 통합검색 월 관리, 두 가지로 진행합니다</h3>
          <p className={c.p}>
            건수 패키지는 위 표대로 정한 건수의 원고를 쓰고 게시한 뒤 게시 주소를 보고합니다.
            통합검색 월 관리는 키워드 하나를 25일 동안 매일 확인해 기록으로 보고하고, 기록을 확인하신 뒤 정산합니다.
            월 {SEARCH_CARE_OFFER.price}이고 키워드마다 진행 가능 여부와 단가를 먼저 확인합니다.
            검색 결과의 위치는 네이버가 정합니다. 몇 위에 오른다고 약속드리지 않습니다.
          </p>
        </Section>

        <Section title="결제 전에 먼저 밝히는 것들" desc="업종과 목표 키워드만 알려주시면 가능 여부를 먼저 알려드립니다. 상담 0원.">
          <ItemList items={GUARANTEES} />
        </Section>

        <Section soft title="신청부터 보고까지 4단계">
          <Steps steps={PROCESS_STEPS.map((s) => ({ title: s.title, desc: s.desc }))} />
        </Section>

        {/* FAQ · LD 의 faqLd(PAGE_FAQ) 와 짝 */}
        <Section
          id="faq"
          title="자주 묻는 질문"
          more={{ href: "/services", label: "서비스 전체 보기" }}
          footer={
            <CostLine
              text={`10건 · 30건 패키지 ${won(PRICE_MIN)}부터, 카페 단건 ${won(CAFE_TIER_MIN)}부터. 표기 금액은 부가세 별도입니다.`}
              link={{ href: "#price", label: "구성과 가격 보기" }}
            />
          }
        >
          <QuestionList items={PAGE_FAQ} />
        </Section>

        <CloseBand
          title="블로그와 카페 게시 대행으로 원고와 게시 계획을 상담하세요"
          text="진행 전 상담을 통해 업종별 가능 여부를 확인해 드립니다. 상담 비용 0원."
          primary={{ href: CTA_HREF, label: "구성 상담 신청하기" }}
        />
      </SianMain>
      <Footer bands={false} />
    </>
  );
}
