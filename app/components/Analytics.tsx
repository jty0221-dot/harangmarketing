"use client";

// gtag 전환 이벤트 헬퍼
// gtag.js 자체는 app/layout.tsx 의 <head> 에서 로드된다.
// 여기서는 로드된 gtag 로 전환 이벤트만 전송한다.

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    /** ChatGPT 광고 측정 픽셀. NEXT_PUBLIC_OPENAI_PIXEL_ID 가 있을 때만 layout 이 심는다 */
    oaiq?: (...args: unknown[]) => void;
  }
}

export function trackEvent(eventName: string, params?: Record<string, string | number>) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, params);
  }
}

/**
 * ChatGPT 광고 전환 (OpenAI Measurement Pixel).
 * 이벤트 이름·data.type 은 developers.openai.com/ads/supported-events 기준이다.
 *   lead_created     : 상담·진단 신청이 서버에 저장됐을 때만. 광고 최적화 목표로 쓰는 값이라 부풀리지 않는다.
 *   custom 이벤트    : 카카오·전화 클릭. 신청보다 약한 신호라 표준 lead 와 섞지 않는다.
 * 픽셀이 없으면(환경변수 미설정) 아무 일도 하지 않는다.
 */
export function trackOpenAI(name: "lead_created" | "kakao_click" | "phone_click") {
  if (typeof window === "undefined" || !window.oaiq) return;
  if (name === "lead_created") {
    window.oaiq("measure", "lead_created", { type: "customer_action" });
  } else {
    window.oaiq("measure", "custom", { type: "custom" }, { custom_event_name: name });
  }
}

// 주요 전환 이벤트
export const GA_EVENTS = {
  contactFormStart: () => trackEvent("contact_form_start"),
  contactFormSubmit: (industry: string) => trackEvent("contact_form_submit", { industry }),
  kakaoClick: (source: string) => {
    trackEvent("kakao_click", { source });
    trackOpenAI("kakao_click");
  },
  phoneClick: (source: string) => {
    trackEvent("phone_click", { source });
    trackOpenAI("phone_click");
  },
  /** 상담·진단 신청이 서버에 저장된 뒤에만 부른다 */
  leadSaved: (form: "contact" | "free-check", source: string) => {
    trackEvent("generate_lead", { form, source });
    trackOpenAI("lead_created");
  },
  freeCheckStart: () => trackEvent("free_check_start"),
  estimateStart: () => trackEvent("estimate_start"),
  blogPostView: (slug: string) => trackEvent("blog_post_view", { slug }),
};
