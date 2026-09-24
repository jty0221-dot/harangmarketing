export type PhotoPlan = {
  code: string; name: string; price: number; image: string; width: number; height: number;
  alt: string; description: string; includes: string[]; extra?: string;
  time: string; days: string; cuts: string; retouch: string; model?: string; area?: string;
};

// 판매가 정본 · 2026-09-22 대표 확정 · 부가세 별도.
// 화면과 JSON-LD, FAQ 의 금액은 전부 이 상수에서 파생한다 · 손으로 적지 않는다.
export const FOOD_PLANS: PhotoPlan[] = [
  { code: 'STANDARD', name: '기본', price: 300000, image: '/photo-pricing/standard.jpg', width: 1280, height: 853, alt: '만둣국과 반찬을 담은 메뉴 촬영 사진', description: '메뉴판과 플레이스에 사용할 메뉴 사진과 매장 인테리어 사진을 촬영합니다.', includes: ['메뉴 10개 촬영, 메뉴 사진 10컷', '인테리어 사진 A컷 5장'], extra: '컷 추가는 상담 때 안내드립니다', time: '90분 이내', days: '5일', cuts: '메뉴 10컷 + 인테리어 A컷 5장', retouch: '진행' },
  { code: 'DELUXE', name: '표준', price: 700000, image: '/photo-pricing/deluxe.jpg', width: 1280, height: 1358, alt: '철판 요리에서 치즈를 들어 올리는 음식 촬영 사진', description: '매장 인테리어와 플레이스 세팅을 제안하고, 채널에 활용할 사진을 촬영합니다.', includes: ['플레이스 A컷·B컷 20컷 이상 제공', '블로그 기자단 배포용 사진 촬영'], time: '90분 이내', days: '5일', cuts: '20컷 이상', retouch: '진행' },
  { code: 'PREMIUM', name: '프리미엄', price: 1100000, image: '/photo-pricing/premium.jpg', width: 1280, height: 1706, alt: '고기와 여러 반찬이 차려진 상차림 촬영 사진', description: '매장 인테리어와 플레이스 세팅을 제안하고, 업로드에 사용할 사진을 폭넓게 촬영합니다.', includes: ['플레이스 업로드용 A컷·B컷 40컷 이상 제공', '블로그 기자단 배포용 사진 촬영'], time: '300분', days: '7일', cuts: '40컷 이상', retouch: '진행' },
];
export const STAY_PLANS: PhotoPlan[] = [
  { code: 'BASIC', name: '기본', price: 700000, image: '/photo-pricing/stay-basic.jpg', width: 1280, height: 853, alt: '정원이 보이는 창가와 테이블을 담은 시설 촬영 사진', description: '모델 없이 시설과 공간 자체를 중심으로 촬영합니다.', includes: ['시설 A컷 30장, B컷 30장', 'A컷 보정 작업'], time: '180분', days: '5일', cuts: 'A컷 30장 + B컷 30장', retouch: 'A컷에 한함', model: '없음', area: '60평 이하' },
  { code: 'DELUXE', name: '표준', price: 1000000, image: '/photo-pricing/stay-deluxe.jpg', width: 1280, height: 853, alt: '모델과 함께 한옥 마당의 분위기를 담은 시설 촬영 사진', description: '모델과 함께 공간에 머무는 장면을 촬영합니다.', includes: ['시설 A컷 50장, B컷 50장', 'A컷 보정 작업'], time: '210분', days: '7일', cuts: 'A컷 50장 + B컷 50장', retouch: 'A컷에 한함', model: '있음', area: '60평 이하' },
  { code: 'PREMIUM', name: '프리미엄', price: 1200000, image: '/photo-pricing/stay-premium.jpg', width: 1280, height: 853, alt: '모델과 조명을 활용한 야외 정원 야간 촬영 사진', description: '모델과 함께 넓은 시설의 여러 공간을 촬영합니다.', includes: ['시설 A컷 60장, B컷 60장', 'A컷 보정 작업'], time: '300분', days: '9일', cuts: 'A컷 60장 + B컷 60장', retouch: 'A컷에 한함', model: '있음', area: '60평 이상' },
];
