/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const root = path.resolve(__dirname, '../..');
const cache = new Map();
function load(file) {
  if (cache.has(file)) return cache.get(file);
  const output = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true } }).outputText;
  const loadedModule = { exports: {} };
  cache.set(file, loadedModule.exports);
  const localRequire = id => id.startsWith('.') ? load(path.resolve(path.dirname(file), id + '.ts')) : require(id);
  vm.runInThisContext(`(function(require,module,exports){${output}\n})`, { filename: file })(localRequire, loadedModule, loadedModule.exports);
  return loadedModule.exports;
}
const { extractInquiryLinks } = load(path.join(root, 'app/lib/inquiry-links.ts'));
const { buildInquiryReply } = load(path.join(root, 'app/lib/inquiry-reply.ts'));
const { parseInquiryPage, isPublicInquiryAddress, researchInquiryLinks } = load(path.join(root, 'app/lib/inquiry-research.ts'));
const urls = ['globalsmartbuying', '916market', 'mi_studio'].map(s => `https://smartstore.naver.com/${s}`);
const q = { name: '테스트', industry: '온라인 쇼핑몰', goals: '온라인 매출 올리기', message: `프라모델/그릇 구매대행 업체입니다. 매출 증진 문의드립니다.\n${urls.join('\n')}` };
const pending = buildInquiryReply(q);
assert.equal(pending.providedLinks.length, 3);
assert.equal(pending.needsResearch, true);
for (const body of [pending.kakao, pending.sms]) {
  assert.doesNotMatch(body, /링크.*보내\s?주시|상세페이지.*확인했습니다/);
  assert.match(body, /프라모델·그릇 구매대행/);
  assert.match(body, /아직|못해/);
}
const blocked = parseInquiryPage(urls[0], '<title>오류</title><p>현재 서비스 접속이 불가합니다.</p>', 200);
assert.equal(blocked.state, 'blocked');
const researched = buildInquiryReply({ ...q, research: { links: urls.map(url => ({ ...blocked, url })), checkedAt: new Date().toISOString(), truncated: false } });
assert.equal(researched.needsResearch, false);
assert.match(researched.kakao, /3개 링크는 접속 제한/);
assert.doesNotMatch(researched.kakao, /링크.*보내\s?주시/);
const read = parseInquiryPage(urls[0], '<title>모델샵</title><meta name="description" content="프라모델 전문몰"><script type="application/ld+json">{"@type":"Product","name":"조립 모델 A"}</script>', 200);
assert.equal(read.state, 'read');
assert.deepEqual(read.products, ['조립 모델 A']);
const complete = buildInquiryReply({ ...q, research: { links: [read, ...urls.slice(1).map(url => ({ ...blocked, url }))], checkedAt: new Date().toISOString(), truncated: false } });
assert.match(complete.kakao, /조립 모델 A/);
assert.match(complete.kakao, /2개 링크는 접속 제한/);
assert.doesNotMatch(complete.kakao, /리뷰가 부족|전환율이 낮/);
assert.equal(extractInquiryLinks('www.example.com/shop. https://smartstore.naver.com/a) https://smartstore.naver.com/a').length, 2);
assert.equal(extractInquiryLinks('https://user:pass@example.com').length, 0);
assert.match(buildInquiryReply({ name: '테스트', industry: '온라인 쇼핑몰' }).kakao, /스토어 링크/);
const reviewedBody = '보내주신 세 스토어를 확인했습니다. 프라모델과 식기를 나눠 진행하겠습니다.';
const manual = buildInquiryReply({ ...q, memo: `내부 메모는 고객에게 노출하지 않음\n[검토 완료 문안]\n${reviewedBody}\n[문안 끝]\n비공개 내부 추가 기록` });
assert.equal(manual.kakao, reviewedBody);
assert.equal(manual.reviewed, true);
assert.equal(manual.needsResearch, false);
assert.doesNotMatch(manual.kakao, /비공개|내부 메모/);
for (const ip of ['127.0.0.1', '10.1.1.1', '169.254.169.254', '192.168.1.1', '100.64.1.1', '::1', '::ffff:127.0.0.1', '2001:db8::1', '2002:7f00::1']) assert.equal(isPublicInquiryAddress(ip), false, ip);
for (const ip of ['8.8.8.8', '1.1.1.1', '2606:4700:4700::1111', '2001:4860:4860::8888']) assert.equal(isPublicInquiryAddress(ip), true, ip);
console.log('PASS: supplied links, pending/blocked/read evidence, product context, missing-link branch, private addresses');
if (process.argv.includes('--live')) researchInquiryLinks(q.message).then(result => {
  console.log(JSON.stringify(result, null, 2));
  console.log(buildInquiryReply({ ...q, research: result }).kakao);
}).catch(error => { console.error(error.message); process.exitCode = 1; });
