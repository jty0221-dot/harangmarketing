/**
 * 인플루언서 배포 (카페 배포의 관련 상품) · 문구 · 레퍼런스 데이터
 *
 * 2026-11-19 (목) 대표 지시 「카페 배포 거기에 인플루언서 배포도 관련 상품으로 넣고 레퍼런스도 보이게」,
 * 「홍보 포스터도 우리식으로도 바꿔서 넣고」.
 *
 * 문구 기준 (search-care-offer.ts 와 같다)
 *   · 10/13 네이버 광고 제한 뒤라 「상위노출 · 노출 보장 · 압도적 노출 · 선점」 은 쓰지 않는다.
 *     무엇을 하고 어디에 올라가는지만 적고, 어디에 얼마나 오래 보이는지는 네이버가 정한다고 밝힌다.
 *   · 금액은 확정된 것이 없다. 숫자를 적지 않고 견적 문의로 둔다. 금액을 넣는 것은 C-35 결재다.
 *   · 원본 홍보물의 「인플루언서 20인 이상 추가 확보」 는 공급 쪽 숫자라 적지 않는다. 대표 확인 뒤에만 넣는다.
 *
 * 레퍼런스는 scripts/cafe-ref (--board allinone) 가 influencer-ref.json 과 public/influencer-ref 를 같이 고친다.
 * 캡처에서 판독한 키워드이므로 손으로 고치지 않는다.
 */
import refs from "./influencer-ref.json";
import { REF_CATEGORIES, type RefCategory } from "./cafe-distribution";
import { todayKst } from "./search-care-offer";

export const INFLUENCER_CTA_HREF = "/contact?service=influencer-distribution";
export const INFLUENCER_REF_HREF = "/services/cafe-distribution/reference?type=influencer";

/** 이 팝업을 띄우는 경로. 통합검색 월 관리 안내(search-care-offer.ts)와 같은 두 곳이다 */
export const INFLUENCER_PATHS = ["/services/blog-marketing", "/services/cafe-distribution"];

export const INFLUENCER_OFFER = {
  /** 이 값을 바꾸면 하루 그만 보기를 누른 사람에게도 다시 뜬다 */
  id: "influencer-2026-11-19",
  eyebrow: "관련 상품 · 인플루언서 배포",
  title: "통합검색에는 인플루언서 글이 모이는 자리가 있습니다",
  lead: "업종과 키워드에 맞는 네이버 인플루언서 계정에 글을 올립니다.",
  points: [
    {
      title: "인플루언서 글이 따로 모이는 자리",
      desc: "네이버 통합검색에는 인플루언서가 쓴 글을 따로 묶어 보여주는 자리가 있습니다. 그 자리의 대상이 되는 계정에 글을 올립니다.",
    },
    {
      title: "쌓인 글과 구독자가 있는 계정",
      desc: "한 주제로 글을 쌓아 온 계정이라 새로 만든 계정의 글과는 출발점이 다릅니다. 글이 어디에 얼마나 오래 보이는지는 네이버가 정합니다.",
    },
    {
      title: "홈페이지 · 예약 · 스토어 링크",
      desc: "글 안에 홈페이지, 예약 페이지, 스토어 링크를 넣을 수 있습니다. 읽은 분이 바로 넘어올 길을 함께 둡니다.",
    },
  ],
  roster: "함께하는 인플루언서를 계속 늘리고 있습니다. 업종과 키워드에 맞는 계정으로 먼저 배정합니다.",
  price: "견적 문의",
  priceNote: "업종과 키워드를 받은 뒤 진행 가능 여부와 금액을 안내합니다",
  footnote: "글이 어디에 얼마나 오래 보이는지는 네이버가 정합니다. 몇 위에 오른다고 약속드리지 않습니다.",
  cta: "인플루언서 배포 견적 문의",
  refCta: "인플루언서 레퍼런스 보기",
  later: "오늘은 그만 보기",
} as const;

/** 최블 · 카페 글과 무엇이 다른가. 세 가지를 같은 틀로 나란히 놓는다 */
export const INFLUENCER_COMPARE = [
  { name: "최적화 블로그", where: "글이 쌓인 블로그 계정", desc: "통합검색 블로그 영역이 대상입니다. 건수 패키지로 진행합니다." },
  { name: "카페", where: "지역맘 카페 · 대형 카페", desc: "통합검색 카페 영역이 대상입니다. 건수 패키지와 단건으로 진행합니다." },
  { name: "인플루언서", where: "네이버 인플루언서 계정", desc: "인플루언서 글이 모이는 자리가 대상입니다. 업종과 키워드를 보고 계정을 배정합니다.", current: true },
] as const;

/** 이런 대표님께 맞습니다 */
export const INFLUENCER_FIT = [
  "블로그와 카페 글은 이미 쌓았고, 통합검색에서 보이는 자리를 하나 더 두고 싶은 대표님",
  "글에서 예약 페이지나 스토어로 바로 이어지는 링크가 필요한 대표님",
  "업종에 맞는 채널에서 소개되기를 바라는 대표님",
];

/** 화면 FAQ 와 FAQPage 구조화 데이터가 같이 읽는다. 금액은 적지 않는다 */
export const INFLUENCER_FAQ = {
  q: "인플루언서 배포는 무엇인가요?",
  a: "업종과 키워드에 맞는 네이버 인플루언서 계정에 글을 올리는 상품입니다. 네이버 통합검색에는 인플루언서 글이 따로 모이는 자리가 있고, 그 자리의 대상이 되는 계정에 글을 올립니다. 블로그 원고 · 카페 게시 대행과 함께 진행할 수 있습니다. 금액은 업종과 키워드를 받은 뒤 안내합니다. 글이 어디에 얼마나 오래 보이는지는 네이버가 정하므로 순위를 약속하지는 않습니다.",
};

export const INFLUENCER_STORAGE_KEY = `harang_offer_${INFLUENCER_OFFER.id}`;

export function influencerShowsOn(pathname: string): boolean {
  return INFLUENCER_PATHS.some((p) => pathname.startsWith(p));
}

export { todayKst };

/* ── 레퍼런스 ─────────────────────────────────────────────── */

export interface InfluencerRef {
  image: string;
  keyword: string;
  /** cafe-distribution.ts 의 업종 slug 를 같이 쓴다 */
  category: string;
  /** 캡처한 날 (YYYY-MM-DD) */
  date: string;
  w: number;
  h: number;
}

/** 숨길 캡처 파일 이름 (확장자 없이). 지우지 않고 여기서 거른다 (cafe-distribution.ts 의 REF_HIDE_GROUPS 와 같은 방식) */
const INFLUENCER_HIDDEN = new Set<string>([]);

/** 최신 날짜가 앞에 온다 (apply.py 가 정렬해 둔다) */
export const INFLUENCER_REFS: InfluencerRef[] = refs
  .filter((r) => !INFLUENCER_HIDDEN.has(r.file.replace(/\.png$/, "")))
  .map((r) => ({ image: `/influencer-ref/${r.file}`, keyword: r.keyword, category: r.category, date: r.date, w: r.w, h: r.h }));

export const INFLUENCER_REF_TOTAL = INFLUENCER_REFS.length;

/** 캡처가 있는 업종만, 카페 레퍼런스와 같은 순서 · 같은 이름으로 */
export const INFLUENCER_REF_CATEGORIES: (Pick<RefCategory, "slug" | "label" | "short"> & { count: number })[] =
  REF_CATEGORIES.map((c) => ({
    slug: c.slug,
    label: c.label,
    short: c.short,
    count: INFLUENCER_REFS.filter((r) => r.category === c.slug).length,
  })).filter((c) => c.count > 0);

/** 가장 최근 캡처 날짜 · "2026-11-17" → "11/17" */
export function shortDate(d: string): string {
  const [, m, day] = d.split("-");
  return m && day ? `${Number(m)}/${Number(day)}` : "";
}
export const INFLUENCER_REF_LATEST = INFLUENCER_REFS[0]?.date ?? "";
