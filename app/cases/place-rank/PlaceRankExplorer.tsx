"use client";

import { useState } from "react";
import { Filter } from "lucide-react";
import { PlaceRankCaseCards } from "../../components/PlaceRankCases";
import {
  PLACE_RANK_CASES,
  PLACE_RANK_INDUSTRIES,
} from "../../lib/place-rank-cases";

/**
 * 업종 필터. 목록과 숫자는 app/lib/place-rank-cases.ts 에서 온다.
 * 필터는 배열을 거르기만 하고 값을 만들지 않는다.
 */
export default function PlaceRankExplorer() {
  const [industry, setIndustry] = useState<string>("전체");

  const list =
    industry === "전체"
      ? PLACE_RANK_CASES
      : PLACE_RANK_CASES.filter((c) => c.industry === industry);

  const tabs = ["전체", ...PLACE_RANK_INDUSTRIES];

  return (
    <div>
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        <Filter size={14} className="text-gray-500 shrink-0 mr-1" />
        {tabs.map((tab) => {
          const on = industry === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setIndustry(tab)}
              className={`inline-flex items-center px-4 py-2 min-h-11 md:min-h-0 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors shrink-0 border ${
                on
                  ? "text-white border-transparent shadow-sm"
                  : "bg-white text-gray-500 border-gray-200 hover:text-gray-800"
              }`}
              style={on ? { background: "var(--w-primary)" } : undefined}
            >
              {tab}
              {tab !== "전체" && (
                <span className={`ml-1.5 text-xs ${on ? "text-white" : "text-gray-500"}`}>
                  {PLACE_RANK_CASES.filter((c) => c.industry === tab).length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <PlaceRankCaseCards cases={list} columns={3} />
    </div>
  );
}
