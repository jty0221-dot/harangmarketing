import type { Metadata } from 'next';
import { SITE, LOCAL_ID } from './seo';
import { FOOD_PLANS, STAY_PLANS } from './photo-pricing';
import { PHOTO_TYPES, type PhotoPortfolio, type PhotoType } from './photo-portfolios';

export const PHOTO_UPDATED = '2026-09-23';
export function photoMetadata(path: string, title: string, description: string, image: string): Metadata {
  const url = SITE.base + path;
  return {
    title, description, alternates: { canonical: url },
    openGraph: { type: 'website', locale: 'ko_KR', siteName: '하랑마케팅', title, description, url, images: [{ url: image, alt: title }] },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
}

export function portfolioSummary(portfolio: PhotoPortfolio) {
  const gifs = portfolio.images.filter((image) => image.src.endsWith('.gif')).length;
  const photos = portfolio.images.length - gifs;
  const media = gifs ? `사진 ${photos}장과 GIF ${gifs}개를` : `사진 ${photos}장을`;
  const subject = portfolio.description || `${PHOTO_TYPES[portfolio.type as PhotoType].label} 촬영`;
  return `${portfolio.name}의 ${subject} 사례입니다. ${media} 확인하고 촬영 구성과 가격을 비교할 수 있습니다.`;
}

export function photoGalleryLd(portfolio: PhotoPortfolio) {
  const url = `${SITE.base}/services/photo/${portfolio.type}/${portfolio.id}`;
  return {
    '@context': 'https://schema.org', '@type': 'ImageGallery', '@id': url + '#webpage', url,
    name: portfolio.name + ' 촬영 포트폴리오', description: portfolioSummary(portfolio),
    inLanguage: 'ko-KR', dateModified: PHOTO_UPDATED,
    mainEntity: {
      '@type': 'ItemList', numberOfItems: portfolio.images.length,
      itemListElement: portfolio.images.map((image, index) => ({
        '@type': 'ListItem', position: index + 1, item: {
          '@type': 'ImageObject', '@id': url + '#image-' + (index + 1),
          contentUrl: SITE.base + image.src, url: SITE.base + image.src,
          name: portfolio.name + ' 촬영 사진 ' + (index + 1),
          width: image.width, height: image.height,
          encodingFormat: image.src.endsWith('.gif') ? 'image/gif' : image.src.endsWith('.png') ? 'image/png' : image.src.endsWith('.webp') ? 'image/webp' : 'image/jpeg',
        },
      })),
    },
  };
}

const priceList = (plans: typeof FOOD_PLANS) => plans.map((plan) => (plan.price / 10000) + '만 원').join(', ');
export const PHOTO_FAQ = [
  { q: '음식점 메뉴 사진촬영 가격은 얼마인가요?', a: `음식점 촬영은 ${priceList(FOOD_PLANS)}의 세 가지 구성입니다. 부가세는 별도이며 제공 컷과 촬영 시간은 상품마다 다릅니다.` },
  { q: '시설과 숙박 공간 촬영 가격은 얼마인가요?', a: `시설과 숙박 촬영은 ${priceList(STAY_PLANS)}입니다. 부가세는 별도이며 모델 유무와 시설 면적에 따라 구성이 달라집니다.` },
  { q: '촬영 시간과 작업 기간은 어떻게 되나요?', a: '음식점 촬영은 기본과 표준 구성이 90분 이내, 프리미엄은 300분입니다. 작업 기간은 기본과 표준 5일, 프리미엄 7일입니다. 시설 촬영은 상품별 180분부터 300분, 작업 기간은 5일부터 9일입니다.' },
  { q: '사진 보정과 수정은 포함되나요?', a: '음식점 촬영은 보정 작업을 진행하며 시설 촬영은 A컷을 보정합니다. 수정은 각 상품에 2회 포함됩니다.' },
];

export function photoOffersLd() {
  return {
    '@context': 'https://schema.org', '@type': 'Service',
    '@id': SITE.base + '/services/photo#service', name: '매장 사진촬영',
    url: SITE.base + '/services/photo', provider: { '@id': LOCAL_ID },
    hasOfferCatalog: {
      '@type': 'OfferCatalog', name: '음식점 및 시설 촬영 구성',
      itemListElement: ([['food', FOOD_PLANS], ['stay', STAY_PLANS]] as const).flatMap(([type, plans]) => plans.map((plan) => ({
        '@type': 'Offer', name: PHOTO_TYPES[type].label + ' ' + plan.name,
        url: SITE.base + '/services/photo/price#' + type + '-' + plan.code.toLowerCase(),
        priceSpecification: { '@type': 'UnitPriceSpecification', price: plan.price, priceCurrency: 'KRW', valueAddedTaxIncluded: false },
        itemOffered: { '@type': 'Service', name: plan.name, description: [plan.description, ...plan.includes, '촬영 시간 ' + plan.time, '작업 기간 ' + plan.days, '수정 2회', ...(plan.model ? ['모델 ' + plan.model, '시설 면적 ' + plan.area] : [])].join('. ') },
      }))),
    },
  };
}
