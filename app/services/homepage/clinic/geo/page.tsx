import type { Metadata } from "next";
import { BarChart3 } from "lucide-react";
import KeywordServicePage from "../../../../components/KeywordServicePage";
import JsonLd from "../../../../components/JsonLd";
import sitemap from "../../../../sitemap";
import { SITE, ogImage, CORE_FAQ, DEFINITIONS, definitionsLd } from "../../../../lib/seo";
import { CLINIC_GEO, CLINIC_GEO_PATH, CLINIC_GEO_TITLE, CLINIC_GEO_DESC, CLINIC_GEO_KEYWORDS } from "../../../../lib/clinic-homepage";

const URL = `${SITE.base}${CLINIC_GEO_PATH}`;

export const metadata: Metadata = {
  title: { absolute: `${CLINIC_GEO_TITLE} | 하랑마케팅` },
  description: CLINIC_GEO_DESC,
  keywords: CLINIC_GEO_KEYWORDS,
  alternates: { canonical: URL },
  openGraph: { type: "website", title: CLINIC_GEO_TITLE, description: CLINIC_GEO_DESC, url: URL, images: [ogImage(CLINIC_GEO_TITLE)] },
};

/** 하랑 사례 절 (세팅안 나-3) · 숫자는 빌드 때 사이트 코드에서 센다. 다른 병원 수치는 넣지 않는다 */
function HarangSelfCheck() {
  const cells = [
    { label: "사이트맵에 올린 주소", value: `${sitemap().length}개` },
    { label: "질문과 답으로 정리한 문답", value: `${CORE_FAQ.length}개` },
    { label: "용어 정의", value: `${DEFINITIONS.length}개` },
    { label: "AI 참고용 안내 파일", value: "llms.txt 공개" },
  ];
  return (
    <section className="py-14 md:py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-[var(--w-primary)] shadow-sm flex items-center justify-center shrink-0">
            <BarChart3 size={16} className="text-white" strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900">하랑 홈페이지에 같은 점검을 해 보면</h2>
        </div>
        <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-6">
          하랑마케팅 홈페이지도 같은 기준으로 만들었습니다. 아래 숫자는 이 화면을 만든 날 사이트 코드에서 센 값입니다.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {cells.map((c) => (
            <div key={c.label} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-xs md:text-[13px] text-gray-500">{c.label}</p>
              <p className="mt-1 text-lg md:text-xl font-black text-gray-900">{c.value}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-gray-500">기준일 {new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Seoul" }).format(new Date())}</p>
      </div>
    </section>
  );
}

export default function Page() {
  return (
    <KeywordServicePage d={CLINIC_GEO}>
      <JsonLd data={definitionsLd(CLINIC_GEO_PATH)} />
      <HarangSelfCheck />
    </KeywordServicePage>
  );
}
