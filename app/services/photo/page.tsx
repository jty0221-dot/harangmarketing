import Image from "next/image";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import JsonLd from "../../components/JsonLd";
import {
  SianMain, PageHead, Section, ItemList, Steps, CostLine, CloseBand,
} from "../../components/sian/Sian";
import { webPageLd, PAGE_UPDATED, ORG_ID, LOCAL_ID, breadcrumbLd } from "../../lib/seo";
import { FOOD_SHOTS, MENU_SHOTS, SPACE_SHOTS } from "../../lib/photo-reference";

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
    title: "음식점 메뉴 촬영",
    desc: "대표 메뉴를 한 컷씩 남깁니다. 김이 오르는 순간과 단면이 보이는 각도를 같이 찍어 메뉴판과 플레이스, 블로그에 나눠 씁니다.",
  },
  {
    title: "매장 공간 촬영",
    desc: "입구와 홀, 창가 자리, 조명이 켜진 저녁 분위기를 나눠 찍습니다. 손님이 들어오기 전에 어떤 곳인지 가늠하게 만드는 컷입니다.",
  },
  {
    title: "플레이스 등록용 컷",
    desc: "네이버 플레이스가 요구하는 자리에 맞춰 외관과 내부, 메뉴, 주차 동선을 챙깁니다. 등록하고 나서 빈칸이 남지 않게 목록을 미리 맞춥니다.",
  },
];

const FLOW = [
  {
    step: "1",
    title: "사전 협의",
    desc: "어떤 메뉴와 어떤 공간을 찍을지, 컷을 어디에 쓸지 먼저 정합니다. 쓸 자리를 정하고 찍어야 가로 컷과 세로 컷을 같이 남깁니다.",
  },
  {
    step: "2",
    title: "촬영",
    desc: "영업에 지장이 없는 시간으로 잡습니다. 메뉴는 조리 직후에 찍고 공간은 낮과 저녁을 나눠 담습니다.",
  },
  {
    step: "3",
    title: "보정",
    desc: "밝기와 색온도를 맞추고 거슬리는 것을 정리하는 선까지입니다. 양이나 크기를 실물과 다르게 만들지 않습니다. 받아본 손님이 사진과 다르다고 할 여지를 남기지 않습니다.",
  },
  {
    step: "4",
    title: "플레이스와 채널 등록",
    desc: "원본을 넘겨 드리는 것으로 끝내지 않습니다. 플레이스와 블로그, 인스타그램, 상세페이지에 맞는 규격으로 잘라 자리마다 올립니다.",
  },
];

function Gallery({
  shots,
  label,
  card = "bg-gray-100",
  ratio = "aspect-[4/3]",
  cols = "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  sizes = "(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 200px",
}: {
  shots: { src: string; alt: string; w: number; h: number }[];
  label: string;
  card?: string;
  ratio?: string;
  cols?: string;
  sizes?: string;
}) {
  return (
    <ul className={`mt-4 grid ${cols} gap-3`} aria-label={label}>
      {shots.map((s) => (
        <li key={s.src} className={`overflow-hidden rounded-lg ${card}`}>
          <span className={`block relative ${ratio}`}>
            <Image
              src={s.src}
              alt={s.alt}
              width={s.w}
              height={s.h}
              sizes={sizes}
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
      <SianMain>
        <PageHead
          where="서비스 · 매장 사진촬영"
          title={<>손님은 들어오기 전에<br />사진부터 봅니다</>}
          lead="음식점 메뉴 사진과 매장 공간 사진을 찍습니다. 찍고 끝내지 않고 네이버 플레이스와 블로그, 인스타그램, 상세페이지에 맞는 규격으로 올리는 것까지 같이 합니다."
          primary={{ href: "/contact?industry=사진촬영", label: "촬영 상담 신청" }}
          link={{ href: "/services/photo/price", label: "가격표 보기" }}
          facts={[
            { label: "촬영 갈래", value: `${KINDS.length}가지` },
            { label: "연락부터 채널 등록까지", value: `${FLOW.length}단계` },
            { label: "상담", value: "0원" },
          ]}
        />

        <Section title="사진이 먼저 걸립니다">
          <div style={{ display: "grid", gap: 16 }}>
            <p>네이버 플레이스를 열면 상호보다 사진이 먼저 보입니다. 사진에서 넘어가면 글은 읽히지 않습니다.</p>
            <p>메신저로 받은 휴대폰 사진은 압축돼 흐리고, 세로라 가로 자리에 넣으면 잘립니다.</p>
            <p className="font-semibold">그래서 어디에 쓸지 먼저 정하고 찍고, 그 자리에 올리는 것까지 한 번에 합니다.</p>
          </div>
        </Section>

        <Section
          soft
          title="매장에 맞춰 보는 두 가지 버전"
          desc="메뉴가 중심인 매장과 공간 자체가 상품인 곳은 촬영 순서가 다릅니다."
          more={{ href: "/services/photo/price", label: "촬영 가격표 보기" }}
        >
          <ItemList items={[
            { title: "음식점·요식업 촬영", desc: "메뉴, 상차림, 매장 동선을 중심으로 잡아 플레이스와 블로그에 나눠 쓸 컷을 만듭니다.", href: "/services/photo/food" },
            { title: "공간·펜션 촬영", desc: "객실, 공용공간, 외부 동선을 나눠 예약 전에 머무는 장면이 그려지는 컷을 만듭니다.", href: "/services/photo/stay" },
          ]} />
        </Section>

        <Section title="촬영 갈래" desc="무엇을 찍는지에 따라 준비하는 것이 다릅니다">
          <ItemList one items={KINDS.map((k) => ({ title: k.title, desc: k.desc }))} />
        </Section>

        <JsonLd data={PHOTO_PAGE_LD} />

        {/* 촬영 예시 · 사진은 내용이라 남긴다. 카드 테두리 · 그림자만 걷었다 */}
        <Section soft title="촬영 예시" desc="촬영 협력사와 함께 작업한 컷입니다. 업체별 전체 사진은 위쪽 포트폴리오에서 보실 수 있습니다.">
          <div style={{ display: "grid", gap: 48 }}>
            <div>
              <h3 style={{ fontSize: 21, fontWeight: 800 }}>음식점 촬영 예시</h3>
              <Gallery shots={FOOD_SHOTS} label="음식점 촬영 예시" />
            </div>
            <div>
              <h3 style={{ fontSize: 21, fontWeight: 800 }}>메뉴 컷 촬영 예시</h3>
              <p style={{ marginTop: 8, color: "var(--muted)" }}>배경을 지우고 메뉴 하나만 남긴 컷입니다. 주문 화면과 메뉴판, 상세페이지에 그대로 올라갑니다.</p>
              <Gallery
                shots={MENU_SHOTS}
                label="메뉴 컷 촬영 예시"
                card="bg-white"
                ratio="aspect-square"
                cols="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 130px"
              />
            </div>
            <div>
              <h3 style={{ fontSize: 21, fontWeight: 800 }}>공간 촬영 예시</h3>
              <p style={{ marginTop: 8, color: "var(--muted)" }}>머무는 곳과 마당, 객실처럼 넓은 공간을 담은 컷입니다. 같은 자리라도 낮과 저녁을 나눠 찍습니다.</p>
              <Gallery shots={SPACE_SHOTS} label="공간 촬영 예시" />
            </div>
          </div>
        </Section>

        <Section
          title="촬영 흐름"
          desc="연락부터 채널 등록까지 네 단계로 진행합니다"
          footer={<CostLine text="가격 구성은 촬영 가격표 한 곳에만 둡니다." link={{ href: "/services/photo/price", label: "촬영 가격표 보기" }} />}
        >
          <Steps steps={FLOW.map((f) => ({ title: f.title, desc: f.desc }))} />
        </Section>

        <CloseBand
          title="촬영 상담 받기"
          text="찍을 메뉴와 공간, 쓸 자리를 먼저 듣고 일정을 잡습니다. 상담은 0원입니다. 촬영 협력사와 함께 진행합니다."
          primary={{ href: "/contact?industry=사진촬영", label: "무료 상담 신청" }}
        />
      </SianMain>
      <Footer bands={false} />
    </>
  );
}
