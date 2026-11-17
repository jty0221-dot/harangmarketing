import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink, Images } from "lucide-react";
import { HL_WORKS } from "../lib/highlight-reference";

/* 인스타그램 하이라이트 세팅 사례 · 2026-10-22 (목) 지은 인계 · 대표 지시
   이미지와 칸 이름은 HL_WORKS(app/lib/highlight-reference.ts) 한 곳에서 온다.
   칸별 설명은 실제 올라간 12장에 적힌 내용만 옮겼다. 성과 숫자는 계측한 것이 없어 적지 않는다. */

const CASE_SLUG = "clean1";

const GROUPS: { name: string; from: number; count: number; note: string }[] = [
  {
    name: "서비스",
    from: 0,
    count: 3,
    note: "설치기사 출신 팀이 청소한다는 점을 첫 장에 세우고, 세탁실과 냉장고 청소 범위를 한 장씩 보여 줍니다.",
  },
  {
    name: "사례",
    from: 3,
    count: 3,
    note: "배수구 주변, 냉장고가 놓였던 자리, 세탁기 뒤쪽까지 실제 작업 전후 사진만 썼습니다.",
  },
  {
    name: "예약",
    from: 6,
    count: 2,
    note: "네이버 예약 네 단계와 방문 전에 준비할 것 다섯 가지를 정리했습니다.",
  },
  {
    name: "거주/입주청소",
    from: 8,
    count: 2,
    note: "견적 신청부터 작업 완료까지의 순서와, 추가 비용이 생길 수 있는 경우를 미리 알려 둡니다.",
  },
  {
    name: "문의",
    from: 10,
    count: 2,
    note: "사진을 먼저 보내 달라는 상담 방법과 방문 가능 지역 안내를 담았습니다. 지도의 지역 이름은 가렸습니다.",
  },
];

export default function HighlightCase() {
  const work = HL_WORKS.find((w) => w.slug === CASE_SLUG);
  if (!work || !work.band) return null;
  const band = work.band;

  return (
    <section className="mt-16">
      <div className="mb-6">
        <span className="w-chip w-chip-blue">
          <Images size={12} strokeWidth={2.5} />
          INSTAGRAM HIGHLIGHT
        </span>
        <h2 className="w-heading-2 mt-3" style={{ color: "var(--w-label-strong)" }}>
          인스타그램 하이라이트 세팅 사례
        </h2>
        <p className="w-body-2 mt-3 max-w-[680px]" style={{ color: "var(--w-label-alt)" }}>
          프로필에 들어온 손님이 하이라이트를 왼쪽부터 눌러 보며 서비스, 작업 사진, 예약 방법, 문의 경로를
          차례로 확인하도록 칸을 짰습니다. 실제 계정에 걸린 화면이고, 업체 이름 · 계정 · 연락처 · 링크 · 로고는
          가렸습니다.
        </p>
      </div>

      <div className="w-card p-4 md:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="w-title-3" style={{ color: "var(--w-label-strong)" }}>
            {work.title}
          </h3>
          <span
            className="inline-flex items-center rounded-lg px-2 py-1 text-[11px] font-medium"
            style={{ background: "var(--w-bg-alt)", color: "var(--w-label-alt)" }}
          >
            {work.industry}
          </span>
          <span
            className="inline-flex items-center rounded-lg px-2 py-1 text-[11px] font-bold tabular-nums"
            style={{ background: "var(--w-bg-alt)", color: "var(--w-primary)" }}
          >
            하이라이트 {GROUPS.length}칸 · 스토리 {work.stories.length}장
          </span>
        </div>

        <div
          className="mt-4 overflow-hidden rounded-xl"
          style={{ border: "1px solid var(--w-line)", maxWidth: band.w }}
        >
          <Image
            src={`/highlight-ref/band/${band.file}`}
            alt={`${work.title} 프로필에 걸린 하이라이트 ${GROUPS.length}칸`}
            width={band.w}
            height={band.h}
            sizes="(max-width: 640px) 92vw, 540px"
            className="h-auto w-full"
          />
        </div>

        <ol className="mt-6 space-y-5">
          {GROUPS.map((g, i) => (
            <li
              key={g.name}
              className="grid min-w-0 grid-cols-1 gap-3 md:grid-cols-[220px_1fr] md:gap-5"
            >
              <div className="min-w-0">
                <p className="w-label-1" style={{ color: "var(--w-label-strong)", fontWeight: 700 }}>
                  <span className="tabular-nums" style={{ color: "var(--w-primary)" }}>
                    {i + 1}
                  </span>
                  <span className="ml-2">{g.name}</span>
                  <span className="w-caption-1 ml-2 tabular-nums" style={{ color: "var(--w-label-assistive)" }}>
                    {g.count}장
                  </span>
                </p>
                <p className="w-caption-1 mt-1.5" style={{ color: "var(--w-label-alt)" }}>
                  {g.note}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {work.stories.slice(g.from, g.from + g.count).map((sh, k) => (
                  <a
                    key={sh.file}
                    href={`/highlight-ref/${sh.file}`}
                    target="_blank"
                    rel="noopener"
                    className="relative block aspect-[9/16] h-40 overflow-hidden rounded-lg shadow-sm sm:h-48"
                    style={{ background: "var(--w-bg-alt)" }}
                    aria-label={`${g.name} 스토리 ${k + 1}번째 장 크게 보기`}
                  >
                    <Image
                      src={`/highlight-ref/${sh.file}`}
                      alt={`${work.title} 하이라이트 ${g.name} 칸 스토리 ${k + 1}`}
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                  </a>
                ))}
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
          <a
            href="/highlight-ref/board/clean1-board.webp"
            target="_blank"
            rel="noopener"
            className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold md:min-h-0"
            style={{ color: "var(--w-primary)" }}
          >
            한 장으로 모아 보기
            <ExternalLink size={14} />
          </a>
          <Link
            href={`/services/instagram#hl-${work.slug}`}
            className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold md:min-h-0"
            style={{ color: "var(--w-primary)" }}
          >
            하이라이트 세팅 서비스 보기
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
