// app/lib/meta-length.ts 자가 검사 · `node scripts/meta-length.test.mjs`
import assert from "node:assert";
const { fitDesc, metaDesc } = await import("../app/lib/meta-length.ts"); // Node 22.18+ 형식 제거로 .ts 를 바로 읽는다

const a = "가".repeat(50) + ".", b = "나".repeat(40) + ".", c = "다".repeat(20) + ".";
assert.equal(fitDesc(a, b, c), `${a} ${c}`); // 넘는 문장은 건너뛰고 다음 문장을 붙인다
assert.equal(fitDesc("짧다. 두 번째."), "짧다. 두 번째.");
assert.throws(() => fitDesc("가".repeat(81) + "."));
assert.throws(() => metaDesc("가".repeat(81)));
assert.equal(metaDesc("가".repeat(80)), "가".repeat(80));
console.log("meta-length ok");
