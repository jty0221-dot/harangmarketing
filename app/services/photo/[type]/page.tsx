import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import JsonLd from '../../../components/JsonLd';
import { photoMetadata, PHOTO_UPDATED } from '../../../lib/photo-seo';
import { breadcrumbLd, webPageLd, SITE } from '../../../lib/seo';
import { isPhotoType, PHOTO_TYPES, portfoliosFor } from '../../../lib/photo-portfolios';

export function generateStaticParams() { return [{ type: 'food' }, { type: 'stay' }]; }
export async function generateMetadata({ params }: { params: Promise<{ type: string }> }): Promise<Metadata> {
  const { type } = await params;
  if (!isPhotoType(type)) notFound();
  const data = PHOTO_TYPES[type];
  // 검색 제목 · 설명은 키워드를 앞에 둔다 (2026-10-08 전 페이지 점검 · 음식사진촬영 월 320회). 화면 문구는 그대로다
  const seoTitle = type === 'food' ? '음식사진촬영 포트폴리오 · 메뉴 · 매장 촬영 사례' : '숙소 · 펜션 사진촬영 포트폴리오 · 시설 촬영 사례';
  const seoDesc = data.description + ' 하랑마케팅이 진행한 매장 사진촬영 사례를 모아 사진 수와 촬영 구성, 가격까지 함께 보여 드립니다.';
  return photoMetadata('/services/photo/' + type, seoTitle, seoDesc, portfoliosFor(type)[0].cover);
}
export default async function PhotoPortfolioPage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  if (!isPhotoType(type)) notFound();
  const data = PHOTO_TYPES[type];
  const groups = portfoliosFor(type);
  const path = '/services/photo/' + type;
  return <><Header /><main className="bg-[var(--w-bg)] pt-[104px] text-[var(--w-label)] md:pt-[108px]">
    <JsonLd data={webPageLd({ path, name: data.title, description: data.description, type: 'CollectionPage', dateModified: PHOTO_UPDATED })} />
    <JsonLd data={breadcrumbLd([{ name: '홈', path: '/' }, { name: '매장 사진촬영', path: '/services/photo' }, { name: data.label, path }])} />
    <JsonLd data={{ '@context': 'https://schema.org', '@type': 'ItemList', '@id': SITE.base + path + '#list', numberOfItems: groups.length, itemListElement: groups.map((group, index) => ({ '@type': 'ListItem', position: index + 1, name: group.name, url: SITE.base + path + '/' + group.id })) }} />
    <section className="mx-auto max-w-6xl px-4 pb-10 pt-10 md:px-6 md:pt-16 lg:px-8">
      <Link href="/services/photo" className="mb-8 inline-flex min-h-11 items-center gap-2 w-label1 text-[var(--w-label-alt)]"><ArrowLeft size={16} />촬영 서비스</Link>
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><div><p className="mb-3 w-caption1 font-semibold tracking-widest text-[var(--w-primary)]">PARTNER PORTFOLIO</p><h1 className="w-display3 font-bold text-[var(--w-label-strong)]">{data.title}</h1><p className="mt-4 max-w-2xl w-body2 text-[var(--w-label-alt)]">{data.description}</p><p className="mt-2 w-caption1 text-[var(--w-label-alt)]">업체별 메뉴와 공간 사진을 확인하세요.</p></div><Link href={'/services/photo/price#' + type} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--w-primary)] px-5 py-3 w-label1 font-semibold text-white">촬영 가격 보기<ArrowRight size={16} /></Link></div>
      <nav aria-label="촬영 포트폴리오 구분" className="mt-8 flex gap-2">{(['stay', 'food'] as const).map((key) => <Link key={key} href={'/services/photo/' + key} aria-current={key === type ? 'page' : undefined} className={'inline-flex min-h-11 items-center rounded-xl border px-4 w-label1 ' + (key === type ? 'border-[var(--w-primary)] bg-[var(--w-primary-bg)] font-semibold text-[var(--w-primary)]' : 'border-[var(--w-line)]')}>{PHOTO_TYPES[key].label}</Link>)}</nav>
    </section>
    <section aria-label="업체별 촬영 포트폴리오" className="mx-auto max-w-6xl px-4 pb-16 md:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => <Link key={group.id} href={path + '/' + group.id} className="group min-w-0 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--w-primary)]">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[var(--w-bg-alt)]"><Image src={group.cover} alt={group.name + ' 촬영 대표 사진'} fill sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 360px" className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none" /></div>
          <div className="mt-4 flex items-start justify-between gap-3"><div><h2 className="w-headline1 font-semibold text-[var(--w-label-strong)]">{group.name}</h2>{group.description && <p className="mt-1 w-label1 text-[var(--w-label-alt)]">{group.description}</p>}</div><ArrowRight size={18} className="mt-1 shrink-0 text-[var(--w-primary)]" /></div><p className="mt-2 w-caption1 text-[var(--w-label-alt)]">사진 {group.images.length}장 보기</p>
        </Link>)}
      </div>
    </section>
  </main><Footer /></>;
}
