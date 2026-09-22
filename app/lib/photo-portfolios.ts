import catalog from '../../content/photo-portfolios.json';

export type PhotoType = 'food' | 'stay';
export type PortfolioImage = { src: string; width: number; height: number };
export type PhotoPortfolio = {
  type: string; id: string; name: string; description: string; cover: string; images: PortfolioImage[];
};
export const PHOTO_PORTFOLIOS: PhotoPortfolio[] = catalog;
export const PHOTO_TYPES = {
  food: { label: '음식점·요식업', title: '음식점 촬영 포트폴리오', description: '메뉴와 상차림, 매장 분위기를 담은 촬영 협력사의 작업 사례입니다.' },
  stay: { label: '시설·숙박', title: '시설·숙박 촬영 포트폴리오', description: '스테이와 펜션, 호텔의 공간과 머무는 장면을 담은 촬영 협력사의 작업 사례입니다.' },
};
export function isPhotoType(type: string): type is PhotoType { return type === 'food' || type === 'stay'; }
export function portfoliosFor(type: PhotoType) { return PHOTO_PORTFOLIOS.filter((item) => item.type === type); }
