"use client";

import { Star, MessageCircle, Clock, ShieldCheck } from "lucide-react";

import { SITE } from "../lib/seo";
export default function ReviewsSection() {
  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center gap-3 justify-center mb-4">
            <div className="w-6 h-[2px] bg-blue-600" />
            <span className="text-[11px] font-black uppercase tracking-[0.22em] text-blue-600">실제 고객 후기</span>
            <div className="w-6 h-[2px] bg-blue-600" />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3" style={{ letterSpacing: "-0.03em" }}>
            직접 경험한 대표님들이<br className="sm:hidden" /> 말씀하십니다
          </h2>
          <p className="text-sm text-gray-500">조작 없음 · 실제 클라이언트 후기만 게재합니다</p>
        </div>

        {/* Placeholder state */}
        <div className="max-w-2xl mx-auto">
          <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-10 md:p-14 flex flex-col items-center text-center gap-5">

            <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
              <MessageCircle size={28} className="text-white" strokeWidth={2} />
            </div>

            <div>
              <h3 className="text-lg font-black text-gray-800 mb-2">
                실제 고객 후기를 준비 중입니다
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                카카오톡으로 직접 받은 클라이언트 후기를 정리해 올릴 예정입니다.<br />
                조작되거나 꾸민 후기는 올리지 않습니다.
              </p>
            </div>

            {/* Trust stats */}
            <div className="grid grid-cols-3 gap-4 w-full mt-2">
              {[
                { icon: Star, val: SITE.stats.renewalRate, sub: "재계약률" },
                { icon: ShieldCheck, val: "10년+", sub: "마케팅 경력" },
                { icon: Clock, val: "500+", sub: "완료 프로젝트" },
              ].map(({ icon: Icon, val, sub }) => (
                <div key={sub} className="bg-white rounded-2xl border border-gray-100 px-3 py-4 flex flex-col items-center gap-1 shadow-sm">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center mb-1">
                    <Icon size={15} className="text-blue-600" strokeWidth={2} />
                  </div>
                  <span className="text-lg font-black text-gray-900">{val}</span>
                  <span className="text-[11px] text-gray-400">{sub}</span>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Bottom note */}
        <div className="mt-10 max-w-xl mx-auto text-center">
          <p className="text-xs text-gray-400 leading-relaxed">
            후기는 절대 조작하지 않습니다.<br />
            모든 후기는 실제 계약 클라이언트께서 직접 남겨주신 것만 게재합니다.
          </p>
          <p className="text-[11px] text-gray-400 mt-1">하랑마케팅 대표</p>
        </div>

      </div>
    </section>
  );
}
