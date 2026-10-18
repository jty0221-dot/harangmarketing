"use client";
import {useState} from "react";
import {Pause,Play} from "lucide-react";

export default function TrustTicker({items}:{items:string[]}) {
  const [paused, setPaused] = useState(false);
  return (
    <div className="flex items-stretch" style={{ background: "var(--h-navy)" }}>
      <div className="flex-1 min-w-0 overflow-hidden py-3">
        <div
          className="flex animate-marquee whitespace-nowrap"
          style={paused ? { animationPlayState: "paused" } : undefined}
        >
          {[...items, ...items].map((text, i) => (
            <span
              key={i}
              aria-hidden={i >= items.length ? true : undefined}
              className="flex items-center gap-3 px-6 text-xs text-white font-semibold"
            >
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${i % 2 ? "bg-blue-200" : "bg-white/60"}`} />
              {text}
            </span>
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-pressed={paused}
        aria-label="흐르는 문구 멈추기"
        title={paused ? "다시 흐르게 하기" : "흐르는 문구 멈추기"}
        className="ticker-toggle shrink-0 w-11 min-h-11 flex items-center justify-center border-l border-white/15 text-white/80 hover:text-white transition-colors motion-reduce:hidden"
      >
        {paused ? <Play size={16} strokeWidth={2.5} /> : <Pause size={16} strokeWidth={2.5} />}
      </button>
    </div>
  );
}
