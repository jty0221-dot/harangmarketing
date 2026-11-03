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
const TIMEOUT_MS = 8000;
const MAX_REDIRECTS = 3;
const ALLOWED_HOSTS = [
  "postfiles.pstatic.net",
  "blogfiles.pstatic.net",
  "mblogthumb-phinf.pstatic.net",
  "blogpfthumb-phinf.pstatic.net",
  "phinf.pstatic.net",
];

function isAllowedUrl(url: URL): boolean {
  return url.protocol === "https:" && !url.username && !url.password &&
    (!url.port || url.port === "443") &&
    ALLOWED_HOSTS.some(host => url.hostname === host || url.hostname.endsWith(`.${host}`));
}

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get("url");
  if (!raw) return new NextResponse("missing url", { status: 400 });

  let url: URL;
  try {
    // URLSearchParams already decodes the normal query parameter. Preserve escaped
    // image paths; retain support for legacy callers that encoded the URL twice.
    try { url = new URL(raw); } catch { url = new URL(decodeURIComponent(raw)); }
  } catch {
    return new NextResponse("invalid url", { status: 400 });
  }

  if (!isAllowedUrl(url)) {
    return new NextResponse("domain not allowed", { status: 403 });
  }

  const controller = new AbortController();
  // One deadline covers redirects, headers and the response body.
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    let res: Response;
    for (let redirects = 0; ; redirects++) {
      res = await fetch(url, {
        redirect: "manual",
        signal: controller.signal,
        headers: {
          Referer: "https://blog.naver.com/",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        },
      });
      if (![301, 302, 303, 307, 308].includes(res.status)) break;
      const location = res.headers.get("location");
      await res.body?.cancel();
      if (!location || redirects >= MAX_REDIRECTS) {
        return new NextResponse("invalid redirect", { status: 502 });
      }
      const nextUrl = new URL(location, url);
      // Check BEFORE requesting the next hop. Checking res.url after automatic
      // redirects would already have sent a request to a forbidden destination.
      if (!isAllowedUrl(nextUrl)) {
        return new NextResponse("redirected off allowlist", { status: 403 });
      }
      url = nextUrl;
    }

    if (!res.ok) return new NextResponse("upstream error", { status: 502 });

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

    // Bound memory even when Content-Length is absent or dishonest.
    const reader = res.body?.getReader();
    if (!reader) return new NextResponse("empty image", { status: 502 });
    const chunks: Uint8Array[] = [];
    let bytes = 0;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        bytes += value.byteLength;
        if (bytes > MAX_BYTES) {
          await reader.cancel();
          return new NextResponse("too large", { status: 413 });
        }
        chunks.push(value);
      }
    } finally {
      reader.releaseLock();
    }
    const buffer = new Uint8Array(bytes);
    let offset = 0;
    for (const chunk of chunks) {
      buffer.set(chunk, offset);
      offset += chunk.byteLength;
    }

    return new NextResponse(buffer.buffer, {
      headers: {
        "Content-Type": upstreamType,
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "default-src 'none'; sandbox",
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
      },
    });
  } catch {
    return new NextResponse("fetch error", { status: controller.signal.aborted ? 504 : 502 });
  } finally {
    clearTimeout(timer);
    controller.abort();
  }
}
