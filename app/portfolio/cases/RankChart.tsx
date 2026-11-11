import type { RankSeries } from "../../lib/result-cases";

// 선 3개까지 구분 : 색 + 실선 · 긴 점선 · 짧은 점선 (색만으로 가르지 않는다)
const STYLES = [
  { color: "var(--w-primary)", dash: undefined },
  { color: "var(--w-orange-50)", dash: "7 5" },
  { color: "var(--w-violet-50)", dash: "2 4" },
];

const W = 480;
const H = 260;
const PAD = { top: 16, right: 18, bottom: 44, left: 76 }; // 왼쪽은 폰 글자 크기로 "1000회" 가 들어갈 만큼

/** 세로축 눈금 4개 안팎. 1 은 순위의 꼭대기라 항상 넣는다 */
function ticks(min: number, max: number, roundUp = false) {
  if (max <= min) return [min];
  const raw = (max - min) / 3;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = Math.max(1, [1, 2, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? raw); // 순위 · 횟수에 1.5 같은 눈금은 없다
  const out = [min];
  for (let t = Math.ceil(min / step) * step; t <= max; t += step) if (t > min) out.push(t);
  if (out[out.length - 1] < max) out.push(roundUp ? Math.ceil(max / step) * step : max);
  return out;
}

export default function RankChart({ series }: { series: RankSeries[] }) {
  const lines = series.slice(0, STYLES.length);
  // 가로축 = 모든 선의 날짜를 합쳐 정렬하고 실제 날짜 간격으로 놓는다. 선마다 계측일이 달라도 자기 점끼리 잇고, 값이 null 인 점에서만 끊는다
  // shortcut: 날짜는 MM/DD 로 같은 해라고 본다. 해를 넘기는 사례가 오면 자료에 연도를 넣는다
  const days = [...new Set(lines.flatMap((s) => s.points.map((p) => p.d)))].sort();
  const dayNum = (d: string) => {
    const [m, dd] = d.split("/").map(Number);
    return Date.UTC(2026, m - 1, dd) / 864e5;
  };
  const dated = days.every((d) => /^\d{1,2}\/\d{1,2}$/.test(d));
  const pos = (d: string) => (dated ? dayNum(d) : days.indexOf(d));
  const values = lines.flatMap((s) => s.points.map((p) => p.v).filter((v): v is number => v != null));
  if (days.length === 0 || values.length === 0) return null;

  const invert = lines.every((s) => s.unit === "위"); // 순위는 작을수록 위
  const lo = invert ? 1 : Math.min(0, ...values);
  const hi = Math.max(...values);
  const yTicks = ticks(lo, hi, !invert);
  const top = yTicks[yTicks.length - 1];
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const p0 = pos(days[0]);
  const span = pos(days[days.length - 1]) - p0;
  const x = (d: string) => PAD.left + (span === 0 ? plotW / 2 : ((pos(d) - p0) / span) * plotW);
  const y = (v: number) => {
    const r = top === lo ? 0.5 : (v - lo) / (top - lo);
    return PAD.top + (invert ? r : 1 - r) * plotH;
  };
  // 날짜 글자는 앞 글자와 72 단위 넘게 떨어질 때만 쓴다. 마지막 날짜는 늘 쓰고 그 앞에서 겹치는 것을 뺀다
  const lastX = x(days[days.length - 1]);
  const xLabels: string[] = [];
  for (const d of days) {
    const xd = x(d);
    const prev = xLabels.length ? x(xLabels[xLabels.length - 1]) : -Infinity;
    if (d === days[days.length - 1] || (xd - prev >= 72 && lastX - xd >= 72)) xLabels.push(d);
  }
  const unit = lines[0].unit;

  return (
    <figure className="mt-4">
      <ul className="flex flex-wrap gap-x-5 gap-y-1.5">
        {lines.map((s, k) => (
          <li key={s.label} className="flex min-w-0 items-center gap-2 w-caption-1" style={{ color: "var(--w-label)" }}>
            <svg width="22" height="8" aria-hidden="true" className="shrink-0">
              <line x1="1" y1="4" x2="21" y2="4" stroke={STYLES[k].color} strokeWidth="2.5" strokeDasharray={STYLES[k].dash} />
            </svg>
            <span className="min-w-0">{s.label}</span>
          </li>
        ))}
      </ul>
      <div className="mx-auto mt-3 w-full max-w-[640px]">
        <svg viewBox={`0 0 ${W} ${H}`} /* 폰에서는 그림이 줄어드는 만큼 축 글자를 키운다 (SVG 글자 크기는 viewBox 단위) */
          className="block h-auto w-full text-[19px] md:text-[13px]" role="img" aria-label={`날짜별 ${lines.map((s) => s.label).join(" · ")} 그래프. 같은 값은 아래 표에 있습니다`}>
          {yTicks.map((t) => (
            <g key={t}>
              <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} stroke="var(--w-line-strong)" strokeWidth="1" />
              <text x={PAD.left - 8} y={y(t)} dy="0.35em" textAnchor="end" fill="var(--w-label-alt)">
                {t}{unit}
              </text>
            </g>
          ))}
          {xLabels.map((d, i) => (
            <text key={d} x={x(d)} y={H - 10} textAnchor={i === xLabels.length - 1 && i > 0 ? "end" : "middle"} fill="var(--w-label-alt)">
              {d}
            </text>
          ))}
          {lines.map((s, k) => {
            const pts = [...s.points]
              .sort((a, b) => pos(a.d) - pos(b.d))
              .map((p) => (p.v == null ? null : ([x(p.d), y(p.v)] as const)));
            // 같은 선의 앞뒤 점에 다 값이 있을 때만 잇는다 (null 이 끊는 자리)
            const segs = pts.slice(1).map((p, i) => (p && pts[i] ? `M${pts[i]![0]},${pts[i]![1]}L${p[0]},${p[1]}` : "")).join("");
            return (
              <g key={s.label}>
                {segs && <path d={segs} fill="none" stroke={STYLES[k].color} strokeWidth="2.5" strokeLinecap="round" strokeDasharray={STYLES[k].dash} />}
                {pts.map((p, i) => p && <circle key={i} cx={p[0]} cy={p[1]} r="3.5" fill="var(--w-bg)" stroke={STYLES[k].color} strokeWidth="2" />)}
              </g>
            );
          })}
        </svg>
      </div>
      <details className="mt-3">
        <summary className="inline-flex min-h-11 cursor-pointer items-center w-label-1 font-semibold" style={{ color: "var(--w-primary)" }}>
          같은 값을 표로 보기
        </summary>
        <div className="overflow-x-auto">
          <table className="mt-2 w-full text-left w-body-2 w-num">
            <thead>
              <tr className="w-caption-1" style={{ color: "var(--w-label-assistive)" }}>
                <th className="py-2 pr-4 font-medium">날짜</th>
                {lines.map((s) => (
                  <th key={s.label} className="py-2 pr-4 font-medium">{s.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map((d) => (
                <tr key={d} className="border-t" style={{ borderColor: "var(--w-line)" }}>
                  <td className="py-2 pr-4" style={{ color: "var(--w-label-alt)" }}>{d}</td>
                  {lines.map((s) => {
                    const v = s.points.find((p) => p.d === d)?.v;
                    return (
                      <td key={s.label} className="py-2 pr-4" style={{ color: "var(--w-label)" }}>
                        {v == null ? "계측 없음" : `${v}${s.unit}`}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}
