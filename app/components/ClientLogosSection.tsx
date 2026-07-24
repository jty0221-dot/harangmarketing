"use client";

// 실제 로고 파일 준비 전 텍스트 기반 로고 플레이스홀더 슬라이더
// 사장님이 실제 로고 이미지를 제공하면 Image 태그로 교체

const LOGOS = [
  { name: "고양 A카페", color: "border border-gray-200 bg-white text-gray-700" },
  { name: "마포 B음식점", color: "border border-gray-200 bg-white text-gray-700" },
  { name: "강서 C피부과", color: "border border-gray-200 bg-white text-gray-700" },
  { name: "수원 D네일", color: "border border-gray-200 bg-white text-gray-700" },
  { name: "안양 E한의원", color: "border border-gray-200 bg-white text-gray-700" },
  { name: "고양 F학원", color: "border border-gray-200 bg-white text-gray-700" },
  { name: "분당 G카페", color: "border border-gray-200 bg-white text-gray-700" },
  { name: "홍대 H술집", color: "border border-gray-200 bg-white text-gray-700" },
  { name: "강남 I클리닉", color: "border border-gray-200 bg-white text-gray-700" },
  { name: "서울 J쇼핑몰", color: "border border-gray-200 bg-white text-gray-700" },
  { name: "파주 K카페", color: "border border-gray-200 bg-white text-gray-700" },
  { name: "부천 L베이커리", color: "border border-gray-200 bg-white text-gray-700" },
  { name: "인천 M음식점", color: "border border-gray-200 bg-white text-gray-700" },
  { name: "수원 N미용실", color: "border border-gray-200 bg-white text-gray-700" },
  { name: "성남 O병원", color: "border border-gray-200 bg-white text-gray-700" },
  { name: "고양 P치과", color: "border border-gray-200 bg-white text-gray-700" },
];

// Duplicate for seamless loop
const ALL = [...LOGOS, ...LOGOS, ...LOGOS];

export default function ClientLogosSection() {
  return (
    <section className="py-10 md:py-14 overflow-hidden" style={{ background: "var(--h-bg)", borderTop: "1px solid var(--h-border)", borderBottom: "1px solid var(--h-border)" }}>
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 mb-6">
        <div className="flex items-center gap-4">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest shrink-0">함께한 매장</p>
          <div className="h-px flex-1 bg-gray-200" />
          <p className="text-xs text-gray-400 shrink-0">500+ 클라이언트</p>
        </div>
      </div>

      <div className="relative">
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, var(--h-bg), transparent)" }} />
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, var(--h-bg), transparent)" }} />

        {/* Row 1 - scroll right */}
        <div className="flex gap-3 mb-3 animate-logo-scroll-r" style={{ width: "max-content" }}>
          {ALL.slice(0, ALL.length / 1.5 | 0).map((logo, i) => (
            <div
              key={i}
              className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap ${logo.color}`}
            >
              {logo.name}
            </div>
          ))}
        </div>

        {/* Row 2 - scroll left */}
        <div className="flex gap-3 animate-logo-scroll-l" style={{ width: "max-content" }}>
          {[...ALL].reverse().slice(0, ALL.length / 1.5 | 0).map((logo, i) => (
            <div
              key={i}
              className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap ${logo.color}`}
            >
              {logo.name}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes logo-scroll-r {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.33%); }
        }
        @keyframes logo-scroll-l {
          from { transform: translateX(-33.33%); }
          to   { transform: translateX(0); }
        }
        .animate-logo-scroll-r {
          animation: logo-scroll-r 30s linear infinite;
        }
        .animate-logo-scroll-l {
          animation: logo-scroll-l 30s linear infinite;
        }
        .animate-logo-scroll-r:hover,
        .animate-logo-scroll-l:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
