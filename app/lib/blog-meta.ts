export interface BlogMeta {
  slug: string;
  title: string;
  excerpt: string;
  tag: string;
  date: string; // YYYY-MM-DD
}

export const BLOG_META: BlogMeta[] = [
  {
    slug: "naver-place-algorithm",
    title: "2024 네이버 플레이스 상위 노출 알고리즘 완전 분석",
    excerpt: "리뷰 수, 답글률, 사진 개수, 저장 수 — 플레이스 순위를 결정하는 7가지 요소를 실제 데이터로 분석했습니다.",
    tag: "플레이스 SEO",
    date: "2024-11-01",
  },
  {
    slug: "cafe-blog-keywords",
    title: "카페 사장님이 꼭 써야 하는 블로그 키워드 30선",
    excerpt: "지역명+카페, 분위기 카페, 데이트 카페 등 실제 검색량 높은 키워드 목록과 글쓰기 공식을 공개합니다.",
    tag: "블로그 마케팅",
    date: "2024-11-08",
  },
  {
    slug: "review-vs-experience",
    title: "체험단 vs 일반 리뷰 — 뭐가 더 효과적인가?",
    excerpt: "체험단은 빠르고 리뷰는 신뢰도가 높습니다. 업종별로 어느 방식이 더 ROI가 높은지 실제 A/B 테스트 결과를 공개합니다.",
    tag: "체험단·리뷰",
    date: "2024-11-15",
  },
  {
    slug: "instagram-reels-beauty",
    title: "인스타그램 릴스로 예약 폭발 — 미용실 성공 케이스",
    excerpt: "수원 네일샵이 릴스 3개로 2주 만에 예약을 마감한 실제 사례. 어떤 내용을, 어떻게 촬영하고, 무슨 해시태그를 달았는지 공개합니다.",
    tag: "SNS 마케팅",
    date: "2024-11-22",
  },
  {
    slug: "delivery-review-formula",
    title: "음식점 배달 매출 2배 만든 리뷰 마케팅 공식",
    excerpt: "배달앱에서 순위를 올리는 방법은 광고비가 아닙니다. 리뷰 수와 평점, 사장님 댓글이 핵심입니다. 서울 마포 음식점의 4개월 과정을 공개합니다.",
    tag: "업종별 전략",
    date: "2024-12-01",
  },
  {
    slug: "small-budget-place-top",
    title: "마케팅 예산 30만원으로 플레이스 1위 가능한가?",
    excerpt: "작은 예산으로 가장 효과적인 조합을 찾는 방법. 10년간 500개 프로젝트 데이터를 바탕으로 예산별 최적 전략을 제시합니다.",
    tag: "마케팅 비용",
    date: "2024-12-08",
  },
  {
    slug: "momcafe-viral-guide",
    title: "맘카페 바이럴 마케팅 완전 가이드 — 수강생 55% 늘린 실전 전략",
    excerpt: "맘카페는 구매 결정권을 가진 주부가 모이는 최고의 로컬 마케팅 채널입니다. 자연스럽게 입소문을 내는 방법을 공개합니다.",
    tag: "업종별 전략",
    date: "2024-12-15",
  },
  {
    slug: "naver-place-review-100",
    title: "네이버 플레이스 리뷰 100개 만들기 — 실전 로드맵",
    excerpt: "리뷰가 없으면 순위가 없고, 순위가 없으면 방문객이 없습니다. 리뷰 0개에서 3개월 만에 127개를 만든 로드맵을 공개합니다.",
    tag: "리뷰 마케팅",
    date: "2025-01-05",
  },
  {
    slug: "kakaomap-marketing-guide",
    title: "카카오맵 마케팅 완전 가이드 — 2개월 만에 Top 3 진입한 방법",
    excerpt: "네이버만 신경 쓰다가 카카오맵을 놓치는 사장님이 많습니다. 카카오맵 트렌드 랭킹 상위 진입 전략과 실전 사례를 공개합니다.",
    tag: "카카오맵",
    date: "2025-01-12",
  },
  {
    slug: "clinic-marketing-guide",
    title: "의원·한의원 마케팅 완전 가이드 · 의료법 안에서 신뢰를 쌓는 6개월 전략",
    excerpt: "병원·한의원 마케팅은 신뢰 구축이 핵심입니다. 원장님 전문성을 블로그로 쌓고, 진료 과정과 장비를 사실 그대로 알리고, 플레이스 SEO까지 이어가는 실전 로드맵을 공개합니다.",
    tag: "업종별 전략",
    date: "2025-01-19",
  },
  {
    slug: "beauty-instagram-follower",
    title: "미용실·네일 인스타그램 팔로워 0명에서 1천명 만드는 법",
    excerpt: "미용 업종은 비포애프터 한 장이 광고 예산 수백만원보다 강합니다. 어떻게 찍고, 어떻게 올리고, 팔로워를 예약으로 전환하는지 실전 전략을 공개합니다.",
    tag: "SNS 마케팅",
    date: "2025-01-26",
  },
  {
    slug: "google-maps-seo",
    title: "구글 지도 마케팅 — 외국인 관광객·MZ 고객 유입 전략",
    excerpt: "네이버만 보다가 구글 지도를 놓치면 MZ세대와 외국인 방문객을 잃습니다. 구글 비즈니스 프로필 최적화, 리뷰 전략, 사진 관리법을 공개합니다.",
    tag: "플레이스 SEO",
    date: "2025-02-02",
  },
  {
    slug: "keyword-research-local",
    title: "소상공인을 위한 로컬 키워드 발굴 완전 가이드",
    excerpt: "키워드를 잘못 고르면 글을 100개 써도 손님이 안 옵니다. 검색량은 많지만 경쟁이 낮은 틈새 키워드를 찾는 방법을 단계별로 공개합니다.",
    tag: "블로그 마케팅",
    date: "2025-02-09",
  },
  {
    slug: "review-response-templates",
    title: "사장님 답글 공식 20선 — 리뷰별 맞춤 템플릿 완전판",
    excerpt: "리뷰에 답글 달기가 귀찮은 가장 큰 이유는 뭐라고 써야 할지 모르기 때문입니다. 별점별·상황별 답글 20가지 템플릿을 공개합니다.",
    tag: "리뷰 마케팅",
    date: "2025-02-16",
  },
  {
    slug: "academy-marketing-guide",
    title: "학원 수강생 55% 늘린 마케팅 — 맘카페부터 블로그까지",
    excerpt: "학원 마케팅은 학부모를 설득하는 일입니다. 학부모가 가는 채널에 집중하면 수강생이 늘어납니다. 3개월 실전 과정을 공개합니다.",
    tag: "업종별 전략",
    date: "2025-02-23",
  },
];
