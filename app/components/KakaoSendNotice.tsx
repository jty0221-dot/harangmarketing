"use client";

import { MessageCircle } from "lucide-react";

/**
 * 신청 직후 카카오톡 채널 창에서 보내기를 누르도록 안내한다 (2026-10-03 (토) 대표 지시).
 *
 * 신청서가 저장되면 대표에게 나에게 보내기 알림이 가지만, 나와의 채팅에 쌓여서 문의인지 눈에 띄지 않는다.
 * 손님이 채널 창에서 보내기를 눌러야 채널 관리자 알림이 울리고 그 채팅방에서 바로 상담이 이어진다.
 * 채널 주소의 text 미리 채우기는 카카오가 보장하는 기능이 아니라서, 제출할 때 같은 내용을 클립보드에도 복사한다.
 * 쓰는 곳 : 상담 신청 (app/contact) · 무료 진단 (app/free-check) 의 완료 화면.
 */
export default function KakaoSendNotice({ href, copied }: { href: string; copied: boolean }) {
  return (
    <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 mb-6 text-left">
      <p className="text-sm font-black text-gray-900 mb-1.5">카카오톡 채널 창에서 보내기를 꼭 눌러 주세요</p>
      <p className="text-xs text-gray-600 leading-relaxed mb-3">
        방금 열린 하랑마케팅 카카오톡 채널 창에서 <span className="font-semibold text-gray-800">보내기</span>를 누르시면 하랑
        대표에게 바로 알림이 가고, 그 채팅방에서 이어서 상담해 드립니다.
        {copied && " 입력칸이 비어 있으면 길게 눌러 붙여넣기 해 주세요. 신청 내용을 복사해 두었습니다."}
      </p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-full sm:w-auto items-center justify-center gap-2 min-h-11 px-5 py-3 rounded-xl bg-yellow-400 text-gray-900 font-bold text-sm hover:bg-yellow-300 transition-colors"
      >
        <MessageCircle size={15} />
        카카오톡 채널 창 다시 열기
      </a>
    </div>
  );
}
