import fs from "fs";
import path from "path";

/**
 * 스마트스토어 상세페이지 제작 사례.
 *
 * 데이터는 content/detail-page-cases.json 에 손으로 적는다. 여기서는 읽기만 한다.
 * 자동 수집하는 /portfolio(네이버 블로그 수집)와는 별개 데이터다 — 섞지 말 것.
 *
 * 규칙 세 가지가 이 파일의 존재 이유다.
 * 1) consent 가 false 면 화면에 올리지 않는다. 클라이언트 상호 노출은 서면 동의를 받은 것만이다.
 * 2) result 는 실측이 없으면 빈 문자열로 둔다. 화면에서도 성과 영역 자체를 그리지 않는다.
 *    '—' 나 '측정 중' 을 대신 넣지 않는다 — 그건 숫자가 있는 것처럼 보이게 한다.
 * 3) 상세페이지는 하랑마케팅이 제작·공급한다. 화면에 파트너·외주 표기를 넣지 않는다
 *    (2026-08-27 (목) 대표 지시 — 제작 협의 종료).
 */

export interface DetailPageCase {
  /** URL·key 용 식별자 */
  slug: string;
  /** 사례 제목 */
  title: string;
  /** food-fresh | food-processed | beauty | living | apparel | pet | service | renewal */
  industry: string;
  /** 상호. 동의를 못 받았으면 "비공개" */
  client: string;
  /** 납품일 YYYY-MM-DD */
  date: string;
  /** 섹션 수 (표준 9단 기준) */
  sections: number;
  /** 어떤 문제로 왔나 */
  problem: string;
  /** 어떻게 풀었나 */
  approach: string;
  /** 성과. 실측이 없으면 빈 문자열 — 절대 지어내지 않는다 */
  result: string;
  /** AI 생성 컷을 썼나 */
  aiUsed: boolean;
  /** AI 컷을 썼다면 출발 원본 파일명을 포함해 적는다 (C-41) */
  aiNote: string;
  /** 대표 이미지 경로. 없으면 null */
  thumb: string | null;
  /** 상세 이미지 경로들 */
  images: string[];
  /** 노출 동의 여부. false 면 렌더하지 않는다 */
  consent: boolean;
}

export const INDUSTRY_LABEL: Record<string, string> = {
  "food-fresh": "신선식품",
  "food-processed": "가공식품",
  beauty: "뷰티",
  living: "리빙",
  apparel: "패션",
  pet: "반려동물",
  service: "서비스",
  renewal: "리뉴얼",
};

export function getDetailPageCases(): DetailPageCase[] {
  try {
    const file = path.join(process.cwd(), "content", "detail-page-cases.json");
    const data = JSON.parse(fs.readFileSync(file, "utf-8")) as DetailPageCase[];
    if (!Array.isArray(data)) return [];
    // 동의를 받지 못한 사례는 여기서 걸러진다. 화면 쪽에서 다시 거르지 않아도 되게 한다.
    return data.filter((c) => c && c.consent === true);
  } catch {
    // 파일이 없거나 깨져도 페이지는 서야 한다. 사례 층이 비어도 나머지 세 층으로 성립한다.
    return [];
  }
}
