import Link from "next/link";
import type { ReactNode } from "react";
import { SITE, type FaqItem } from "../../lib/seo";
import { byVolume, fmtMove, PLACE_RANK_AS_OF, PLACE_RANK_VOLUME_AS_OF } from "../../lib/place-rank-cases";
import s from "./sian.module.css";

/*
 * 세부 카테고리 페이지 공통 틀 · 2026-11-12 시안 (TR-0214 · 대표 지시 「각 세부 카테고리쪽 페이지도 보완해」).
 * 순서 : 머리 → 정답 → 본문 절(제목 4/12 · 내용 8/12) → 순위 → 진행 순서 → 질문 → 비용 한 줄 → 맺음 띠 하나.
 * 한 화면에 눈에 띄는 단추는 하나다. 머리와 맺음 띠에만 단추가 있다.
 * 이 틀을 쓰는 경로는 SIAN_ROUTES (app/components/sian/routes.ts) 에 같이 적는다 · 공지 띠를 끄고 머리글을 투명하게 한다.
 */

type Href = { href: string; label: string };
type Fact = { label: string; value: string };

/** 페이지 몸통 · 토큰과 글자 크기를 깐다 */
export function SianMain({ children }: { children: ReactNode }) {
  return <main className={s.root}>{children}</main>;
}

/** 머리 · 어두운 바탕 · 왼쪽 제목 · 단추 하나 + 글자 링크 하나 · 아래에 사실 3~4칸 */
export function PageHead({ where, title, lead, primary, link, facts = [] }: {
  where: string;
  title: ReactNode;
  lead: ReactNode;
  primary: Href;
  link?: Href;
  facts?: Fact[];
}) {
  return (
    <section className={s.head}>
      <div className={s.wrap}>
        <span className={s.where}>{where}</span>
        <h1>{title}</h1>
        <p className={s.lead}>{lead}</p>
        <div className={s.acts}>
          <Link href={primary.href} className={`${s.btn} ${s.btnWhite}`}>{primary.label}</Link>
          {link && <Link href={link.href} className={s.textLink}>{link.label}</Link>}
        </div>
        {facts.length > 0 ? (
          <dl className={`${s.facts} ${facts.length === 3 ? s.facts3 : ""}`}>
            {facts.map((f) => (
              <div key={f.label}>
                <dt>{f.value}</dt>
                <dd>{f.label}</dd>
              </div>
            ))}
          </dl>
        ) : <div className={s.noFacts} />}
      </div>
    </section>
  );
}

/** 2단 절 · 제목은 왼쪽 4/12, 내용은 오른쪽 8/12 */
export function Section({ title, desc, eyebrow, more, soft, id, children, footer }: {
  title: string;
  desc?: ReactNode;
  eyebrow?: string;
  more?: Href;
  soft?: boolean;
  id?: string;
  children: ReactNode;
  /** 2단 아래 전체 폭으로 붙는 줄 (비용 한 줄 등) */
  footer?: ReactNode;
}) {
  const hid = id ? `${id}-heading` : undefined;
  return (
    <section className={`${s.sec} ${soft ? s.soft : ""}`} id={id} aria-labelledby={hid}>
      <div className={s.wrap}>
        <div className={s.two}>
          <div className={s.side}>
            {eyebrow && <span className={s.eyebrow}>{eyebrow}</span>}
            <h2 id={hid}>{title}</h2>
            {desc && <p>{desc}</p>}
            {more && <Link href={more.href} className={s.more}>{more.label}</Link>}
          </div>
          <div>{children}</div>
        </div>
        {footer}
      </div>
    </section>
  );
}

/** 정답 · 상자 없이 질문 왼쪽 · 답 오른쪽. speakable 지정(.speakable)은 그대로 */
export function AnswerRow({ question, answer }: { question: string; answer: string }) {
  return (
    <Section title={question} id="answer">
      <p className={`speakable ${s.answer}`}>{answer}</p>
    </Section>
  );
}

/** 한 줄짜리 항목 목록 */
export function LineList({ items }: { items: string[] }) {
  return <ul className={s.qlist}>{items.map((t) => <li key={t}>{t}</li>)}</ul>;
}

/** 제목 + 설명 목록 · href 가 있으면 제목이 링크가 된다 */
export function ItemList({ items, one }: { items: { title: string; desc: string; href?: string }[]; one?: boolean }) {
  return (
    <dl className={`${s.items} ${one ? s.items1 : ""}`}>
      {items.map((i) => (
        <div key={i.title}>
          <dt>{i.href ? <Link href={i.href}>{i.title}</Link> : i.title}</dt>
          <dd>{i.desc}</dd>
        </div>
      ))}
    </dl>
  );
}

/** 다른 페이지로 가는 짧은 링크 목록 */
export function LinkList({ links }: { links: Href[] }) {
  return (
    <ul className={s.links}>
      {links.map((l) => <li key={l.href}><Link href={l.href}>{l.label}</Link></li>)}
    </ul>
  );
}

/** 진행 순서 · 번호는 글자로만 */
export function Steps({ steps, idPrefix }: { steps: { title: string; desc: string }[]; /** HowTo 단계 url(#step-1 …)이 가리키는 자리 */ idPrefix?: string }) {
  return (
    <ol className={s.steps}>
      {steps.map((st, i) => (
        <li key={st.title} id={idPrefix ? `${idPrefix}${i + 1}` : undefined}>
          <span className={s.no}>{String(i + 1).padStart(2, "0")}</span>
          <h3>{st.title}</h3>
          <p>{st.desc}</p>
        </li>
      ))}
    </ol>
  );
}

/** `190위에서 5위` 를 lib 문장 그대로 쓰고 끝 순위만 강조한다 (홈과 같은 꼴) */
function Move({ from, to }: { from: number; to: number }) {
  const [a, b] = fmtMove({ from, to }).split("에서");
  return b === undefined ? <>{a}</> : <>{a}<i>에서</i><b>{b.trim()}</b></>;
}

/** 이 업종에서 잰 줄. 검색수가 큰 키워드부터 넷. 남의 업종 줄은 빌려오지 않는다 */
export function rankRows(industries?: string[], limit = 4) {
  return byVolume().filter((c) => !industries || industries.includes(c.industry)).slice(0, limit);
}

/**
 * 순위 절 · 숫자는 app/lib/place-rank-cases.ts 한 곳에서만 온다.
 * 그 업종 줄이 하나도 없으면 절이 통째로 빠진다 (C-42 · 틀린 값보다 빈 값).
 */
export function RankSection({ industries, label, soft, title, desc, more }: {
  /** 비우면 업종을 가리지 않고 검색수가 큰 줄부터 넷 (플레이스 페이지) */
  industries?: string[];
  label: string;
  soft?: boolean;
  title?: string;
  desc?: string;
  more?: Href;
}) {
  const rows = rankRows(industries);
  if (rows.length === 0) return null;
  return (
    <Section
      id="rank"
      soft={soft}
      title={title ?? `${label} 매장에서 잰 순위`}
      desc={desc ?? `${label} 업종에서 잰 기록입니다. 줄 하나가 키워드 하나이고, 상호와 지역명은 적지 않습니다.`}
      more={more ?? { href: "/cases/place-rank", label: "다른 업종 기록도 보기" }}
    >
      <div className={s.rank} role="table" aria-label={`${label} 키워드별 플레이스 순위`}>
        <div className={`${s.rankRow} ${s.rankHead}`} role="row">
          <span role="columnheader">키워드</span>
          <span role="columnheader">네이버 월 검색수</span>
          <span role="columnheader">플레이스 순위</span>
          <span role="columnheader" style={{ textAlign: "right" }}>계측 기간</span>
        </div>
        {rows.map((c) => {
          const k = c.keywords[0];
          return (
            <div key={c.code} className={s.rankRow} role="row">
              <div className={s.kw} role="cell">{k.detail}<small>{c.industry}</small></div>
              <div className={s.vol} role="cell">{c.volumeLabel}</div>
              <div className={s.move} role="cell"><Move from={k.from} to={k.to} /></div>
              {/* 줄마다 잰 날짜를 붙인다. 내려가기 전 순위를 둔 건이 지금 순위로 읽히지 않게 (규칙 5) */}
              <div className={s.days} role="cell">{k.days}일<small>{c.asOf} 계측</small></div>
            </div>
          );
        })}
      </div>
      <p className={s.note}>
        가장 최근 계측 {PLACE_RANK_AS_OF}. 검색수는 {PLACE_RANK_VOLUME_AS_OF}에 조회한 네이버 월간 검색수입니다. 특정 순위와 매출은 미리 약속하지 않습니다.
      </p>
    </Section>
  );
}

/**
 * 질문 목록 · 펼치면 답이 보인다. FAQPage 구조화 데이터와 짝이라 질문과 답이 DOM 에 그대로 있다.
 * 페이지의 faqLd 에 넣은 항목을 빠짐없이 넘길 것.
 */
export function QuestionList({ items }: { items: FaqItem[] }) {
  return (
    <div className={s.acc}>
      {items.map((f, i) => (
        <details key={f.q} open={i === 0}>
          <summary>{f.q}</summary>
          <p>{f.a}</p>
        </details>
      ))}
    </div>
  );
}

/** 접힌 설명 · 긴 설명을 본문 길이에서 빼되 DOM 에는 남긴다 (검색 · AI 인용용) */
export function Fold({ summary, children, open }: { summary: string; children: ReactNode; open?: boolean }) {
  return (
    <div className={s.acc}>
      <details open={open}>
        <summary>{summary}</summary>
        <div className={s.foldBody}>{children}</div>
      </details>
    </div>
  );
}

/** 가는 선 표 · 좁은 화면에서는 표 안에서만 가로로 밀린다 (페이지는 넘치지 않는다) */
export function Table({ head, rows, label }: { head: string[]; rows: ReactNode[][]; label: string }) {
  return (
    <div className={s.tblWrap}>
      <table className={s.tbl} aria-label={label}>
        <thead><tr>{head.map((h) => <th key={h} scope="col">{h}</th>)}</tr></thead>
        <tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

/** 비용 한 줄 · 질문 절 아래 전체 폭 */
export function CostLine({ text, link = { href: "/services#pricing", label: "항목별 단가 보기" } }: { text: string; link?: Href }) {
  return (
    <div className={s.cost}>
      <p>{text}</p>
      <Link href={link.href}>{link.label}</Link>
    </div>
  );
}

/** 맺음 띠 · 한 페이지에 하나 */
export function CloseBand({ title, text, primary }: { title: string; text: ReactNode; primary: Href }) {
  return (
    <section className={s.close} aria-labelledby="close-heading">
      <div className={s.wrap}>
        <h2 id="close-heading">{title}</h2>
        <p>{text}</p>
        <div className={s.acts}>
          <Link href={primary.href} className={`${s.btn} ${s.btnWhite}`}>{primary.label}</Link>
          <a href={SITE.kakaoChat} target="_blank" rel="noopener noreferrer" className={`${s.btn} ${s.btnLine}`}>카카오톡 상담</a>
          <a href={`tel:${SITE.phone}`} className={s.tel}>{SITE.phone}</a>
        </div>
      </div>
    </section>
  );
}

/* ───────── 처음 보는 대표님용 · 2026-11-12 보완 (대표 지시 「초보사장님들이 봐도 잘 알아들을 수 있게」) ───────── */

type Term = { term: string; desc: string };

/** 낱말 풀이 · 어려운 말이 처음 나오는 자리에 둔다 */
export function TermList({ terms, label = "이 페이지에 나오는 말" }: { terms: readonly Term[]; label?: string }) {
  return (
    <div className={s.terms}>
      <p className={s.termsLabel}>{label}</p>
      <dl>
        {terms.map((t) => (
          <div key={t.term}>
            <dt>{t.term}</dt>
            <dd>{t.desc}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/**
 * 머리 바로 아래 쉬운 풀이 · 무엇을 하는 일인지 · 누구에게 필요한지 · 그림 · 낱말 풀이.
 * 병·의원 페이지에는 쓰지 않는다 (검수본 문장을 건드리지 않는다).
 */
export function Plain({ what, who, terms = [], children }: {
  what: string;
  who: string;
  terms?: readonly Term[];
  /** 그림 (SearchSketch 등) */
  children?: ReactNode;
}) {
  return (
    <Section id="plain" eyebrow="처음이시라면" title="쉽게 말하면 이런 일입니다" desc="어려운 말을 빼고 먼저 정리했습니다. 자세한 내용은 아래에 이어집니다.">
      <dl className={s.plain}>
        <div>
          <dt>무슨 일인가요</dt>
          <dd>{what}</dd>
        </div>
        <div>
          <dt>누구에게 필요한가요</dt>
          <dd>{who}</dd>
        </div>
      </dl>
      {children}
      {terms.length > 0 && <TermList terms={terms} />}
    </Section>
  );
}

export type SketchZone = "ad" | "place" | "post" | "site";

const SKETCH_ZONES: { id: SketchZone; name: string; desc: string }[] = [
  { id: "ad", name: "광고 자리", desc: "돈을 내면 올라가는 자리입니다. 누른 만큼 광고비가 네이버로 나가고, 멈추면 내려옵니다." },
  { id: "place", name: "플레이스 (지도와 가게 목록)", desc: "가게 정보, 사진, 리뷰가 쌓여서 순서가 정해지는 자리입니다. 돈으로 사는 자리가 아닙니다." },
  { id: "post", name: "블로그 · 카페 글", desc: "다녀온 사람의 후기와 정보 글이 실리는 자리입니다. 손님이 가기 전에 여기서 확인합니다." },
  { id: "site", name: "홈페이지 · 스토어", desc: "눌러서 들어가는 우리 가게 페이지입니다. 문의와 결제가 여기서 일어납니다." },
];

/**
 * 네이버에서 동네 가게를 검색하면 보이는 화면을 단순하게 그린 그림 (실제 화면 갈무리가 아니다).
 * focus 로 넘긴 자리만 파랗게 칠하고 「이 페이지에서 다루는 자리」라고 적는다. 여러 페이지가 이 그림 하나를 같이 쓴다.
 */
export function SearchSketch({ focus, query = "동네 이름 + 업종" }: { focus: SketchZone[]; query?: string }) {
  const on = (z: SketchZone) => (focus.includes(z) ? s.skOn : "");
  const no = (z: SketchZone) => SKETCH_ZONES.findIndex((x) => x.id === z) + 1;
  return (
    <figure className={s.sketch}>
      <div className={s.skPhone} aria-hidden="true">
        <div className={s.skSearch}><span>{query}</span><i /></div>
        <div className={`${s.skZone} ${on("ad")}`}>
          <b className={s.skNo}>{no("ad")}</b>
          <div className={s.skRow}><em>광고</em><span className={s.skBar} /></div>
          <div className={s.skRow}><em>광고</em><span className={`${s.skBar} ${s.skShort}`} /></div>
        </div>
        <div className={`${s.skZone} ${on("place")}`}>
          <b className={s.skNo}>{no("place")}</b>
          <div className={s.skMap}><i /><i /><i /></div>
          {[1, 2, 3].map((n) => (
            <div key={n} className={s.skRow}><strong>{n}</strong><span className={`${s.skBar} ${n === 2 ? s.skShort : ""}`} /><span className={s.skThumb} /></div>
          ))}
        </div>
        <div className={`${s.skZone} ${on("post")}`}>
          <b className={s.skNo}>{no("post")}</b>
          <div className={s.skCards}><span /><span /><span /></div>
        </div>
        <div className={`${s.skZone} ${on("site")}`}>
          <b className={s.skNo}>{no("site")}</b>
          <div className={s.skRow}><span className={s.skDot} /><span className={`${s.skBar} ${s.skShort}`} /></div>
        </div>
      </div>
      <div className={s.skSide}>
        <p className={s.skTitle}>손님이 네이버에서 가게를 찾을 때 보는 화면</p>
        <ol className={s.skLegend}>
          {SKETCH_ZONES.map((z, i) => (
            <li key={z.id} className={on(z.id)}>
              <b className={s.skNo}>{i + 1}</b>
              <div>
                <strong>{z.name}</strong>
                {focus.includes(z.id) && <mark>이 페이지에서 다루는 자리</mark>}
                <p>{z.desc}</p>
              </div>
            </li>
          ))}
        </ol>
        <figcaption>이해를 돕기 위한 그림입니다. 실제 네이버 화면이 아니며, 검색어와 업종에 따라 순서와 구성이 달라집니다.</figcaption>
      </div>
    </figure>
  );
}
