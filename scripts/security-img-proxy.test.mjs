import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const code = ts.transpileModule(fs.readFileSync(new URL('../app/api/img-proxy/route.ts', import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const safe = 'https://postfiles.pstatic.net/image.jpg';
const png = () => new Response(new Uint8Array([137, 80, 78, 71]), { headers: { 'content-type': 'image/png' } });
let passed = 0;

async function run(raw, responses = [png()], timeout = false) {
  const calls = [];
  const exports = {};
  vm.runInNewContext(code, {
    exports, URL, Uint8Array, AbortController,
    setTimeout: timeout ? (fn) => { queueMicrotask(fn); return 1; } : setTimeout,
    clearTimeout: timeout ? () => {} : clearTimeout,
    require(name) { assert.equal(name, 'next/server'); return require(name); },
    fetch: async (url, options) => {
      calls.push(String(url));
      assert.equal(options.redirect, 'manual');
      assert.ok(options.signal instanceof AbortSignal);
      if (timeout) {
        return new Promise((_, reject) => {
          if (options.signal.aborted) reject(new Error('aborted'));
          else options.signal.addEventListener('abort', () => reject(new Error('aborted')), { once: true });
        });
      }
      assert.ok(responses.length, 'Unexpected extra network request');
      const response = responses.shift();
      return typeof response === 'function' ? response(options.signal) : response;
    },
  });
  const nextUrl = new URL('https://www.harangmarketing.com/api/img-proxy');
  if (raw !== null) nextUrl.searchParams.set('url', raw);
  return { response: await exports.GET({ nextUrl }), calls };
}

async function rejected(raw, status) {
  const result = await run(raw, []);
  assert.equal(result.response.status, status, raw);
  assert.equal(result.calls.length, 0, 'Rejected URLs must never be requested');
  passed++;
}

await rejected(null, 400);
await rejected('not-a-url', 400);
for (const raw of [
  'https://evilpostfiles.pstatic.net/image.png',
  'https://postfiles.pstatic.net.evil.example/image.png',
  'https://127.0.0.1/image.png',
  'https://[::1]/image.png',
  'http://postfiles.pstatic.net/image.png',
  'ftp://postfiles.pstatic.net/image.png',
  'https://user:pass@postfiles.pstatic.net/image.png',
  'https://postfiles.pstatic.net:8443/image.png',
]) await rejected(raw, 403);

for (const raw of [safe, 'https://sub.postfiles.pstatic.net/image.jpg', encodeURIComponent(safe), safe + '?key=a%2Fb']) {
  const { response, calls } = await run(raw);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-type'), 'image/png');
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(response.headers.get('content-security-policy'), "default-src 'none'; sandbox");
  assert.equal((await response.arrayBuffer()).byteLength, 4);
  assert.equal(calls.length, 1);
  if (raw.includes('?key=')) assert.ok(calls[0].endsWith('?key=a%2Fb'), 'Preserve escaped image parameters');
  passed++;
}

for (const location of ['https://169.254.169.254/latest/meta-data/', 'https://evil.example/payload', 'http://blogfiles.pstatic.net/a', 'https://evilphinf.pstatic.net/a']) {
  const { response, calls } = await run(safe, [new Response(null, { status: 302, headers: { location } })]);
  assert.equal(response.status, 403);
  assert.deepEqual(calls, [safe], 'Forbidden redirect target must not be fetched');
  passed++;
}
{
  const { response, calls } = await run(safe, [new Response(null, { status: 302, headers: { location: '/next.png' } }), png()]);
  assert.equal(response.status, 200);
  assert.deepEqual(calls, [safe, 'https://postfiles.pstatic.net/next.png']);
  passed++;
}
{
  const redirects = Array.from({ length: 4 }, () => new Response(null, { status: 302, headers: { location: safe } }));
  const { response, calls } = await run(safe, redirects);
  assert.equal(response.status, 502);
  assert.equal(calls.length, 4, 'Stop redirect loops after three followed hops');
  passed++;
}
for (const type of ['text/html', 'image/svg+xml']) {
  const { response } = await run(safe, [new Response('<script>bad</script>', { headers: { 'content-type': type } })]);
  assert.equal(response.status, 415);
  passed++;
}
{
  const { response } = await run(safe, [new Response('x', { headers: { 'content-type': 'image/png', 'content-length': String(13 * 1024 * 1024) } })]);
  assert.equal(response.status, 413);
  passed++;
}
{
  let cancelled = false;
  const stream = new ReadableStream({
    pull(controller) { controller.enqueue(new Uint8Array(7 * 1024 * 1024)); },
    cancel() { cancelled = true; },
  });
  const { response } = await run(safe, [new Response(stream, { headers: { 'content-type': 'image/png', 'content-length': '1' } })]);
  assert.equal(response.status, 413);
  assert.equal(cancelled, true, 'Oversized stream must be cancelled before reading to completion');
  passed++;
}
{
  const { response } = await run(safe, [], true);
  assert.equal(response.status, 504);
  passed++;
}
console.log(`PASS: ${passed} image proxy cases (allowlist boundaries, HTTPS, redirect-before-fetch, image MIME, bounded body, timeout); all fetches mocked.`);
