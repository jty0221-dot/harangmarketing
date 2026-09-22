import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Camera } from 'lucide-react';

const links = [
  { title: '음식점 메뉴 촬영', href: '/services/photo/food', src: '/photo-pricing/standard.jpg', alt: '만둣국과 반찬을 담은 메뉴 촬영 사진', text: '메뉴와 상차림의 촬영 사례' },
  { title: '시설·숙박 공간 촬영', href: '/services/photo/stay', src: '/photo-pricing/stay-basic.jpg', alt: '정원이 보이는 창가와 테이블을 담은 시설 촬영 사진', text: '공간과 머무는 장면의 촬영 사례' },
];

export default function PhotoServicePreview() {
  return <section aria-labelledby="photo-preview-title" className="border-y border-[var(--w-line)] bg-[var(--w-bg-alt)] py-12 md:py-20">
    <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
      <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div><p className="mb-3 flex items-center gap-2 w-label1 font-semibold text-[var(--w-primary)]"><Camera size={17} />매장 사진촬영</p><h2 id="photo-preview-title" className="w-display3 text-[var(--w-label-strong)]">메뉴와 공간을 사진으로 보여주세요</h2><p className="mt-3 w-body2 text-[var(--w-label-alt)]">촬영 사례를 먼저 보고 매장에 맞는 구성을 선택하세요.</p></div>
        <Link href="/services/photo/price" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--w-primary)] px-5 py-3 w-label1 font-semibold text-white hover:bg-[var(--w-primary-strong)]">촬영 구성과 가격<ArrowRight size={16} /></Link>
      </div>
      <div className="grid gap-5 md:grid-cols-2">{links.map(link => <Link key={link.href} href={link.href} className="group overflow-hidden rounded-2xl border border-[var(--w-line)] bg-[var(--w-bg)] shadow-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--w-primary)]">
        <div className="relative aspect-[16/9] overflow-hidden"><Image src={link.src} alt={link.alt} fill sizes="(max-width: 767px) 100vw, 560px" className="object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none" /></div>
        <div className="flex items-center justify-between gap-4 p-5 md:p-6"><div><h3 className="w-headline1 text-[var(--w-label-strong)]">{link.title}</h3><p className="mt-1 w-body2 text-[var(--w-label-alt)]">{link.text}</p></div><ArrowRight size={20} className="shrink-0 text-[var(--w-primary)]" /></div>
      </Link>)}</div>
    </div>
  </section>;
}
