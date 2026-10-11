import type { Metadata } from "next"
import { ArrowDownToLine, ArrowUpRight, BookOpen, FileText, Users, Building2 } from "lucide-react"
const SITE = { kakaoUrl: "https://pf.kakao.com/_cDxaKn/chat" }
import ShareLink from "./share-link"

export const metadata: Metadata = {
  title: "박새미 강의 소개 · 자료 다운로드",
  robots: { index: false, follow: false },
  description: "돈스탑 잉글리시 박새미의 중장년·어르신 영어 강의 소개와 기관·소규모 모임 제안 자료입니다.",
  alternates: { canonical: "/dontstop-lecture" },
  openGraph: { title: "박새미 강의 소개와 제안 자료", description: "기관용·친근한 소개용·소규모 모임용 자료를 PDF와 Word로 확인하세요.", url: "/dontstop-lecture", type: "website" },
}

const documents = [
  { key: "profile-institution", label: "강사 프로필", version: "기관 검토용", description: "담당자가 강사 소개와 수업 방향을 차분하게 살펴보는 자료입니다.", Icon: Building2 },
  { key: "profile-friendly", label: "강사 프로필", version: "친근한 소개용", description: "처음 만나는 분에게 수업 분위기와 참여 방식을 소개하는 자료입니다.", Icon: BookOpen },
  { key: "proposal-institution", label: "강의 제안서", version: "기관 단체용", description: "10명 이상 모임의 대상, 구성, 진행 방법을 검토하는 자료입니다.", Icon: FileText },
  { key: "proposal-small-group", label: "강의 제안서", version: "2~3인 모임용", description: "친구·부부·이웃과 함께하는 작은 모임을 위한 자료입니다.", Icon: Users },
]

export default function LecturesPage() {
  return <main className="min-h-screen bg-[var(--w-bg-alt)] text-[var(--w-label-strong)]">
    <header className="border-b border-[var(--w-line)] bg-[var(--w-bg-elevated)]"><div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5"><a href="/" className="font-bold tracking-tight">하랑마케팅</a><a href={SITE.kakaoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--w-label-neutral)]">강의 문의<ArrowUpRight size={16} aria-hidden /></a></div></header>
    <section className="mx-auto max-w-6xl px-5 pb-12 pt-12 md:pt-20">
      <p className="mb-5 text-sm font-bold tracking-wide text-[var(--w-primary)]">박새미 · 강의 자료실</p>
      <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight md:text-6xl">함께 말해보는 영어,<br />모임에 맞게 준비합니다.</h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--w-label-alt)]">부천의 중장년·어르신을 위한 영어 강의 제안입니다. 기관 단체부터 2~3인 모임까지, 검토 목적에 맞는 소개 자료를 골라보세요.</p>
      <div className="my-7 flex flex-wrap gap-2 text-sm font-medium">{["부천 출강 제안", "60·90·120분 구성", "생활·여행 영어 제안"].map(label => <span key={label} className="rounded-lg border border-[var(--w-line)] bg-[var(--w-bg-elevated)] px-3 py-2">{label}</span>)}</div>
      <ShareLink />
    </section>
    <section aria-labelledby="documents" className="mx-auto max-w-6xl px-5 pb-12">
      <div className="mb-6"><h2 id="documents" className="text-2xl font-bold">목적에 맞는 자료 선택</h2><p className="mt-2 text-[var(--w-label-alt)]">바로 읽을 때는 PDF, 문서를 편집할 때는 Word를 선택하세요.</p></div>
      <div className="grid gap-5 md:grid-cols-2">{documents.map(({key, label, version, description, Icon}) => <article key={key} className="rounded-2xl border border-[var(--w-line)] bg-[var(--w-bg-elevated)] p-6 shadow-sm md:p-8"><div className="flex items-start justify-between gap-3"><span className="text-sm font-semibold text-[var(--w-primary)]">{version}</span><Icon size={24} className="text-[var(--w-label-alt)]" aria-hidden /></div><h3 className="mt-3 text-2xl font-bold">{label}</h3><p className="mb-6 mt-3 min-h-12 leading-relaxed text-[var(--w-label-alt)]">{description}</p><div className="flex flex-wrap gap-2"><a href={`/dontstop-lecture/${key}.pdf`} target="_blank" rel="noopener noreferrer" aria-label={`${version} ${label} PDF 보기`} className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[var(--w-primary)] px-5 py-3 font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--w-primary)]">PDF 보기</a><a href={`/dontstop-lecture/download/${key}.pdf`} className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-[var(--w-line-strong)] px-4 py-3 font-semibold"><ArrowDownToLine size={17} aria-hidden />PDF 저장</a><a href={`/dontstop-lecture/download/${key}.docx`} className="inline-flex min-h-12 items-center rounded-xl px-3 py-3 font-semibold text-[var(--w-primary)] underline underline-offset-4">Word 저장</a></div></article>)}</div>
    </section>
    <section className="mx-auto max-w-6xl px-5 pb-16"><div className="flex flex-col justify-between gap-6 rounded-2xl bg-[var(--w-primary)] p-7 text-white md:flex-row md:items-center md:p-9"><div><h2 className="text-2xl font-bold">전체 자료 한 번에 받기</h2><p className="mt-2 text-white">네 가지 버전의 PDF와 편집용 Word를 함께 담았습니다.</p></div><a href="/dontstop-lecture/download/lecture-kit.zip" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--w-bg-elevated)] px-5 py-3 font-bold text-[var(--w-label-strong)]"><ArrowDownToLine size={18} aria-hidden />전체 ZIP 저장</a></div>
      <div className="mt-8 grid gap-7 text-sm leading-relaxed text-[var(--w-label-alt)] md:grid-cols-2"><div><h2 className="mb-2 font-bold text-[var(--w-label-strong)]">카카오톡에서 파일이 열리지 않을 때</h2><p>카카오톡 화면의 메뉴에서 다른 브라우저로 열기를 선택한 뒤 다시 저장해 주세요. PDF 보기는 새 화면에서 열리고, 파일 저장은 기기와 브라우저에 따라 방식이 다를 수 있습니다.</p></div><div><h2 className="mb-2 font-bold text-[var(--w-label-strong)]">강의는 함께 조율합니다</h2><p>주제와 시간 구성은 제안안입니다. 대상·인원·장소·일정·강사료는 상담 후 확정합니다. 참가자 수준과 기관의 운영 조건에 맞춰 구성합니다.</p><a href={SITE.kakaoUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 font-semibold text-[var(--w-primary)] underline underline-offset-4">돈스탑 잉글리시 공식 채널 문의<ArrowUpRight size={15} aria-hidden /></a></div></div>
    </section>
    <footer className="border-t border-[var(--w-line)] bg-[var(--w-bg-elevated)] px-5 py-6 text-center text-sm text-[var(--w-label-alt)]">돈스탑 잉글리시 · 박새미 강의 소개</footer>
  </main>
}

