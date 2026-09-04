"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  Phone, Mail, MapPin, MessageCircle, Send, CheckCircle2,
  Clock, ArrowRight, ChevronRight,
  Coffee, UtensilsCrossed, Scissors, Stethoscope, GraduationCap, ShoppingBag, HelpCircle, Sparkles,
  Handshake,
} from "lucide-react";
import { GA_EVENTS } from "../components/Analytics";

import { SITE } from "../lib/seo";
import { best, fmt } from "../lib/rank-records";

/*
 * 업종별 순위 문구 — 손으로 적지 않는다.
 * 여기 숫자를 직접 써 뒀더니 스냅샷이 6회에서 11회로 바뀌는 동안 넷이 틀린 값이 됐다
 * (치과 5위 → 1위는 RECORDS 에서 사라진 기록이었다). rank-records 에서 그때그때 만든다.
 */
const rank = (industry: string) => {
  const r = best(industry);
  return r
    ? { result: fmt(r), case: `${r.keyword} · ${r.days}일 계측` }
    : { result: "무료 진단 후 목표 설정", case: "계측 기록 준비 중" };
};

const INDUSTRY_ICONS = [
  { id: "cafe", icon: Coffee, label: "카페·베이커리", rec: ["플레이스 SEO", "인스타그램 마케팅", "리뷰 마케팅"], ...rank("카페"), color: "from-blue-500 to-blue-700" },
  { id: "food", icon: UtensilsCrossed, label: "음식점·배달", rec: ["리뷰 마케팅", "맘카페 바이럴", "블로그 배포"], ...rank("음식점"), color: "from-blue-600 to-indigo-700" },
  { id: "clean", icon: Sparkles, label: "청소·시설관리", rec: ["플레이스 SEO", "블로그 관리", "리뷰 마케팅"], ...rank("청소"), color: "from-blue-600 to-blue-800" },
  { id: "beauty", icon: Scissors, label: "미용·네일·뷰티", rec: ["인스타그램 마케팅", "체험단 모집", "카카오맵 마케팅"], result: "인스타그램 중심", case: "무료 진단 후 목표 설정", color: "from-blue-500 to-blue-700" },
  { id: "medical", icon: Stethoscope, label: "의원·한의원·피부과", rec: ["블로그 관리", "리뷰 답글 관리", "플레이스 SEO"], ...rank("치과"), color: "from-blue-600 to-blue-800" },
  { id: "edu", icon: GraduationCap, label: "학원·교육", rec: ["맘카페 바이럴", "홈페이지형 블로그", "블로그 관리"], result: "맘카페 바이럴 중심", case: "무료 진단 후 목표 설정", color: "from-blue-700 to-indigo-800" },
  { id: "shop", icon: ShoppingBag, label: "온라인 쇼핑몰", rec: ["블로그 SEO", "체험단 모집", "블로그 배포"], result: "블로그 SEO 중심", case: "무료 진단 후 목표 설정", color: "from-blue-500 to-indigo-600" },
  { id: "other", icon: HelpCircle, label: "기타 업종", rec: ["무료 상담 후 맞춤 추천"], result: "맞춤 분석 제공", case: "상담 후 업종별 전략 수립", color: "from-blue-700 to-blue-900" },
];

const BUDGETS = [
  "월 30만원 미만", "월 30~50만원", "월 50~100만원",
  "월 100~200만원", "월 200만원 이상", "아직 미정",
];

const GOALS = [
  "네이버 플레이스 순위 올리기", "리뷰·후기 늘리기",
  "SNS 팔로워·인지도 올리기", "블로그 검색 노출 늘리기",
  "매장 방문객 늘리기", "온라인 매출 올리기",
  "브랜드 신뢰도 높이기", "아직 잘 모르겠어요",
];

const PROCESS_STEPS = [
  { step: "01", title: "상담 신청", desc: "24시간 내 연락" },
  { step: "02", title: "현황 무료 분석", desc: "업종·경쟁사 분석" },
  { step: "03", title: "전략 제안", desc: "맞춤 견적 제안" },
  { step: "04", title: "즉시 시작", desc: "계약 당일 착수" },
];

/**
 * 자가진단에서 넘어온 개수만 읽는 잎 컴포넌트.
 *
 * useSearchParams 는 이 훅을 부른 컴포넌트부터 가장 가까운 Suspense 경계까지를
 * 미리 그린 HTML 에서 빼 버린다. 전에는 페이지 전체가 이 훅을 부르고 fallback 이
 * null 이라 /contact 서버 HTML 이 통째로 비어 있었다 (h1 0개 · 제목 문구 0회).
 * 그래서 훅을 이 잎 하나에 가두고 나머지 화면은 그대로 미리 그려지게 둔다.
 */
function ChecklistParam({ onCount }: { onCount: (n: number) => void }) {
  const searchParams = useSearchParams();
  const raw = Number(searchParams.get("checklist") ?? 0);
  const count = Number.isFinite(raw) ? raw : 0;
  useEffect(() => {
    onCount(count);
  }, [count, onCount]);
  return null;
}

export default function ContactPage() {
  // 주소창 쿼리는 아래 ChecklistParam 이 하이드레이션 뒤에 채운다.
  // 값이 안 와도 화면은 그대로 동작한다. 문구 한 줄과 메모 초안이 더 붙을 뿐이다.
  const [checklistCount, setChecklistCount] = useState(0);

  const [step, setStep] = useState<"industry" | "form" | "done">("industry");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [form, setForm] = useState({ name: "", phone: "", budget: "", message: "" });
  const [loading, setLoading] = useState(false);
  // 봇 트랩 — 사람 눈에 안 보이는 칸이라 값이 차 있으면 자동 도배로 본다
  const [website, setWebsite] = useState("");

  useEffect(() => {
    if (checklistCount > 0 && form.message === "") {
      setForm((prev) => ({ ...prev, message: `홈페이지 자가진단에서 ${checklistCount}가지 문제를 확인했습니다.` }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checklistCount]);

  const toggleGoal = (g: string) => {
    setSelectedGoals((prev) => prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]);
  };

  const selectedInd = INDUSTRY_ICONS.find((i) => i.id === selectedIndustry);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const indLabel = INDUSTRY_ICONS.find((i) => i.id === selectedIndustry)?.label ?? selectedIndustry;
    const goalsText = selectedGoals.length > 0 ? `\n목표: ${selectedGoals.join(", ")}` : "";
    const budgetText = form.budget ? `\n예산: ${form.budget}` : "";
    const msgText = form.message ? `\n메모: ${form.message}` : "";

    const kakaoMsg = encodeURIComponent(
      `[하랑마케팅 상담 신청]\n이름/업체명: ${form.name}\n연락처: ${form.phone}\n업종: ${indLabel}${budgetText}${goalsText}${msgText}`
    );

    GA_EVENTS.contactFormSubmit(indLabel);
    // 카카오톡 채널에 문의 내용 전달
    window.open(`https://pf.kakao.com/_MuUkG/chat?text=${kakaoMsg}`, "_blank");

    // 이메일 알림 (API route)
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          industry: indLabel,
          budget: form.budget,
          goals: selectedGoals,
          message: form.message,
          website,
        }),
      });
    } catch {
      // 이메일 실패해도 카카오로 전달됐으므로 무시
    }

    setLoading(false);
    setStep("done");
  };

  return (
    <>
      <Suspense fallback={null}>
        <ChecklistParam onCount={setChecklistCount} />
      </Suspense>
      <Header />
      <main className="pt-[104px] md:pt-[108px]">
        {/* Hero */}
        <section className="bg-gradient-to-br from-gray-950 via-blue-950 to-gray-950 py-14 md:py-20 relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-blue-600/8 rounded-full blur-3xl pointer-events-none" />
          <div className="relative max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            {checklistCount >= 3 && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/20 border border-blue-500/30 mb-5">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                <span className="text-blue-200 text-sm font-bold">자가진단에서 {checklistCount}가지 문제를 확인하셨군요. 지금 바로 해결해드립니다.</span>
              </div>
            )}
            <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4">Contact</p>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
              무료 전략 진단 신청
            </h1>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-xl mb-6">
              업종과 목표를 알려주시면 맞춤 마케팅 전략을 무료로 분석해드립니다.<br />
              <span className="text-blue-300 font-semibold">실패를 경험한 하랑 대표가 직접 대표님 매장을 분석합니다.</span>
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              {[
                { icon: CheckCircle2, text: "상담 비용 0원" },
                { icon: CheckCircle2, text: "계약 강요 없음" },
                { icon: Clock, text: "24시간 내 대표가 직접 연락" },
                { icon: CheckCircle2, text: "작업 내역 100% 공개" },
              ].map(({ icon: Icon, text }) => (
                <span key={text} className="flex items-center gap-1.5 text-gray-300">
                  <Icon size={14} className="text-blue-400" strokeWidth={2.5} /> {text}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Process bar */}
        <section className="py-6 bg-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="flex items-center justify-between md:justify-start md:gap-8">
              {PROCESS_STEPS.map((s, i) => (
                <div key={s.step} className="flex items-center gap-2 md:gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0 transition-colors ${
                    (step === "form" && i <= 1) || step === "done" ? "bg-blue-600 text-white" : i === 0 ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
                  }`}>
                    {s.step}
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-xs font-bold text-gray-700">{s.title}</div>
                    <div className="text-[11px] text-gray-600">{s.desc}</div>
                  </div>
                  {i < PROCESS_STEPS.length - 1 && <ChevronRight size={12} className="text-gray-200 hidden md:block" />}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-10 md:py-14 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 md:gap-8">

              {/* Main form area */}
              <div>
                {/* Step 1: 업종 선택 */}
                {step === "industry" && (
                  <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-black text-gray-900 mb-1">어떤 업종을 운영하고 계신가요?</h2>
                    <p className="text-xs text-gray-500 mb-6">업종에 맞는 전략을 추천해드립니다</p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
                      {INDUSTRY_ICONS.map((ind) => {
                        const Icon = ind.icon;
                        return (
                          <button
                            key={ind.id}
                            onClick={() => setSelectedIndustry(ind.id)}
                            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center ${
                              selectedIndustry === ind.id
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-100 bg-gray-50 hover:border-blue-200"
                            }`}
                          >
                            <Icon size={22} className={selectedIndustry === ind.id ? "text-blue-600" : "text-gray-500"} strokeWidth={1.5} />
                            <span className={`text-xs font-bold leading-tight ${selectedIndustry === ind.id ? "text-blue-700" : "text-gray-600"}`}>
                              {ind.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {selectedInd && (
                      <div className="rounded-xl border border-blue-100 overflow-hidden mb-6">
                        <div className={`bg-gradient-to-r ${selectedInd.color} px-4 py-3 flex items-center justify-between`}>
                          <div>
                            <p className="text-[11px] font-black text-white/70 uppercase tracking-wider">유사 사례 실적</p>
                            <p className="text-white font-black text-base">{selectedInd.result}</p>
                          </div>
                          <p className="text-white/70 text-[11px] text-right">{selectedInd.case}</p>
                        </div>
                        <div className="bg-blue-50 px-4 py-3">
                          <p className="text-[11px] font-black text-blue-600 uppercase tracking-wider mb-2">추천 서비스</p>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedInd.rec.map((r) => (
                              <span key={r} className="px-2.5 py-1 rounded-full bg-blue-600 text-white text-xs font-semibold">{r}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mb-6">
                      <h3 className="text-sm font-black text-gray-700 mb-3">마케팅 목표를 선택해주세요 (복수 선택 가능)</h3>
                      <div className="flex flex-wrap gap-2">
                        {GOALS.map((g) => (
                          <button
                            key={g}
                            onClick={() => toggleGoal(g)}
                            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                              selectedGoals.includes(g)
                                ? "border-blue-500 bg-blue-50 text-blue-700 font-bold"
                                : "border-gray-200 text-gray-500 hover:border-blue-200"
                            }`}
                          >
                            {selectedGoals.includes(g) && <CheckCircle2 size={11} className="text-blue-500 shrink-0" strokeWidth={2.5} />}{g}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => setStep("form")}
                      disabled={!selectedIndustry}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold text-base transition-colors"
                    >
                      다음 단계: 연락처 입력
                      <ArrowRight size={16} />
                    </button>
                    {!selectedIndustry && <p className="text-xs text-gray-500 text-center mt-2">업종을 먼저 선택해주세요</p>}
                  </div>
                )}

                {/* Step 2: 연락처 */}
                {step === "form" && (
                  <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-5">
                      <button onClick={() => setStep("industry")} className="text-xs text-blue-600 font-bold hover:underline">
                        ← 업종 다시 선택
                      </button>
                      {selectedInd && (
                        <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                          {selectedInd.label}
                        </span>
                      )}
                    </div>

                    <h2 className="text-lg font-black text-gray-900 mb-1">어디로 연락드릴까요?</h2>
                    <p className="text-xs text-gray-500 mb-6">대표가 직접 24시간 이내에 연락드립니다 · 상담 비용 0원</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <input
                        type="text"
                        name="website"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        tabIndex={-1}
                        autoComplete="off"
                        aria-hidden="true"
                        className="absolute w-px h-px -left-[9999px] opacity-0"
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="contact-name" className="block text-xs font-bold text-gray-700 mb-1.5">이름 / 업체명 <span className="text-blue-500">*</span></label>
                          <input id="contact-name" type="text" required value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="홍길동 / 하랑카페"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder:text-gray-300" />
                        </div>
                        <div>
                          <label htmlFor="contact-phone" className="block text-xs font-bold text-gray-700 mb-1.5">연락처 <span className="text-blue-500">*</span></label>
                          <input id="contact-phone" type="tel" required value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            placeholder="010-0000-0000"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder:text-gray-300" />
                        </div>
                      </div>

                      <div>
                        <span id="contact-budget-label" className="block text-xs font-bold text-gray-700 mb-2">예상 월 예산</span>
                        <div role="group" aria-labelledby="contact-budget-label" className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {BUDGETS.map((b) => (
                            <button key={b} type="button" onClick={() => setForm({ ...form, budget: b })}
                              className={`px-3 py-2 rounded-xl border text-xs font-medium transition-all ${form.budget === b ? "border-blue-500 bg-blue-50 text-blue-700 font-bold" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                              {b}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="contact-message" className="block text-xs font-bold text-gray-700 mb-1.5">추가 문의 사항</label>
                        <textarea id="contact-message" rows={3} value={form.message}
                          onChange={(e) => setForm({ ...form, message: e.target.value })}
                          placeholder="현재 상황, 가장 큰 고민, 기대하는 결과 등을 자유롭게 적어주세요"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none placeholder:text-gray-300" />
                      </div>

                      {selectedGoals.length > 0 && (
                        <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-500">
                          <span className="font-bold text-gray-700">선택한 목표: </span>
                          {selectedGoals.join(", ")}
                        </div>
                      )}

                      {/* 제출 전 보증 */}
                      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-start gap-3">
                        <CheckCircle2 size={14} className="text-blue-500 shrink-0 mt-0.5" strokeWidth={2.5} />
                        <div>
                          <p className="text-xs font-bold text-blue-800">제출하셔도 아무런 계약 의무가 없습니다</p>
                          <p className="text-[11px] text-blue-600 mt-0.5">분석 리포트와 전략을 먼저 확인하신 후 진행 여부를 결정하세요</p>
                        </div>
                      </div>

                      <button type="submit" disabled={loading}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-base transition-colors shadow-sm">
                        {loading ? (
                          <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />처리 중...</>
                        ) : (
                          <><Send size={15} />무료 전략 진단 신청하기</>
                        )}
                      </button>

                      <p className="text-xs text-gray-400 text-center">상담 비용 없음 · 계약 강요 없음 · 대표가 직접 연락</p>
                    </form>
                  </div>
                )}

                {/* Done */}
                {step === "done" && (
                  <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-5 shadow-md">
                      <CheckCircle2 size={28} className="text-white" strokeWidth={2} />
                    </div>
                    <h2 className="text-xl font-black text-gray-900 mb-2">신청이 완료됐습니다</h2>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4">
                      <span className="font-black text-gray-800">{form.name || "사장님"}</span>, 소중한 신청 감사합니다.<br />
                      대표가 직접 <span className="font-semibold text-blue-600">24시간 이내</span>에 연락드립니다.
                    </p>

                    {/* 다음 단계 안내 */}
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 text-left">
                      <p className="text-xs font-bold text-blue-600 mb-2 uppercase tracking-wider">앞으로의 과정</p>
                      <ol className="space-y-1.5">
                        {["대표가 신청 내용 확인 후 연락드립니다", "20~30분 무료 전략 상담 진행", "업종·경쟁사 분석 리포트 전달", "맞춤 서비스 제안 (비용 0원)"].map((s, i) => (
                          <li key={i} className="flex items-center gap-2.5 text-xs text-gray-600">
                            <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[11px] font-black flex items-center justify-center shrink-0">{i + 1}</span>
                            {s}
                          </li>
                        ))}
                      </ol>
                    </div>

                    <p className="text-xs text-gray-500 mb-4">급하신 경우 아래로 바로 연락주세요</p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center mb-5">
                      <a href="https://pf.kakao.com/_MuUkG/chat" target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-yellow-400 text-gray-900 font-bold text-sm hover:bg-yellow-300 transition-colors">
                        <MessageCircle size={15} />카카오톡 바로 상담
                      </a>
                      <a href="tel:010-7541-9054" className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gray-900 text-white font-bold text-sm hover:bg-gray-800 transition-colors">
                        <Phone size={15} />010-7541-9054
                      </a>
                    </div>
                    <div className="flex justify-center items-center gap-1.5">
                      <Handshake size={13} className="text-blue-400" strokeWidth={2.5} />
                      <p className="text-xs text-gray-500">재계약률 {SITE.stats.renewalRate} · 500+ 프로젝트</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                {/* Direct contact */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-900 text-sm mb-4">지금 바로 연락하기</h3>
                  <div className="space-y-2.5">
                    <a href="https://pf.kakao.com/_MuUkG/chat" target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3.5 rounded-xl bg-yellow-50 hover:bg-yellow-100 transition-colors group">
                      <div className="w-9 h-9 rounded-xl bg-yellow-400 flex items-center justify-center shadow-sm shrink-0">
                        <MessageCircle size={16} className="text-gray-900" strokeWidth={2.5} />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-gray-900 text-sm">카카오톡 채널</div>
                        <div className="text-xs text-gray-500">평균 응답 10분 이내</div>
                      </div>
                      <ArrowRight size={13} className="text-gray-500 group-hover:text-yellow-500 transition-colors" />
                    </a>
                    <a href="tel:010-7541-9054"
                      className="flex items-center gap-3 p-3.5 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors group">
                      <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm shrink-0">
                        <Phone size={16} className="text-white" strokeWidth={2.5} />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-gray-900 text-sm">010-7541-9054</div>
                        <div className="text-xs text-gray-600">평일 09:00~18:00</div>
                      </div>
                      <ArrowRight size={13} className="text-gray-600 group-hover:text-blue-500 transition-colors" />
                    </a>
                    <a href="mailto:harangmarketing@naver.com"
                      className="flex items-center gap-3 p-3.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group">
                      <div className="w-9 h-9 rounded-xl bg-gray-600 flex items-center justify-center shadow-sm shrink-0">
                        <Mail size={16} className="text-white" strokeWidth={2.5} />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-gray-900 text-sm">이메일 문의</div>
                        <div className="text-xs text-gray-500 truncate">harangmarketing@naver.com</div>
                      </div>
                      <ArrowRight size={13} className="text-gray-500 group-hover:text-gray-700 transition-colors" />
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-600 flex items-center justify-center shadow-sm shrink-0">
                      <MapPin size={15} className="text-white" strokeWidth={2.5} />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-sm mb-1">주소</div>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        경기 고양시 일산동구 장백로19<br />더루벤투스카운티 501호
                      </p>
                    </div>
                  </div>
                </div>

                {/* Industry results mini */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <h4 className="font-bold text-gray-900 text-sm mb-3">업종별 순위 계측 기록</h4>
                  <div className="space-y-2.5">
                    {[
                      { ind: "음식점·배달", industry: "음식점" },
                      { ind: "청소·시설관리", industry: "청소" },
                      { ind: "카페·베이커리", industry: "카페" },
                      { ind: "의원·치과", industry: "치과" },
                    ].flatMap((row) => {
                      const r = best(row.industry);
                      if (!r) return [];
                      return [
                        <div key={row.ind} className="flex items-center gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-gray-800 truncate">{row.ind}</div>
                            <div className="text-[11px] text-gray-600">{r.keyword}</div>
                          </div>
                          <div className="shrink-0 px-2.5 py-1 rounded-lg border text-[11px] font-black text-blue-700 bg-blue-50 border-blue-100 tabular-nums">
                            {r.days}일 계측 {fmt(r)}
                          </div>
                        </div>,
                      ];
                    })}
                  </div>
                </div>

                {/* What you get */}
                <div className="bg-blue-600 rounded-2xl p-5">
                  <h4 className="font-bold text-white text-sm mb-3">무료 진단에서 받는 것</h4>
                  <ul className="space-y-2">
                    {["업종·경쟁사 현황 분석", "최적 마케팅 채널 추천", "현실적인 목표 기간 안내", "맞춤 서비스 패키지 제안", "예산별 우선순위 가이드"].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-xs text-blue-50">
                        <CheckCircle2 size={12} className="text-blue-300 shrink-0" strokeWidth={2.5} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
