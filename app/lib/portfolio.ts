import fs from "fs";
import path from "path";

/**
 * 업종별 마케팅 사례 — 네이버 블로그 포트폴리오에서 자동 수집한 데이터.
 *
 * 데이터는 scripts/portfolio/collect.py 가 만든다. 블로그에 새 사례를 올린 뒤
 * 다시 실행하면 content/portfolio.json 과 public/portfolio/*.jpg 가 갱신된다.
 * 여기서는 읽기만 하고, 홈페이지 표시 문구는 아래 CASE_OVERRIDES 로 덮는다.
 */

export interface PortfolioCase {
  logNo: string;
  title: string;
  date: string;
  url: string;
  image: string | null;
  excerpt: string;
}

export interface PortfolioIndustry {
  slug: string;
  name: string;
  categoryNo: number;
  count: number;
  cases: PortfolioCase[];
}

export interface PortfolioData {
  generatedAt: string;
  total: number;
  industries: PortfolioIndustry[];
}

const EMPTY: PortfolioData = { generatedAt: "", total: 0, industries: [] };

interface PortfolioOverride {
  title?: string;
  excerpt?: string;
  hidden?: boolean;
}

/*
 * 홈페이지에 보이는 제목 · 요약만 여기서 고친다 (2026-09-25 (금) 대표 결재).
 *
 * content/portfolio.json 은 collect.py 가 블로그를 다시 긁을 때마다 통째로 새로 쓴다. 그 파일을 손으로
 * 고치면 다음 수집에서 원래 제목으로 되돌아가므로, 고친 문구는 수집 결과 위에 여기서 덮는다.
 * 네이버에 올라가 있는 원글은 건드리지 않는다 (이미 발행된 글은 소급하지 않는다 · 1-B).
 * 병원 글은 1위 · 탈환 · 신환 · 예약 같은 결과 표현을 뺐다 (D-0177 · C-50). hidden 은 목록에서 뺀다.
 * 키는 네이버 블로그 글 번호(logNo)다. 블로그에서 글이 지워져 키가 남아도 아무 일도 일어나지 않는다.
 */
const CASE_OVERRIDES: Record<string, PortfolioOverride> = {
  // 음식점
  "223914025275": {
    title: "음식점 마케팅, 플레이스 순위가 떨어졌던 태국 음식점이 바꾼 것들",
    excerpt:
      "내용 : 네이버 플레이스 순위 하락으로 고민하던 태국 음식점, 마케팅에 대한 회의감이 컸던 상황에서 진단부터 다시 시작한 과정을 정리했습니다.",
  },
  "223590618648": {
    title: "네이버 플레이스 예약 시스템을 활용한 음식점 사례",
    excerpt: "네이버 플레이스 예약 기능을 어떻게 세팅하고 운영했는지 음식점 사례로 정리했습니다.",
  },
  // 미용
  "224074263499": { title: "소상공인 디지털 전환 지원 사업, 미용실 마케팅에서 먼저 바꾼 것들" },
  // 청소
  "224130938774": { title: "청소업체 마케팅, 블로그 글쓰기에 지치셨나요? 무엇부터 바꿨는지 정리한 사례" },
  "223854603928": {
    title: "청소업체 마케팅, 플레이스 순위가 떨어졌던 입주청소 업체가 바꾼 것들",
    excerpt:
      "내용 : 네이버 플레이스 순위 하락으로 고민이 많으셨던 입주청소 업체 대표님, 마케팅에 대한 의심이 컸던 상황에서 무엇부터 바꿨는지 정리했습니다.",
  },
  // 병원
  "224222915254": { title: "병원 마케팅 대행사 제대로 고르는 법, 치과 플레이스 순위 하락 뒤 점검 순서" },
  "224213226208": { title: "치과마케팅, 갑자기 떨어진 플레이스 순위 원인부터 찾는 법" },
  "224130682267": { hidden: true },
  "224127233278": { title: "치과 마케팅, 상위 노출만으로 부족한 이유" },
  "224127096382": { title: "치과 플레이스 마케팅, 광고비 경쟁 속에서 로직부터 파악한 과정" },
  "224097354924": { title: "피부과 마케팅, 광고비를 늘리지 않고 플레이스를 다시 정리한 과정" },
  "223987312836": { title: "한의원 마케팅, 광고만으로 부족한 이유와 진료 정보 글 운영법" },
  "223925385165": { excerpt: "네이버 플레이스 문의로 시작한 치과, 실명 블로그 운영과 업체별 컨설팅 과정" },
  "223855381173": {
    title: "병원 마케팅 성공사례, 네이버 플레이스와 블로그를 함께 정리한 00지역 치과 이야기",
    excerpt: "네이버 플레이스와 블로그를 함께 정리하고 싶었던 치과",
  },
  // 인테리어
  "224099776791": { title: "인테리어 업체 마케팅, 시공 기간이 길어 보여줄 게 없던 업체가 바꾼 것들" },
};

function applyOverrides(data: PortfolioData): PortfolioData {
  const industries = data.industries
    .map((industry) => {
      const cases = industry.cases
        .filter((c) => !CASE_OVERRIDES[c.logNo]?.hidden)
        .map((c) => {
          const o = CASE_OVERRIDES[c.logNo];
          if (!o) return c;
          return { ...c, title: o.title ?? c.title, excerpt: o.excerpt ?? c.excerpt };
        });
      // 숨긴 글이 빠진 만큼 업종 건수도 다시 센다 (collect.py 와 같은 기준 · 건수 = 사례 수)
      return { ...industry, cases, count: cases.length };
    })
    // 사례가 하나도 없는 업종은 화면에 띄우지 않는다
    .filter((i) => i.cases.length > 0)
    // collect.py 처럼 건수 많은 업종부터 (같은 건수는 원래 순서 그대로)
    .sort((a, b) => b.count - a.count);
  return { ...data, industries, total: industries.reduce((sum, i) => sum + i.count, 0) };
}

export function getPortfolio(): PortfolioData {
  try {
    const file = path.join(process.cwd(), "content", "portfolio.json");
    const data = JSON.parse(fs.readFileSync(file, "utf-8")) as PortfolioData;
    return applyOverrides(data);
  } catch {
    return EMPTY;
  }
}

/** 최신 사례 N건 — 메인·서비스 페이지에서 미리보기로 쓴다 */
export function getRecentCases(limit = 6): (PortfolioCase & { industry: string })[] {
  const { industries } = getPortfolio();
  return industries
    .flatMap((i) => i.cases.map((c) => ({ ...c, industry: i.name })))
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
}
