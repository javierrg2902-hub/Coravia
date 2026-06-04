"use client";

import { useState, useEffect } from "react";
import ElectionComparison from "./ElectionComparison";
import type { HistoricalDataJson, HistoricalElectionResult, PhaseData } from "@/types/election";
import { PID, CLR } from "@/data/parties";
import { hasNoDangerousKeys } from "@/lib/validation";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "/Coravia";
const MAX_HIST_BYTES = 50_000;

interface Props {
  activePhaseData: PhaseData;
}

export default function ComparacionTab({ activePhaseData }: Props) {
  const [historical, setHistorical] = useState<HistoricalElectionResult[]>([]);
  const [histError, setHistError] = useState(false);
  const [highlightedParty, setHighlightedParty] = useState<string | null>(null);
  const [hiddenParties, setHiddenParties] = useState<Set<string>>(new Set());
  const [metric, setMetric] = useState<"votos" | "escanos">("votos");

  useEffect(() => {
    let active = true;
    fetch(`${BASE}/data/elecciones-anteriores.json`)
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const text = await r.text();
        if (text.length > MAX_HIST_BYTES) throw new Error("Respuesta demasiado grande");
        const raw: unknown = JSON.parse(text);
        if (!hasNoDangerousKeys(raw)) throw new Error("Datos inválidos");
        const data = raw as HistoricalDataJson;
        // Normalize votosPct from fractions (0.21) to percentages (21.0) so display
        // components can use raw values without year-based scaling heuristics.
        const normalized = Array.isArray(data.elecciones)
          ? data.elecciones.map((y) => ({
              ...y,
              votosPct: Object.fromEntries(
                Object.entries(y.votosPct).map(([k, v]) => { const n = v as number; return [k, n > 1 ? n : n * 100]; })
              ) as Record<string, number>,
            }))
          : [];
        if (active) { setHistorical(normalized); setHistError(false); }
      })
      .catch(() => { if (active) setHistError(true); });
    return () => { active = false; };
  }, []);

  const totalVotos = activePhaseData.vv || 1;
  const currentPct: Partial<Record<string, number>> = {};
  PID.forEach((p) => {
    currentPct[p] = (activePhaseData.votes[p] / totalVotos) * 100;
  });

  const allYears = [
    ...historical,
    {
      year: 2026,
      label: "Elecciones 2026",
      votosPct: currentPct as Record<string, number>,
      escanos: {} as Record<string, number>,
      presidencial: { candidato: "Rodrigo Vinyas", partido: "PLP" as const, pct: 44.0 },
      gobernadores: [],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="card p-4">
        <div className="label-xs mb-1">Comparativa Electoral</div>
        <div className="text-lg font-black text-slate-100">2022 · 2024 · 2026</div>
        <div className="text-xs text-slate-500 mt-1">
          Evolución del voto por partido entre elecciones generales
        </div>
      </div>

      {histError && (
        <div className="card border-yellow-800/50 bg-yellow-900/10 p-3 text-xs text-yellow-300 flex items-center gap-2">
          <span>⚠️</span>
          <span>No se pudieron cargar los datos históricos. Mostrando solo 2026.</span>
        </div>
      )}

      {allYears.length > 0 && (
        <div className="card p-4">
          {/* Metric toggle */}
          <div className="flex gap-2 mb-4">
            {(["votos", "escanos"] as const).map(m => (
              <button key={m} onClick={() => setMetric(m)}
                className={`px-3 py-1.5 text-xs font-bold rounded transition-all
                  ${metric === m ? "bg-yellow-500 text-black" : "bg-[#0c1e3a] text-slate-400 border border-[#1e3a5f] hover:border-slate-500"}`}>
                {m === "votos" ? "% Voto" : "Escaños"}
              </button>
            ))}
            {highlightedParty && (
              <button onClick={() => setHighlightedParty(null)}
                className="px-3 py-1.5 text-xs font-bold rounded bg-[#0c1e3a] text-slate-400 border border-[#1e3a5f] hover:border-slate-500">
                Quitar selección
              </button>
            )}
          </div>

          {/* Party filter checkboxes */}
          <div className="flex flex-wrap gap-1 mb-4">
            {PID.map(p => (
              <button key={p} onClick={() => setHiddenParties(prev => {
                const next = new Set(prev);
                if (next.has(p)) next.delete(p); else next.add(p);
                return next;
              })}
                className={`px-2 py-1 text-[10px] font-black rounded transition-all
                  ${hiddenParties.has(p) ? "opacity-30 bg-[#0c1e3a] border border-[#1e3a5f]" : "border border-transparent"}`}
                style={{ color: CLR[p] }}>
                {p}
              </button>
            ))}
          </div>

          <ElectionComparison
            elections={allYears}
            highlightedParty={highlightedParty}
            setHighlightedParty={setHighlightedParty}
            hiddenParties={hiddenParties}
            metric={metric}
          />
        </div>
      )}

      <div className="card p-4">
        <div className="label-sm mb-3">Variación de voto por partido</div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#1e3a5f]">
                <th className="text-left py-2 px-3 text-slate-500 font-bold uppercase tracking-wider text-[10px]">Partido</th>
                {allYears.map((y) => (
                  <th key={y.year} className="text-right py-2 px-3 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    {y.year}
                  </th>
                ))}
                <th className="text-right py-2 px-3 text-slate-500 font-bold uppercase tracking-wider text-[10px]">Δ 22→26</th>
              </tr>
            </thead>
            <tbody>
              {PID
                .filter(p => !hiddenParties.has(p))
                .map((p) => {
                  const vals = allYears.map((y) => y.votosPct[p] ?? 0);
                  const first = vals[0] ?? 0;
                  const last = vals[vals.length - 1] ?? 0;
                  const delta = last - first;
                  const isHighlighted = !highlightedParty || highlightedParty === p;
                  return (
                    <tr
                      key={p}
                      className="border-b border-[#1e3a5f]/40 cursor-pointer hover:bg-white/5 transition-all"
                      style={{ opacity: isHighlighted ? 1 : 0.2 }}
                      onClick={() => setHighlightedParty(highlightedParty === p ? null : p)}
                    >
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-4 rounded-sm" style={{ backgroundColor: CLR[p] }} />
                          <span className="font-black uppercase text-[11px]" style={{ color: CLR[p] }}>{p}</span>
                        </div>
                      </td>
                      {vals.map((v, i) => (
                        <td key={i} className="text-right py-2 px-3 tabular-nums text-slate-300">
                          {v.toFixed(1)}%
                        </td>
                      ))}
                      <td className={`text-right py-2 px-3 tabular-nums font-bold ${
                        histError
                          ? "text-slate-600"
                          : delta > 0 ? "text-green-400" : delta < 0 ? "text-red-400" : "text-slate-500"
                      }`}>
                        {histError ? "N/A" : `${delta > 0 ? "+" : ""}${delta.toFixed(1)}pp`}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
