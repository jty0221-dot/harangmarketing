import { getLatestVideos } from "../lib/youtube-rss";
import YouTubeCard from "./YouTubeCard";

const CHANNEL_ID = "UCGCBCIO5B-TALayNqmtAyUg";
const CHANNEL_URL = "https://www.youtube.com/@madaenam";
const SUBSCRIBE_URL = "https://www.youtube.com/@madaenam?sub_confirmation=1";

const YT_ICON = (
  <svg viewBox="0 0 24 24" className="fill-current">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

// 교육교재 커리큘럼 (순서 고정)
const CURRICULUM = [
  {
    step: "STEP 1",
    stepColor: "bg-blue-600",
    videoId: "1oiqvVTtF_w",
    title: "네이버 플레이스 등록부터 SEO 최적화 세팅까지, 이 영상 하나로 종결",
    desc: "플레이스 신규 등록 방법과 상위 노출을 위한 SEO 세팅 완전 정복. 대행사에 맡기기 전 이것만 알아도 됩니다.",
    duration: "11분 43초",
    badge: "플레이스 기초",
  },
  {
    step: "STEP 2",
    stepColor: "bg-blue-600",
    videoId: "owgcIulD8xk",
    title: "네이버 스마트 플레이스 예약·쿠폰·마케팅 메시지 완벽 활용 가이드",
    desc: "1페이지 노출됐는데 매출이 그대로인 이유 — 예약·쿠폰·메시지로 방문 전환율 높이는 실전 가이드.",
    duration: "7분 28초",
    badge: "플레이스 활용",
  },
  {
    step: "STEP 3",
    stepColor: "bg-blue-600",
    videoId: "LWjHEAujJr0",
    title: "2026년 네이버 정책 변경, 리뷰 하나 잘못 썼다가 가게 망한다",
    desc: "영수증 리뷰 100개보다 키워드 리뷰 10개가 강한 이유. 합법적인 리뷰 마케팅 전략 완전 공개.",
    duration: "5분 32초",
    badge: "리뷰 마케팅",
  },
  {
    step: "필독",
    stepColor: "bg-amber-500",
    videoId: "YA2mETS3y0w",
    title: "마케팅 대행사에 300만 원 입금 전, 제발 이 영상 보세요 (2026 최신 사기수법)",
    desc: "\"월 5만 원에 상위노출 보장\" 그 말 믿고 입금하는 순간 돈은 사라집니다. 사기꾼들의 3가지 수법 폭로.",
    duration: "11분 25초",
    badge: "주의 필독",
  },
];

export default async function YouTubeSection() {
  const latest = await getLatestVideos(CHANNEL_ID, 3);

  return (
    <>
      {/* ── 1. 최신 영상 ── */}
      <section className="py-14 md:py-20 bg-gray-950">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
          {/* 헤더 */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center text-white">
                  <span className="w-4 h-4">{YT_ICON}</span>
                </div>
                <span className="text-[11px] font-black text-red-500 uppercase tracking-[0.18em]">마대남 YouTube</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white leading-tight mb-1.5" style={{ letterSpacing: "-0.03em" }}>
                마케팅 노하우,<br className="md:hidden" /> 영상으로 무료 공개합니다
              </h2>
              <p className="text-gray-400 text-sm">최신 영상이 올라올 때마다 자동 업데이트 — 구독하면 놓치지 않아요</p>
            </div>
            <a
              href={SUBSCRIBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-sm transition-colors"
            >
              <span className="w-4 h-4">{YT_ICON}</span>
              채널 구독하기
            </a>
          </div>

          {/* 최신 영상 카드 3개 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {latest.map((v, i) => (
              <div key={v.videoId} className="relative">
                {i === 0 && (
                  <span className="absolute -top-2.5 left-3 z-10 bg-red-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full">
                    최신
                  </span>
                )}
                <YouTubeCard
                  videoId={v.videoId}
                  title={v.title}
                  desc={v.published ? `업로드 ${new Date(v.published).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}` : ""}
                />
              </div>
            ))}
          </div>

          <p className="text-center text-gray-600 text-xs mt-6">
            채널에 새 영상이 업로드되면 이 목록이 자동으로 바뀝니다 ·{" "}
            <a href={CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white underline transition-colors">
              채널 전체 보기
            </a>
          </p>
        </div>
      </section>

      {/* ── 2. 구독 유도 CTA 배너 ── */}
      <section className="relative overflow-hidden bg-red-600">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #fff 0%, transparent 60%), radial-gradient(circle at 80% 20%, #fff 0%, transparent 50%)" }} />
        <div className="relative max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-10 md:py-12 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <p className="text-red-100 text-xs font-bold uppercase tracking-widest mb-1.5">무료 마케팅 강의</p>
            <h3 className="text-xl md:text-2xl font-black text-white mb-1" style={{ letterSpacing: "-0.02em" }}>
              새 영상 올라올 때마다 알림 받아보세요
            </h3>
            <p className="text-red-100 text-sm">
              네이버 플레이스 · 블로그 · 리뷰 · SNS — 실전 노하우를 무료로 공개합니다
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a
              href={SUBSCRIBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white text-red-600 font-black text-sm hover:bg-red-50 transition-colors"
            >
              <span className="w-4 h-4 text-red-600">{YT_ICON}</span>
              구독하기
            </a>
            <a
              href={CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-white/30 text-white font-bold text-sm hover:border-white/60 transition-colors"
            >
              채널 방문
            </a>
          </div>
        </div>
      </section>

      {/* ── 3. 교육교재 커리큘럼 ── */}
      <section className="py-14 md:py-20" style={{ background: "var(--h-surface)" }}>
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
          {/* 헤더 */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-[2px]" style={{ background: "var(--h-amber)" }} />
              <span className="text-[11px] font-black uppercase tracking-[0.22em]" style={{ color: "var(--h-amber)" }}>마케팅 교과서</span>
              <div className="w-6 h-[2px]" style={{ background: "var(--h-amber)" }} />
            </div>
            <h2 className="text-2xl md:text-3xl font-black mb-2" style={{ color: "var(--h-dark)", letterSpacing: "-0.03em" }}>
              사장님이 꼭 봐야 할 영상 4편
            </h2>
            <p className="text-sm" style={{ color: "var(--h-muted)" }}>
              순서대로 보시면 네이버 플레이스 마케팅의 전체 그림이 잡힙니다
            </p>
          </div>

          {/* 커리큘럼 리스트 */}
          <div className="space-y-4">
            {CURRICULUM.map((item) => (
              <CurriculumCard key={item.videoId} {...item} />
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            <p className="text-sm mb-4" style={{ color: "var(--h-muted)" }}>
              영상이 도움됐다면 구독과 좋아요로 응원해주세요 — 더 좋은 콘텐츠를 만드는 힘이 됩니다
            </p>
            <a
              href={SUBSCRIBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-sm transition-colors"
            >
              <span className="w-4 h-4">{YT_ICON}</span>
              마대남 채널 구독하기
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function CurriculumCard({
  step, stepColor, videoId, title, desc, duration, badge,
}: {
  step: string; stepColor: string; videoId: string; title: string;
  desc: string; duration: string; badge: string;
}) {
  const thumb = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  return (
    <a
      href={`https://www.youtube.com/watch?v=${videoId}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex gap-4 md:gap-5 p-4 md:p-5 rounded-2xl bg-white border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all"
    >
      {/* Step badge */}
      <div className="shrink-0 flex flex-col items-center gap-2 pt-0.5">
        <span className={`${stepColor} text-white text-[10px] font-black px-2.5 py-1 rounded-lg whitespace-nowrap`}>
          {step}
        </span>
        <div className="w-px flex-1 bg-gray-100 min-h-[20px]" />
      </div>

      {/* Thumbnail */}
      <div className="shrink-0 w-28 md:w-36 rounded-xl overflow-hidden aspect-video bg-gray-100 relative">
        <img
          src={thumb}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={undefined}
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-red-600/90 flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white ml-0.5">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{badge}</span>
          <span className="text-[10px] text-gray-400">{duration}</span>
        </div>
        <h3 className="text-sm md:text-base font-black leading-snug mb-1.5 line-clamp-2" style={{ color: "var(--h-dark)" }}>
          {title}
        </h3>
        <p className="text-xs leading-relaxed line-clamp-2 hidden sm:block" style={{ color: "var(--h-muted)" }}>
          {desc}
        </p>
      </div>
    </a>
  );
}
