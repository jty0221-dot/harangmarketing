// git 훅을 scripts/hooks 로 돌린다.
//
// .git/hooks 는 clone 을 따라오지 않는다. 그래서 훅을 repo 안에 두고
// core.hooksPath 로 가리킨다 — 새로 clone 해도 npm install 한 번이면 붙는다.
//
// 실패해도 빌드를 세우지 않는다. Vercel 처럼 .git 이 없거나 git 이 없는 곳에서는
// 조용히 넘어간다 — 훅은 사람이 push 하는 자리에서만 의미가 있다.

const { execFileSync } = require("node:child_process");
const { existsSync } = require("node:fs");
const { join } = require("node:path");

const root = join(__dirname, "..");

function quiet(reason) {
  if (process.env.HARANG_HOOKS_VERBOSE) console.log(`훅 설치 건너뜀: ${reason}`);
  process.exit(0);
}

if (!existsSync(join(root, ".git"))) quiet(".git 없음");

let current = "";
try {
  current = execFileSync("git", ["-C", root, "config", "--get", "core.hooksPath"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  }).trim();
} catch {
  // 값이 없으면 git 이 1 로 끝난다. 에러가 아니라 '아직 안 붙었다' 는 뜻이다.
}

if (current === "scripts/hooks") process.exit(0);

try {
  execFileSync("git", ["-C", root, "config", "core.hooksPath", "scripts/hooks"], {
    stdio: "ignore",
  });
} catch {
  quiet("git 을 쓸 수 없음");
}

console.log("git 훅 연결 완료 — push 전에 레퍼런스 커밋 여부를 검사합니다.");
