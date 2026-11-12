"use client";

import { useState } from "react";
import Link from "next/link";
import p from "../../components/persuasion.module.css";

/*
 * 무료 구성 진단 신청 · 기존 상담 API(/api/contact)를 그대로 쓴다. 자동 생성 기능은 없다 (대표 결재 후보).
 * 저장 · 알림 · 과다 요청 방지 · 봇 트랩(website)은 API 쪽 규칙을 따른다.
 */
export default function PersuasionForm() {
  const [subject, setSubject] = useState("");
  const [points, setPoints] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "fail">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "sending") return;
    setState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          industry: "구성 진단 (상세페이지 · 홈페이지)",
          message: `상품명 또는 업체명: ${subject}\n특징: ${points}`,
          source: "web · persuasion",
          website,
        }),
      });
      setState(res.ok ? "done" : "fail");
    } catch {
      setState("fail");
    }
  }

  if (state === "done") return <p className={p.done} role="status">접수됐습니다. 하랑 대표가 확인하고 연락드립니다.</p>;

  return (
    <form className={p.form} onSubmit={submit}>
      <label>
        상품명 또는 업체명
        <input value={subject} onChange={(e) => setSubject(e.target.value)} required maxLength={40} />
      </label>
      <label>
        특징 몇 줄
        <span className={p.hint}>어떤 점을 내세우고 싶은지, 손님이 자주 묻는 것이 무엇인지 적어 주세요.</span>
        <textarea value={points} onChange={(e) => setPoints(e.target.value)} maxLength={1500} />
      </label>
      <div className={p.pair}>
        <label>
          이름 또는 담당자
          <input value={name} onChange={(e) => setName(e.target.value)} required maxLength={60} autoComplete="name" />
        </label>
        <label>
          연락처
          <input value={phone} onChange={(e) => setPhone(e.target.value)} required maxLength={40} inputMode="tel" autoComplete="tel" />
        </label>
      </div>
      <div className={p.trap} aria-hidden="true">
        <input name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>
      <p className={p.note}>
        남겨 주신 연락처는 이 상담 연락에만 씁니다. <Link href="/privacy">개인정보처리방침</Link>
      </p>
      {state === "fail" && (
        <p className={p.fail} role="alert">접수가 되지 않았습니다. 잠시 뒤 다시 보내 주시거나 상담 페이지를 이용해 주세요.</p>
      )}
      <button type="submit" className={p.submit} disabled={state === "sending"}>
        {state === "sending" ? "보내는 중" : "무료 구성 진단 신청"}
      </button>
    </form>
  );
}
