"use client";

/**
 * 하랑 상담실장 챗봇 위젯
 *
 * 카카오 Kanana 상담매니저와 동일한 페르소나(차분+상큼한 여성 상담실장)와
 * FAQ 지식(E:\하랑\상담실장\페르소나-FAQ-마스터.md 기준)을 사용하는 규칙 기반 챗봇.
 * 답을 모르는 질문은 카카오톡 채널 상담으로 연결한다.
 *
 * 위치 규칙: FloatingCTA(우측 bottom-8)와 SocialProofToast(좌측)를 피해
 * 데스크톱은 우측 하단에서 FloatingCTA 왼쪽, 모바일은 하단 고정 바 위에 뜬다.
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Send,
  X,
  Phone,
  MessageCircle,
  Zap,
  ArrowRight,
  Newspaper,
  MonitorDown,
} from "lucide-react";

const KAKAO_CHAT_URL = "https://pf.kakao.com/_MuUkG/chat";
const PHONE = "010-7541-9054";

type ActionKey = "kakao" | "phone" | "freeCheck" | "cafeDist" | "studio";

interface BotEntry {
  /** 매칭 키워드 — 하나라도 포함되면 후보, 많이 겹칠수록 우선 */
  keywords: string[];
  answer: string;
  actions?: ActionKey[];
}

interface Msg {
  role: "bot" | "user";
  text: string;
  actions?: ActionKey[];
}

/* 카카오 Kanana 상담매니저와 동일한 FAQ 지식 베이스 */
const KNOWLEDGE: BotEntry[] = [
  {
    keywords: ["디자인", "홈페이지형", "스킨", "위젯", "블로그디자인", "블로그 디자인", "꾸미기"],
    answer:
      "홈페이지형 블로그 디자인은 '고급형 20만원 / 프리미엄형 30만원' 두 가지로 진행되며, 대부분 고급형으로 많이 하세요. 발주 후 초안까지 보통 3~4일 소요됩니다. 마음에 드는 레이아웃이나 참고 블로그가 있다면 카카오톡으로 링크를 남겨주세요. 포트폴리오와 발주 양식을 바로 보내드릴게요:)",
    actions: ["kakao"],
  },
  {
    keywords: ["포스팅", "블로그 글", "블로그글", "원고", "글 작성", "글작성", "대행", "기재", "발행"],
    answer:
      "블로그 포스팅은 1건당 4만원이며, 보통 월 5~10건(20~40만원)으로 진행하십니다. 업종과 지역, 키워드에 맞춰 원고 방향을 잡아드리고, 게시 후에는 링크를 모두 공유드려요. 파워컨텐츠 등 광고 세팅은 별도이며 광고비는 네이버에 직접 결제됩니다.",
    actions: ["kakao", "freeCheck"],
  },
  {
    keywords: ["플레이스", "상위노출", "순위", "지도", "스마트플레이스", "네이버 지도", "노출"],
    answer:
      "네, 플레이스 최적화·상위노출은 하랑의 주력 서비스예요. 지역과 키워드 경쟁 강도에 따라 기간과 비용이 달라져서 업체 상황을 먼저 확인하고 있어요. 아래 '무료 플레이스 진단'으로 현재 상태를 바로 확인해보시거나, 카카오톡으로 '지역+상호명'과 원하시는 키워드를 남겨주시면 진단해서 답변드릴게요:)",
    actions: ["freeCheck", "kakao"],
  },
  {
    keywords: ["견적", "비용", "가격", "얼마", "요금", "금액", "단가", "예산"],
    answer:
      "견적은 원하시는 서비스와 지역, 경쟁 강도에 따라 달라져요. 1) 지역+상호명 2) 관심 있는 서비스 3) 월 마케팅 예산(만원 단위)을 카카오톡으로 남겨주시면 견적서를 정리해 보내드립니다. 예산 안에서 우선순위를 잡아 단계별로 제안드리는 방식이라 부담 갖지 않으셔도 돼요:)",
    actions: ["freeCheck", "kakao"],
  },
  {
    keywords: ["전화", "통화", "연락", "콜", "상담원", "직원", "사람"],
    answer:
      "네, 전화 상담도 가능합니다. 다만 작업이나 회의 중에는 바로 받기 어려울 수 있어서, 카카오톡에 성함과 연락처, 편하신 시간대를 남겨주시면 확인 후 전화드리겠습니다. 급하신 내용은 아래 번호로 바로 연락 주셔도 돼요:)",
    actions: ["phone", "kakao"],
  },
  {
    keywords: ["인스타", "인스타그램", "피드", "릴스", "숏폼", "영상", "촬영", "유튜브", "쇼츠", "sns"],
    answer:
      "네:) 인스타 계정관리(피드 제작·프로필 세팅·팔로우 소통), 숏폼 영상 제작, 인플루언서 체험단까지 진행하고 있어요. 보통 3개월 단위 패키지로 구성되며, 업종에 따라 구성이 달라집니다. 업체명과 현재 운영 중인 SNS를 알려주시면 맞는 구성으로 안내드릴게요.",
    actions: ["kakao"],
  },
  {
    keywords: ["카페 배포", "카페배포", "카페 침투", "카페침투", "맘카페", "지역카페", "커뮤니티"],
    answer:
      "네, 최적화 블로그와 지역 카페 배포를 묶어서 진행하고 있어요. 블로그와 카페에 동시에 노출되면 같은 키워드에서 진입 경로가 늘어나 효과가 좋습니다. 원고 작성 포함/미포함을 고를 수 있고, 진행 후에는 게시 URL 전체를 정리해 보내드려요. 지금은 이벤트 기간이라 기존 상품에 카페 배포 건이 추가로 제공되고 있으니 자세한 구성은 아래에서 확인해보세요:)",
    actions: ["cafeDist", "kakao"],
  },
  {
    keywords: ["사진 프로그램", "영상 프로그램", "스튜디오", "gif", "움짤", "사진 보정", "사진 편집", "워터마크", "영상 변환", "사진 세탁", "일괄"],
    answer:
      "현장 사진 정리가 번거로우시다면 자체 제작 프로그램 '하랑 스튜디오'를 추천드려요. 사진 100장 일괄 보정, 워터마크, 비포·애프터 붙이기, 영상을 움짤(GIF)로 변환까지 한 번에 됩니다. 파일을 서버에 올리지 않고 내 컴퓨터 안에서 처리돼 안전하고, 무료로 100장 체험 후 결정하시면 돼요. 1개월 4,900원부터입니다:)",
    actions: ["studio", "kakao"],
  },
  {
    keywords: ["노출 관리", "관리대행", "관리도", "제작만", "관리 비용", "관리비"],
    answer:
      "네, 제작만이 아니라 노출 관리(관리대행)까지 저희가 직접 합니다. 본업이 마케팅 대행이고 블로그 디자인 제작은 그중 한 부분이에요. 관리는 블로그 포스팅 1건 4만원, 보통 월 5~10건(20~40만원)으로 진행하며, 발행 후 게시 링크를 전부 보내드려 어떤 글이 어떻게 올라갔는지 직접 확인하실 수 있습니다:)",
    actions: ["kakao", "freeCheck"],
  },
  {
    keywords: ["위젯", "위젯명", "버튼명", "링크가 뭔", "무슨 뜻"],
    answer:
      "블로그 맨 위에 홈페이지처럼 보이는 큰 대문 이미지가 들어가고, 그 위에 누를 수 있는 버튼을 심어요. 버튼 이름이 위젯명, 눌렀을 때 이동하는 곳이 링크입니다. 예) 상담 신청(카카오톡 연결), 전화 연결, 서비스 소개(글 모음), 후기·사례, 오시는 길. 정하기 어려우시면 업종에 맞는 예시를 저희가 만들어 드리니 편하게 말씀해주세요:)",
    actions: ["kakao"],
  },
  {
    keywords: ["어디에 노출", "노출되나요", "노출 범위", "pc", "모바일", "유튜브에도", "인스타에도", "톡에도"],
    answer:
      "블로그 글은 네이버 PC·모바일 검색 노출이 기본이고, 구글·다음 등 다른 검색에도 잡히도록 백링크 작업을 함께 합니다. 인스타·유튜브는 별도 채널이라 블로그 글이 자동으로 노출되진 않고, 그 채널용 콘텐츠(피드·숏폼)를 따로 만들어야 해요. 카카오톡은 노출 매체가 아니라 상담 창구입니다. 순서는 네이버부터 잡고, 인스타·유튜브는 소재가 쌓인 뒤 붙이시는 걸 권해드려요.",
    actions: ["kakao"],
  },
  {
    keywords: ["해외", "외국", "베트남", "다낭", "일본", "태국", "관광객", "여행객"],
    answer:
      "고객이 한국인이고 방문 전에 네이버에서 검색하는 업종이면 가능합니다. 해외 여행지 매장이 대표적이에요. 다만 네이버 플레이스는 국내 지도 기반이라 해외 매장은 해당이 없고, 블로그·카페 배포로 진행합니다. 저희가 방문 촬영이 어려워 사진·영상 소재는 매장에서 제공해주셔야 해요. 매장 종류, 타깃 고객, 원하시는 키워드를 남겨주시면 되는 케이스인지부터 갈라드릴게요:)",
    actions: ["cafeDist", "kakao"],
  },
  {
    keywords: ["부가세", "vat", "현금", "계좌", "결제", "입금", "카드"],
    answer:
      "안내드리는 금액은 부가세 별도 기준이고, 세금계산서가 필요하시면 사업자등록번호와 이메일을 주시면 발행해드립니다. 결제는 계좌이체 또는 카드결제(숨고)로 가능하며, 계좌는 진행 확정 시 견적서와 함께 안내드려요. 입금 확인되면 바로 착수합니다:)",
    actions: ["kakao"],
  },
  {
    keywords: ["사진 보내", "사진은 어떻게", "사진 전달", "압축", "알집", "파일 보내", "영상 보내"],
    answer:
      "카톡에서 사진을 여러 장 한 번에 선택해 묶음으로 보내주시고, 보내기 전에 '원본 화질' 옵션만 체크해주세요. 압축은 안 하셔도 됩니다. 사진이 많으면 구글 드라이브 폴더 링크를 드리니 거기 올려주셔도 돼요. 매장 전경, 진열·시설, 주력 상품 위주로 찍어주시면 되고, 필요한 컷과 각도는 착수 시 가이드로 드립니다:)",
    actions: ["kakao"],
  },
  {
    keywords: ["예전 블로그", "옛날 블로그", "기존 블로그", "쓰던 블로그", "블로그 있는데", "계정 있는데"],
    answer:
      "네, 먼저 상태부터 확인해드릴게요(무료). 오래된 계정은 상태에 따라 그대로 살려 쓰는 게 유리할 수도, 새로 시작하는 게 나을 수도 있어서 블로그 주소만 보내주시면 확인 후 판단해 드립니다. 아이디·비밀번호는 진행 확정 후 발주 양식에 적어주시면 돼요:)",
    actions: ["kakao"],
  },
  {
    keywords: ["보험", "설계사", "금융", "재무"],
    answer:
      "네, 보험설계사·금융 전문가 블로그도 진행합니다. 보험은 광고 심의가 있는 업종이라 특정 상품 비교나 수익 단정 표현은 피하고 정보성 중심으로 원고를 잡고, 방문자 수보다 '보험 점검', '지역명+보험상담'처럼 계약으로 이어지는 키워드 위주로 씁니다. 시작은 홈페이지형 블로그(고급형 20만원) + 월 5건 관리(20만원) 구성을 많이 선택하세요:)",
    actions: ["kakao", "freeCheck"],
  },
  {
    keywords: ["처음", "막막", "몰라", "모르겠", "뭐부터", "뭘 해야", "어떻게 시작", "초보"],
    answer:
      "걱정 마세요, 그런 대표님들이 가장 많으세요:) 하랑은 예산 안에서 우선순위를 정해 '지금 꼭 필요한 것'부터 단계별로 제안드려요. 업종, 지역, 월 예산 이 세 가지만 알려주시면 현재 상황을 진단하고 방향을 알기 쉽게 정리해 드리겠습니다.",
    actions: ["freeCheck", "kakao"],
  },
  {
    keywords: ["성과", "결과", "보고", "리포트", "확인", "효과", "증명"],
    answer:
      "진행 내역과 결과는 투명하게 공유드려요. 블로그 배포 시 게시글 링크 전체를 보내드리고, 플레이스는 키워드별 순위 변화를 보고드립니다. 월 단위로 견적서와 세금계산서도 바로바로 발행해드려서 정산도 깔끔하게 관리되세요:)",
    actions: ["kakao"],
  },
  {
    keywords: ["체험단", "기자단", "인플루언서", "리뷰어", "방문단"],
    answer:
      "네, 방문형 인플루언서 체험단(인스타 1~30만 팔로워)과 블로그 체험단 모두 진행합니다. 매장 방문이 가능한 지역인지, 어떤 콘텐츠를 원하시는지에 따라 섭외 방향이 달라져요. 지역+상호명과 원하시는 형태를 남겨주시면 구성안을 정리해 드릴게요:)",
    actions: ["kakao"],
  },
  {
    keywords: ["계약", "기간", "약정", "몇 개월", "몇개월", "해지", "중단", "최소 계약", "묶이", "한 달만", "한달만"],
    answer:
      "묶어두는 조건은 없어요:) 플레이스랑 블로그는 월 단위라, 다음 달 안 하시겠다고 말씀만 주시면 그 달까지만 하고 멈춰요. 인스타 관리나 체험단 같은 패키지는 구성상 3개월로 잡히는 경우가 있고요. 다만 솔직히 말씀드리면 한 달로 판단하시기는 조금 짧아요. 보통 2~3개월째부터 움직이는 게 보이거든요. 그래서 처음부터 크게 시작하시라고는 권하지 않아요.",
    actions: ["kakao"],
  },
  {
    keywords: ["트래픽", "자동 클릭", "자동클릭", "프로그램 쓰", "프로그램 사용", "어뷰징", "매크로", "작업", "저품질"],
    answer:
      "트래픽이라는 말이 두 가지를 가리켜서 나눠서 말씀드릴게요. 하나는 프로그램이나 매크로로 기계가 자동 클릭하는 건데, 이건 저희가 쓰지 않습니다. 위험이 여기서 나오거든요. 사람이 아니라서 들어와서 아무것도 안 하고 나가는데 네이버가 그걸 봅니다. 다른 하나는 실제 사람이 검색해서 들어와 보고 나가는 거예요. 이건 씁니다. 체류시간이랑 행동이 정상적으로 남거든요. 다만 이건 보조예요. 메인은 글이랑 리뷰를 쌓는 거고, 그거 없이 이것만 하면 결국 똑같이 떨어집니다.",
    actions: ["kakao"],
  },
  {
    keywords: ["어떤 업무", "무슨 일", "어디까지", "업무 범위", "서비스 범위", "뭐 해주", "무엇을 해주", "뭘 해주"],
    answer:
      "네이버 플레이스랑 블로그가 주력이고요, 카페 배포·인스타그램 관리·사진영상 촬영까지 해드려요. 플레이스는 최적화랑 상위노출 관리, 블로그는 대행 포스팅·체험단·홈페이지형 디자인이에요. 어디부터 하실지는 지금 상태 보고 같이 정하시면 돼요:) 지역이랑 상호명만 남겨주시면 현재 순위부터 확인해 드릴게요.",
    actions: ["kakao", "freeCheck"],
  },
  {
    keywords: ["뭘 수정", "어떤 부분을 수정", "실제로 뭐", "어떤 작업", "seo 관리", "플레이스 관리", "최적화 항목"],
    answer:
      "실제로 만지는 건 이런 것들이에요. 1) 업체명·대표키워드·상세설명을 검색에 진짜로 걸리는 문구로 다시 씁니다 2) 사진 순서랑 메뉴판·가격표 정리 3) 리뷰 유도 동선(영수증리뷰 문구·매장 안내물) 4) 소식·쿠폰 주기적으로 올리기 5) 상위노출을 같이 관리하면서 저장수·길찾기 지표가 움직이게 만드는 작업이고요. 원하시는 게 SEO 부분만인지 상위노출까지인지에 따라 금액이 달라져요.",
    actions: ["kakao", "freeCheck"],
  },
  {
    keywords: ["경쟁업체", "경쟁사", "경쟁 분석", "경쟁업체 분석", "상위 업체", "누가 위에"],
    answer:
      "그럼요, 해드려요:) 이건 무료고요. 지금 그 키워드 상위에 어떤 업체가 있는지, 그 집들이 리뷰 몇 개에 어떤 키워드로 잡혀 있는지 정리해서 보여드려요. 지역명이 다른 곳과 겹치는 키워드면 그것도 같이 알려드리고요. 보시고 결정하셔도 되고 안 하셔도 됩니다. 지역이랑 상호명, 띄우고 싶은 키워드 남겨주시면 확인해 드릴게요.",
    actions: ["kakao", "freeCheck"],
  },
  {
    keywords: ["세금계산서", "계산서", "증빙", "부가세", "세금"],
    answer:
      "네, 정식 사업자로 세금계산서 발행해드립니다. 입금 확인 후 바로 발행해드리며, 사업자등록번호와 이메일을 남겨주시면 처리해 드릴게요:)",
    actions: ["kakao"],
  },
  {
    keywords: ["환불", "취소", "불만", "문제"],
    answer:
      "불편을 드렸다면 진심으로 죄송합니다. 환불·취소는 관리자 확인 후 처리해드리고 있어요. 카카오톡으로 성함, 연락처, 진행 서비스, 사유를 남겨주시면 확인하는 대로 바로 답변드리겠습니다.",
    actions: ["kakao"],
  },
  {
    keywords: ["영업시간", "영업 시간", "몇 시", "몇시", "주말", "언제", "휴무"],
    answer:
      "공식 영업시간은 09:00~18:00이지만, 사장님들 업무가 끝나는 야간이나 주말에도 문의는 24시간 받고 있어요. 메시지를 남겨주시면 확인하는 대로 최대한 빠르게 답변드리겠습니다:)",
    actions: ["kakao", "phone"],
  },
  {
    keywords: ["위치", "어디", "주소", "사무실", "찾아"],
    answer:
      "하랑마케팅은 경기 북서부에 사무실이 있고 경기·서울·인천 전 지역을 담당해요. 전국 어디든 비대면으로 동일하게 진행 가능해서, 대부분의 대표님들이 카카오톡과 전화로 편하게 진행하고 계세요. 방문 상담이 필요하시면 위치 안내드릴게요:)",
    actions: ["kakao"],
  },
];

const FALLBACK: Msg = {
  role: "bot",
  text: "말씀 주신 내용은 제가 바로 답변드리기 어려운 부분이에요. 카카오톡으로 남겨주시면 관리자가 확인 후 꼼꼼하게 답변드릴게요. 보통 10분 내로 응답드리고 있어요:)",
  actions: ["kakao", "phone"],
};

const QUICK_CHIPS: { label: string; query: string }[] = [
  { label: "플레이스 상위노출", query: "플레이스 상위노출 가능한가요?" },
  { label: "블로그 디자인", query: "홈페이지형 블로그 디자인 비용이 궁금해요" },
  { label: "블로그 대행", query: "블로그 포스팅 대행 비용이 궁금해요" },
  { label: "인스타·영상", query: "인스타그램 관리나 영상 제작도 하나요?" },
  { label: "카페 배포", query: "블로그 카페 배포는 어떻게 진행되나요?" },
  { label: "사진·영상 프로그램", query: "사진 영상 편집 프로그램이 있나요?" },
  { label: "견적 받기", query: "견적을 받아보고 싶어요" },
  { label: "처음이라 막막해요", query: "마케팅을 처음 해봐서 뭐부터 해야 할지 모르겠어요" },
];

function matchAnswer(input: string): Msg {
  const q = input.toLowerCase().replace(/\s+/g, " ");
  let best: BotEntry | null = null;
  let bestScore = 0;
  for (const entry of KNOWLEDGE) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (q.includes(kw.toLowerCase())) score += kw.length >= 3 ? 2 : 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }
  if (!best) return { ...FALLBACK };
  return { role: "bot", text: best.answer, actions: best.actions };
}

function ActionButtons({ actions }: { actions: ActionKey[] }) {
  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {actions.map((a) => {
        switch (a) {
          case "kakao":
            return (
              <a
                key={a}
                href={KAKAO_CHAT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-yellow-400 text-gray-900 text-xs font-bold hover:bg-yellow-300 transition-colors"
              >
                <MessageCircle size={12} strokeWidth={2.5} />
                카카오톡 상담
              </a>
            );
          case "phone":
            return (
              <a
                key={a}
                href={`tel:${PHONE}`}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-gray-800 transition-colors"
              >
                <Phone size={12} strokeWidth={2.5} />
                {PHONE}
              </a>
            );
          case "freeCheck":
            return (
              <Link
                key={a}
                href="/free-check"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
              >
                무료 플레이스 진단
                <ArrowRight size={12} />
              </Link>
            );
          case "cafeDist":
            return (
              <Link
                key={a}
                href="/services/cafe-distribution"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
              >
                <Newspaper size={12} strokeWidth={2.5} />
                카페 배포 자세히 보기
              </Link>
            );
          case "studio":
            return (
              <Link
                key={a}
                href="/studio"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-violet-600 text-white text-xs font-bold hover:bg-violet-700 transition-colors"
              >
                <MonitorDown size={12} strokeWidth={2.5} />
                하랑 스튜디오 보기
              </Link>
            );
        }
      })}
    </div>
  );
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "bot",
      text: "안녕하세요, 하랑마케팅 정보라 팀장입니다:) 업체 상황에 맞는 방향을 같이 찾아드릴게요. 궁금하신 점 편하게 남겨주세요!",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing, open]);

  const ask = (raw: string) => {
    const text = raw.trim();
    if (!text || typing) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setTyping(true);
    // 상담실장이 잠깐 생각하고 답하는 느낌을 준다
    setTimeout(() => {
      setMessages((m) => [...m, matchAnswer(text)]);
      setTyping(false);
    }, 600);
  };

  return (
    <>
      {/* 열기 버튼 — 데스크톱: FloatingCTA 왼쪽 / 모바일: 하단 바 위 */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed z-40 md:right-24 md:bottom-8 right-3 bottom-[104px] w-14 h-14 rounded-2xl shadow-xl overflow-hidden ring-2 ring-white hover:shadow-2xl hover:-translate-y-0.5 transition-all"
          aria-label="상담실장 챗봇 열기"
        >
          <Image
            src="/consultant.png"
            alt="하랑 상담실장"
            width={56}
            height={56}
            className="w-full h-full object-cover"
          />
          <span className="absolute top-0.5 right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-white" />
        </button>
      )}

      {/* 채팅 패널 */}
      {open && (
        <div className="fixed z-50 md:right-6 md:bottom-8 md:w-[360px] md:h-[540px] md:rounded-2xl inset-x-0 bottom-0 top-16 md:inset-auto md:top-auto bg-white shadow-2xl border border-gray-100 rounded-t-2xl flex flex-col overflow-hidden">
          {/* 헤더 */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-white">
            <div className="w-9 h-9 rounded-xl shadow-sm overflow-hidden">
              <Image
                src="/consultant.png"
                alt="하랑 상담실장"
                width={36}
                height={36}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-gray-900">정보라 팀장</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <p className="text-[11px] text-gray-400">바로 답변 · 24시간 문의 가능</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"
              aria-label="챗봇 닫기"
            >
              <X size={18} />
            </button>
          </div>

          {/* 메시지 영역 */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50">
            {messages.map((m, i) =>
              m.role === "bot" ? (
                <div key={i} className="max-w-[85%]">
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-md px-3.5 py-2.5 text-sm text-gray-800 leading-relaxed shadow-sm whitespace-pre-line">
                    {m.text}
                  </div>
                  {m.actions && m.actions.length > 0 && <ActionButtons actions={m.actions} />}
                </div>
              ) : (
                <div key={i} className="flex justify-end">
                  <div className="max-w-[85%] bg-blue-600 text-white rounded-2xl rounded-tr-md px-3.5 py-2.5 text-sm leading-relaxed">
                    {m.text}
                  </div>
                </div>
              )
            )}
            {typing && (
              <div className="inline-flex items-center gap-1 bg-white border border-gray-100 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm">
                {[0, 1, 2].map((n) => (
                  <span
                    key={n}
                    className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce"
                    style={{ animationDelay: `${n * 120}ms` }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* 빠른 질문 칩 */}
          <div className="px-3 pt-2 pb-1 bg-white border-t border-gray-100">
            <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
              {QUICK_CHIPS.map((c) => (
                <button
                  key={c.label}
                  onClick={() => ask(c.query)}
                  className="shrink-0 px-3 py-1.5 rounded-full border border-gray-200 bg-white text-xs font-semibold text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-colors"
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* 입력 영역 */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask(input);
            }}
            className="flex items-center gap-2 px-3 py-2.5 bg-white"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="궁금한 내용을 입력해주세요"
              className="flex-1 min-w-0 px-3.5 py-2.5 rounded-xl bg-gray-100 text-base md:text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-blue-200"
            />
            <button
              type="submit"
              disabled={!input.trim() || typing}
              className="w-10 h-10 shrink-0 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="보내기"
            >
              <Send size={16} strokeWidth={2.5} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
