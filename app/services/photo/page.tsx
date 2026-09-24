import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Camera,
  UtensilsCrossed,
  Building2,
  MapPin,
  MessageSquare,
  Aperture,
  Wand2,
  Upload,
  ReceiptText,
} from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import JsonLd from "../../components/JsonLd";
import { webPageLd, PAGE_UPDATED, ORG_ID, LOCAL_ID, breadcrumbLd } from "../../lib/seo";
import { FOOD_SHOTS, SPACE_SHOTS } from "../../lib/photo-reference";

/* 가격 구성은 /services/photo/price 정본에만 둔다. 사진은 노출을 만드는 재료이지 순위를 보장하지 않는다. */
const PHOTO_PAGE_LD = webPageLd({
  path: "/services/photo",
  name: "매장 사진촬영 | 음식 사진 · 매장 공간 촬영",
  description:
    "음식점 메뉴 사진과 매장 공간 사진을 촬영하고 보정해 네이버 플레이스와 블로그, 인스타그램, 상세페이지에 등록합니다. 촬영 협력사와 함께 진행합니다.",
  dateModified: PAGE_UPDATED["/services/photo"],
});

const KINDS = [
  {
    icon: UtensilsCrossed,
    title: "음식점 메뉴 촬영",
    desc: "대표 메뉴를 한 컷씩 남깁니다. 김이 오르는 순간과 단면이 보이는 각도를 같이 찍어 메뉴판과 플레이스, 블로그에 나눠 씁니다.",
  },
  {
    icon: Building2,
    title: "매장 공간 촬영",
    desc: "입구와 홀, 창가 자리, 조명이 켜진 저녁 분위기를 나눠 찍습니다. 손님이 들어오기 전에 어떤 곳인지 가늠하게 만드는 컷입니다.",
  },
  {
    icon: MapPin,
    title: "플레이스 등록용 컷",
    desc: "네이버 플레이스가 요구하는 자리에 맞춰 외관과 내부, 메뉴, 주차 동선을 챙깁니다. 등록하고 나서 빈칸이 남지 않게 목록을 미리 맞춥니다.",
  },
];

const FLOW = [
  {
    icon: MessageSquare,
    step: "1",
    title: "사전 협의",
    desc: "어떤 메뉴와 어떤 공간을 찍을지, 컷을 어디에 쓸지 먼저 정합니다. 쓸 자리를 정하고 찍어야 가로 컷과 세로 컷을 같이 남깁니다.",
  },
  {
    icon: Aperture,
    step: "2",
    title: "촬영",
    desc: "영업에 지장이 없는 시간으로 잡습니다. 메뉴는 조리 직후에 찍고 공간은 낮과 저녁을 나눠 담습니다.",
  },
  {
    icon: Wand2,
    step: "3",
    title: "보정",
    desc: "밝기와 색온도를 맞추고 거슬리는 것을 정리하는 선까지입니다. 양이나 크기를 실물과 다르게 만들지 않습니다. 받아본 손님이 사진과 다르다고 할 여지를 남기지 않습니다.",
  },
  {
    icon: Upload,
    step: "4",
    title: "플레이스와 채널 등록",
    desc: "원본을 넘겨 드리는 것으로 끝내지 않습니다. 플레이스와 블로그, 인스타그램, 상세페이지에 맞는 규격으로 잘라 자리마다 올립니다.",
  },
];

function Gallery({
  shots,
  label,
}: {
  shots: { src: string; alt: string; w: number; h: number }[];
  label: string;
}) {
  return (
    <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3" aria-label={label}>
      {shots.map((s) => (
        <li key={s.src} className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 shadow-sm">
          <span className="block relative aspect-[4/3]">
            <Image
              src={s.src}
              alt={s.alt}
              width={s.w}
              height={s.h}
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 264px"
              className="h-full w-full object-cover"
            />
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function PhotoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "@id": "https://www.harangmarketing.com/services/photo#service",
            name: "매장 사진촬영",
            description:
              "음식점 메뉴 사진과 매장 공간 사진을 촬영하고 보정해 네이버 플레이스와 블로그, 인스타그램, 상세페이지에 등록합니다.",
            serviceType: "상업 사진 촬영",
            provider: { "@id": LOCAL_ID },
            brand: { "@id": ORG_ID },
            inLanguage: "ko-KR",
            offers: { "@type": "Offer", url: "https://www.harangmarketing.com/services/photo/price" },
            areaServed: "대한민국",
            url: "https://www.harangmarketing.com/services/photo",
          }),
        }}
      />
      <JsonLd
        data={breadcrumbLd([
          { name: "홈", path: "/" },
          { name: "서비스", path: "/services" },
          { name: "매장 사진촬영", path: "/services/photo" },
        ])}
      />
      <Header />
      <main className="pt-[104px] md:pt-[108px]">
        <section className="bg-gray-950 py-16 md:py-24 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
          <div className="relative max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 border border-white/10 rounded-full px-4 py-1.5 mb-6">
              <Camera size={12} className="text-blue-400" />
              <span className="text-gray-400 text-xs font-medium">매장 사진촬영</span>
            </div>
            <h1 className="text-[36px] md:text-[52px] font-black text-white leading-tight mb-5">
              손님은 들어오기 전에
              <br />
              <span className="text-blue-400">사진부터</span> 봅니다
            </h1>
            <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-8 max-w-2xl">
              음식점 메뉴 사진과 매장 공간 사진을 찍습니다. 찍고 끝내지 않고 네이버 플레이스와 블로그, 인스타그램,
              상세페이지에 맞는 규격으로 올리는 것까지 같이 합니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/contact?industry=사진촬영"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-white font-bold text-sm transition-opacity hover:opacity-90"
                style={{ background: "var(--w-primary)" }}
              >
                촬영 상담 신청 <ArrowRight size={15} />
              </Link>
              <Link
                href="/services/photo/price"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-white/15 hover:border-white/30 text-white font-medium text-sm transition-colors"
              >
                가격표 보기 <ReceiptText size={15} />
              </Link>
            </div>
          </div>
        </section>

        <section className="py-14 md:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-7"><div><h2 className="text-2xl font-black text-gray-900 mb-2">매장에 맞춰 보는 두 가지 버전</h2><p className="text-sm text-gray-500">메뉴가 중심인 매장과 공간 자체가 상품인 곳은 촬영 순서가 다릅니다.</p></div><Link href="/services/photo/price" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700">촬영 가격표 보기 <ReceiptText size={16} /></Link></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><Link href="/services/photo/food" className="group rounded-2xl border border-gray-200 bg-gray-50 p-5 md:p-6 shadow-sm hover:border-blue-300 hover:bg-blue-50"><UtensilsCrossed size={20} className="text-blue-600 mb-4" /><h3 className="text-lg font-black text-gray-900">음식점·요식업 촬영</h3><p className="mt-2 text-sm text-gray-600 leading-relaxed">메뉴, 상차림, 매장 동선을 중심으로 잡아 플레이스와 블로그에 나눠 쓸 컷을 만듭니다.</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-600">음식점 포트폴리오 보기 <ArrowRight size={15} /></span></Link><Link href="/services/photo/stay" className="group rounded-2xl border border-gray-200 bg-gray-50 p-5 md:p-6 shadow-sm hover:border-blue-300 hover:bg-blue-50"><Building2 size={20} className="text-blue-600 mb-4" /><h3 className="text-lg font-black text-gray-900">공간·펜션 촬영</h3><p className="mt-2 text-sm text-gray-600 leading-relaxed">객실, 공용공간, 외부 동선을 나눠 예약 전에 머무는 장면이 그려지는 컷을 만듭니다.</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-600">공간 포트폴리오 보기 <ArrowRight size={15} /></span></Link></div>
          </div>
        </section>

        <JsonLd data={PHOTO_PAGE_LD} />

        <section className="py-14 md:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <h2 className="text-2xl font-black text-gray-900 mb-4">사진이 먼저 걸립니다</h2>
            <div className="space-y-4 text-sm md:text-[15px] text-gray-600 leading-relaxed">
              <p>
                네이버 플레이스를 열면 상호보다 사진이 먼저 보입니다. 인스타그램도, 상세페이지도 순서가
                같습니다. 글을 아무리 잘 써 두어도 목록에서 넘어가 버리면 읽히지 않습니다.
              </p>
              <p>
                그런데 현장에서 받는 사진은 대부분 휴대폰으로 찍어 메신저로 넘긴 것입니다. 압축을 거치면서 화질이
                떨어지고, 세로로만 찍혀 있어 가로 자리에 넣으면 위아래가 잘립니다. 좋은 재료가 없으면 어느 채널에
                올려도 같은 자리에서 막힙니다.
              </p>
              <p className="font-semibold text-gray-900">
                그래서 찍는 일을 채널 운영과 따로 두지 않았습니다. 어디에 쓸지 정하고 찍고, 찍은 컷을 그 자리에
                올리는 것까지 한 번에 진행합니다.
              </p>
            </div>
          </div>
        </section>

        <section className="py-14 md:py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
            <h2 className="text-2xl font-black text-gray-900 mb-2">촬영 갈래</h2>
            <p className="text-gray-500 text-sm mb-6">무엇을 찍는지에 따라 준비하는 것이 다릅니다</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {KINDS.map((k) => (
                <div key={k.title} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 md:p-6">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm mb-3"
                    style={{ background: "var(--w-primary)" }}
                  >
                    <k.icon size={16} className="text-white" strokeWidth={2.5} />
                  </div>
                  <div className="font-black text-gray-900 text-base mb-1.5">{k.title}</div>
                  <p className="text-[13px] text-gray-500 leading-relaxed">{k.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14 md:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
            <h2 className="text-2xl font-black text-gray-900 mb-2">음식점 촬영 예시</h2>
            <p className="text-gray-500 text-sm mb-6">
              촬영 협력사와 함께 작업한 컷입니다. 상호 노출 동의를 받은 범위가 사진까지라 업체명은 적지 않습니다.
            </p>
            <Gallery shots={FOOD_SHOTS} label="음식점 촬영 예시" />
          </div>
        </section>

        <section className="py-14 md:py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
            <h2 className="text-2xl font-black text-gray-900 mb-2">공간 촬영 예시</h2>
            <p className="text-gray-500 text-sm mb-6">
              머무는 곳과 마당, 객실처럼 넓은 공간을 담은 컷입니다. 같은 자리라도 낮과 저녁을 나눠 찍습니다.
            </p>
            <Gallery shots={SPACE_SHOTS} label="공간 촬영 예시" />
          </div>
        </section>

        <section className="py-14 md:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
            <h2 className="text-2xl font-black text-gray-900 mb-2">촬영 흐름</h2>
            <p className="text-gray-500 text-sm mb-6">연락부터 채널 등록까지 네 단계로 진행합니다</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {FLOW.map((f) => (
                <div key={f.step} className="bg-gray-50 rounded-2xl border border-gray-100 p-4 md:p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                      style={{ background: "var(--w-primary)" }}
                    >
                      <f.icon size={16} className="text-white" strokeWidth={2.5} />
                    </div>
                    <span className="text-xs font-bold text-gray-400">{f.step}단계</span>
                  </div>
                  <div className="font-black text-gray-900 text-sm mb-1.5">{f.title}</div>
                  <p className="text-[13px] text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14 bg-gray-950">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <p className="text-gray-500 text-xs mb-5">촬영 협력사와 함께 진행합니다</p>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-3">촬영 상담 받기</h2>
            <p className="text-gray-400 text-sm mb-7">
              찍을 메뉴와 공간, 쓸 자리를 먼저 듣고 일정을 잡습니다. 상담은 0원입니다.
            </p>
            <Link
              href="/contact?industry=사진촬영"
              className="inline-flex items-center gap-2 text-white font-bold px-7 py-3.5 rounded-xl transition-opacity hover:opacity-90 text-sm"
              style={{ background: "var(--w-primary)" }}
            >
              무료 상담 신청 <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
