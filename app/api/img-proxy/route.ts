import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

/** 되돌려줄 수 있는 이미지 타입 (svg 제외 — 스크립트를 품을 수 있다) */
const IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/avif",
  "image/bmp",
];
const MAX_BYTES = 12 * 1024 * 1024;

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get("url");
  if (!raw) return new NextResponse("missing url", { status: 400 });

  let url: string;
  try {
    url = decodeURIComponent(raw);
    new URL(url); // validate
  } catch {
    return new NextResponse("invalid url", { status: 400 });
  }

  // Only allow known Naver CDN domains
  const allowed = [
    "postfiles.pstatic.net",
    "blogfiles.pstatic.net",
    "mblogthumb-phinf.pstatic.net",
    "blogpfthumb-phinf.pstatic.net",
    "phinf.pstatic.net",
  ];
  const host = new URL(url).hostname;
  if (!allowed.some((d) => host.endsWith(d))) {
    return new NextResponse("domain not allowed", { status: 403 });
  }

  try {
    const res = await fetch(url, {
      headers: {
        Referer: "https://blog.naver.com/",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
      },
    });

    if (!res.ok) return new NextResponse("upstream error", { status: 502 });

    // fetch 는 리다이렉트를 따라간다. 업스트림이 허용 밖 주소(사내망·클라우드
    // 메타데이터)로 끌고 갈 수 있으므로 최종 착지 호스트를 다시 검사한다.
    const finalHost = new URL(res.url).hostname;
    if (!allowed.some((d) => finalHost.endsWith(d))) {
      return new NextResponse("redirected off allowlist", { status: 403 });
    }

    // 업스트림 Content-Type 을 그대로 되돌려주면 안 된다.
    // 허용 호스트(blogfiles·postfiles)는 사용자가 올린 블로그 첨부를 서빙하므로
    // text/html 이 내려오면 그 HTML 이 우리 도메인에서 실행된다(저장형 XSS).
    // svg+xml 도 스크립트를 품을 수 있어 제외한다.
    const upstreamType = (res.headers.get("content-type") ?? "")
      .split(";")[0]
      .trim()
      .toLowerCase();
    if (!IMAGE_TYPES.includes(upstreamType)) {
      return new NextResponse("not an image", { status: 415 });
    }

    const declared = Number(res.headers.get("content-length") ?? 0);
    if (declared > MAX_BYTES) return new NextResponse("too large", { status: 413 });

    const buffer = await res.arrayBuffer();
    if (buffer.byteLength > MAX_BYTES) return new NextResponse("too large", { status: 413 });

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": upstreamType,
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "default-src 'none'; sandbox",
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
      },
    });
  } catch {
    return new NextResponse("fetch error", { status: 502 });
  }
}
