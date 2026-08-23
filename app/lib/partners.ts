/**
 * 함께한 브랜드 — 홈페이지 로고 슬라이더의 유일한 출처.
 *
 * 로고는 명함 뒷면 두 장에서 나왔다.
 *   · 하랑 명함 뒷면        → `scripts/partners/build_logos.py`
 *   · 청설모 명함 뒷면(주요 거래처) → `scripts/partners/build_logos_cheongsulmo.py`
 *     대표가 청설모 CMO 를 맡고 하랑이 청설모 마케팅을 함께 보고 있어 같이 싣는다.
 *
 * 업체를 추가하려면
 *   1) 로고 파일을 `public/partners/` 에 넣는다. PNG 투명 배경, 384x144 권장.
 *      명함·인쇄물에서 잘라내야 한다면 위 스크립트가 배경을 알파로 빼고
 *      크기까지 맞춰준다.
 *   2) 아래 배열에 한 줄 추가한다. 순서가 곧 화면 순서다.
 *
 * 빼려면 그 줄만 지우면 된다. 컴포넌트는 손대지 않는다.
 */
export type Partner = {
  /** 관리용 이름. 화면에는 안 보이고 이미지 alt 로 들어간다 */
  name: string;
  /** public/partners/ 안의 파일명 */
  file: string;
  /** 있으면 로고에 링크가 걸린다 */
  url?: string;
};

// 큰 마크와 동네 업체가 한쪽에 몰리지 않게 섞어 뒀다.
// 컴포넌트가 홀·짝으로 갈라 두 줄에 담으므로 이 순서가 그대로 화면 순서가 된다.
export const PARTNERS: Partner[] = [
  { name: "한화호텔&리조트", file: "hanwha-hotels-resorts.png" },
  { name: "대한민국 해병대", file: "rok-marine-corps.png" },
  { name: "한국수자원공사 K-water", file: "k-water.png" },
  { name: "샤브올데이", file: "shabu-all-day.png" },
  { name: "포항공과대학교 POSTECH", file: "postech.png" },
  { name: "명륜진사갈비", file: "myeongryun-jinsa.png" },
  { name: "KFC", file: "kfc.png" },
  { name: "대한민국 해군", file: "rok-navy.png" },
  { name: "투썸플레이스", file: "twosome-place.png" },
  { name: "메르세데스-벤츠", file: "mercedes-benz.png" },
  { name: "컴포즈커피", file: "compose-coffee.png" },
  { name: "모텍스", file: "motex.png" },
  { name: "한국지질자원연구원 KIGAM", file: "kigam.png" },
  { name: "바른약속치과의원", file: "bareun-dental.png" },
  { name: "파스쿠찌", file: "pascucci.png" },
  { name: "서울특별시 소방재난본부", file: "seoul-fire-hq.png" },
  { name: "종로엠스쿨", file: "jongro-m-school.png" },
  { name: "소방", file: "sobang.png" },
  { name: "쿠우쿠우", file: "kuu-kuu.png" },
  { name: "베리굿 웨딩컴퍼니", file: "verygood-wedding.png" },
  { name: "밴스의원", file: "vands-clinic.png" },
  { name: "클린패스", file: "cleanpass.png" },
  { name: "연우디자인스튜디오", file: "yeonwoo-design.png" },
  { name: "타이백스트리트", file: "thai-back-street.png" },
  { name: "모앤닷", file: "mo-and-dot.png" },
  { name: "열정클린", file: "yeoljeong-clean.png" },
  { name: "스킨뮤즈", file: "skinmuse.png" },
  { name: "에이봄클리닉", file: "abom-clinic.png" },
  { name: "미소가득치과", file: "misogadeuk-dental.png" },
  { name: "DS ENGLISH", file: "ds-english.png" },
  { name: "청설모 토탈케어", file: "cheongseolmo.png" },
  { name: "서원가설재", file: "sw-seowon.png" },
];

/** 로고 원본 크기. 전부 같아서 CSS 는 높이만 잡으면 된다 */
export const PARTNER_LOGO = { w: 384, h: 144 } as const;
