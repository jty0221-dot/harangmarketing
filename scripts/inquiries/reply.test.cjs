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
assert.match(buildInquiryReply({ name: '테스트', industry: '온라인 쇼핑몰' }).kakao, /필요한 작업/);
const reviewedBody = '보내주신 세 스토어를 확인했습니다. 프라모델과 식기를 나눠 진행하겠습니다.';
const manual = buildInquiryReply({ ...q, memo: `내부 메모는 고객에게 노출하지 않음\n[검토 완료 문안]\n${reviewedBody}\n[문안 끝]\n비공개 내부 추가 기록` });
assert.equal(manual.kakao, reviewedBody);
assert.equal(manual.reviewed, true);
assert.equal(manual.needsResearch, false);
assert.doesNotMatch(manual.kakao, /비공개|내부 메모/);
for (const ip of ['127.0.0.1', '10.1.1.1', '169.254.169.254', '192.168.1.1', '100.64.1.1', '::1', '::ffff:127.0.0.1', '2001:db8::1', '2002:7f00::1']) assert.equal(isPublicInquiryAddress(ip), false, ip);
for (const ip of ['8.8.8.8', '1.1.1.1', '2606:4700:4700::1111', '2001:4860:4860::8888']) assert.equal(isPublicInquiryAddress(ip), true, ip);
console.log('PASS: supplied links, pending/blocked/read evidence, product context, missing-link branch, private addresses');
const cases = [
  ['price and scope', '블로그 관리 가격과 진행 방식 알려주세요', /비용|공개 안내/, /원고/],
  ['schedule and guarantee', '이번 주 시작 가능한가요? 1위 보장되나요?', /일정/, /보장할 수는 없습니다/],
  ['refund', '9월 계약일과 주문번호 A123입니다. 환불해주세요', /환불 요청/, /계약 내용/],
  ['complaint', '계약했는데 연락도 안 되고 약속을 안 지켰어요', /불편과 문제/, /진행 기록/],
  ['existing revision', '기존 계약 글 오탈자 수정 요청합니다', /기존 작업/, /수정/],
  ['payment receipt', '입금했습니다. 세금계산서 확인 부탁드립니다', /실제 결제 기록/, /증빙/],
  ['text only', '부천 카페입니다. 플레이스 순위 문의, 전화 말고 카톡만 주세요', /메시지로/, /순위/],
  ['time supplied', '오후 3시 통화 부탁드립니다', /남겨주신 통화 희망시간/, /연락 가능/],
  ['thanks only', '감사합니다', /말씀 감사합니다/, /추가로 확인/],
  ['studio Mac', '하랑 스튜디오 맥에서 사용 가능한가요?', /윈도우/, /다른 운영체제/],
  ['kakao sender', '카톡 예약 발송 프로그램 문의합니다', /윈도우/, /예약/],
  ['medical guarantee', '치과 플레이스 1위와 체험단 문의합니다', /일괄적으로 보장할 수는 없습니다/, /문구와 소재/],
  ['missing photos', '블로그 관리 사진이 부족해요, 원본 자료 어떻게 보내나요?', /가지고 계신 사진/, /원본 화질/],
  ['portfolio', '공간 사진촬영 포트폴리오와 비용 궁금합니다', /portfolio/, /비용/],
  ['website different', '쇼핑몰 홈페이지 제작 가능할까요?', /홈페이지형 블로그는 다른 작업/, /제공 가능한/],
  ['budget supplied', '월 예산 30만원으로 블로그 관리할까요?', /비용/, /확인/],
  ['email', '상세페이지 제작 견적을 이메일로만 주세요', /이메일 안내/, /상세/],
  ['unknown', '수출 협업 가능한지 문의합니다', /담당 범위/, /내용을 확인/],
];
for (const [label, message, first, second] of cases) {
  const reply = buildInquiryReply({ name: '테스트', industry: /치과/.test(message) ? '치과' : '기타 업종', goals: '온라인 매출 올리기', message });
  assert.match(reply.kakao, first, label);
  assert.match(reply.kakao, second, label);
  assert.doesNotMatch(reply.kakao, /스토어 링크.*보내|무료 진단 신청해주세요/, label);
  if (label === 'thanks only') assert.doesNotMatch(reply.kakao, /순위|매출|통화|업종/, label);
  if (label === 'refund' || label === 'complaint') assert.doesNotMatch(reply.kakao, /무료|광고비|온라인 매출/, label);
  if (label === 'text only') assert.doesNotMatch(reply.kakao, /통화가 편하신|전화드리/, label);
  if (label === 'time supplied') assert.doesNotMatch(reply.kakao, /시간을 알려/, label);
  if (label === 'budget supplied') assert(reply.assessment.supplied.includes('예산'), label);
  if (label === 'refund') assert(!reply.assessment.missing.includes('계약·주문 식별 정보'), label);
}
const priced = buildInquiryReply({ name:'테스트', industry:'기타 업종', message:'스마트스토어 상세페이지 가격은 얼마인가요?', knowledge:{ available:true,checkedAt:new Date().toISOString(),facts:[{question:'상세페이지 제작은 얼마인가요?',answer:'공개 테스트 가격 165,000원, 기획형, 부가세 포함입니다.',source:'https://www.harangmarketing.com/faq'}]}});
assert.match(priced.kakao,/165,000원/);
assert.match(priced.kakao,/부가세 포함/);
const unavailable = buildInquiryReply({ name:'테스트', message:'상세페이지 가격은 얼마인가요?', knowledge:{available:false,checkedAt:new Date().toISOString(),facts:[]}});
assert.doesNotMatch(unavailable.kakao,/165,000/);
assert.match(unavailable.kakao,/최종 금액/);
console.log('PASS: 18 varied inquiries, multi-question coverage, supplied budget/time, contact preference, support routing, live-price authority/fallback');
for (const message of ['계약 전에 최소 계약기간과 중도 해지 조건을 알고 싶습니다', '주문 취소 안 할게요', '환불 문의 아닙니다. 블로그 관리 가격 알려주세요']) {
  const reply = buildInquiryReply({ message });
  assert.doesNotMatch(reply.kakao, /환불 요청으로|계약·주문 식별/);
}
assert.doesNotMatch(buildInquiryReply({message:'로고 제작 가격과 진행 방법 알려주세요'}).kakao, /PC·모바일 커버|위젯/);
assert.doesNotMatch(buildInquiryReply({message:'전화는 어렵고 메일로만 안내해주세요'}).kakao, /업종과 필요한/);
assert.match(buildInquiryReply({message:'블로그, 인스타, 상세페이지, 공간 촬영 진행 방식 알려주세요'}).kakao, /촬영은/);
const multi = buildInquiryReply({message:'블로그 관리 가격과 상세페이지 가격 각각 알려주세요',knowledge:{available:true,checkedAt:'test',facts:[{question:'블로그 관리 가격은?',answer:'블로그 테스트 가격 100원 부가세 포함',source:'test'},{question:'상세페이지 가격은?',answer:'상세페이지 테스트 가격 200원 부가세 포함',source:'test'}]}});
assert.match(multi.kakao,/100원/); assert.match(multi.kakao,/200원/);
console.log('PASS: policy versus claim, negation, logo scope, contact-only, four services and individual prices');
if (process.argv.includes('--knowledge')) load(path.join(root,'app/lib/inquiry-knowledge.ts')).getPublicInquiryKnowledge().then(result => {
  assert.equal(result.available,true,'published FAQ reachable and structured facts available');
  console.log(`PASS: published FAQ ${result.facts.length} facts`);
}).catch(error => {console.error(error.message);process.exitCode=1;});
if (process.argv.includes('--live')) researchInquiryLinks(q.message).then(result => {
  console.log(JSON.stringify(result, null, 2));
  console.log(buildInquiryReply({ ...q, research: result }).kakao);
}).catch(error => { console.error(error.message); process.exitCode = 1; });
