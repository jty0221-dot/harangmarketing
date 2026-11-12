import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { SianMain, PageHead, Section, Steps, QuestionList, CloseBand } from "../../components/sian/Sian";
import PersuasionSians from "../../components/PersuasionSians";
import PersuasionForm from "./PersuasionForm";
import type { FaqItem } from "../../lib/seo";

/*
 * 구성 진단 · 설득 공정 시안 (2026-11-12 루미 · 대표 지시 후커블 방법 흡수 · 정본 본부장/스마트스토어/상세페이지_후커블방법_흡수.md 4-1).
 * 순서 : 첫 화면에서 바로 신청 → 결과물 예시(시안 두 벌) → 세 단계 → 질문 → 상담 버튼. 가격 절은 넣지 않는다 (C).
 * 외부 서비스 이름 · 화면 · 문구는 쓰지 않는다. 화면 문구 원본 : 홈페이지공장/out/설득공정-시안/하랑반영_발행본문.md (원고검사 0)
 */

const STEPS = [
  { title: "재료를 모읍니다", desc: "손님이 어떤 상황에서 찾는지, 내세울 점과 그 근거, 지금 있는 후기, 있는 사진과 찍을 사진을 한 장에 적습니다. 근거가 없는 칸은 비워 두고 여쭙니다." },
  { title: "걱정 세 개를 고릅니다", desc: "문의와 리뷰에서 사기 전에, 전화하기 전에 망설이는 이유를 세 개로 추립니다. 괜찮았다는 후기도 거꾸로 읽으면 걱정이 보입니다." },
  { title: "걱정마다 받는 섹션을 정합니다", desc: "섹션 구성표에 받는 걱정 칸을 두고, 받는 섹션이 없는 걱정이 남으면 시안을 내보내지 않습니다." },
];

const FAQS: FaqItem[] = [
  { q: "구성 진단은 무엇을 받아 보는 건가요?", a: "걱정 세 개와 그 걱정을 받는 섹션 순서를 정리한 구성 초안입니다. 디자인 시안이나 완성 이미지는 들어가지 않습니다." },
  { q: "자동으로 만들어 주는 건가요?", a: "아닙니다. 적어 주신 내용을 하랑 대표가 직접 보고 정리합니다." },
  { q: "리뷰가 아직 없으면 어떻게 하나요?", a: "문의에서 들은 질문이나 비슷한 상품의 리뷰로 시작합니다. 근거가 모자란 칸은 지어 쓰지 않고 어떤 자료가 더 필요한지 말씀드립니다." },
  { q: "시안의 업체명과 숫자는 실제인가요?", a: "아닙니다. 두 시안 모두 업체명과 수치가 가상입니다. 방법을 보여 드리려고 만든 예시입니다." },
];

export default function PersuasionPage() {
  return (
    <>
      <Header />
      <SianMain>
        <PageHead
          where="상세페이지 · 홈페이지 구성 진단"
          title="손님이 사기 전에 하는 걱정 세 개부터 정합니다"
          lead="상품명이나 업체명, 특징 몇 줄만 적어 주세요. 하랑 대표가 보고 어떤 걱정을 어느 섹션이 받아야 하는지 구성 초안으로 연락드립니다."
          primary={{ href: "#diagnose", label: "구성 진단 신청" }}
          link={{ href: "#sians", label: "시안 먼저 보기" }}
        />
        <Section id="diagnose" title="무료 구성 진단 신청" desc="적어 주신 내용으로 걱정 세 개와 받는 섹션을 정리해 연락드립니다. 자동으로 만들어지는 화면은 아니고 사람이 직접 봅니다.">
          <PersuasionForm />
        </Section>
        <Section soft id="sians" title="같은 방법으로 짠 시안 두 벌" desc="둘 다 같은 순서로 짰습니다. 업체명과 수치는 가상입니다.">
          <PersuasionSians />
        </Section>
        <Section title="세 단계로 짭니다" desc="재료를 모으고, 걱정을 고르고, 걱정마다 받는 섹션을 정합니다.">
          <Steps steps={STEPS} />
        </Section>
        <Section soft id="faq" title="자주 묻는 질문">
          <QuestionList items={FAQS} />
        </Section>
        <CloseBand
          title="걱정 세 개부터 같이 정해 보세요"
          text="상품명이나 업체명만 있어도 시작할 수 있습니다."
          primary={{ href: "/contact?service=detail-page", label: "상담 신청" }}
        />
      </SianMain>
      <Footer bands={false} />
    </>
  );
}
