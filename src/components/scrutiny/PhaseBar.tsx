"use client";

import { PHASES, CACHE } from "@/data/phases";

interface Props {
  phaseIdx: number;
  onChange: (idx: number) => void;
}

export default function PhaseBar({ phaseIdx, onChange }: Props) {
  return (
    /* Fade derecho como indicador de scroll horizontal */
    <div className="relative">
      <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-[#0a1628] to-transparent pointer-events-none z-10" />
      <div
        className="flex gap-1.5 overflow-x-auto tab-scroll pb-1"
        role="tablist"
        aria-label="Fase de escrutinio"
      >
        {PHASES.map((ph, i) => (
          <button
            key={ph.n}
            onClick={() => onChange(i)}
            role="tab"
            aria-selected={phaseIdx === i}
            aria-label={`${ph.n} — ${CACHE[i].pct}% escrutado`}
            /* min-w garantiza toque mínimo de 44px horizontal; py-2.5 da ~44px vertical */
            className={`
              flex-shrink-0 min-w-[44px] flex flex-col items-center
              px-2.5 py-2.5 rounded text-[11px] font-bold transition-all
              ${phaseIdx === i
                ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/20"
                : "bg-[#0c1e3a] text-slate-400 hover:bg-[#1e3a5f] hover:text-slate-200 border border-[#1e3a5f]"
              }
            `}
          >
            <span>{ph.n}</span>
            <span className={`text-[9px] leading-none mt-0.5 ${phaseIdx === i ? "text-black/70" : "text-slate-600"}`}>
              {CACHE[i].pct}%
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
