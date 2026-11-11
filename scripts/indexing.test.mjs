import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import ts from 'typescript';
import * as jsxRuntime from 'react/jsx-runtime';
import { renderToStaticMarkup } from 'react-dom/server';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
function load(file, dependencies, DateImpl = Date) {
  const code = ts.transpileModule(fs.readFileSync(path.join(root, file), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
  const exports = {};
  vm.runInNewContext(code, { exports, Date: DateImpl, Response, require(name) {
    assert.ok(name in dependencies, `Unexpected dependency: ${name}`);
    return dependencies[name];
  }});
  return exports.default ?? exports;
}
const base = 'https://www.harangmarketing.com';
const dependencies = {
  './lib/blog-index': {getBlogIndex: () => [{slug:'published-cms-post', date:'2026-10-20', title:'Published CMS post', excerpt:'Article summary', tag:'Marketing'}]},
  './lib/seo': {SITE:{base}, PAGE_UPDATED:{'/':'2026-10-28'}, updatedAt: (_, date) => date},
  './lib/rank-records': {SNAPSHOT_DATE:'2026-10-21'},
  './lib/place-rank-cases': {PLACE_RANK_GENERATED:'2026-10-22'},
  './lib/feature-flags': {SNS_STORE_ENABLED:false},
  './lib/photo-seo': {PHOTO_UPDATED:'2026-09-23'},
  './lib/photo-portfolios': {PHOTO_PORTFOLIOS:[{type:'food',id:'fixture',images:[{src:'/photo.jpg'}]}]},
  './lib/clinic-homepage': {CLINIC_LINE_PAGES:[{path:'/services/homepage/clinic'},{path:'/services/homepage/clinic/geo'}]},
};
// Different build clocks must not pretend that untouched content changed.
class FutureDate extends Date { constructor(...args) { super(...(args.length ? args : ['2030-01-01'])); }}
const sitemap = load('app/sitemap.ts', dependencies)();
const future = load('app/sitemap.ts', dependencies, FutureDate)();
assert.equal(JSON.stringify(sitemap), JSON.stringify(future));
assert.equal(sitemap.find(p => p.url === base + '/about').lastModified, undefined);
assert.equal(sitemap.find(p => p.url === base).lastModified.toISOString(), '2026-10-28T00:00:00.000Z');
assert.equal(sitemap.find(p => p.url.endsWith('/published-cms-post')).lastModified.toISOString(), '2026-10-20T00:00:00.000Z');
assert.equal(sitemap.find(p => p.url === base + '/blog').lastModified.toISOString(), '2026-10-20T00:00:00.000Z');
assert.equal(sitemap.find(p => p.url.endsWith('/food/fixture')).images[0], base + '/photo.jpg');
assert.equal(new Set(sitemap.map(p => p.url)).size, sitemap.length);
assert.ok(sitemap.some(p => p.url.endsWith('/clinic/geo')));
assert.ok(!sitemap.some(p => /\/(sns|admin|preview|r|sian)(\/|$)/.test(new URL(p.url).pathname)));
const robots = load('app/robots.ts', {
  './lib/seo': dependencies['./lib/seo'], './lib/feature-flags':dependencies['./lib/feature-flags'],
})();
for (const bot of ['*', 'Yeti', 'Googlebot', 'Bingbot', 'OAI-SearchBot']) {
  const rule = robots.rules.find(rule => rule.userAgent === bot);
  assert.ok(rule, bot);
  for (const page of sitemap) {
    const pathname = new URL(page.url).pathname;
    assert.ok(!rule.disallow.some(prefix => pathname.startsWith(prefix)), `${bot} blocks sitemap URL ${pathname}`);
  }
}
for (const file of ['app/preview/layout.tsx','app/r/[code]/page.tsx']) {
  assert.match(fs.readFileSync(path.join(root,file),'utf8'), /index:\s*false/);
}
console.log('PASS: stable content dates, CMS/portfolio/clinic coverage, unique URLs, sitemap/robots consistency, intentional noindex preserved');

// A newer service item must advance the feed date, and undated items must not borrow a ranking date.
const rss = load('app/rss.xml/route.ts', {
  '../lib/blog-index': dependencies['./lib/blog-index'],
  '../lib/place-rank-cases': dependencies['./lib/place-rank-cases'],
  '../lib/clinic-homepage': {CLINIC_LINE_PAGES: [
    {path:'/services/homepage/clinic', title:'Clinic & FAQ', desc:'Verified <details>'},
    {path:'/services/homepage/clinic/geo', title:'Undated service', desc:'Details'},
  ]},
  '../lib/seo': {PAGE_UPDATED:{'/services/homepage/clinic':'2026-10-30'}},
});
const feed = await (await rss.GET()).text();
assert.ok(feed.includes(`<lastBuildDate>${new Date('2026-10-30').toUTCString()}</lastBuildDate>`));
assert.ok(feed.includes('Clinic &amp; FAQ'));
const undatedItem = feed.split('<item>').find(item => item.includes('Undated service'));
assert.ok(undatedItem && !undatedItem.includes('<pubDate>'));
console.log('PASS: RSS includes latest service update and preserves unknown dates');

// Render the real CMS branch with hostile metadata. It must remain one inert JSON-LD script.
const JsonLd = load('app/components/JsonLd.tsx', {'react/jsx-runtime':jsxRuntime});
const hostileTitle = '</script><script>alert("jsonld")</script>';
const ignoredComponent = () => null;
const blogPage = load('app/blog/[slug]/page.tsx', {
  'react/jsx-runtime': jsxRuntime,
  'next/navigation': {notFound: () => {throw new Error('unexpected notFound');}},
  'next/link': ignoredComponent,
  '../../components/Header': ignoredComponent,
  '../../components/Footer': ignoredComponent,
  '../../components/ScrollProgressBar': ignoredComponent,
  '../../components/JsonLd': JsonLd,
  'lucide-react': Object.fromEntries(['ArrowLeft','Clock','TrendingUp','CheckCircle2','ArrowRight','MessageCircle','BookOpen'].map(name => [name,ignoredComponent])),
  '../../lib/blog-posts': {getAllPosts: () => [], getPostBySlug: () => ({slug:'cms-fixture',title:hostileTitle,excerpt:'<img src=x onerror=alert(1)>',date:'2026-10-20',body:'<p>Approved body</p>',published:true})},
  '../../lib/blog-meta': {BLOG_META:[]},
  '../../lib/seo': {ogImage:() => ({}),fitDesc:value => value},
});
const html = renderToStaticMarkup(await blogPage({params:Promise.resolve({slug:'cms-fixture'})}));
assert.equal((html.match(/<script/g) ?? []).length, 1);
assert.equal((html.match(/<\/script>/g) ?? []).length, 1);
const payload = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1];
assert.equal(JSON.parse(payload).headline, hostileTitle);
assert.ok(!payload.includes('<'));
console.log('PASS: real CMS JSON-LD branch escapes script breakouts without changing metadata');
