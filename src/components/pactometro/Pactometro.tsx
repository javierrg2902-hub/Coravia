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

const STANCE_CONFIG: { stance: CoalitionStance; label: string; shortLabel: string; activeClass: string; inactiveClass: string }[] = [
  {
    stance: "favor",
    label: "A favor",
    shortLabel: "A favor",
    activeClass: "bg-green-600 border-green-500 text-white",
    inactiveClass: "border-green-800/60 text-green-600 hover:bg-green-900/30",
  },
  {
    stance: "abstention",
    label: "Abstención",
    shortLabel: "Abs",
    activeClass: "bg-yellow-500 border-yellow-400 text-black",
    inactiveClass: "border-yellow-800/60 text-yellow-600 hover:bg-yellow-900/30",
  },
  {
    stance: "contra",
    label: "En contra",
    shortLabel: "Contra",
    activeClass: "bg-red-600 border-red-500 text-white",
    inactiveClass: "border-red-800/60 text-red-600 hover:bg-red-900/30",
  },
];

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

  const hemData = withSeats.map((p) => ({
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
    ? { text: "✅ Investidura aprobada (1ª votación)", color: "#22c55e", bg: "bg-green-500/10 border-green-500/30" }
    : second
    ? { text: "⚠️ Investidura posible (2ª votación — sin mayoría absoluta)", color: "#EAB308", bg: "bg-yellow-500/10 border-yellow-500/30" }
    : favor > 0
    ? { text: "❌ Investidura rechazada", color: "#ef4444", bg: "bg-red-500/10 border-red-500/30" }
    : null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

        {/* ── Hemiciclo coloreado ── */}
        <div>
          <HemicyclePie
            data={hemData}
            totalSeats={SEATS}
            centerMain={favor > 0 ? String(favor) : "—"}
            centerSub1={favor > 0 ? "a favor" : "sin asignar"}
            centerSub2={`Mayoría: ${MAJ}`}
            showMaj
          />

          {/* Resumen de votos */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            {([
              ["A favor",    favor,  "text-green-400",  "bg-green-500/10"],
              ["Abstención", abs,    "text-yellow-400", "bg-yellow-500/10"],
              ["En contra",  contra, "text-red-400",    "bg-red-500/10"],
            ] as [string, number, string, string][]).map(([l, n, tc, bg]) => (
              <div key={l} className={`rounded-lg p-3 text-center ${bg}`}>
                <div className="text-[11px] text-slate-400 mb-1">{l}</div>
                <div className={`text-2xl font-black ${tc}`}>{n}</div>
                <div className="text-[10px] text-slate-600">esc.</div>
              </div>
            ))}
          </div>

          {verdict && (
            <div className={`mt-3 p-3 rounded-lg border text-sm font-bold text-center ${verdict.bg}`}
              style={{ color: verdict.color }}
            >
              {verdict.text}
            </div>
          )}

          {hasAny && (
            <button
              onClick={() => setStances({})}
              className="mt-3 w-full py-3 text-sm text-slate-400 border border-[#1e3a5f] rounded-lg hover:border-slate-500 hover:text-slate-200 transition-colors"
            >
              Resetear pactómetro
            </button>
          )}
        </div>

        {/* ── Controles por partido ── */}
        <div className="space-y-2">
          <div className="label-sm mb-3">Asignar posición de cada partido</div>
          {withSeats.map((p) => {
            const stance = stances[p];
            return (
              <div key={p} className="card-inner p-3 flex items-center gap-2">
                {/* Info del partido */}
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-[10px] font-black flex-shrink-0"
                    style={{ background: CLR[p] }}
                    aria-hidden="true"
                  >
                    {p}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-200 truncate">{NOM[p]}</div>
                    <div className="text-[11px] text-slate-500">{seats[p]} esc.</div>
                  </div>
                </div>

                {/* Botones de postura — mínimo 44px de alto, texto legible */}
                <div className="flex gap-1 flex-shrink-0">
                  {STANCE_CONFIG.map(({ stance: s, shortLabel, activeClass, inactiveClass }) => (
                    <button
                      key={s}
                      onClick={() => toggle(p, s)}
                      aria-pressed={stance === s}
                      aria-label={`${p}: ${s}`}
                      /* min-w y h-11 garantizan 44×44px de toque */
                      className={`
                        min-w-[44px] h-11 px-1 text-[10px] font-black rounded-lg border
                        transition-all leading-tight
                        ${stance === s ? activeClass : inactiveClass}
                      `}
                    >
                      {shortLabel}
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
