"use client";

import { PHASES } from "@/data/phases";

interface Props {
  phaseIdx: number;
  onChange: (idx: number) => void;
}

export default function PhaseBar({ phaseIdx, onChange }: Props) {
  return (
    <div className="flex gap-1 overflow-x-auto tab-scroll py-1 px-0.5">
      {PHASES.map((ph, i) => (
        <button
          key={ph.n}
          onClick={() => onChange(i)}
          aria-pressed={phaseIdx === i}
          className={`
            flex-shrink-0 px-3 py-1.5 rounded text-[11px] font-bold transition-all
            ${phaseIdx === i
              ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/20"
              : "bg-[#0c1e3a] text-slate-400 hover:bg-[#1e3a5f] hover:text-slate-200 border border-[#1e3a5f]"
            }
          `}
        >
          {ph.n}
        </button>
      ))}
    </div>
  );
}
