import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken, ADMIN_COOKIE_NAME } from "../../../lib/admin-auth";
import { fetchPostsFromGitHub, commitPostsToGitHub } from "../../../lib/github-content";

interface PostInput {
  slug?: string;
  title: string;
  excerpt: string;
  body: string;
  published: boolean;
}

async function isAuthed() {
  const store = await cookies();
  return verifySessionToken(store.get(ADMIN_COOKIE_NAME)?.value);
}

function slugify(title: string): string {
  const ascii = title
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  return ascii ? `${ascii}-${id}` : `post-${id}`;
}

export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false, error: "인증이 필요합니다" }, { status: 401 });
  }
  try {
    const { posts } = await fetchPostsFromGitHub();
    return NextResponse.json({ ok: true, posts });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false, error: "인증이 필요합니다" }, { status: 401 });
  }

  const input = (await req.json()) as PostInput;
  const bodyText = input.body?.replace(/<[^>]*>/g, "").trim();
  if (!input.title?.trim() || !bodyText) {
    return NextResponse.json({ ok: false, error: "제목과 본문은 필수입니다" }, { status: 400 });
  }

  try {
    const { posts, sha } = await fetchPostsFromGitHub();
    const list = posts as Array<PostInput & { slug: string; date: string }>;

    const now = new Date().toISOString().slice(0, 10);
    const existingIdx = input.slug ? list.findIndex((p) => p.slug === input.slug) : -1;

    if (existingIdx >= 0) {
      list[existingIdx] = {
        ...list[existingIdx],
        title: input.title,
        excerpt: input.excerpt,
        body: input.body,
        published: input.published,
      };
    } else {
      list.unshift({
        slug: slugify(input.title),
        title: input.title,
        excerpt: input.excerpt,
        body: input.body,
        published: input.published,
        date: now,
      });
    }

    await commitPostsToGitHub(
      list,
      sha,
      existingIdx >= 0 ? `블로그 글 수정: ${input.title}` : `블로그 글 작성: ${input.title}`
    );

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
