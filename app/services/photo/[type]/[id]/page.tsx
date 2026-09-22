import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Header from '../../../../components/Header';
import Footer from '../../../../components/Footer';
import PhotoSlideshow from '../../../../components/PhotoSlideshow';
import JsonLd from '../../../../components/JsonLd';
import { breadcrumbLd, webPageLd } from '../../../../lib/seo';
import { isPhotoType, PHOTO_TYPES, PHOTO_PORTFOLIOS, portfoliosFor } from '../../../../lib/photo-portfolios';

type Params = Promise<{ type: string; id: string }>;
function getPortfolio(type: string, id: string) {
  if (!isPhotoType(type)) notFound();
  const portfolio = PHOTO_PORTFOLIOS.find((item) => item.type === type && item.id === id);
  if (!portfolio) notFound();
  return { portfolio, type };
}
export function generateStaticParams() { return PHOTO_PORTFOLIOS.map(({ type, id }) => ({ type, id })); }
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { type, id } = await params;
  const { portfolio } = getPortfolio(type, id);
  const title = portfolio.name + ' 촬영 포트폴리오';
  const description = portfolio.name + '의 촬영 사진 ' + portfolio.images.length + '장을 확인하세요. 촬영 및 디렉팅: 본유 스튜디오.';
  const url = 'https://www.harangmarketing.com/services/photo/' + type + '/' + id;
  return { title, description, alternates: { canonical: url }, openGraph: { title, description, url, images: [{ url: portfolio.cover, alt: portfolio.name + ' 촬영 대표 사진' }] } };
}
export default async function PhotoDetailPage({ params }: { params: Params }) {
  const raw = await params;
  const { portfolio, type } = getPortfolio(raw.type, raw.id);
  const path = '/services/photo/' + type + '/' + portfolio.id;
  const groups = portfoliosFor(type);
  const current = groups.findIndex((item) => item.id === portfolio.id);
  const next = groups[(current + 1) % groups.length];
  return <><Header /><main className="bg-[var(--w-bg)] pt-[104px] text-[var(--w-label)] md:pt-[108px]">
    <JsonLd data={webPageLd({ path, name: portfolio.name + ' 촬영 포트폴리오', description: portfolio.description || PHOTO_TYPES[type].description, dateModified: '2026-09-22' })} />
    <JsonLd data={breadcrumbLd([{ name: '홈', path: '/' }, { name: '매장 사진촬영', path: '/services/photo' }, { name: PHOTO_TYPES[type].label, path: '/services/photo/' + type }, { name: portfolio.name, path }])} />
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-8 md:px-6 md:pt-12 lg:px-8">
      <Link href={'/services/photo/' + type} className="inline-flex min-h-11 items-center gap-2 w-label1 text-[var(--w-label-alt)]"><ArrowLeft size={16} />{PHOTO_TYPES[type].label} 목록</Link>
      <header className="pb-8 pt-6 text-center md:pb-10"><p className="mb-3 w-caption1 tracking-widest text-[var(--w-primary)]">{type === 'stay' ? 'STAY PHOTOGRAPHY' : 'FOOD PHOTOGRAPHY'}</p><h1 className="w-display3 font-bold text-[var(--w-label-strong)]">{portfolio.name}</h1>{portfolio.description && <p className="mt-3 w-body2 text-[var(--w-label-alt)]">{portfolio.description}</p>}<p className="mt-2 w-caption1 text-[var(--w-label-alt)]">촬영 및 디렉팅: 본유 스튜디오</p></header>
      <PhotoSlideshow key={portfolio.type + portfolio.id} name={portfolio.name} images={portfolio.images} />
      <nav aria-label="다음 촬영 사례" className="mt-10 flex flex-col justify-between gap-4 border-t border-[var(--w-line)] pt-6 sm:flex-row"><Link href={'/services/photo/price#' + type} className="inline-flex min-h-11 items-center gap-2 w-label1 font-semibold text-[var(--w-primary)]">촬영 구성과 가격 보기<ArrowRight size={16} /></Link><Link href={'/services/photo/' + type + '/' + next.id} className="inline-flex min-h-11 items-center gap-2 w-label1">다음 사례 · {next.name}<ArrowRight size={16} /></Link></nav>
    </div>
  </main><Footer /></>;
}
