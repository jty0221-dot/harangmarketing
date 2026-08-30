const REPO = "jty0221-del/harangmarketing";
const FILE_PATH = "content/blog-posts.json";
const BRANCH = "main";

function getToken(): string {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN 환경변수가 설정되지 않았습니다");
  return token;
}

async function githubApi(path: string, init?: RequestInit) {
  const res = await fetch(`https://api.github.com/repos/${REPO}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub API 오류 (${res.status}): ${text}`);
  }
  return res.json();
}

export async function fetchPostsFromGitHub(): Promise<{ posts: unknown[]; sha: string }> {
  const data = await githubApi(`/contents/${FILE_PATH}?ref=${BRANCH}`);
  const content = Buffer.from(data.content, "base64").toString("utf-8");
  return { posts: JSON.parse(content), sha: data.sha };
}

export async function commitPostsToGitHub(posts: unknown[], sha: string, message: string): Promise<void> {
  const content = Buffer.from(JSON.stringify(posts, null, 2) + "\n", "utf-8").toString("base64");
  await githubApi(`/contents/${FILE_PATH}`, {
    method: "PUT",
    body: JSON.stringify({ message, content, sha, branch: BRANCH }),
  });
}
