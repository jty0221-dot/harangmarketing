/**
 * 홈페이지 제작 포트폴리오 (시안 갤러리) 데이터.
 *
 * 정본은 루미의 홈페이지 공장(E:\하랑\홈페이지공장)이다. `python publish.py` 뒤
 * 포트폴리오_사이트용/ 의 json 과 썸네일(webp)을 여기로 옮긴다. 손으로 고치지 않는다.
 * - 썸네일 : public/homepage-portfolio/<slug>.webp (PC) · <slug>_m.webp (모바일)
 * - 시안 본체는 public/sian/<slug>/ (사진 재압축 · 같은 템플릿 자료는 git 이 한 번만 저장 · 고유 내용 약 84MB)
 * - 업체명은 전부 가상이다. 실제 고객 상호 · 사진은 들어가지 않는다
 */
import data from "../../content/homepage-portfolio.json";

export interface HomepageDraft {
  slug: string;
  name: string;
  industry: string;
  group: string;
  groupLabel: string;
  design: string;
  moods: string[];
  real: boolean;
}

export const HP_DRAFTS = data as HomepageDraft[];
export const HP_DEMO_BASE = "/sian";          // 시안은 하랑 사이트 안 public/sian/<slug>/ (홈페이지공장 harang_export.py 가 넣는다)
export const HP_DATA_DATE = "2026-10-04";

export const hpDemoUrl = (slug: string) => `${HP_DEMO_BASE}/${slug}/index.html`;
export const hpThumb = (slug: string, mobile = false) => `/homepage-portfolio/${slug}${mobile ? "_m" : ""}.webp`;

/** 업종군 (데이터에 나온 순서) */
export const HP_GROUPS: { key: string; label: string; count: number }[] = (() => {
  const m = new Map<string, { key: string; label: string; count: number }>();
  for (const d of HP_DRAFTS) {
    const g = m.get(d.group) ?? { key: d.group, label: d.groupLabel, count: 0 };
    g.count += 1;
    m.set(d.group, g);
  }
  return [...m.values()];
})();

/** 무드 (실사형 = 구조부터 다른 업체형 레이아웃) */
export const HP_MOODS = ["실사형", "전문", "다크", "몽환", "심플", "화려", "따뜻", "친근", "현장"];

export const HP_STATS = {
  drafts: HP_DRAFTS.length,
  industries: new Set(HP_DRAFTS.map((d) => d.industry)).size,
  designs: new Set(HP_DRAFTS.map((d) => d.design)).size,
};
