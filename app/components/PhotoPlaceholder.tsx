import { ImageIcon } from "lucide-react";

interface Props {
  label: string;
  hint?: string;
  width?: string;
  height?: string;
  className?: string;
  dark?: boolean;
}

export default function PhotoPlaceholder({
  label,
  hint,
  width = "w-full",
  height = "h-48",
  className = "",
  dark = false,
}: Props) {
  return (
    <div
      className={`
        ${width} ${height} ${className}
        relative flex flex-col items-center justify-center gap-2
        rounded-2xl overflow-hidden
        ${dark ? "bg-white/5" : "bg-gray-600"}
      `}
    >
      {/* shimmer sweep */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: dark
            ? "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%)"
            : "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.7) 50%, transparent 60%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 2.4s linear infinite",
        }}
      />

      {/* subtle dot grid */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: dark
            ? "radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)"
            : "radial-gradient(circle, #C8C0B0 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="relative flex flex-col items-center gap-2 px-4 text-center">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${dark ? "bg-white/10" : "bg-white shadow-sm border border-gray-200"}`}>
          <ImageIcon size={18} className={dark ? "text-white/50" : "text-gray-400"} strokeWidth={1.5} />
        </div>
        <p className={`text-xs font-bold ${dark ? "text-white/60" : "text-gray-500"}`}>
          {label}
        </p>
        {hint && (
          <p className={`text-[11px] leading-relaxed max-w-[180px] ${dark ? "text-white/35" : "text-gray-400"}`}>
            {hint}
          </p>
        )}
        <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${dark ? "bg-white/10 text-white/40" : "bg-blue-50 text-blue-400 border border-blue-100"}`}>
          사진 교체 예정
        </span>
      </div>
    </div>
  );
}
