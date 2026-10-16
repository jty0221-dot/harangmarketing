import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Building2, Camera, Check, UtensilsCrossed } from 'lucide-react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import JsonLd from '../../../components/JsonLd';
import { breadcrumbLd, webPageLd, faqLd, PAGE_UPDATED } from '../../../lib/seo';
import { photoMetadata, photoOffersLd, PHOTO_FAQ } from '../../../lib/photo-seo';
import { FOOD_PLANS, STAY_PLANS, type PhotoPlan } from '../../../lib/photo-pricing';

export const metadata: Metadata = photoMetadata('/services/photo/price', '매장 사진촬영 가격표 | 음식점 · 시설 촬영', '음식점 촬영 30만·70만·110만 원, 시설 촬영 70만·100만·120만 원. 부가세 별도. 상품별 사진과 촬영 조건을 확인하세요.', '/photo-pricing/standard.jpg');
const container = 'mx-auto max-w-6xl px-4 md:px-6 lg:px-8';
const button = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--w-primary)] px-5 py-3 w-label1 font-semibold text-white hover:bg-[var(--w-primary-strong)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--w-primary)]';
const outline = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[var(--w-line)] bg-[var(--w-bg)] px-5 py-3 w-label1 font-semibold text-[var(--w-label)] hover:bg-[var(--w-bg-alt)]';

function PlanCard({ plan, type }: { plan: PhotoPlan; type: 'food' | 'stay' }) {
  const rows = [
    ...(plan.model ? [['모델', plan.model], ['시설 면적', plan.area!]] : []),
    ['작업 기간', plan.days], ['수정 횟수', '2회'], ['촬영 시간', plan.time],
    ['보정 작업', plan.retouch], ['제공 컷', plan.cuts],
  ];
  return <article id={type + '-' + plan.code.toLowerCase()} className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[var(--w-line)] bg-[var(--w-bg)] shadow-sm">
    <div className={type === 'food' ? 'flex aspect-[4/5] items-center justify-center bg-[var(--w-bg-alt)]' : 'aspect-[3/2] bg-[var(--w-bg-alt)]'}>
      <Image src={plan.image} alt={plan.alt} width={plan.width} height={plan.height} sizes="(max-width: 1023px) 100vw, 360px" className="h-full w-full object-contain" />
    </div>
    <div className="flex flex-1 flex-col p-5 md:p-6">
      <p className="w-caption1 font-semibold tracking-widest text-[var(--w-primary)]">{plan.code}</p>
      <h3 className="mt-2 w-heading1 text-[var(--w-label-strong)]">{plan.name}</h3>
      <p className="mt-4 w-body2 text-[var(--w-label-alt)]">{plan.description}</p>
      <ul className="mt-5 space-y-3 w-label1">{plan.includes.map((item) => <li key={item} className="flex gap-2"><Check size={16} className="mt-0.5 shrink-0 text-[var(--w-primary)]" /><span>{item}</span></li>)}</ul>
      {plan.extra && <p className="mt-3 w-caption1 text-[var(--w-label-alt)]">{plan.extra}</p>}
      <div className="mt-auto pt-8">
        <p className="w-display3 font-bold tabular-nums text-[var(--w-label-strong)]">{plan.price.toLocaleString('ko-KR')}<span className="ml-1 w-body1 font-semibold">원</span></p>
        <p className="mt-1 w-caption1 text-[var(--w-label-alt)]">부가세 별도</p>
        <div className="my-6 border-t border-[var(--w-line)]" />
        <dl className="space-y-3 w-label1">{rows.map(([label, value]) => <div key={label} className="flex items-start justify-between gap-3"><dt className="shrink-0 text-[var(--w-label-alt)]">{label}</dt><dd className="text-right font-medium">{value}</dd></div>)}</dl>
        <Link href={'/contact?industry=' + encodeURIComponent(type === 'food' ? '음식점 사진촬영' : '시설·숙박 사진촬영') + '&plan=' + encodeURIComponent(plan.name)} className={button + ' mt-7 w-full'}>{plan.name} 상담<ArrowRight size={16} /></Link>
      </div>
    </div>
  </article>;
}

export default function PhotoPricePage() {
  return <><Header /><main className="bg-[var(--w-bg)] pt-[104px] text-[var(--w-label)] md:pt-[108px]">
    <JsonLd data={photoOffersLd()} />
    <JsonLd data={faqLd(PHOTO_FAQ, 'https://www.harangmarketing.com/services/photo/price')} />
    <JsonLd data={webPageLd({ path: '/services/photo/price', name: '매장 사진촬영 가격표', description: metadata.description as string, dateModified: PAGE_UPDATED['/services/photo/price'] })} />
    <JsonLd data={breadcrumbLd([{ name: '홈', path: '/' }, { name: '서비스', path: '/services' }, { name: '매장 사진촬영', path: '/services/photo' }, { name: '가격표', path: '/services/photo/price' }])} />
    <section className="border-b border-[var(--w-line)] bg-[var(--w-bg-alt)] py-12 md:py-20"><div className={container}>
      <div className="mb-6 flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--w-primary)] shadow-sm"><Camera size={16} className="text-white" strokeWidth={2.5} /></span><p className="w-label1 font-semibold text-[var(--w-primary)]">매장 사진촬영 가격표</p></div>
      <h1 className="w-display2 max-w-4xl font-bold text-[var(--w-label-strong)]">메뉴와 공간에 맞는<br />촬영 구성을 선택하세요</h1>
      <p className="mt-5 max-w-2xl w-body1 text-[var(--w-label-alt)]">음식점은 메뉴와 인테리어를, 시설·숙박은 공간과 머무는 장면을 중심으로 촬영합니다. 상품별 사진과 제공 범위를 확인해 주세요.</p>
      <nav aria-label="촬영 가격 구분" className="mt-8 flex flex-wrap gap-3"><a href="#food" className={button}><UtensilsCrossed size={16} />음식점 촬영</a><a href="#stay" className={outline}><Building2 size={16} />시설·숙박 촬영</a></nav>
    </div></section>
    {([{ type: 'food', title: '음식점 촬영', english: 'PLACE PHOTOGRAPHY', plans: FOOD_PLANS, description: '메뉴 사진부터 플레이스에 사용할 사진까지, 세 가지 구성으로 안내합니다.' }, { type: 'stay', title: '시설·숙박 촬영', english: 'STAY PHOTOGRAPHY', plans: STAY_PLANS, description: '모델 유무와 시설 면적에 맞춰 촬영 구성을 선택할 수 있습니다.' }] as const).map((section) =>
      <section key={section.type} id={section.type} aria-labelledby={section.type + '-title'} className={'scroll-mt-32 py-12 md:py-20 ' + (section.type === 'stay' ? 'border-t border-[var(--w-line)] bg-[var(--w-bg-alt)]' : '')}>
        <div className={container}><div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="mb-3 w-caption1 font-semibold tracking-widest text-[var(--w-primary)]">{section.english}</p><h2 id={section.type + '-title'} className="w-display3 font-bold text-[var(--w-label-strong)]">{section.title}</h2><p className="mt-3 w-body2 text-[var(--w-label-alt)]">{section.description}</p></div><Link href={'/services/photo/' + section.type} className={outline}>업체별 촬영 사례 보기<ArrowRight size={16} /></Link></div>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">{section.plans.map((plan) => <PlanCard key={plan.code} plan={plan} type={section.type} />)}</div>
          {section.type === 'food' && <p className="mt-6 w-caption1 text-[var(--w-label-alt)]">사진은 촬영 구성에 대한 이해를 돕는 협력사 작업 예시입니다. 블로그 기자단 배포용 사진 촬영은 사진 제작 범위를 뜻합니다.</p>}
        </div>
      </section>
    )}
    <section aria-labelledby="photo-faq" className={container + ' py-12 md:py-16'}>
      <h2 id="photo-faq" className="w-heading1 font-semibold">사진촬영 자주 묻는 질문</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">{PHOTO_FAQ.map(({ q, a }) => <article key={q} className="min-w-0 rounded-2xl border border-[var(--w-line)] p-5"><h3 className="w-headline1 font-semibold">{q}</h3><p className="mt-3 w-body2 text-[var(--w-label-alt)]">{a}</p></article>)}</div>
    </section>
  </main><Footer /></>;
}
