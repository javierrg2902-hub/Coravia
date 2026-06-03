"use client";

import { useState } from "react";
import HemicyclePie from "@/components/hemiciclo/HemicyclePie";
import { CLR, NOM, SPECTR } from "@/data/parties";
import { PID } from "@/data/parties";
import { MAJ, SEATS } from "@/data/phases";
import type { SeatMap, CoalitionStance, PartyId } from "@/types/election";

interface Props {
  seats: SeatMap;
}

type StanceMap = Partial<Record<PartyId, CoalitionStance>>;

export default function Pactometro({ seats }: Props) {
  const [stances, setStances] = useState<StanceMap>({});

  const withSeats = PID
    .filter((p) => (seats[p] || 0) > 0)
    .sort((a, b) => (SPECTR[a] || 50) - (SPECTR[b] || 50));

  const favor  = withSeats.filter((p) => stances[p] === "favor").reduce((s, p) => s + (seats[p] || 0), 0);
  const contra = withSeats.filter((p) => stances[p] === "contra").reduce((s, p) => s + (seats[p] || 0), 0);
  const abs    = withSeats.filter((p) => stances[p] === "abstention").reduce((s, p) => s + (seats[p] || 0), 0);

  const first  = favor >= MAJ;
  const second = !first && favor > contra && favor > 0;
  const hasAny = withSeats.some((p) => stances[p]);

  function toggle(p: PartyId, stance: CoalitionStance) {
    setStances((prev) => ({ ...prev, [p]: prev[p] === stance ? undefined : stance }));
  }

  const hemData = withSeats.sort((a, b) => (SPECTR[a] || 50) - (SPECTR[b] || 50)).map((p) => ({
    p,
    value: seats[p] || 0,
    color:
      stances[p] === "favor"      ? "#22c55e" :
      stances[p] === "abstention" ? "#EAB308" :
      stances[p] === "contra"     ? "#ef4444" :
      hasAny                      ? "#2d4a6e" :
      CLR[p],
  }));

  const verdict = first
    ? { text: "Investidura aprobada (1ª votación)", color: "#22c55e", bg: "bg-green-500/10 border-green-500/30" }
    : second
    ? { text: "Investidura posible (2ª votación)", color: "#EAB308", bg: "bg-yellow-500/10 border-yellow-500/30" }
    : favor > 0
    ? { text: "Investidura rechazada", color: "#ef4444", bg: "bg-red-500/10 border-red-500/30" }
    : null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Hemiciclo coloreado */}
        <div>
          <HemicyclePie
            data={hemData}
            totalSeats={SEATS}
            centerMain={favor > 0 ? String(favor) : "—"}
            centerSub1={favor > 0 ? "a favor" : "sin asignar"}
            centerSub2={`Mayoría: ${MAJ}`}
            showMaj
          />
          {/* Resumen */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            {([
              ["A favor",    favor,  "text-green-400",  "bg-green-500/10"],
              ["Abstención", abs,    "text-yellow-400", "bg-yellow-500/10"],
              ["En contra",  contra, "text-red-400",    "bg-red-500/10"],
            ] as [string, number, string, string][]).map(([l, n, tc, bg]) => (
              <div key={l} className={`rounded p-3 text-center ${bg}`}>
                <div className="text-[9px] text-slate-500 uppercase tracking-wider">{l}</div>
                <div className={`text-xl font-black ${tc}`}>{n}</div>
              </div>
            ))}
          </div>
          {verdict && (
            <div className={`mt-3 p-3 rounded border text-center text-sm font-bold ${verdict.bg}`} style={{ color: verdict.color }}>
              {verdict.text}
            </div>
          )}
          {hasAny && (
            <button
              onClick={() => setStances({})}
              className="mt-2 w-full py-1.5 text-xs text-slate-500 border border-[#1e3a5f] rounded hover:border-slate-500 hover:text-slate-300 transition-colors"
            >
              Resetear pactómetro
            </button>
          )}
        </div>

        {/* Controles por partido */}
        <div className="space-y-2">
          <div className="label-sm mb-3">Asignar posición de cada partido</div>
          {withSeats.map((p) => {
            const stance = stances[p];
            return (
              <div key={p} className="card-inner p-2 flex items-center gap-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div
                    className="w-8 h-8 rounded flex items-center justify-center text-white text-[10px] font-black flex-shrink-0"
                    style={{ background: CLR[p] }}
                  >
                    {p}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-200 truncate">{NOM[p]}</div>
                    <div className="text-[10px] text-slate-500">{seats[p]} esc.</div>
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  {([
                    ["favor",       "A F",  "bg-green-600/80 border-green-500", "border-green-500/30 text-green-500 hover:bg-green-600/20"],
                    ["abstention",  "Abs",  "bg-yellow-500/80 border-yellow-400 text-black", "border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/20"],
                    ["contra",      "C",    "bg-red-600/80 border-red-500",      "border-red-500/30 text-red-500 hover:bg-red-600/20"],
                  ] as [CoalitionStance, string, string, string][]).map(([s, label, activeClass, inactiveClass]) => (
                    <button
                      key={s}
                      onClick={() => toggle(p, s)}
                      className={`w-8 h-7 text-[9px] font-black rounded border transition-all ${
                        stance === s ? activeClass + " text-white" : inactiveClass
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
