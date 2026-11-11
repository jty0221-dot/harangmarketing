import Link from "next/link";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import JsonLd from "./components/JsonLd";
import {
  SITE, CORE_FAQ, ANSWER_SENTENCES, DEFINITIONS, PAGE_UPDATED,
  faqLd, webPageLd, breadcrumbLd, definitionsLd,
} from "./lib/seo";
import {
  byVolume, fmtMove, PLACE_RANK_AS_OF, PLACE_RANK_VOLUME_AS_OF, PLACE_RANK_MONITORING,
} from "./lib/place-rank-cases";
import { TRACK_TOTALS } from "./lib/track-record";
import { PARTNERS, PARTNER_LOGO, CLIENTS_AS_OF, type Partner } from "./lib/partners";
import s from "./home.module.css";

/*
 * 홈 (/) · 2026-11-12 시안대로 17개 섹션을 8개로 줄였다 (TR-0214 · 대표 지시 「시안대로 민수한테 구현 시켜」).
 * 시안 정본 : E:\하랑\홈페이지공장\out\harang-home-sian-20261112\index.html
 * 홈에서 내린 내용(업종 카드 · 관리 매장 이력 · 고민 해결 · 업종별 전략 · 사진촬영 · 지역 · 용어)은
 * 각자 전용 페이지가 있고, 맺음 띠 바로 위 「더 알아보기」 목록과 바닥글에서 그 페이지로 간다.
 */

/* ─── AEO/GEO 구조화 데이터 (홈) ───────────────────
   FAQPage · DefinedTermSet 은 아래 화면의 질문 목록과 용어 목록에 1:1로 대응한다.
   둘 다 <details> 안에 본문이 그대로 들어 있어 접혀 있어도 크롤러가 읽는다.
   화면에서 하나를 지우면 여기서도 함께 지울 것. */
const HOME_LD = [
  webPageLd({
    path: "/",
    name: "하랑마케팅 | 소상공인 마케팅 대행사",
    description: ANSWER_SENTENCES.whoWeAre,
    dateModified: PAGE_UPDATED["/"],
  }),
  breadcrumbLd([{ name: "홈", path: "/" }]),
  faqLd(CORE_FAQ, `${SITE.base}/`),
  definitionsLd("/"),
];

/* 숫자와 표기는 app/lib/place-rank-cases.ts 한 곳에서만 온다. 검색수가 큰 키워드부터 네 줄.
   몇 장을 실었는지 세는 문장은 넣지 않는다 (2026-09-07 (월) 대표 지시 「이런 멘트 자체를 넣지마」).
   그래서 시안의 「화면에 올린 계측 사례 N건」 칸은 계측 중인 매장 수로 바꿨다. */
const RANK_ROWS = byVolume(4);
const MONITOR = [
  { value: `${PLACE_RANK_MONITORING.stores}곳`, label: "지금 계측 중인 매장" },
  { value: `${PLACE_RANK_MONITORING.keywords}개`, label: "지금 계측 중인 키워드" },
  { value: `${PLACE_RANK_MONITORING.page1Keywords}개`, label: "그 가운데 1~5위" },
];

/** `190위에서 5위` 를 lib 의 문장 그대로 쓰고 끝 순위만 강조한다. 유지 기록은 그대로 둔다 */
function Move({ from, to }: { from: number; to: number }) {
  const [a, b] = fmtMove({ from, to }).split("에서");
  return b === undefined ? <>{a}</> : <>{a}<i>에서</i><b>{b.trim()}</b></>;
}

const CHECKS = [
  { title: "현재 검색 위치", text: "고객이 찾는 키워드에서 내 매장이 어디에 보이는지 확인합니다." },
  { title: "놓치고 있는 유입 경로", text: "플레이스, 블로그, 콘텐츠 가운데 지금 막힌 경로를 먼저 찾습니다." },
  { title: "먼저 할 한 가지", text: "해야 할 일을 늘어놓지 않고 우선순위와 다음 확인 기준을 정합니다." },
];

const PACKAGES = [
  {
    name: "한 채널 집중",
    roi: "대표 키워드 한 곳에 집중",
    desc: "한 곳만 확실히 잡으면 되는 매장",
    features: ["플레이스 SEO 최적화 1회", "대표키워드 5개 관리", "리뷰 유도 동선 설계", "월 리포트 1회"],
    popular: false,
  },
  {
    name: "두세 채널 묶음",
    roi: "검색 유입부터 문의 동선까지",
    desc: "검색 유입부터 만들어야 하는 매장",
    features: ["플레이스 SEO 최적화", "블로그 관리대행 월 10~15편", "파워컨텐츠 원고 설계 · 검수", "네이버 광고 운영대행", "월 리포트 2회"],
    popular: true,
  },
  {
    name: "전 채널 통합",
    roi: "지역 키워드 여러 구간 동시 공략",
    desc: "경쟁이 촘촘한 상권, 지점이 여러 곳인 브랜드",
    features: ["블로그 · 카페 배포 월 10~30건", "파워컨텐츠 월 5편", "플레이스 SEO · 주간 순위 관리", "인스타 피드 · 릴스 월 8~20건", "주간 최적화 리포트"],
    popular: false,
  },
];

const PRICE_BASIS = [
  { value: "필요한 항목만 합산", label: "견적 방식" },
  { value: "블로그 1편 3~5만원", label: "기준 단가 · 업종마다 다름 · 부가세 별도" },
  { value: "상담 · 현황 진단 0원", label: "견적 받고 안 하셔도 됩니다" },
];

const COMPARISONS = [
  {
    pain: "계약 후 담당자가 바뀌어 처음부터 다시 설명",
    harang: "대표가 직접 상담하고 계약부터 종료까지 1:1 관리",
    detail: "상담 전화를 받는 사람이 대표입니다. 상담한 사람이 그대로 끝까지 맡습니다.",
  },
  {
    pain: "성과가 없어도 월 비용 그대로 청구",
    harang: "월 단위 계약, 매달 잰 순위를 보고 계속 여부 결정",
    detail: "어렵다고 판단하면 계약 자체를 권하지 않습니다.",
  },
  {
    pain: "업종 구분 없이 똑같은 패키지",
    harang: "카페 · 병원 · 학원 · 음식점 업종별 맞춤 설계",
    detail: "네이버 플레이스 최적화는 카페와 한의원이 다릅니다.",
  },
  {
    pain: "보고서가 복잡해서 무슨 말인지 모름",
    harang: "플레이스 순위 · 리뷰 수치 중심으로 월 2회 직접 보고",
    detail: "마케팅 용어 없이 그 자리에서 바로 이해하실 수 있게 설명합니다.",
  },
  {
    pain: "프리랜서 재하청으로 관리 공백",
    harang: "상담한 대표가 진행 방향과 보고를 계속 확인",
    detail: "약속한 작업은 게시 URL 로 전부 확인하실 수 있습니다.",
  },
];

/* 로고는 app/lib/partners.ts 한 곳에서 온다. 앞 절반과 뒤 절반을 두 줄에 나눠 서로 반대로 흐르게 한다 */
const HALF = Math.ceil(PARTNERS.length / 2);
const LOGO_ROWS = [PARTNERS.slice(0, HALF), PARTNERS.slice(HALF)];

/** 로고가 있으면 이미지, 없으면 같은 칸에 상호를 글자로 적는다 */
function Tile({ p, hidden }: { p: Partner; hidden?: boolean }) {
  return (
    <li aria-hidden={hidden || undefined}>
      {p.file
        ? <img src={`/partners/${p.file}`} alt={hidden ? "" : `${p.name} 로고`} width={PARTNER_LOGO.w} height={PARTNER_LOGO.h} loading="lazy" decoding="async" />
        : <span className={s.word}>{p.name}</span>}
    </li>
  );
}

/* 고객을 장담하지 않는 이유 · 2026-11-12 대표가 붙여 준 글을 세 줄로 줄였다 */
const BELIEFS = [
  { title: "결과를 움직이는 변수는 많습니다", text: "상품의 경쟁력, 가격, 시장 상황, 고객의 구매 심리까지. 좋은 마케터를 써도 매출이 저절로 오르지는 않습니다." },
  { title: "그래서 가장 효율적인 방향부터 찾습니다", text: "주어진 조건에서 돈과 시간이 덜 새는 길을 먼저 고르고, 될 확률을 한 단계씩 높입니다." },
  { title: "답은 대표님과 함께 찾습니다", text: "결과만 요구하는 일이 아니라, 전문성을 믿고 같이 답을 찾아가는 과정이라고 생각합니다." },
];

/* 묶음은 FAQ 페이지와 같은 주제 다섯 개. 질문 수는 묶음 길이에서 센다 */
const FAQ_GROUPS = [
  { label: "비용 · 계약", items: [1, 4, 7, 19, 20] },
  { label: "상담 · 진행 · 개업 준비", items: [0, 8, 14, 15, 18] },
  { label: "검색 노출 · 성과", items: [2, 3, 5, 6, 16, 21] },
  { label: "채널별 마케팅", items: [9, 10, 11, 12, 13, 17] },
  { label: "병원 · 치과 마케팅", items: [22, 23, 24, 25] },
].map((g) => ({ label: g.label, items: g.items.map((i) => CORE_FAQ[i]).filter(Boolean) }));

/* 홈에서 내린 섹션의 전용 페이지. 문구는 내리기 전 홈에 있던 링크 문구 그대로다 */
const MORE_LINKS = [
  { href: "/portfolio", label: "업종별 진행 항목까지 보기" },
  { href: "/cases", label: "전체 사례 보기" },
  { href: "/services", label: "전체 서비스 보기" },
  { href: "/services#pricing", label: "항목별 단가와 계산 과정 보기" },
  { href: "/services/photo/price", label: "촬영 구성과 가격" },
  { href: "/location", label: "지역별 안내 자세히 보기" },
];

export default function HomePage() {
  return (
    <>
      <JsonLd data={HOME_LD} />
      <Header />
      <main className={s.root}>
        <HeroSection />

        {/* 장담하지 않는 이유 */}
        <section className={`${s.sec} ${s.soft}`} aria-labelledby="belief-heading">
          <div className={`${s.wrap} ${s.two}`}>
            <div className={s.side}>
              <h2 id="belief-heading">마케팅 비용으로 사시는 것은 경험과 시간입니다</h2>
              <p>광고를 대신 눌러 드리는 값이 아니라, 오래 쌓은 노하우와 대표님 문제를 푸는 데 쓰는 시간입니다.</p>
            </div>
            <ol className={s.checks}>
              {BELIEFS.map((c, i) => (
                <li key={c.title}>
                  <span className={s.no}>0{i + 1}</span>
                  <h3>{c.title}</h3>
                  <p>{c.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 키워드별 순위 */}
        <section className={s.sec} id="rank" aria-labelledby="rank-heading">
          <div className={`${s.wrap} ${s.two}`}>
            <div className={s.side}>
              <h2 id="rank-heading">키워드별 순위, 잰 그대로 적었습니다</h2>
              <p>정해진 시각에 잰 네이버 플레이스 순위를 그대로 옮겼습니다. 상호와 지역명은 적지 않고, 그 키워드를 한 달에 몇 번 찾는지 같이 적었습니다.</p>
              <Link href="/cases/place-rank" className={s.more}>계측 사례 전체 보기</Link>
            </div>
            <div>
              <div className={s.rank} role="table" aria-label="키워드별 플레이스 순위">
                <div className={`${s.rankRow} ${s.rankHead}`} role="row">
                  <span role="columnheader">키워드</span>
                  <span role="columnheader">네이버 월 검색수</span>
                  <span role="columnheader">플레이스 순위</span>
                  <span role="columnheader" style={{ textAlign: "right" }}>계측 기간</span>
                </div>
                {RANK_ROWS.map((c) => {
                  const k = c.keywords[0];
                  return (
                    <div key={c.code} className={s.rankRow} role="row">
                      <div className={s.kw} role="cell">{k.detail}<small>{c.industry}</small></div>
                      <div className={s.vol} role="cell">{c.volumeLabel}</div>
                      <div className={s.move} role="cell"><Move from={k.from} to={k.to} /></div>
                      {/* 카드마다 잰 날짜를 붙인다. 내려가기 전 순위를 둔 건이 지금 순위로 읽히지 않게 (규칙 5) */}
                      <div className={s.days} role="cell">{k.days}일<small>{c.asOf} 계측</small></div>
                    </div>
                  );
                })}
              </div>
              <p className={s.note}>
                가장 최근 계측 {PLACE_RANK_AS_OF}. 검색수는 {PLACE_RANK_VOLUME_AS_OF}에 조회한 네이버 월간 검색수입니다. 특정 순위와 매출은 미리 약속하지 않습니다.
              </p>
              <dl className={s.sum}>
                {MONITOR.map((m) => (
                  <div key={m.label}>
                    <dt>{m.value}</dt>
                    <dd>{m.label}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* 확인하는 것 */}
        <section className={`${s.sec} ${s.soft}`} aria-labelledby="check-heading">
          <div className={`${s.wrap} ${s.two}`}>
            <div className={s.side}>
              <h2 id="check-heading">무엇이 문제인지 알면, 다음 선택은 선명해집니다</h2>
              <p>더 많은 상품을 권하기 전에 대표님이 판단할 수 있는 기준부터 드립니다.</p>
            </div>
            <ol className={s.checks}>
              {CHECKS.map((c, i) => (
                <li key={c.title}>
                  <span className={s.no}>0{i + 1}</span>
                  <h3>{c.title}</h3>
                  <p>{c.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 구성 */}
        <section className={s.sec} aria-labelledby="plan-heading">
          <div className={s.wrap}>
            <div className={s.two}>
              <div className={s.side}><h2 id="plan-heading">매장에 필요한 것만 골라 조합합니다</h2></div>
              <div className={s.side}>
                <p style={{ marginTop: 6 }}>필요 없는 항목까지 묶은 패키지를 권하지 않습니다. 아래는 실제로 나간 구성이고, 필요 없는 항목은 빼고 부족한 항목은 더해 다시 짜드립니다.</p>
              </div>
            </div>
            <div className={s.plans}>
              {PACKAGES.map((p) => (
                <div key={p.name} className={`${s.plan} ${p.popular ? s.pick : ""}`}>
                  <span className={s.tag}>{p.popular ? `${p.name} · 하랑 대표 추천` : p.name}</span>
                  <h3>{p.roi}</h3>
                  <p className={s.who}>{p.desc}</p>
                  <ul>{p.features.map((f) => <li key={f}>{f}</li>)}</ul>
                  <Link href="/contact">이 구성으로 문의하기</Link>
                </div>
              ))}
            </div>
            <dl className={s.price}>
              {PRICE_BASIS.map((p) => (
                <div key={p.label}>
                  <dt>{p.value}</dt>
                  <dd>{p.label}</dd>
                </div>
              ))}
            </dl>
            <p className={s.note}>
              단가는 실제로 나간 견적서에 쓴 금액 그대로입니다. 부가세 별도이고 광고 집행비는 매체에 직접 나가는 실비라 대행료에 넣지 않습니다.{" "}
              <Link href="/services#pricing">항목별 단가와 계산 과정 보기</Link>
            </p>
          </div>
        </section>

        {/* 비교 · 홈에서 하나뿐인 어두운 띠 */}
        <section className={`${s.sec} ${s.dark}`} aria-labelledby="cmp-heading">
          <div className={s.wrap}>
            <h2 id="cmp-heading">다른 대행사에서 실망하셨다면 이 표를 먼저 보세요</h2>
            <div className={s.cmp} role="table" aria-label="일반 대행사와 하랑마케팅 비교">
              <div className={`${s.cmpRow} ${s.cmpHead}`} role="row">
                <div role="columnheader">일반 대행사의 현실</div>
                <div role="columnheader" className={s.us}>하랑마케팅</div>
              </div>
              {COMPARISONS.map((c) => (
                <div key={c.pain} className={s.cmpRow} role="row">
                  <div role="cell" className={s.them}>{c.pain}</div>
                  <div role="cell" className={s.us}>
                    <strong>{c.harang}</strong>
                    <span>{c.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 지금 함께하는 곳 · 두 줄 파노라마. 마우스를 올리거나 초점이 들어오면 멈춘다 */}
        <section className={s.sec} aria-labelledby="partners-heading">
          <div className={s.wrap}>
            <div className={s.side}>
              <h2 id="partners-heading">지금 함께하고 있는 곳들</h2>
              <p>{CLIENTS_AS_OF} 기준, 하랑 대표가 직접 맡아 진행 중인 매장과 브랜드입니다. 음식점과 카페부터 치과 · 의원, 입주청소와 설비까지.</p>
            </div>
            <div className={s.pano} role="region" tabIndex={0} aria-label="지금 함께하고 있는 곳 로고 목록 · 초점이 들어오면 멈춥니다">
              {LOGO_ROWS.map((row, r) => (
                <ul key={r} className={`${s.track} ${r ? s.rev : ""}`}>
                  {row.map((p) => <Tile key={p.name} p={p} />)}
                  {row.map((p) => <Tile key={`${p.name}-2`} p={p} hidden />)}
                </ul>
              ))}
            </div>
            <dl className={`${s.sum} ${s.sumThree}`}>
              <div><dt>{TRACK_TOTALS.stores}곳</dt><dd>지금까지 맡아온 매장 · 계약 대장 기준</dd></div>
              <div><dt>{TRACK_TOTALS.trades}종</dt><dd>업종 · 음식점부터 설비까지</dd></div>
              <div><dt>{TRACK_TOTALS.workKinds}종</dt><dd>맡아서 한 일 · 플레이스부터 영상까지</dd></div>
            </dl>
          </div>
        </section>

        {/* 질문 · FAQPage 구조화 데이터와 짝. 주제를 펼치면 질문과 답이 보인다 */}
        <section className={`${s.sec} ${s.soft}`} aria-labelledby="faq-heading">
          <div className={`${s.wrap} ${s.two}`}>
            <div className={s.side}>
              <h2 id="faq-heading">대표님들이 가장 많이 묻는 질문</h2>
              <Link href="/faq" className={s.more}>전체 질문 보기</Link>
            </div>
            <div className={s.faq}>
              {FAQ_GROUPS.map((g) => (
                <details key={g.label} name="home-faq">
                  <summary>{g.label}<span>질문 {g.items.length}개</span></summary>
                  <dl className={s.qa}>
                    {g.items.map((f) => (
                      <div key={f.q}>
                        <dt>{f.q}</dt>
                        <dd className="speakable">{f.a}</dd>
                      </div>
                    ))}
                  </dl>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* 더 알아보기 · AI 답변 엔진이 인용하는 한 줄 정답(speakable)과, 홈에서 내린 섹션의 전용 페이지 */}
        <section className={s.sec} aria-labelledby="about-heading">
          <div className={`${s.wrap} ${s.two}`}>
            <div className={s.side}>
              <h2 id="about-heading">하랑마케팅은 어떤 회사인가요?</h2>
            </div>
            <div>
              <p className={`speakable ${s.answer}`}>{ANSWER_SENTENCES.whoWeAre}</p>
              <ul className={s.links} style={{ marginTop: 32 }}>
                {MORE_LINKS.map((l) => (
                  <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
                ))}
              </ul>
              {/* 용어 사전 · DefinedTermSet 구조화 데이터와 짝 (전체 화면은 /services) */}
              <details className={s.gloss}>
                <summary>마케팅 용어, 쉽게 정리했습니다</summary>
                <dl className={s.qa}>
                  {DEFINITIONS.map((d) => (
                    <div key={d.term}>
                      <dt>{d.term}</dt>
                      <dd className="speakable">{d.definition}</dd>
                    </div>
                  ))}
                </dl>
              </details>
            </div>
          </div>
        </section>

        {/* 맺음 */}
        <section className={s.close} aria-labelledby="close-heading">
          <div className={s.wrap}>
            <h2 id="close-heading">계약 전에, 지금 무엇부터 볼지 확인하세요</h2>
            <p>업종과 지역을 남겨주시면 현재 상태를 확인한 뒤 먼저 할 일과 다음에 확인할 숫자를 하랑 대표가 설명합니다.</p>
            <div className={s.acts}>
              <Link href="/contact" className={`${s.btn} ${s.btnWhite}`}>내 매장 현재 상태 확인하기</Link>
              <a href={SITE.kakaoChat} target="_blank" rel="noopener noreferrer" className={`${s.btn} ${s.btnLine}`}>카카오톡 상담</a>
              <a href={`tel:${SITE.phone}`} className={s.tel}>{SITE.phone}</a>
            </div>
          </div>
        </section>
      </main>
      <Footer bands={false} />
    </>
  );
}
