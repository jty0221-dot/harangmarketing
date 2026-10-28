import type { Metadata } from "next";
import Link from "next/link";
import KeywordServicePage from "../../../components/KeywordServicePage";
import ClinicDrafts from "../../../components/ClinicDrafts";
import { SITE, ogImage } from "../../../lib/seo";
import { CLINIC_SUBJECTS, CLINIC_HUB_PATH, type ClinicSubjectKey } from "../../../lib/clinic-homepage";

/** 과목 쪽 넷이 같이 쓰는 틀 (세팅안 나-4). 페이지 파일이 아니라 라우트가 생기지 않는다 */
export function subjectMetadata(k: ClinicSubjectKey): Metadata {
  const s = CLINIC_SUBJECTS[k];
  const url = `${SITE.base}${s.data.path}`;
  return {
    title: { absolute: `${s.title} | 하랑마케팅` },
    description: s.desc,
    keywords: s.keywords,
    alternates: { canonical: url },
    openGraph: { type: "website", title: s.title, description: s.desc, url, images: [ogImage(s.title)] },
  };
}

export function SubjectPage({ k }: { k: ClinicSubjectKey }) {
  const s = CLINIC_SUBJECTS[k];
  return (
    <KeywordServicePage d={s.data}>
      <ClinicDrafts title={`${s.name} 시안`} prefixes={s.prefixes} />
      <section className="pb-14 md:pb-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
          <Link href={`${CLINIC_HUB_PATH}#faq`} className="block rounded-2xl border border-gray-200 bg-gray-50 p-4 md:p-6 text-sm text-gray-700 leading-relaxed hover:border-[var(--w-primary)] transition-colors">
            비용 · 기간 · 효과 측정 · 오픈 뒤 관리는 병원 홈페이지 제작 쪽 문답에 모아 두었습니다.
          </Link>
        </div>
      </section>
    </KeywordServicePage>
  );
}
