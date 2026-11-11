/* ── meta description · og:description 길이 상한 (2026-10-28 · 네이버 서치어드바이저 `80자 이내` 경고) ──
 * 셈은 공백 포함 글자 수다 (파이썬 len 과 같다). 새 쪽이 또 넘지 않게 두 겹으로 막는다.
 * 1) 템플릿으로 만드는 쪽(블로그 · 사진 상세 · 병원 과목)은 아래 함수를 거치고, 넘으면 빌드가 멈춘다.
 * 2) 손으로 적는 쪽은 `npm run check:meta` (next start 뒤 사이트맵 전 쪽을 잰다) 가 종료 1 로 잡는다.
 */
export const META_DESC_MAX = 80;

/** 80자를 넘으면 빌드(정적 생성)에서 멈춘다. 말줄임으로 자르지 않는다 */
export function metaDesc(text: string): string {
  const n = [...text].length;
  if (n > META_DESC_MAX) throw new Error(`meta description ${n}자 (상한 ${META_DESC_MAX}자): ${text}`);
  return text;
}

/** 문장 경계에서만 자른다. 앞 문장부터 차례로 붙이되 80자를 넘기는 문장은 건너뛴다. 첫 문장이 넘으면 멈춘다 */
export function fitDesc(...parts: string[]): string {
  const sentences = parts.flatMap((p) => p.split(/(?<=[.!?])\s+/)).map((s) => s.trim()).filter(Boolean);
  let out = metaDesc(sentences[0] ?? "");
  for (const s of sentences.slice(1)) {
    if ([...`${out} ${s}`].length <= META_DESC_MAX) out = `${out} ${s}`;
  }
  return out;
}
