import type { Metadata } from "next";
import { SITE } from "../lib/seo";
import { STUDIO, CHEAPEST, won } from "../lib/studio";

const PATH = "/studio";
const URL = `${SITE.base}${PATH}`;

export const metadata: Metadata = {
  // 루트 layout 의 title.template 이 " | 하랑마케팅" 을 붙이므로 여기서는 브랜드명을 넣지 않는다
  title: "동영상 GIF 변환 · 사진 세탁 프로그램 | 하랑 스튜디오",
  description:
    `현장 사진 100장을 1분 안에 정리하고, 영상은 끌어다 놓으면 움짤이 되는 윈도우 프로그램입니다. ` +
    `파일을 외부에 올리지 않고 내 컴퓨터에서 처리합니다. 사진 세탁·워터마크·비포애프터·영상 압축까지 하나로. ` +
    `무료 ${STUDIO.trialCount}장 체험 후 한 달 ${won(CHEAPEST.price)}원.`,
  keywords: [
    "동영상 gif 변환", "동영상 gif 변환 프로그램", "gif 변환 프로그램",
    "움짤 만들기", "움짤 만들기 프로그램", "영상 움짤 변환",
    "이미지 세탁", "이미지 세탁 프로그램", "사진 세탁", "사진 세탁 프로그램",
    "이미지 세척", "사진 세척", "세탁 프로그램",
    "사진 워터마크", "워터마크 넣기 프로그램", "사진 일괄 편집",
    "이미지 리사이즈", "사진 크기 조절", "사진 일괄 리사이즈",
    "영상 압축", "동영상 용량 줄이기", "동영상 사진 추출",
    "비포애프터 사진", "현장 사진 정리", "블로그 사진 정리",
    "하랑 스튜디오", "마케팅 대행사 프로그램",
  ],
  alternates: { canonical: URL },
  openGraph: {
    type: "website",
    title: "하랑 스튜디오 | 동영상 GIF 변환 · 사진 세탁 프로그램",
    description:
      `현장 사진 100장이 1분, 영상은 끌어다 놓으면 움짤. 업로드 없이 내 컴퓨터에서. 무료 ${STUDIO.trialCount}장 체험 후 한 달 ${won(CHEAPEST.price)}원.`,
    url: URL,
    images: [{ url: "/studio/og-studio.png", width: 1080, height: 1080, alt: "하랑 스튜디오" }],
  },
};

/**
 * 이 layout 은 메타데이터만 담당한다.
 * 구조화 데이터(JSON-LD)는 page.tsx 에서 선언한다.
 */
export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
