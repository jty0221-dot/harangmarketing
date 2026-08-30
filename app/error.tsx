"use client";

import { useEffect } from "react";
import Link from "next/link";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { AlertTriangle, RotateCcw, Home, MessageCircle, Phone } from "lucide-react";
import { SITE } from "./lib/seo";

/**
 * 라우트 렌더 중 오류가 났을 때 뜨는 화면.
 *
 * 이 파일이 없으면 Next 기본 영문 오류 화면이 그대로 노출된다.
 * 마케팅 회사 홈페이지에서 영문 스택이 뜨면 그 자체가 영업 손실이라
 * 한국어 안내와 연락 수단(카톡·전화)을 같이 둔다.
 *
 * Next 16 주의: 재시도 prop 이름이 reset → retry 로 바뀌었다.
 * (docs/01-app/03-api-reference/03-file-conventions/error.md)
 *
 * error.digest 는 서버 로그와 대조할 수 있는 해시다.
 * 사장님이 이 값을 알려주면 어느 요청에서 터졌는지 바로 찾을 수 있어 화면에 남긴다.
 */
export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <Header />
      <main className="pt-[104px] md:pt-[108px] min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center py-20 px-4">
          <div className="max-w-2xl w-full text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 shadow-xl shadow-blue-200 mb-8">
              <AlertTriangle size={28} className="text-white" strokeWidth={2} />
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">
              화면을 불러오지 못했어요
            </h1>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-8 max-w-md mx-auto">
              일시적인 문제일 수 있습니다. 다시 시도해 보시고, 같은 화면이 계속 나오면
              아래 연락처로 알려주세요. 바로 확인하겠습니다.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
              <button
                type="button"
                onClick={() => retry()}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-black text-sm hover:bg-blue-700 transition-colors shadow-sm"
              >
                <RotateCcw size={15} />
                다시 시도
              </button>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gray-900 text-white font-bold text-sm hover:bg-gray-800 transition-colors"
              >
                <Home size={15} />
                홈으로 돌아가기
              </Link>
              <a
                href={SITE.kakaoChat}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-yellow-400 text-gray-900 font-black text-sm hover:bg-yellow-300 transition-colors"
              >
                <MessageCircle size={15} />
                카카오로 문의하기
              </a>
            </div>

            <div className="inline-flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-gray-400">
              <span className="flex items-center gap-1.5">
                <Phone size={11} className="text-blue-500" strokeWidth={2.5} />
                {SITE.phone}
              </span>
              <span>상담 비용 0원</span>
            </div>

            {error.digest && (
              <p className="mt-6 text-[11px] text-gray-300">
                오류 번호 {error.digest}
              </p>
            )}
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
}
