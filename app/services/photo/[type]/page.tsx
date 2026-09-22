import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Building2, UtensilsCrossed } from "lucide-react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import JsonLd from "../../../components/JsonLd";
import { breadcrumbLd, webPageLd } from "../../../lib/seo";

const PORTFOLIOS = {
  food: { label: "음식점·요식업", title: "메뉴가 가장 맛있어 보이는 순간을 남깁니다", description: "음식점, 카페, 주점처럼 메뉴와 상차림이 손님의 선택을 만드는 매장을 위한 촬영 구성입니다.", count: 10, prefix: "restaurant", icon: UtensilsCrossed, alt: "음식점 메뉴와 상차림 촬영 포트폴리오", checklist: ["대표 메뉴 단품과 상차림을 분리해 촬영", "메뉴판과 배달 앱에 맞는 가로·세로 컷 준비", "플레이스 대표 사진과 사진 리뷰 자리를 함께 점검"] },
  stay: { label: "공간·펜션", title: "머무는 시간을 먼저 상상하게 만드는 공간 사진", description: "펜션, 숙소, 스테이, 대관 공간처럼 객실과 공용공간의 분위기가 예약 전환에 중요한 곳을 위한 촬영 구성입니다.", count: 48, prefix: "stay", icon: Building2, alt: "펜션과 숙소 공간 촬영 포트폴리오", checklist: ["객실, 공용공간, 외부 동선을 나눠 촬영", "낮과 저녁의 빛이 다른 자리를 구분해 기록", "예약 페이지와 플레이스에서 먼저 보일 컷을 우선 선정"] },
} as const;

type PortfolioType = keyof typeof PORTFOLIOS;
function getPortfolio(type: string): PortfolioType { return type === "stay" ? "stay" : "food"; }

export function generateStaticParams() { return [{ type: "food" }, { type: "stay" }]; }

export async function generateMetadata({ params }: { params: Promise<{ type: string }> }): Promise<Metadata> {
  const { type } = await params;
  const portfolio = PORTFOLIOS[getPortfolio(type)];
  return { title: `${portfolio.label} 촬영 포트폴리오 | 하랑마케팅`, description: `${portfolio.label} 매장을 위한 사진촬영 포트폴리오입니다. 메뉴와 공간의 쓰임에 맞춰 촬영한 예시를 확인할 수 있습니다.`, alternates: { canonical: `https://www.harangmarketing.com/services/photo/${getPortfolio(type)}` } };
}

export default async function PhotoPortfolioPage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const portfolioType = getPortfolio(type);
  const portfolio = PORTFOLIOS[portfolioType];
  const Icon = portfolio.icon;
  const shots = Array.from({ length: portfolio.count }, (_, index) => index + 1);
  const path = `/services/photo/${portfolioType}`;
  return <><Header /><main className="pt-[104px] md:pt-[108px] bg-gray-50">
    <JsonLd data={webPageLd({ path, name: `${portfolio.label} 촬영 포트폴리오`, description: portfolio.description })} />
    <JsonLd data={breadcrumbLd([{ name: "홈", path: "/" }, { name: "서비스", path: "/services" }, { name: "매장 사진촬영", path: "/services/photo" }, { name: portfolio.label, path }])} />
    <section className="bg-gray-950 py-14 md:py-20"><div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8"><Link href="/services/photo" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-gray-300 hover:text-white mb-8"><ArrowLeft size={16} /> 촬영 서비스로 돌아가기</Link><div className="max-w-3xl"><div className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold text-blue-300 mb-5"><Icon size={14} /> {portfolio.label} 버전</div><h1 className="text-3xl md:text-5xl font-black leading-tight text-white mb-5">{portfolio.title}</h1><p className="max-w-2xl text-base md:text-lg leading-relaxed text-gray-300">{portfolio.description}</p></div></div></section>
    <section className="py-12 md:py-16 bg-white"><div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8"><div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8"><div><p className="text-xs font-bold tracking-[0.16em] text-blue-600 mb-3">PARTNER PORTFOLIO</p><h2 className="text-2xl md:text-3xl font-black text-gray-900">촬영 포트폴리오 {portfolio.count}장</h2><p className="text-sm text-gray-500 mt-2">촬영 협력사 사용 허가 범위에서 가져온 실제 작업 예시입니다.</p></div><Link href="/services/photo/price" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700">{portfolio.label} 가격표 보기 <ArrowRight size={16} /></Link></div><ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3" aria-label={`${portfolio.label} 촬영 포트폴리오`}>{shots.map((number) => { const src = `/photo-partner/${portfolioType}/${portfolio.prefix}-${String(number).padStart(2, "0")}.jpg`; return <li key={src} className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 shadow-sm"><Image src={src} alt={`${portfolio.alt} ${number}`} fill sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 264px" className="object-cover transition-transform duration-300 hover:scale-[1.03]" /></li>; })}</ul></div></section>
    <section className="py-12 md:py-16 bg-gray-50"><div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8"><h2 className="text-2xl font-black text-gray-900 mb-6">이 버전에서 먼저 맞추는 것</h2><div className="grid grid-cols-1 md:grid-cols-3 gap-4">{portfolio.checklist.map((item, index) => <div key={item} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"><span className="text-xs font-black text-blue-600">0{index + 1}</span><p className="mt-3 text-sm font-semibold leading-relaxed text-gray-900">{item}</p></div>)}</div></div></section>
  </main><Footer /></>;
}
