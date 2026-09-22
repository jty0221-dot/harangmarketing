/** 공개 판매 품목. 홈·공통 메뉴·검색 데이터가 같은 목적지를 사용한다. */
export const PUBLIC_SERVICES = [
  { id: 'place', title: '네이버 플레이스 SEO', href: '/services/place', icon: 'Search', desc: '매장 정보와 키워드를 정리하고 순위 변화를 계측합니다.' },
  { id: 'blog', title: '블로그 마케팅', href: '/services#blog', icon: 'BookOpen', desc: '업종과 지역에 맞는 원고를 작성하고 블로그를 관리합니다.' },
  { id: 'cafe-distribution', title: '최적화 블로그 · 카페 배포', href: '/services/cafe-distribution', icon: 'Megaphone', desc: '블로그 기자단과 지역 카페에 맞춰 콘텐츠를 배포합니다.' },
  { id: 'review', title: '리뷰 마케팅 · 체험단', href: '/services/review', icon: 'Users', desc: '체험단 모집과 방문 확인, 리뷰 링크 회수를 관리합니다.' },
  { id: 'sns', title: '인스타그램 마케팅', href: '/services/instagram', icon: 'AtSign', desc: '피드와 릴스 콘텐츠부터 계정 운영까지 안내합니다.' },
  { id: 'photo', title: '매장 사진촬영', href: '/services/photo', icon: 'Camera', desc: '음식점 메뉴와 시설 공간을 촬영합니다. 구성별 가격과 업체별 사진을 확인하세요.' },
  { id: 'detail-page', title: '스마트스토어 상세페이지 제작', href: '/services/detail-page', icon: 'LayoutTemplate', desc: '상품의 설명 순서와 카피를 기획하고 상세 이미지를 제작합니다.' },
  { id: 'powercontents', title: '파워컨텐츠 원고 설계·검수', href: '/services#powercontents', icon: 'FileText', desc: '광고에 사용할 원고를 설계하고 검수 대응을 준비합니다.' },
  { id: 'naver-ads', title: '네이버 광고 세팅·운영대행', href: '/services#naver-ads', icon: 'BarChart3', desc: '광고 세팅과 운영을 대행합니다. 광고 집행비는 별도입니다.' },
  { id: 'kakaomap', title: '카카오맵 매장 관리', href: '/services#kakaomap', icon: 'MapPin', desc: '카카오맵의 매장 정보와 사진을 정리합니다.' },
  { id: 'startup', title: '창업 지원 · 홈페이지형 블로그', href: '/services#startup', icon: 'Palette', desc: '홈페이지형 블로그와 로고, 명함, 메뉴판 등 개업에 필요한 디자인을 안내합니다.' },
  { id: 'studio', title: '하랑 스튜디오', href: '/studio', icon: 'Camera', desc: '사진 정리와 동영상 GIF 변환을 위한 윈도우 프로그램입니다.' },
] as const;
