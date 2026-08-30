import Header from "../components/Header";

/**
 * 블로그 목록이 뜨기 전까지 보여주는 뼈대 화면.
 *
 * /blog 는 네이버 블로그 RSS 를 서버에서 기다린다(maxDuration 60초).
 * 이 파일이 없으면 그동안 화면이 통째로 비어 있어서 사장님 쪽에서는
 * 링크가 죽은 것처럼 보인다. 히어로 높이를 실제 페이지와 맞춰 두면
 * 목록이 들어올 때 화면이 튀지 않는다.
 */
export default function Loading() {
  return (
    <>
      <Header />
      <main className="pt-[104px] md:pt-[108px]">
        <section className="bg-gradient-to-br from-gray-950 via-blue-950 to-gray-950 py-14 md:py-20">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 animate-pulse">
            <div className="h-3 w-12 rounded bg-white/10 mb-4" />
            <div className="h-9 md:h-10 w-3/4 rounded-lg bg-white/10 mb-3" />
            <div className="h-9 md:h-10 w-1/2 rounded-lg bg-white/10 mb-5" />
            <div className="h-4 w-full max-w-xl rounded bg-white/5 mb-2" />
            <div className="h-4 w-2/3 max-w-md rounded bg-white/5 mb-7" />
            <div className="flex flex-wrap gap-3">
              <div className="h-10 w-52 rounded-xl bg-white/10" />
              <div className="h-10 w-44 rounded-xl bg-white/5" />
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 animate-pulse">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <div className="h-3 w-16 rounded bg-gray-100 mb-4" />
                <div className="h-5 w-full rounded bg-gray-100 mb-2" />
                <div className="h-5 w-4/5 rounded bg-gray-100 mb-4" />
                <div className="h-3 w-full rounded bg-gray-50 mb-1.5" />
                <div className="h-3 w-full rounded bg-gray-50 mb-1.5" />
                <div className="h-3 w-2/3 rounded bg-gray-50" />
              </div>
            ))}
          </div>
          <p className="mt-10 text-center text-xs text-gray-400">
            글 목록을 불러오는 중입니다
          </p>
        </section>
      </main>
    </>
  );
}
