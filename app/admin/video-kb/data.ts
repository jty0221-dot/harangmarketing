// 영상 지식고 데이터 — 챌린존(갓찌뇽의 초보여도 괜찮아) 채널 전수 판독 산출
// 정본은 E:\하랑\본부장\영상\챌린존_전수판독.md · 프롬프트_라이브러리.md — 이 파일은 열람용 사본. 어긋나면 md 가 이긴다.
// 채널 콘텐츠는 학습·내부 참고용. 원문 재게시 금지 (D-0064). 프롬프트는 채널 원문이 아니라 하랑 재구성 표준 블록.

export type KbCategory =
  | "생성모델"
  | "에이전트자동화"
  | "편집"
  | "디자인"
  | "합성연출"
  | "운영수익화";

export type KbVideo = {
  no: number; // 채널 최신순 행번호 (0 = 최신)
  videoId: string;
  title: string;
  category: KbCategory | "판독불가";
  gist: string; // 요지 한 줄 (판독불가면 빈 문자열)
};

export type KbTechnique = {
  id: string; // T-001
  category: KbCategory;
  title: string;
  what: string; // 무엇을 어떻게
  why: string; // 창작자가 밝힌 이유 — (인용)=자막 직접 언급 · (추론)=맥락 도출
  how?: string[]; // 재현 절차
  tools: string[];
  sources: number[]; // KbVideo.no
  harang: string; // 하랑 공정(루나 기획 → 찌뇽이 프롬프트 → 연진 생성·검수) 적용 자리
  promptId?: string; // 연결 프롬프트 id
};

export type KbPrompt = {
  id: string; // P-001
  title: string;
  use: string; // 언제 쓰나
  model: string; // 대상 모델·도구
  text: string; // 복붙용 영어 블록 (하랑 재구성 · [대괄호]는 슬롯 — 채우지 않고 생성 금지)
  sources: number[];
};

export type KbTool = {
  name: string;
  role: string;
  pricing: string; // 자막 기준 요금. 언급 없으면 빈 문자열
  verdict: string; // 하랑 기준 한 줄 판정
};

export const KB_META = {
  channel: "갓찌뇽의 초보여도 괜찮아 (@challenzon)",
  harvested: "2026-08-26",
  total: 100,
  read: 93,
  noCaption: 7,
};

export const KB_VIDEOS: KbVideo[] = [
  { no: 0, videoId: "0vwcc_dkm0E", category: "생성모델", title: "AI 애니메이션 영상 제작, 비싼 툴 필요 없습니다 (DomoAI)", gist: "DomoAI 올인원 애니메이션 공정 (이미지 → 영상 → TTS → 립싱크 → 4K) · 고정 스타일 블록(T-002)의 출처" },
  { no: 1, videoId: "0T141EWrHhQ", category: "에이전트자동화", title: "Topview AI x 시댄스 2.5 이렇게 강력했어?!", gist: "Topview Film Studio 에이전트 — 마이크로신 하나로 기획서 → 신 카드 → 스토리보드 → 30초 이상 장편까지" },
  { no: 2, videoId: "cHXRb_z5Bt4", category: "에이전트자동화", title: "AI로 진짜 팔리는 광고영상 만들어 봤습니다 (Flova AI)", gist: "제품·타겟·브랜드톤을 프로젝트 문서로 저장하고 전 공정을 스킬로 굳혀 다음 제품에 재현하는 영상 에이전트" },
  { no: 3, videoId: "4gNBuTk7Fk8", category: "생성모델", title: "시댄스 2.5로 어떤 영상을 만들면 좋을까? (1080 비교)", gist: "동일 캐릭터 시트로 장면전환·액션·롱테이크·Extend 연작 4종 테스트 · 720/1080 차이 실측" },
  { no: 4, videoId: "obaoHmriaks", category: "생성모델", title: "프롬프트보다 중요합니다. AI 영상 레퍼런스 잘쓰는 법", gist: "레퍼런스 최대 50개(이미지 30·영상 10·오디오 10)를 캐릭터·클레이·모션·크리에이티브 4유형으로 나눠 쓰는 법" },
  { no: 5, videoId: "mtSIEe9Qeng", category: "생성모델", title: "촬영x편집 없이 한번에 만든 AI 광고영상 (Newtake) — 티저", gist: "33초 결과물 티저 — 자막 한 줄뿐 · 본편: '차원이 다른 AI 광고 제작수준'" },
  { no: 6, videoId: "c992Og-57hM", category: "에이전트자동화", title: "차원이 다른 AI 광고 제작수준 (Newtake AI)", gist: "노드 캔버스 한 화면 공정 — 아이디어 → 스크립트 → 자산 자동 분리 → 멀티샷 시트 → 샷 11개 일괄 생성 → 타임라인" },
  { no: 7, videoId: "2L6ILTZhPTg", category: "생성모델", title: "시댄스 2.5 뭐가 달라졌을까? (2.0과 비교)", gist: "2.5 변경점(최대 30초·레퍼런스 50개)을 한국어 대사 드라마로 실측 · 대사 컷 순서(T-006)의 출처" },
  { no: 8, videoId: "1JWUGE99b5g", category: "에이전트자동화", title: "쇼핑쇼츠, 클로드 x Topview MCP 하나로", gist: "Claude에 Topview MCP를 붙여 제품 링크 하나로 시장조사 → 기획 → UGC 쇼츠 생성까지 잇는 공정" },
  { no: 9, videoId: "qvblH3oRbwQ", category: "생성모델", title: "AI 모델 일관성 (Higgsfield Soul 2.0)", gist: "사진 수십 장으로 캐릭터를 1회 학습해 계속 재사용하는 인물 고정 시스템" },
  { no: 10, videoId: "qBEeaQH_TRk", category: "판독불가", title: "AI가 팀원이 된다?! (젠스파크 6.0 에이전트)", gist: "" },
  { no: 11, videoId: "qni1Ap4zsJY", category: "에이전트자동화", title: "프롬프트 한줄로 Vox 스타일 모션 영상 (Claude Code + Higgsfield)", gist: "Vox 스타일 지식영상(질문 훅·내레이션·모션그래픽)을 Claude Code 스킬 하나로 대본 → 컷 → 생성 자동화" },
  { no: 12, videoId: "LCCZFN3v8Pw", category: "에이전트자동화", title: "상위 10%만 쓰는 클로드 AI 광고 세팅법 (Higgsfield MCP)", gist: "성패는 실물 다각도 원본 촬영 — 시트·배경 사전 생성과 짧은 컷 분할로 잇는 광고 공정" },
  { no: 13, videoId: "aclvD4MJ0pg", category: "편집", title: "클로드x힉스필드x에펙 영상편집 — 티저", gist: "23초 티저 · 본편: '영상편집 자동화 (클로드x힉스필드x애프터이펙트)'" },
  { no: 14, videoId: "NIB-_Z2ahM4", category: "편집", title: "영상편집 자동화 (클로드x힉스필드x애프터이펙트)", gist: "Claude가 AE 익스프레션으로 반응형 자막을 짜고 힉스필드 AE 플러그인으로 편집 중 생성까지" },
  { no: 15, videoId: "xvqfHlVI8qY", category: "에이전트자동화", title: "콘텐츠 제작은 젠스파크 (Genspark)", gist: "슈퍼 에이전트로 시장조사 → 기획, 슬라이드·이미지·비디오를 스킬 저장으로 재사용하는 업무 플랫폼" },
  { no: 16, videoId: "gucNzxW_52w", category: "합성연출", title: "구글 Omni 활용법 — 티저", gist: "22초 티저 — 드라마 타이틀·상세 모션·CG 연출 예고뿐 · 본편 공개 시 재판독" },
  { no: 17, videoId: "afk9Mu39-2o", category: "에이전트자동화", title: "클로드 Fable5 x 힉스필드 쇼츠 자동화앱 (App Builder)", gist: "App Builder에서 Fable 5로 쇼핑쇼츠 자동 생성 앱을 바이브 코딩 · 크레딧 게이트 설계(T-013)의 출처" },
  { no: 18, videoId: "lnGsgfZSetw", category: "에이전트자동화", title: "Fable5 제품광고 자동화 — 티저", gist: "19초 티저 · 본편: 'Fable5 제품광고 자동화 방법편'" },
  { no: 19, videoId: "6UpO58sr_HA", category: "에이전트자동화", title: "Fable5 제품광고 자동화 방법편 (스킬 + MCP)", gist: "광고 스튜디오 아티팩트(신별 스토리보드 + 한/영 프롬프트)를 스킬로 저장해 재사용 · MCP로 클로드 안에서 생성까지" },
  { no: 20, videoId: "_pJM7HvUcZo", category: "생성모델", title: "구글 Flow 무료 영상 AI 모델 전부 비교", gist: "무료 Flow에서 Veo 3.1 3등급 비교 · 프롬프트 자동화로 유료 크레딧 실패율을 줄이는 연습 공정" },
  { no: 21, videoId: "eBbjRz7g8cQ", category: "판독불가", title: "구글 Omni로 드라마 타이틀 만드는 법", gist: "" },
  { no: 22, videoId: "p5lbLf-cmcc", category: "편집", title: "일러스트 0, 애펙 0. 구글 Omni — 티저", gist: "감탄사뿐인 티저 — 기술 내용 없음 · 본편: 'Omni + 나노바나나2 Lite로 편집 판도 교체'" },
  { no: 23, videoId: "Q0qZLnNp6qY", category: "합성연출", title: "Omni 실무 — 타이틀·상세 모션·배경 교체 (Omni Flash x NB2 Lite)", gist: "NB2 Lite 장면컷 + Omni Flash로 드라마 타이틀 모션·상세 모션 오버레이·인물 배경 교체 실무 3종" },
  { no: 24, videoId: "l0Ree6-QvI8", category: "에이전트자동화", title: "클로드 Fable 5 vs Opus 4.8 (힉스필드 MCP)", gist: "두 모델을 MCP로 물려 광고 이미지·일관성·원큐 3종 벤치마크 — Fable 5는 질문 없이 완성하는 디렉터형" },
  { no: 25, videoId: "Tar3yAlYWrg", category: "편집", title: "Omni + NB2 Lite 조합 — 티저", gist: "옴니를 '영상의 포토샵'으로 규정하는 티저 · 본편: 'Omni + 나노바나나2 Lite로 편집 판도 교체'" },
  { no: 26, videoId: "1GKrXbdPjMs", category: "편집", title: "Omni + 나노바나나2 Lite로 편집 판도 교체", gist: "NB2 Lite(장당 약 4초) 소스 + Omni Flash로 모션 그래픽·한글 말자막·인물 치환까지 후반 공정 대체" },
  { no: 27, videoId: "NFgEAg2j6Fs", category: "판독불가", title: "시댄스 2.0 vs Kling 3.0 차이", gist: "" },
  { no: 28, videoId: "ACTEmWSVF3M", category: "생성모델", title: "AI 영화 몇분만에 (MagicLight) — 티저", gist: "스토리만 넣으면 단편 영화가 나온다는 티저 · 본편: '대본·캐릭터·영화 자동완성 (MagicLight)'" },
  { no: 29, videoId: "vgxjXjHxP9g", category: "판독불가", title: "낙서가 영화캐릭터로 변하는 과정", gist: "" },
  { no: 30, videoId: "UDKUZD8J8mI", category: "생성모델", title: "Seedance 2.0 4K 실무 5종 데모", gist: "3D 애니·실사 전환·게임 시네마틱·감정 연기·제품 광고 5종 데모 · 슬로우모션 % 지정(T-009)의 출처" },
  { no: 31, videoId: "PyLw7z2OXPA", category: "생성모델", title: "1080 vs 4K 실측 A/B (Seedance 2.0)", gist: "같은 프롬프트로 5개 시나리오 A/B — 시안 1080·납품과 확대 편집은 4K라는 운영 기준 도출" },
  { no: 32, videoId: "4GCe2toYbwc", category: "디자인", title: "포토샵 x 힉스필드 패키지 디자인 — 티저", gist: "스케치 → 3D 실사 예고 티저 · 본편: '포토샵 AI 플러그인'" },
  { no: 33, videoId: "2taPvWZ787k", category: "디자인", title: "포토샵 AI 플러그인 (Higgsfield Photoshop Plugin)", gist: "포토샵 안에서 스케치 → 3D 패키지, Shot 다각도 제품컷, 생성 후 정밀 후편집까지 한 화면 공정" },
  { no: 34, videoId: "eoswf3OCyuo", category: "생성모델", title: "대본·캐릭터·영화 자동완성 (MagicLight)", gist: "기획서 한 장 → 대본 → 캐스팅 → 장면 → 영상 → 업로드 원플랫폼 · 기획서 6항목·계단식 모델(T-004)의 출처" },
  { no: 35, videoId: "AoF0JMX6SWE", category: "생성모델", title: "AI로 이런 영상 어떻게 — 티저 (기술 내용 없음)", gist: "자막이 음악·감탄사뿐인 티저 — 추출 가능한 기술 내용 없음" },
  { no: 36, videoId: "pJE85sJWi-s", category: "에이전트자동화", title: "클로드 x 힉스필드 상세페이지 — 티저", gist: "채팅 안에서 상세 디자인 + 영상 + GIF까지 한 번에 만든다는 티저 (쇼츠 상위 조회 4,197)" },
  { no: 37, videoId: "Se1OfFzyyB0", category: "생성모델", title: "Pippit Seedance 2.0 AI 드라마", gist: "스토리 한 줄 → 장면 흐름·캐릭터 자동 생성한 사내연애 반전 AI드라마 (구간 최다 조회 19,852)" },
  { no: 38, videoId: "c2sk5VOab2s", category: "에이전트자동화", title: "AI 직원채용 — 상세+광고+콘텐츠 에이전트 수익화", gist: "AI 직원 4명(분석 → 카피+디자인 → 영상 → 대본)으로 자동화하고 사람은 컨펌만 하는 구조" },
  { no: 39, videoId: "s_Xe1YZ7HbM", category: "편집", title: "프리미어 AI 편집 (Higgsfield Adobe Plugin) — 티저", gist: "배경 합성·의상 변경·롱폼 → 쇼폼 예고 티저 · 본편: '프리미어 + 힉스필드 Adobe Plugins 본편'" },
  { no: 40, videoId: "YsTiJqWL-y8", category: "편집", title: "프리미어 + 힉스필드 Adobe Plugins 본편", gist: "ZXP 플러그인을 Premiere에 설치 — 편집 타임라인 안에서 배경·의상 교체, 개체 삭제, 업스케일·리프레임" },
  { no: 41, videoId: "RQ1V3SY0qEY", category: "판독불가", title: "요즘 잘되는 광고영상 잘만드는 법", gist: "" },
  { no: 42, videoId: "ext9w2dL3b8", category: "에이전트자동화", title: "클로드+힉스필드 상세페이지 제작방식", gist: "Higgsfield MCP를 Claude Desktop 커넥터로 연결 — 채팅 안에서 상세 디자인 → 수정 → 영상 → GIF까지" },
  { no: 43, videoId: "_mTWkEii2aI", category: "에이전트자동화", title: "클로드와 오팔이 만나면 — 쇼츠", gist: "클로드 기획서 프롬프트 + 제품 이미지 2장을 Opal 노드 1개에 넣어 광고 시안을 뽑는 최소 구성" },
  { no: 44, videoId: "kX3PbyPiONQ", category: "디자인", title: "40분 피그마 디자인 자동화 풀강의", gist: "무료 피그마 카드뉴스(1080x1350) 템플릿 + 구글시트 연동 자동 주입 · 시트 연동 대량 제작(T-031)의 출처" },
  { no: 45, videoId: "rXslRwZ4JXY", category: "에이전트자동화", title: "클로드 x 오팔 제품광고 자동화 — 쇼츠", gist: "클로드 스킬 기획 → 오팔 시안 다발 → 선택 시안만 영상화하는 3층 공정 축약판" },
  { no: 46, videoId: "zCxUyclc_So", category: "에이전트자동화", title: "클로드 x 오팔 영상 제작 (5부 구조)", gist: "오팔 노드 1개 영상 에이전트에 씬별 기획(훅 → 문제 → 해결 → 증거 → CTA)을 물리는 공정 · 5부 구조(T-015)의 출처" },
  { no: 47, videoId: "OI9_LDCGDwI", category: "디자인", title: "클로드 디자인 써봤더니 — 쇼츠", gist: "Claude Design 출시 티저 · 본편: '클로드 디자인 실무 활용법'" },
  { no: 48, videoId: "Hdl73fUn-n8", category: "디자인", title: "클로드 디자인 실무 활용법", gist: "설문식 기획 → A/B/C 시안 → 내보내기까지 실무 흐름 검증 (조회 26,301)" },
  { no: 49, videoId: "KT-Nhi8lzKo", category: "에이전트자동화", title: "코워크+스킬 피그마 자동화 (07시 무인 라인)", gist: "Claude 코워크 스케줄 + 스킬 + Figma MCP로 매일 07:00 카드뉴스를 피그마에 자동 생성하는 무인 라인" },
  { no: 50, videoId: "AszA6-A1Z_o", category: "에이전트자동화", title: "오팔 에이전트 자동생성 마스터", gist: "먼저 묻는 인터랙티브 대화·모델 자동 연결 두 축으로 원노드 앱과 프롬프트 한 줄 앱 설계" },
  { no: 51, videoId: "mLUSJSo1fJU", category: "에이전트자동화", title: "카드뉴스 자동화 사이트 (구글 AI 스튜디오 Build)", gist: "AI 스튜디오 Build로 카드뉴스 생성 사이트를 만들어 배포까지 — 평시엔 무료 오팔 유지가 창작자 결론" },
  { no: 52, videoId: "YRtOHkwipWk", category: "디자인", title: "어도비 AI 패키지 디자인 (Firefly)", gist: "Firefly 무드보드 → 리터치 → 벡터화 → 목업 합성 — 상업적으로 안전한 패키지·캐릭터 공정" },
  { no: 53, videoId: "Cb5wtzva-qc", category: "에이전트자동화", title: "오팔 상세페이지 자동화 (전문가 분업 노드)", gist: "기획·촬영·디자인 전문가 분업 노드 앱 + 레퍼런스 고정 템플릿 앱 — 분업(T-017)·티어링(T-018)·템플릿화(T-019)의 출처" },
  { no: 54, videoId: "P8bpE2d1QR4", category: "디자인", title: "어도비 캐릭터·굿즈 — 쇼츠", gist: "'어도비 AI 패키지 디자인'의 캐릭터·굿즈 파트 축약 쇼츠" },
  { no: 55, videoId: "OZI0l3OOrSE", category: "에이전트자동화", title: "오팔 영상 에이전트 (템플릿 공유)", gist: "캐릭터만 갈아끼우는 인터뷰 영상 템플릿 에이전트 — 시안 게이트 노드 포함 (조회 12,988)" },
  { no: 56, videoId: "UBTYweeUM7I", category: "디자인", title: "어도비 패키지 — 쇼츠", gist: "'어도비 AI 패키지 디자인'의 패키지 파트 축약 쇼츠" },
  { no: 57, videoId: "sIhXmm8IQC0", category: "판독불가", title: "AI로 영화제작? Kling 구글과 비교", gist: "" },
  { no: 58, videoId: "h7RjaHW3PLc", category: "운영수익화", title: "상세+광고+콘텐츠 자동화 (펀딩 Q&A)", gist: "무료 툴 기반 자동화의 설계 사상과 수익화 구조 — '광고 없이 팔리는 구조 먼저, 광고는 확장 도구'" },
  { no: 59, videoId: "vKBigONgMwE", category: "에이전트자동화", title: "오팔 마스터 응용 (앱 5종)", gist: "노드 3개(클라이언트·전문가·결과물)로 앱 5종을 완성 — 저가 연습 → 확정 후 상위 모델 (조회 25,378)" },
  { no: 60, videoId: "EbbXhmh9yCg", category: "에이전트자동화", title: "AI 디자인 자동화 — 홍보 스킷", gist: "목표·정보만 넣으면 시장 조사 → 카피 → 이미지·영상 → 상세 → 광고까지 자동 제작한다는 46초 홍보 스킷" },
  { no: 61, videoId: "89BnOJdKwsg", category: "생성모델", title: "나노바나나 vs GPT 이미지 완벽 비교", gist: "GPT 이미지 3기능(한글·템플릿·구역 선택) 실전 검증과 Nano Banana 강약점 비교 — 한글 컷은 GPT/Gemini Pro" },
  { no: 62, videoId: "N4JX52yoA80", category: "편집", title: "제미나이 마크업 수정 — 쇼츠", gist: "이미지 업로드 후 클릭 → 그림판처럼 부위에 그리고 프롬프트 입력하는 부위 지정 수정" },
  { no: 63, videoId: "tx6b11zElF8", category: "에이전트자동화", title: "제미나이 Gems x 오팔 연동 (기획봇 공유)", gist: "같은 구글 계정이면 Opal 앱이 Gems에 나타나 실행 — Gem 작성 공식으로 기획봇까지 (조회 34,249)" },
  { no: 64, videoId: "vxUJv0rE_ac", category: "편집", title: "GPT 어도비 커넥터 (포토샵·Express·PDF)", gist: "ChatGPT에 Photoshop·Express·Acrobat 커넥터를 붙여 채팅 안에서 보정·디자인 수정·PDF 편집까지" },
  { no: 65, videoId: "PGBwnnrs2p0", category: "에이전트자동화", title: "오팔 천만뷰 숏폼 (앱 5종 오픈소스)", gist: "Opal 노드 설계 원칙과 실전 앱 5종(식단·숏폼·제품 이미지·영상 병렬·카드뉴스) 오픈소스 공개 (조회 18,692)" },
  { no: 66, videoId: "u4QZf7PB5C4", category: "에이전트자동화", title: "오팔 기초 완전판 (노드 프롬프트 제공)", gist: "3대 노드 개념부터 기획서·이미지·영상·더빙·종합 숏폼 앱까지 무료 베타 시연 (채널 최다 조회 46,396)" },
  { no: 67, videoId: "jKvIKqpzWmU", category: "생성모델", title: "믹스보드 8가지 꿀기능 — 쇼츠", gist: "한 프롬프트 다장 생성 → 말로 수정 → 변주 → 합성 → 확장 → 업로드 변형 → 공유 → 고해상도 다운로드" },
  { no: 68, videoId: "hC1xwZyUhm4", category: "합성연출", title: "믹스보드 제품이미지 (기획 에이전트 선행)", gist: "GPT 기획 에이전트 + Mixboard로 상세 컷 기획 → 생성 → 합성 — 제품 미사용 AI 상세는 창작자도 비추" },
  { no: 69, videoId: "yFUeqMxpNX0", category: "디자인", title: "GPT → Figma/Canva 이관 경로", gist: "GPT 디자인을 Figma·Canva로 넘겨 편집하는 경로와 무료·유료 경계 정리" },
  { no: 70, videoId: "QxJ-b4SICOs", category: "디자인", title: "캔바 AI 에이전트 총정리", gist: "Canva AI 전 기능 실전 총정리 — '상세페이지는 기획 먼저' 결론 (조회 11,790)" },
  { no: 71, videoId: "vEl56p50Xo0", category: "합성연출", title: "나노바나나 상세 제품이미지 9가지", gist: "촬영 없이 제품컷 9종(누끼 → 디테일 → 사용 → 세트 → 합성 → 개체 변경 → 업스케일 → 텍스트) · 배경 3요소(T-037)·4컷 공정(T-038)의 출처" },
  { no: 72, videoId: "G7HSJ6LWWn8", category: "디자인", title: "컬러 → 디자인 매칭 — 쇼츠", gist: "조건 몇 개 입력으로 AI가 컬러 추천 → 목적별 디자인 매칭 → 패키지 적용·인쇄 실물 컬러 확인까지" },
  { no: 73, videoId: "iIU5DVWkwq8", category: "편집", title: "피그마 모션 GIF (Lottie 무료 우회)", gist: "피그마 상세 프레임에 모션을 입히고 유료 GIF 출력을 Lottie 경유로 무료 우회" },
  { no: 74, videoId: "SIFnM4nwCK4", category: "합성연출", title: "나노바나나 정체 (제품 합성) — 쇼츠", gist: "Nano Banana(Gemini 2.5 Flash Image) 제품 합성 — 합성용 프롬프트를 AI에게 먼저 만들게 한 뒤 입력" },
  { no: 75, videoId: "PYsob765hck", category: "디자인", title: "피그마 Make — 쇼츠", gist: "Make 버튼 + 프롬프트 한 줄로 클릭 화면 전환까지 되는 디자인 생성" },
  { no: 76, videoId: "fh2uvy23Hp8", category: "디자인", title: "피그마 상세페이지 30분 강의", gist: "피그마 기초부터 상세 제작·AI 기능·대량 제작·내보내기·협업까지 30분 강의 (조회 13,694)" },
  { no: 77, videoId: "8Ekpgxvf7ok", category: "디자인", title: "피그마 Make 사용법·응용", gist: "Make로 캐러셀·랜딩 제작 — 하루 3개 무료 · 한글 안 깨짐이 국내 상세 초안 도구로서의 채택 근거" },
  { no: 78, videoId: "1RfcItdx9Z0", category: "합성연출", title: "포토샵 제품연출컷 (프롬프트 생성기) — 쇼츠", gist: "AI 프롬프트 생성 봇이 뽑은 문구를 포토샵 '배경 생성'에 붙여넣는 제품 배경 완성 공정" },
  { no: 79, videoId: "odCFdkAk_tQ", category: "합성연출", title: "Topview 제품합성 — 쇼츠", gist: "브러시로 교체 부위 지정 → 의상 합성 → '이미지에서 동영상' 프롬프트로 모델 워킹 광고 영상까지" },
  { no: 80, videoId: "jajc92GvX5g", category: "합성연출", title: "Topview 합성+더빙+광고영상 본편", gist: "제품 사진 한 장·상세 링크만으로 모델 합성컷과 말하는 광고·쇼츠 영상까지 Topview 한 곳에서" },
  { no: 81, videoId: "YFl33MVh6gQ", category: "생성모델", title: "AI 모델컷 3가지 방법 (Firefly + GPT봇)", gist: "Firefly 모델컷 3단계(공식 프롬프트 → GPT 위임 → 레퍼런스) · 모델컷 5요소 공식(T-040)의 출처" },
  { no: 82, videoId: "6w0xBv4tAWo", category: "편집", title: "Firefly 유튜브 자동번역 더빙", gist: "Firefly 비디오 번역 — 업로드 한 번에 외국어 번역과 입모양 동기화 더빙까지" },
  { no: 83, videoId: "7s42Iy1UMdo", category: "합성연출", title: "포토샵 배경생성 제품연출컷 (GPT봇)", gist: "포토샵 배경 제거+생성에 자작 GPT봇 프롬프트를 붙여 무촬영 제품 연출컷을 만들고 보정으로 마감" },
  { no: 84, videoId: "l2iIwlg0f6U", category: "디자인", title: "컬러디자인 — 티저", gist: "컬러 5원칙 목차만 낭독하는 예고 쇼츠 · 본편: '실패 없는 컬러 5법칙'" },
  { no: 85, videoId: "96db1MRLTWM", category: "디자인", title: "실패 없는 컬러 5법칙", gist: "무채색 베이스 · 60/30/10 3색 · 톤인톤 · 톤온톤 · 대비(보색·명도·채도) — 배색 5법칙(T-032)의 출처" },
  { no: 86, videoId: "XTUboYUPmDI", category: "에이전트자동화", title: "브이캣 AI 홍보영상 (URL 한 줄)", gist: "상세페이지 링크만 넣으면 기획·이미지 선별·카피·영상 제작까지 자동, 스타일별 4안 동시 출력" },
  { no: 87, videoId: "K_itm2e31SQ", category: "생성모델", title: "상세 카피는 클로드 (GPT 2단 조합)", gist: "상세 카피는 GPT 초안을 Claude에 넣어 문장만 다시 쓰게 하는 2단 조합으로 친근한 톤" },
  { no: 88, videoId: "Iml1IMi2KTU", category: "편집", title: "AI 물체 지우기 무료 3종", gist: "포토샵 없이 사진 속 개체를 지우는 무료 웹툴 3종 실측 비교" },
  { no: 89, videoId: "gOKyXicygUY", category: "에이전트자동화", title: "GPT + Vrew 무촬영 영상", gist: "GPT 스토리 → Vrew '텍스트로 비디오 만들기'로 더빙·삽화·자막까지 자동 생성되는 무촬영 공정" },
  { no: 90, videoId: "nfyh7gpYhPQ", category: "디자인", title: "진짜 팔리는 상세페이지 (3단 피드백)", gist: "기획 코멘트/디자인 팁/촬영 팁 3단 피드백 — AI 기획보다 벤치마킹·소비자 입장 설계가 먼저" },
  { no: 91, videoId: "n-pAtGS8Egg", category: "편집", title: "캡컷 무료 고급기능 총정리", gist: "키프레임·마스크·복합클립·브랜드 키트·긴영상 쇼츠 자동 변환과 단점 3가지 (조회 27,263)" },
  { no: 92, videoId: "zmvvz0b_CVY", category: "편집", title: "캡컷 영상편집 종결판", gist: "초기 세팅(브랜드 키트·프로젝트 분리)부터 컷편집 단축키·자막·보정·4K 내보내기까지 (채널 조회 2위 29,725)" },
  { no: 93, videoId: "HosNJUd-FgI", category: "운영수익화", title: "수익화 과정 (자사 강의 패키징) — 쇼츠", gist: "자사 강의 '수익화 디자인' 홍보 — 기획·카피·생성·외주 수주·템플릿·챌린지·피드백을 원스톱으로 묶어 판매" },
  { no: 94, videoId: "1EehH4WED3Q", category: "판독불가", title: "피그마 텍스트디자인 이렇게", gist: "" },
  { no: 95, videoId: "V21s6F1c_hY", category: "디자인", title: "피그마 꿀기능 Q&A (오토레이아웃·마스크)", gist: "구독자 Q&A 2건 — 오토 레이아웃으로 텍스트 배경, 마스크로 도형 안 이미지 자유 배치" },
  { no: 96, videoId: "CCXcs8typYI", category: "디자인", title: "피그마 UI3 리뷰", gist: "UI3 개편(도구 패널 하단 이동)과 저작권 이슈로 보류된 AI 기능 5종 예고 리뷰" },
  { no: 97, videoId: "w53nw7Ief_I", category: "편집", title: "1분 상세페이지 GIF (피그마 → 캡컷)", gist: "피그마 시안을 캡컷에 상세페이지 규격 그대로 가져가 모션을 입히고 1분 만에 GIF 출력" },
  { no: 98, videoId: "k5w_4171aGM", category: "편집", title: "AI 자동 영상편집 4종 비교", gist: "컷편집·자막·오디오 싱크·잡음 제거 4공정을 프리미어·다빈치·캡컷·Vrew로 비교 — 강점만 골라 쓰기" },
  { no: 99, videoId: "mHDfL47ZM34", category: "편집", title: "릴스 잡음제거 — 티저", gist: "잡음 제거 전후 청감 비교만 보여주는 24초 티저 · 본편: 'AI 자동 영상편집 4종 비교'" },
];

export const KB_TECHNIQUES: KbTechnique[] = [
  // 생성모델 (12)
  {
    id: "T-001",
    category: "생성모델",
    title: "캐릭터 시트 고정",
    what: "정면·측면·45도·클로즈업·전신 시트를 먼저 만들어 전 컷에 참조로 쓴다",
    why: "컷마다 따로 생성하면 얼굴이 계속 바뀐다 (인용)",
    how: [
      "실물 다각도 원본 확보 — 여기가 출발점 (C-41)",
      "시트 1장 생성 — 정면·측면·45도·클로즈업·전신 (Seedream 5.0 Pro · 시트 3크레딧)",
      "소재대장에 등록해 전 컷과 후속 건에 재사용",
    ],
    tools: ["Seedream 5.0 Pro", "Nano Banana Pro", "Higgsfield Soul 2.0"],
    sources: [3, 6, 8, 12, 17, 34],
    harang: "연진 AI 실사화 공정의 1단계 — 시트 없는 인물·제품 컷은 반려. 한 번 만든 시트는 소재대장에 등록",
    promptId: "P-002",
  },
  {
    id: "T-002",
    category: "생성모델",
    title: "고정 스타일 블록",
    what: "모든 프롬프트 끝에 같은 그림체·톤 문구를 붙인다",
    why: "컷마다 그림체가 달라지면 한 작품으로 안 보인다 (인용)",
    tools: ["이미지·영상 모델 공통"],
    sources: [0],
    harang: "찌뇽이 컷프롬프트 시트의 말미 공통 블록 — 프로젝트당 한 벌을 확정하고 전 컷에 동일 적용",
    promptId: "P-001",
  },
  {
    id: "T-003",
    category: "생성모델",
    title: "이미지 확정 후 영상 변환",
    what: "이미지 단계에서 고르고 확정본만 영상화한다",
    why: "영상은 느리고 크레딧이 크며, 바로 생성하면 원치 않는 글자·형태가 나온다 (인용)",
    tools: ["Nano Banana (이미지)", "Seedance (영상)"],
    sources: [19, 26, 53, 55],
    harang: "예린 게이트 '이미지 확정 전 영상 금지'와 동일 — 연진 집행의 반려 기준",
  },
  {
    id: "T-004",
    category: "생성모델",
    title: "계단식 모델 전략",
    what: "저가 모델로 전체를 만들고 아쉬운 컷만 상위 모델로 재생성 교체한다",
    why: "고성능으로 전편을 만드는 것보다 합리적 (인용)",
    tools: ["Kling 3.0 (저가)", "Seedance 2.0/2.5 (상위)"],
    sources: [34, 59, 0, 31],
    harang: "AI소재 파이프라인 크레딧 규칙과 동일 — 연습·시안은 Kling 720p, 납품은 Seedance 4K",
  },
  {
    id: "T-005",
    category: "생성모델",
    title: "신 분할",
    what: "한 프롬프트에 전부 담지 않고 짧은 컷으로 나눠 연결한다",
    why: "한 프롬프트에 다 담으면 영상이 애매해진다 (인용)",
    tools: ["Seedance", "Kling"],
    sources: [19, 12, 6],
    harang: "루나 구성안의 마이크로신 단위(2~3초)와 동일 — 한 씬 = 한 생성",
  },
  {
    id: "T-006",
    category: "생성모델",
    title: "대사 컷 순서",
    what: "화자 → 시선 대상 → 행동 → 대사 순으로 명시한다",
    why: "다인물 대화에서 모델이 화자를 추정하지 못한다 (추론)",
    tools: ["Seedance 2.5"],
    sources: [7],
    harang: "찌뇽이 대사 컷 표준 — 한국어 대사 원문은 따옴표로 그대로 싣는다",
    promptId: "P-003",
  },
  {
    id: "T-007",
    category: "생성모델",
    title: "연작 배제 명시",
    what: "Extend 시 앞 영상의 요소가 관성으로 유지되므로 뺄 것은 '없이'로 명문화한다",
    why: "프롬프트에 없는 요소까지 앞 영상에서 이어진다 (인용)",
    tools: ["Seedance 2.5 Extend"],
    sources: [3],
    harang: "찌뇽이 Extend 블록 표준 — REMOVE·CARRY OVER 목록 분리",
    promptId: "P-009",
  },
  {
    id: "T-008",
    category: "생성모델",
    title: "레퍼런스 4유형",
    what: "캐릭터(누가)·클레이 프리비즈(어디·카메라)·모션(어떻게)·크리에이티브(무드)로 역할을 나눠 지정한다",
    why: "만드는 사람에서 감독하는 사람으로 (인용)",
    how: [
      "컷마다 고정할 것을 4유형 표에서 고른다 (루나 레퍼런스 지정표)",
      "레퍼런스가 말하게 두고 프롬프트는 짧게 쓴다 (찌뇽이)",
      "생성당 레퍼런스 최대 50개 — 이미지 30·영상 10·오디오 10 (Seedance 2.5)",
    ],
    tools: ["Seedance 2.5 (힉스필드)"],
    sources: [4],
    harang: "기획구성_정본 제2장이 정본 — 레퍼런스 지정표는 루나 소유",
  },
  {
    id: "T-009",
    category: "생성모델",
    title: "슬로우모션 % 지정",
    what: "프롬프트에 '슬로우 모션 300%' 식 수치를 명시한다",
    why: "탄산·질감의 청량감은 느리게 봐야 산다 (인용)",
    tools: ["Seedance 2.0/2.5"],
    sources: [30],
    harang: "시즐 컷(음식·음료) 표준 슬롯 — 촬영가이드_음식과 접합",
    promptId: "P-008",
  },
  {
    id: "T-010",
    category: "생성모델",
    title: "해상도 이원화",
    what: "시안은 1080, 납품과 확대 편집은 4K로 만든다",
    why: "물방울 궤적·모공이 1080에서 뭉개지고 크롭 내성이 다르다 (인용)",
    tools: ["Seedance 2.0 (4K)"],
    sources: [31, 3, 40],
    harang: "연진 검수 기준 — 시안 1080 · 최종 4K (6초 기준 54 대 132크레딧)",
  },
  {
    id: "T-011",
    category: "생성모델",
    title: "인물 학습 사진 규격",
    what: "20장 이상·다각도·선명한 얼굴로 학습하고 중복·단체·필터·선글라스는 뺀다",
    why: "학습 노이즈 제거 (추론)",
    tools: ["Higgsfield Soul 2.0"],
    sources: [9],
    harang: "전속 모델 고정이 필요한 업체 건 — 규격은 촬영가이드에 반영",
  },
  {
    id: "T-012",
    category: "생성모델",
    title: "모션 레퍼런스 운용",
    what: "원본 영상 길이만큼 생성하고 프롬프트는 짧게 쓴다",
    why: "텍스트로 재설명하면 레퍼런스가 죽고, 짧게 생성하면 앞부분만 옮겨진다 (인용)",
    tools: ["Seedance 2.5"],
    sources: [4],
    harang: "손 동작(플레이팅·시술)·카메라 워크 이식용 — 8초 모션에 5초 생성 금지",
  },
  // 에이전트자동화 (11)
  {
    id: "T-013",
    category: "에이전트자동화",
    title: "크레딧 게이트 설계",
    what: "생성 소모 지점을 전부 사용자 확인 버튼 뒤로 보낸다",
    why: "AI 임의 생성이 크레딧을 태운다 (추론) · '크레딧을 아끼려면 미리보기부터' (인용)",
    tools: ["App Builder", "Google Opal", "Claude 스킬"],
    sources: [17, 1, 8, 11],
    harang: "하랑 자동화 도구 공통 삽입문 — 테스트 단계는 목데이터만, 실생성은 버튼 뒤",
    promptId: "P-012",
  },
  {
    id: "T-014",
    category: "에이전트자동화",
    title: "공정의 스킬화",
    what: "검증된 공정을 스킬 파일로 저장해 재사용·공유한다",
    why: "같은 프롬프트도 매번 결과가 달라지는 문제를 저장으로 해결 (인용)",
    tools: ["Claude 스킬", "Genspark", "Flova AI"],
    sources: [2, 11, 15, 19, 20, 49],
    harang: "찌뇽이 프롬프트 패키지·컷프롬프트 시트의 존재 이유 — 검증되면 스킬로 승격",
  },
  {
    id: "T-015",
    category: "에이전트자동화",
    title: "에이전트 프롬프트 5부 구조",
    what: "역할 → 흐름 → 인터랙티브 옵션 → 출력 지침 → 오차 방지 순으로 설계한다",
    why: "결과물 퀄리티가 훨씬 안정적 (인용)",
    tools: ["Google Opal", "Gemini Gems", "Claude 스킬"],
    sources: [46, 63],
    harang: "하랑 자동화 봇 설계 표준 골격",
    promptId: "P-010",
  },
  {
    id: "T-016",
    category: "에이전트자동화",
    title: "노드 역할 쪼개기",
    what: "한 노드에 여러 역할을 주지 않고, 에러가 나면 연결선부터 점검한다",
    why: "에러가 나도 어디서 터졌는지 못 찾는다 (인용)",
    tools: ["Google Opal"],
    sources: [65, 53],
    harang: "오팔형 자동화의 디버깅 수칙",
  },
  {
    id: "T-017",
    category: "에이전트자동화",
    title: "전문가 분업 노드",
    what: "기획 → 촬영 → 디자인 → 출력을 사람 공정처럼 나눈다",
    why: "디자이너가 한 번에 모든 작업을 하지 않는 실제 공정의 모사 (인용)",
    tools: ["Google Opal"],
    sources: [53],
    harang: "하랑 인격 분업(예린 → 찌뇽이 → 연진)과 동형 — 외부 실증",
  },
  {
    id: "T-018",
    category: "에이전트자동화",
    title: "모델 티어링",
    what: "텍스트·중간 컷은 경량 모델, 한글 들어가는 최종 컷만 Pro 모델을 쓴다",
    why: "고급 모델을 두 번 쓸 필요가 없다 (인용)",
    tools: ["NB2 Lite (경량)", "NB Pro / GPT Image (한글 최종)"],
    sources: [53, 61],
    harang: "한글 컷 깨짐 방지 규칙(P-007)과 한 쌍 — 크레딧 세이프의 모델 축",
    promptId: "P-007",
  },
  {
    id: "T-019",
    category: "에이전트자동화",
    title: "레퍼런스 템플릿화",
    what: "스타일값을 레퍼런스로 고정하고 내용(캐릭터·카피)만 교체한다",
    why: "이 방식으로 설계해야 템플릿 자동화가 된다 (인용)",
    tools: ["이미지·영상 공통", "Google Opal"],
    sources: [53, 55, 50],
    harang: "확정 시안의 템플릿 승격 — 예린 _템플릿 규칙과 접합",
    promptId: "P-011",
  },
  {
    id: "T-020",
    category: "에이전트자동화",
    title: "링크 기반 시장조사",
    what: "리뷰·트렌드 링크에서 불만을 추출하되 실제 리뷰인지 검증한다",
    why: "환각 카피 방지 (추론)",
    tools: ["Claude + MCP", "Topview AI"],
    sources: [8, 90],
    harang: "루나 시장조사 절차 — 인용할 리뷰가 실재하는지 확인, 환각 카피는 내보내지 않는다",
  },
  {
    id: "T-021",
    category: "에이전트자동화",
    title: "A/B 시안 다발",
    what: "시안을 여러 개 받아 고른 것만 영상화·완성한다",
    why: "영상 크레딧을 확정 시안에만 쓴다 (추론)",
    tools: ["Claude Design", "Google Opal", "VCAT"],
    sources: [45, 50, 48],
    harang: "연진 검수 앞단의 표준 — 시안 게이트와 한 몸",
  },
  {
    id: "T-022",
    category: "에이전트자동화",
    title: "무료 샌드박스 연습",
    what: "Flow 일 50크레딧·오팔 무료 구간에서 연습한 뒤 유료 모델로 옮긴다",
    why: "비싼 모델 다용보다 기획·자동화 시스템이 먼저 (인용)",
    tools: ["Google Flow (Veo 3.1)", "Google Opal"],
    sources: [20, 66, 63],
    harang: "신규 모델·신규 포맷 검증은 크레딧 0원 구간에서 끝낸다",
  },
  {
    id: "T-023",
    category: "에이전트자동화",
    title: "MCP 권한 점검",
    what: "커넥터 도구가 '항상 허용/승인 필요' 어느 쪽인지 먼저 확인한다",
    why: "연동 실패의 최다 원인이 권한 설정 (추론)",
    tools: ["Claude + Higgsfield MCP"],
    sources: [24, 42, 19],
    harang: "연진 MCP 세팅 점검 1순위 — 파이프라인 협업 세팅표에 반영",
  },
  // 편집 (7)
  {
    id: "T-024",
    category: "편집",
    title: "유지·교체 분리 지시",
    what: "유지(목소리·얼굴·멘트)와 교체(배경·의상)를 나눠 기술한다",
    why: "모호하면 인물까지 변형된다 (추론)",
    tools: ["Gemini Omni Flash", "Nano Banana (편집형)", "Premiere 플러그인"],
    sources: [40, 23, 26],
    harang: "부분 수정 표준 — KEEP·CHANGE 목록 분리",
    promptId: "P-006",
  },
  {
    id: "T-025",
    category: "편집",
    title: "실촬영 + 모션 오버레이",
    what: "실촬영본에 모션 효과만 AI로 얹는다",
    why: "AI 100% 생성이 아니라 AI 표기·정책 부담이 준다 (인용)",
    tools: ["Gemini Omni Flash"],
    sources: [23],
    harang: "C-41 실물 출발과 정합 — 상세·광고 GIF의 기본 경로",
  },
  {
    id: "T-026",
    category: "편집",
    title: "캡컷 모션 어휘",
    what: "키프레임 보간 · 마스크 와이프 · 복합 클립 일괄 모션을 조합한다",
    why: "컷 편집 후 한 덩어리로 모션을 줘야 할 때가 있다 (인용)",
    tools: ["CapCut"],
    sources: [91],
    harang: "캡컷 드래프트 생성기 스펙 JSON의 표준 모션 어휘로 등재",
  },
  {
    id: "T-027",
    category: "편집",
    title: "브랜드 키트 운용",
    what: "클라이언트별 폰트·컬러·로고·음악을 저장하고 외주에는 초대 링크로 공유한다",
    why: "릴스 양산 규격화·협업 (추론)",
    tools: ["CapCut"],
    sources: [91, 92],
    harang: "업체별 릴스 양산 규격 — 신규·외주 편집 온보딩 교본",
  },
  {
    id: "T-028",
    category: "편집",
    title: "받아쓰기 컷편집",
    what: "자동 받아쓰기로 무발화 구간을 일괄 삭제하고 잡음 제거를 조합한다",
    why: "편집 시간이 확 준다 (인용) · 무발화 연출 컷은 따로 촬영",
    tools: ["CapCut", "DaVinci Resolve", "Vrew", "Premiere"],
    sources: [98],
    harang: "사장님 인터뷰·현장 영상 편집 SOP — 받아쓰기 컷 + 다빈치 잡음 제거",
  },
  {
    id: "T-029",
    category: "편집",
    title: "규격 일치 GIF",
    what: "피그마 프레임 크기를 캡컷 해상도에 그대로 입력해 모션 GIF를 출력한다",
    why: "실폭과 어긋나면 업로드 리사이즈로 화질이 깨진다 (추론)",
    tools: ["Figma", "CapCut", "Lottie"],
    sources: [97, 73],
    harang: "상세페이지 인트로 움짤 표준 공정 — 연진 제작 · 연경 게시",
  },
  {
    id: "T-030",
    category: "편집",
    title: "반응형 자막 익스프레션",
    what: "텍스트 길이에 자동으로 맞는 자막 박스를 AE 코드로 만든다",
    why: "자막마다 박스 수작업 제거 (추론)",
    tools: ["After Effects", "Claude"],
    sources: [14],
    harang: "자막 템플릿 자동화 — 캡컷 공정의 상위 호환 후보",
  },
  // 디자인 (6)
  {
    id: "T-031",
    category: "디자인",
    title: "시트 연동 대량 제작",
    what: "레이어명을 변수화(#메인카피 등)하고 구글시트로 50~100장을 일괄 생성한다",
    why: "원고만 시트에 쌓으면 디자인이 따라온다 (추론)",
    tools: ["Figma", "Google Sheets"],
    sources: [44, 76],
    harang: "카드뉴스 양산 라인의 뼈대 — 루나가 시트에 카피를 채우면 피그마가 그린다",
  },
  {
    id: "T-032",
    category: "디자인",
    title: "배색 5법칙",
    what: "무채색 베이스 · 60/30/10 3색 · 톤인톤 · 톤온톤 · 저채도 배경+고채도 포인트",
    why: "색이 많으면 어지럽고, 톤이 안 맞으면 어색하다 (인용)",
    tools: ["공통 (검수 기준)"],
    sources: [85],
    harang: "시안 반려를 감으로 하지 않고 이 다섯으로 말한다 — 기획구성_정본 6-3",
  },
  {
    id: "T-033",
    category: "디자인",
    title: "스타일·변수 선지정",
    what: "텍스트 스타일·컬러 변수를 먼저 등록하고 작업한다",
    why: "반복 산출물의 수정 비용을 변수 하나로 축소 (추론)",
    tools: ["Figma"],
    sources: [44, 76],
    harang: "업체별 브랜드 컬러 교체를 베리어블 하나로 처리",
  },
  {
    id: "T-034",
    category: "디자인",
    title: "설문식 사전 기획",
    what: "주제·타겟·장수·톤·컬러를 먼저 답하게 하고 A/B/C안을 받는다",
    why: "요구를 앞에 고정할수록 재생성이 준다 (추론)",
    tools: ["Claude Design"],
    sources: [48],
    harang: "예린 [슬롯] 규칙과 같은 결 — 확정 안 된 값은 묻는다",
  },
  {
    id: "T-035",
    category: "디자인",
    title: "3단 피드백 포맷",
    what: "섹션마다 기획 코멘트/디자인 팁/촬영 팁으로 나누고 촬영 지시엔 AI 예시컷을 붙인다",
    why: "글과 사진 예시가 같이 가야 촬영이 빨리 끝난다 (인용)",
    tools: ["공통 (문서 포맷)"],
    sources: [90],
    harang: "사장님께 나가는 수정·촬영 요청 표준 — 발송은 C급 결재",
  },
  {
    id: "T-036",
    category: "디자인",
    title: "상업 안전 벡터 공정",
    what: "Firefly 무드보드 → 벡터화 → 무지 목업 합성 → 발주 도면 순으로 만든다",
    why: "상업 사용 가능 AI라 저작권 중요 작업에 안정적 (인용)",
    how: [
      "Firefly 무드보드 생성",
      "포토샵 리터치",
      "일러스트레이터 벡터화",
      "무지 목업 합성 → 발주 도면",
    ],
    tools: ["Adobe Firefly", "Photoshop", "Illustrator"],
    sources: [52, 54, 56],
    harang: "저작권 민감 건(패키지·굿즈)의 우회로",
  },
  // 합성연출 (6)
  {
    id: "T-037",
    category: "합성연출",
    title: "배경 프롬프트 3요소",
    what: "공간 정보 · 오브젝트 구성 · 조명 표현 셋을 다 채운다",
    why: "요소별 역할이 달라 셋을 다 채워야 한다 (인용)",
    tools: ["Nano Banana"],
    sources: [71],
    harang: "제품 합성용 배경 생성 표준",
    promptId: "P-004",
  },
  {
    id: "T-038",
    category: "합성연출",
    title: "4컷 공정",
    what: "누끼 → 디테일 → 사용 → 세트 순서로 만들고, 누끼가 이후 합성의 기초가 된다",
    why: "이 시각 흐름이 상세페이지 구조와 고객 심리를 연결 (인용)",
    how: [
      "누끼(흰 배경) 컷 확보",
      "디테일 클로즈업 컷",
      "사용 장면 컷",
      "세트·연출 컷 — 누끼를 기초로 합성",
    ],
    tools: ["Nano Banana"],
    sources: [71],
    harang: "상세페이지 컷 구성의 기본 골격 — 연경 상세 구조와 접합",
  },
  {
    id: "T-039",
    category: "합성연출",
    title: "개체 변경 라인업 확장",
    what: "같은 구도·감성에서 제품만 교체해 라인업 5~6컷을 만든다",
    why: "촬영 한 번으로 라인업 전체를 채운다 (인용)",
    tools: ["Nano Banana"],
    sources: [71],
    harang: "라인업 상품 상세 — 실물 원본 출발 유지 (C-41)",
  },
  {
    id: "T-040",
    category: "합성연출",
    title: "모델컷 5요소 공식",
    what: "배경+톤+제품 컬러+행동+인물 순으로 조립하고 구성/스타일 참조 2슬롯을 분리한다",
    why: "흰 배경은 크로마키 관행과 같고 누끼도 쉽다 (인용)",
    tools: ["Nano Banana Pro", "Seedream", "Adobe Firefly"],
    sources: [81],
    harang: "착용·사용 장면 표준 — 비포·애프터 짝은 뷰티 상세컷 레시피",
    promptId: "P-005",
  },
  {
    id: "T-041",
    category: "합성연출",
    title: "브러시 부위 지정 합성",
    what: "바꿀 부위만 칠해 제품·의상을 교체한 뒤 영상화한다",
    why: "마스크를 좁힐수록 원본 보존 (추론)",
    tools: ["Topview AI"],
    sources: [79, 80],
    harang: "의류·잡화 착용컷 경로 — '사진이랑 다르네' 판정 선행 (C-41)",
  },
  {
    id: "T-042",
    category: "합성연출",
    title: "배경 생성 후보정 체인",
    what: "Camera Raw 보정 → 배경만 아웃포커스 → 선명화 순으로 마감한다",
    why: "생성 배경과 실물의 선명도 차를 심도로 봉합 (추론)",
    tools: ["Photoshop"],
    sources: [83],
    harang: "AI 실사화 공정의 마감 순서로 이식",
  },
  // 운영수익화 (3)
  {
    id: "T-043",
    category: "운영수익화",
    title: "인트로 움짤 훅",
    what: "소비자가 이미 품은 질문을 첫 화면에서 짚고 효과 입증 모션으로 정지시킨다",
    why: "모션이 설명을 줄이고 이해 속도를 올린다 (인용)",
    tools: ["Figma", "CapCut"],
    sources: [58, 97],
    harang: "상세페이지·웹 문서 첫 화면 표준 — 정지 이미지보다 GIF",
  },
  {
    id: "T-044",
    category: "운영수익화",
    title: "실사 오인 금지",
    what: "실물 사진 기반 생성 · 직접 써 보고 제작 · 레퍼런스 동반",
    why: "실사로 오인되면 신뢰도 하락 (인용)",
    tools: ["공통 (원칙)"],
    sources: [58, 68, 12],
    harang: "C-41의 외부 실증 — 원본을 못 대는 AI 컷은 내보내지 않는다",
  },
  {
    id: "T-045",
    category: "운영수익화",
    title: "공정 패키징 판매",
    what: "강의+템플릿+챌린지+피드백 묶음으로, 결과물이 아니라 공정을 판다",
    why: "한번 구매하면 꾸준히 케어받는 구조 (인용)",
    tools: ["공통 (상품 설계)"],
    sources: [93, 58, 38],
    harang: "하랑 교육·컨설팅 상품 패키징 참고 — 무료 콘텐츠로 모객, 공정을 상품화",
  },
];

export const KB_PROMPTS: KbPrompt[] = [
  {
    id: "P-001",
    title: "고정 스타일 블록 (모든 프롬프트 말미 공통)",
    use: "여러 컷을 나눠 생성해도 그림체·톤이 한 작품으로 유지되게 한다",
    model: "이미지·영상 공통 — 프롬프트 끝에 항상 같은 문구",
    sources: [0],
    text: `--- STYLE BLOCK (append to every prompt in this project, verbatim) ---
Art style: [스타일명 · 예: soft 3D animation, Pixar-like]. Color mood: [주조색 2~3개].
Lighting: [조명 기조 · 예: warm golden hour]. Camera: [렌즈감 · 예: 35mm, shallow depth of field].
Rendering: consistent character proportions and materials across all cuts of this project.
Do not change the art style, palette, or character design between cuts.`,
  },
  {
    id: "P-002",
    title: "캐릭터 시트 생성",
    use: "주인공(인물·캐릭터·제품 의인화)의 기준 시트를 만들어 전 컷에 참조로 쓴다",
    model: "Seedream 5.0 Pro (시트 3크레딧) 또는 NB Pro",
    sources: [3, 6, 8, 12, 17],
    text: `Create a character reference sheet of [캐릭터 한 줄 정의] on a plain neutral background.
One sheet, five views, same character in all views:
1) front view, full body  2) side profile  3) 45-degree view
4) close-up of the face  5) full body in a natural pose.
Keep identical face, hairstyle, outfit, colors, and proportions in every view.
No text, no logos, no watermark, no extra characters.
[P-001 STYLE BLOCK]`,
  },
  {
    id: "P-003",
    title: "대사 컷 (화자·시선·행동·대사)",
    use: "2인 이상 등장 컷에서 누가 말하는지 모델이 헷갈리지 않게 한다",
    model: "Seedance 2.5 (대사 지원 영상 생성)",
    sources: [7],
    text: `Scene: [장소·상황 한 줄].
Characters: [A 캐릭터 — 시트 참조], [B 캐릭터 — 시트 참조].
Speaker: [A]. [A] looks at [B], [행동 · 예: leans forward and smiles], and says:
"[대사 원문 — 한국어 그대로]"
[B] listens and [반응 행동]. Only [A] speaks in this cut.
Camera: [샷 사이즈 · 예: medium two-shot]. Duration: [6]s.
[P-001 STYLE BLOCK]`,
  },
  {
    id: "P-004",
    title: "배경 생성 3요소 (공간·오브젝트·조명)",
    use: "제품 합성용 배경을 만들 때 셋 중 하나라도 비면 어색해지는 것을 막는다",
    model: "NB2 / NB Pro (이미지)",
    sources: [71],
    text: `Create a background scene for product photography. No product in this image yet.
Space: [공간 정의 · 예: a minimal concrete studio shelf, eye-level].
Objects: [소품 구성 · 예: two small ceramic props on the left, dried flowers right].
Lighting: [조명 · 예: soft window light from the left, gentle shadows, no harsh highlights].
Leave clear empty space at [제품 놓일 위치 · 예: center-right] for a product to be composited.
Photorealistic, [비율 · 예: 4:5], high detail.`,
  },
  {
    id: "P-005",
    title: "모델컷 5요소 공식 (+ 참조 2슬롯 분리)",
    use: "착용·사용 장면의 모델컷을 공식대로 조립한다 — 구성(포즈·구도)과 스타일(무드) 참조를 다른 슬롯에 넣는다",
    model: "NB Pro · Seedream (이미지) — 참조 이미지 2장 첨부",
    sources: [81],
    text: `[Reference image 1 = composition reference: follow its pose and framing only]
[Reference image 2 = style reference: follow its mood, tone, and lighting only]
A [인물 정의 · 예: Korean woman in her 20s] [행동 · 예: holding the attached product
at chest level and looking at it] against [배경 · 예: a plain white studio background].
Overall tone: [톤 · 예: clean and bright]. Product color must stay exactly as the attached
product photo: [제품 컬러]. Do not alter the product's shape, label, or logo.
[비율], photorealistic.`,
  },
  {
    id: "P-006",
    title: "유지·교체 분리 지시 (부분 편집)",
    use: "배경·의상만 바꾸고 인물·제품·음성은 지킬 때 — 유지 목록과 교체 목록을 분리해 기술한다",
    model: "Omni Flash · NB (편집형)",
    sources: [40, 23, 26],
    text: `Edit the attached [image/video].
KEEP unchanged: the person's face and identity, body proportions, [voice and speech if video],
the product and its label, [유지 항목 추가].
CHANGE only: [교체 항목 · 예: replace the background with a sunlit cafe interior].
Blend lighting and shadows of the kept subject to match the new background naturally.
Do not add any new objects, text, or people.`,
  },
  {
    id: "P-007",
    title: "한글 텍스트 깨짐 방지 규칙",
    use: "카드뉴스·상세 컷에 한글이 들어갈 때 자소 깨짐을 줄인다",
    model: "이미지 모델 공통 — 한글 최종 컷은 Pro급 모델 (T-018)",
    sources: [19, 53],
    text: `The image contains Korean text. Render this exact string, character-for-character:
"[한글 문구 원문]"
Rules: keep every Korean character (Hangul) exactly as written — do not invent, translate,
or decorate letters. Use a clean sans-serif style, high contrast against the background.
If any character cannot be rendered accurately, leave that text area empty instead.
Text placement: [위치 · 예: top third, centered]. No other text anywhere in the image.`,
  },
  {
    id: "P-008",
    title: "슬로우모션 % 지정",
    use: "탄산·질감·낙하 등 시즐 컷의 속도감을 수치로 고정한다",
    model: "Seedance 2.0/2.5 (영상)",
    sources: [30],
    text: `[씬 정의 · 예: Close-up of sparkling liquid being poured over ice in a glass].
Slow motion at [300]% (playback [1/3]x of real speed), emphasizing [강조 질감 · 예:
rising bubbles and splash droplets]. Static camera, macro lens feel.
Duration [6]s, [해상도 · 초안 720p / 납품 4K].
[P-001 STYLE BLOCK]`,
  },
  {
    id: "P-009",
    title: "연작(Extend) 배제 명시",
    use: "Extend로 이어 만들 때 앞 컷의 요소가 관성으로 따라오는 것을 차단한다",
    model: "Seedance 2.5 Extend",
    sources: [3],
    text: `Extend the previous video. In this continuation:
REMOVE from the previous cut: [배제 요소 · 예: the falling confetti, the second character].
These must NOT appear at all in the new segment.
CARRY OVER: the main character (same sheet), the location, and the lighting.
New action: [이번 컷 동작 한 줄]. Duration [10]s.
[P-001 STYLE BLOCK]`,
  },
  {
    id: "P-010",
    title: "에이전트 프롬프트 5부 구조 (자동화 설계)",
    use: "오팔·Gems·스킬 등 자동화 에이전트를 설계할 때 뼈대로 쓴다",
    model: "Opal 노드 · Gemini Gems · Claude 스킬 공통",
    sources: [46, 63],
    text: `[1. ROLE] You are [역할 정의 · 예: a product-ad planning agent for small business owners].
[2. FLOW] Work in this order: (1) [입력 수집] (2) [기획] (3) [시안] (4) [확정] (5) [출력].
Never skip a step. Never reorder.
[3. INTERACTIVE OPTIONS] At step [3], present [3] options labeled A/B/C and wait for the
user's choice before continuing.
[4. OUTPUT SPEC] Final output format: [규격 · 예: a numbered cut list, one line per cut:
cut number / duration / visual / caption]. Language: Korean.
[5. ERROR GUARDS] If any required input is missing, ask instead of assuming.
Do not invent facts, prices, or review quotes. Do not generate media until the user confirms.`,
  },
  {
    id: "P-011",
    title: "레퍼런스 템플릿화 (스타일 고정 · 내용 교체)",
    use: "확정된 시안 하나를 템플릿으로 승격해, 스타일은 잠그고 내용만 갈아끼운다",
    model: "이미지·영상 공통 — 확정 시안을 스타일 레퍼런스로 첨부",
    sources: [53, 55, 50],
    text: `[Reference image = approved master template. Lock its style completely.]
Reproduce the exact layout, palette, typography style, lighting, and mood of the reference.
Replace ONLY the following content:
- Subject: [새 제품/인물] (from the attached original photo — keep it accurate)
- Headline text: "[새 카피 — 한국어 원문]"
- [기타 교체 항목]
Everything not listed above must remain visually identical to the reference.`,
  },
  {
    id: "P-012",
    title: "크레딧 게이트 개발 한 줄 (자동화 앱·스킬 공통 삽입)",
    use: "앱빌더·스킬·에이전트가 임의로 생성을 돌려 크레딧을 태우는 것을 설계 단계에서 차단한다",
    model: "App Builder · Claude 스킬 · Opal",
    sources: [17, 1],
    text: `Credit guard (must be implemented): the app/agent must NEVER trigger a paid generation
(image, video, or audio) automatically. Every generation call is placed behind an explicit
user-facing confirm button that shows the estimated credit cost before running.
During build and test phases, use mock data only — no real generation calls.`,
  },
];

export const KB_TOOLS: KbTool[] = [
  { name: "Seedance 2.5 (힉스필드)", role: "메인 영상 생성 (최대 30초 · 레퍼런스 50개)", pricing: "6초 1080 54 · 30초 1080 270 · 30초 텍스트 195 · Extend 10초 90 · 15초 60", verdict: "하랑 메인 · 레퍼런스 4유형 운용" },
  { name: "Seedance 2.0 (힉스필드)", role: "영상 생성 (최대 15초)", pricing: "720p 6초 27·8초 36·15초 68 · 풀HD 8초 72 · 4K 6초 132·8초 176·15초 330", verdict: "4K 납품·확대 편집용" },
  { name: "Kling 3.0 (힉스필드)", role: "영상 생성", pricing: "720p 6초 10·8초 14 · 1080p 6초 12·8초 16 · 15초 30", verdict: "저가 연습·아쉬운 컷 교체" },
  { name: "Nano Banana 2 / Pro", role: "이미지", pricing: "NB2 1.5 · Pro 2 · Pro 4K 4", verdict: "이미지 선생성 기본값" },
  { name: "Nano Banana 2 Lite", role: "이미지 (장당 약 4초)", pricing: "수치 미언급 (합리적이라고만)", verdict: "모션 소스·스토리보드용 — 다컷 얼굴 일관성 붕괴 주의" },
  { name: "GPT Image 2.0", role: "이미지", pricing: "7", verdict: "한글 우세 · 단가는 NB Pro가 저렴" },
  { name: "Seedream 5.0 Pro", role: "캐릭터 시트", pricing: "시트 3", verdict: "시트 제작 표준" },
  { name: "Higgsfield Shot (포토샵 플러그인)", role: "다각도 제품컷", pricing: "1회 4", verdict: "각도 세트 = 촬영 가이드 겸용" },
  { name: "Higgsfield Soul 2.0", role: "인물 1회 학습·재사용", pricing: "수치 미언급 (블로그 안내)", verdict: "전속 모델 고정 수단" },
  { name: "Gemini Omni Flash", role: "모션 오버레이·말자막·치환", pricing: "", verdict: "실촬영+오버레이 공정 (T-025)" },
  { name: "Google Flow (Veo 3.1)", role: "무료 연습", pricing: "일 50 무료 · Lite 10 / Fast 20 / Quality 100", verdict: "신규 모델 연습은 여기서 크레딧 0" },
  { name: "Google Opal", role: "노드 자동화", pricing: "무료 베타 · 하루 할당량", verdict: "크레딧 0원 시제품 샌드박스" },
  { name: "Gemini Gems", role: "챗봇 규격화", pricing: "무료 (영상 생성은 유료)", verdict: "기획봇 (Opal 앱 연동)" },
  { name: "Claude + Higgsfield MCP", role: "채팅 안 생성", pricing: "힉스필드 Plus 요금제 필수", verdict: "하랑 기본 체계와 동일 구조" },
  { name: "Claude Design", role: "A/B/C 시안", pricing: "프로 이상 · 사용량 소진 빠름", verdict: "UI/UX 특화 — 마케팅 디자인엔 보조" },
  { name: "Claude 코워크", role: "스케줄 무인 실행", pricing: "프로: 내보내기 2~3회에 하루 소진", verdict: "무인 초안 라인 (발행은 채널 주인)" },
  { name: "Figma (+Make)", role: "디자인·대량 제작", pricing: "무료 충분 · Make 하루 3개", verdict: "카드뉴스 양산·상세 초안 · 한글 안 깨짐" },
  { name: "CapCut", role: "편집", pricing: "대부분 무료 · 4K 출력", verdict: "편집 기본기·브랜드 키트" },
  { name: "Canva", role: "배너·카드뉴스", pricing: "무료 위주", verdict: "짧은 디자인 즉시 완성" },
  { name: "Mixboard", role: "연출컷 다량 생성", pricing: "무료", verdict: "상세 연출컷 후보 1차" },
  { name: "Adobe Firefly", role: "상업 안전 생성·영상 번역", pricing: "번역 초당 5 · 표준은 구독 포함", verdict: "저작권 민감 건(패키지·굿즈) 우회로" },
  { name: "Topview AI", role: "제품 합성·UGC 쇼츠", pricing: "무료 월 10크레딧", verdict: "착용컷·스토어 링크 광고" },
  { name: "VCAT", role: "URL 한 줄 광고영상", pricing: "미리보기 무료", verdict: "저비용 1차 4안 뽑기" },
  { name: "Vrew", role: "텍스트 → 비디오", pricing: "무료 플랜으로 전 과정", verdict: "정보형 쇼츠 초안" },
  { name: "MagicLight", role: "숏드라마 (최대 10분)", pricing: "프로 무료 이벤트 (당시)", verdict: "드라마형 포맷 실험" },
];
