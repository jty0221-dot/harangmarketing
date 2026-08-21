import fs from "fs";
import path from "path";

/**
 * 업종별 마케팅 사례 — 네이버 블로그 포트폴리오에서 자동 수집한 데이터.
 *
 * 데이터는 scripts/portfolio/collect.py 가 만든다. 블로그에 새 사례를 올린 뒤
 * 다시 실행하면 content/portfolio.json 과 public/portfolio/*.jpg 가 갱신된다.
 * 여기서는 읽기만 한다.
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

export function getPortfolio(): PortfolioData {
  try {
    const file = path.join(process.cwd(), "content", "portfolio.json");
    const data = JSON.parse(fs.readFileSync(file, "utf-8")) as PortfolioData;
    // 사례가 하나도 없는 업종은 화면에 띄우지 않는다
    return { ...data, industries: data.industries.filter((i) => i.cases.length > 0) };
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
