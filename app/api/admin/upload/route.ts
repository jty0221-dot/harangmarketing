import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken, ADMIN_COOKIE_NAME } from "../../../lib/admin-auth";

const REPO = "jty0221-del/harangmarketing";
const BRANCH = "main";
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

async function isAuthed() {
  const store = await cookies();
  return verifySessionToken(store.get(ADMIN_COOKIE_NAME)?.value);
}

export async function POST(req: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false, error: "인증이 필요합니다" }, { status: 401 });
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return NextResponse.json({ ok: false, error: "GITHUB_TOKEN 환경변수가 설정되지 않았습니다" }, { status: 500 });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "파일이 없습니다" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ ok: false, error: "이미지 파일만 업로드할 수 있습니다" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ ok: false, error: "파일 용량은 5MB를 넘을 수 없습니다" }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const repoPath = `public/images/blog/${filename}`;

  const buf = Buffer.from(await file.arrayBuffer());
  const content = buf.toString("base64");

  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${repoPath}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: `블로그 이미지 업로드: ${filename}`,
      content,
      branch: BRANCH,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json({ ok: false, error: `업로드 실패: ${text}` }, { status: 500 });
  }

  return NextResponse.json({ ok: true, url: `/images/blog/${filename}` });
}
