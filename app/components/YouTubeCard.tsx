"use client";

import { useState } from "react";
import { Play } from "lucide-react";

interface YouTubeCardProps {
  videoId: string;
  title: string;
  desc?: string;
  badge?: string;
}

export default function YouTubeCard({ videoId, title, desc, badge }: YouTubeCardProps) {
  const [playing, setPlaying] = useState(false);
  const thumb = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <div className="rounded-2xl overflow-hidden bg-gray-900 border border-white/10 group">
      {playing ? (
        <div className="aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      ) : (
        <button
          onClick={() => setPlaying(true)}
          className="relative w-full aspect-video overflow-hidden block"
          aria-label={`영상 재생: ${title}`}
        >
          <img
            src={thumb}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
            }}
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
              <Play size={22} className="text-white fill-white ml-1" />
            </div>
          </div>
          {badge && (
            <span className="absolute top-3 left-3 bg-blue-600 text-white text-[11px] font-black px-2 py-0.5 rounded-full">
              {badge}
            </span>
          )}
        </button>
      )}
      <div className="p-4">
        <p className="text-white font-bold text-sm leading-snug mb-1 line-clamp-2">{title}</p>
        {desc && <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">{desc}</p>}
      </div>
    </div>
  );
}
