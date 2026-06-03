"use client";

import { useState, useEffect } from "react";
import ElectionComparison from "./ElectionComparison";
import type { HistoricalDataJson, HistoricalElectionResult } from "@/types/election";
import { CACHE } from "@/data/phases";
import { PID, CLR, NOM } from "@/data/parties";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "/Coravia";

export default function ComparacionTab() {
  const [historical, setHistorical] = useState<HistoricalElectionResult[]>([]);

  useEffect(() => {
    fetch(`${BASE}/data/elecciones-anteriores.json`)
      .then((r) => r.json())
      .then((data: HistoricalDataJson) => setHistorical(data.elecciones))
      .catch(() => {});
  }, []);

  // Datos actuales (última fase disponible)
  const currentPhase = CACHE[CACHE.length - 1];
  const totalVotos = currentPhase.vv || 1;
  const currentPct: Partial<Record<string, number>> = {};
  PID.forEach((p) => {
    currentPct[p] = (currentPhase.votes[p] / totalVotos) * 100;
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

      {allYears.length > 0 && (
        <ElectionComparison elections={allYears} />
      )}

      {/* Tabla comparativa */}
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
              {PID.map((p) => {
                const vals = allYears.map((y) => (y.votosPct[p] ?? 0) * (y.year < 2026 ? 100 : 1));
                const first = vals[0] ?? 0;
                const last = vals[vals.length - 1] ?? 0;
                const delta = last - first;
                return (
                  <tr key={p} className="border-b border-[#1e3a5f]/40">
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
                    <td className={`text-right py-2 px-3 tabular-nums font-bold ${delta > 0 ? "text-green-400" : delta < 0 ? "text-red-400" : "text-slate-500"}`}>
                      {delta > 0 ? "+" : ""}{delta.toFixed(1)}pp
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
