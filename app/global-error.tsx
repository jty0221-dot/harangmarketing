"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

/**
 * 루트 레이아웃 자체가 터졌을 때 뜨는 최후의 화면.
 *
 * 이 파일은 루트 레이아웃을 통째로 대체하므로 html·body 를 직접 들고 있어야 하고,
 * globals.css 가 로드되지 않는다. 그래서 Tailwind 클래스가 아니라 인라인 스타일로 쓴다
 * (docs/01-app/03-api-reference/03-file-conventions/error.md 의 Global Error 항목).
 *
 * Header·Footer 도 부르지 않는다. 레이아웃이 깨진 상황에서 같은 코드를 다시 불러
 * 두 번째 오류를 만들지 않기 위해서다. 여기서는 연락처만 확실히 남긴다.
 */
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="ko">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          backgroundColor: "#F7F7F8",
          color: "#212225",
          fontFamily:
            "Pretendard, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Malgun Gothic', sans-serif",
          letterSpacing: "-0.01309em",
        }}
      >
        <div style={{ maxWidth: "480px", width: "100%", textAlign: "center" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              backgroundColor: "#0066FF",
              marginBottom: "28px",
            }}
          >
            <AlertTriangle size={26} color="#FFFFFF" strokeWidth={2} />
          </div>

          <h1
            style={{
              fontSize: "22px",
              fontWeight: 800,
              color: "#171719",
              margin: "0 0 12px",
            }}
          >
            잠시 문제가 생겼습니다
          </h1>
          <p
            style={{
              fontSize: "15px",
              lineHeight: 1.6,
              color: "#70737C",
              margin: "0 0 28px",
            }}
          >
            사이트를 여는 중에 오류가 났습니다. 다시 시도해 주시고,
            같은 화면이 계속 나오면 아래 번호로 알려주세요.
          </p>

          <button
            type="button"
            onClick={() => retry()}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "12px 24px",
              borderRadius: "12px",
              border: "none",
              backgroundColor: "#0066FF",
              color: "#FFFFFF",
              fontSize: "14px",
              fontWeight: 800,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <RotateCcw size={15} />
            다시 시도
          </button>

          <p style={{ fontSize: "13px", color: "#989BA2", margin: "24px 0 0" }}>
            하랑마케팅 010-7541-9054
          </p>

          {error.digest && (
            <p style={{ fontSize: "11px", color: "#C2C4C8", margin: "12px 0 0" }}>
              오류 번호 {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
