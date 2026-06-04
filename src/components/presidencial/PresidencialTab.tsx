"use client";

import { useState } from "react";
import { PRES_CANDS, PRES_BY_PHASE, PRES_TOTAL_PADRON, PRES_PARTICIPACION } from "@/data/presidential";
import { PRES_BY_REGION, getPresRegionVotes, getPresDistrictResults } from "@/data/presRegional";
import { REGION_DATA } from "@/data/regional";
import PhaseBar from "@/components/scrutiny/PhaseBar";
import type { RegionId } from "@/types/election";

interface Props {
  phaseIdx: number;
  setPhaseIdx: (i: number) => void;
}

const CAND_COLORS: Record<string, string> = {
  vinyas:  "#03427b",
  calleja: "#7a0000",
  santos:  "#00abff",
  blank:   "#AAAAAA",
  null:    "#777777",
};

const CAND_NAMES: Record<string, string> = {
  vinyas:  "Rodrigo Vinyas",
  calleja: "María Calleja",
  santos:  "Héctor Santos",
  blank:   "En blanco",
  null:    "Nulos",
};

const DISPLAY_CANDS = ["vinyas", "calleja", "santos"] as const;

const REGION_LABELS: Record<RegionId, string> = {
  E1: "DF Monteblanco",
  E2: "Florente",
  E3: "Litoral",
  E4: "Palmdale",
  E5: "Sta. Catalina",
  E6: "Castellón",
  E7: "Alcalá",
  E8: "Río Bravo",
};

export default function PresidencialTab({ phaseIdx, setPhaseIdx }: Props) {
  const [presDistFilter, setPresDistFilter] = useState<string>("all");
  const [showAllDistricts, setShowAllDistricts] = useState(false);

  const phase = PRES_BY_PHASE[phaseIdx] ?? PRES_BY_PHASE[0];
  const totalVotos = Math.round(PRES_TOTAL_PADRON * PRES_PARTICIPACION);

  const nonNullCands = PRES_CANDS.filter((c) => c.party !== null);
  const leader = nonNullCands.length
    ? nonNullCands.reduce((a, b) => (phase[a.id] ?? 0) >= (phase[b.id] ?? 0) ? a : b)
    : PRES_CANDS[0];

  const hasAbsoluteMajority = (phase[leader.id] ?? 0) > 0.50;
  const top2 = [...nonNullCands]
    .sort((a, b) => (phase[b.id] ?? 0) - (phase[a.id] ?? 0))
    .slice(0, 2);
  const top2Ids = new Set(top2.map((c) => c.id));

  // District results
  const allDistrictResults = getPresDistrictResults()
    .sort((a, b) => b.tv - a.tv);
  const filteredDistricts = presDistFilter === "all"
    ? allDistrictResults
    : allDistrictResults.filter((d) => d.regionId === presDistFilter);
  const displayedDistricts = showAllDistricts ? filteredDistricts : filteredDistricts.slice(0, 30);

  return (
    <div className="space-y-6">
      {/* Cabecera de la elección */}
      <div className="card p-5 border-b-2 border-yellow-500/50">
        <div className="label-xs mb-1">Elección Presidencial 2026</div>
        <div className="text-lg font-black text-slate-100 mb-3">República de Coravia</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {([
            ["Padrón electoral",       PRES_TOTAL_PADRON.toLocaleString("es-ES")],
            ["Participación estimada", `${(PRES_PARTICIPACION * 100).toFixed(0)}%`],
            ["Votos totales",          totalVotos.toLocaleString("es-ES")],
            ["Candidatos",             String(nonNullCands.length)],
          ] as [string, string][]).map(([l, v]) => (
            <div key={l} className="card-inner p-3 text-center">
              <div className="label-xs mb-1">{l}</div>
              <div className="text-xl font-black text-slate-100">{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Banner de resultado electoral */}
      {hasAbsoluteMajority ? (
        <div
          className="card p-4 flex items-center gap-4 border-l-4 bg-green-500/5"
          style={{ borderLeftColor: leader.color }}
        >
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-black text-sm flex-shrink-0"
            style={{ background: leader.color }}
          >
            {leader.party}
          </div>
          <div className="flex-1">
            <div className="label-xs mb-0.5 text-green-400">✅ Elegido en primera vuelta</div>
            <div className="text-lg font-black text-slate-100">{leader.name}</div>
            <div className="text-xs text-slate-400">{leader.party}</div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-black text-green-400">
              {((phase[leader.id] ?? 0) * 100).toFixed(1)}%
            </div>
            <div className="text-xs text-slate-500">del voto</div>
          </div>
        </div>
      ) : (
        <div className="card p-4 border-l-4 border-yellow-500 bg-yellow-500/5">
          <div className="label-xs mb-2 text-yellow-400">⚠️ Segunda vuelta — Balotaje</div>
          <div className="text-xs text-slate-400 mb-3">
            Ningún candidato obtuvo el 50%+1. Los dos más votados pasan a segunda vuelta:
          </div>
          <div className="flex gap-3">
            {top2.map((c, i) => (
              <div key={c.id} className="flex-1 flex items-center gap-2 card-inner p-3">
                <div className="text-lg font-black text-yellow-400 flex-shrink-0">{i + 1}º</div>
                <div
                  className="w-8 h-8 rounded flex items-center justify-center text-white text-[10px] font-black flex-shrink-0"
                  style={{ background: c.color }}
                >
                  {c.party}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-slate-100 text-sm truncate">{c.name}</div>
                  <div className="text-yellow-400 font-black text-sm">
                    {((phase[c.id] ?? 0) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Barras de candidatos */}
      <div className="space-y-3">
        <div className="label-sm">Resultados por candidato</div>
        {PRES_CANDS.map((cand) => {
          const pct = (phase[cand.id] ?? 0) * 100;
          const votes = Math.round(totalVotos * (phase[cand.id] ?? 0));
          const isWinner = hasAbsoluteMajority && cand.id === leader.id;
          const advancesToBalotaje = !hasAbsoluteMajority && cand.party !== null && top2Ids.has(cand.id);
          const isEliminated = cand.party !== null && !isWinner && !advancesToBalotaje;
          return (
            <div
              key={cand.id}
              className={`card p-4 transition-opacity duration-300 ${isEliminated ? "opacity-50" : "opacity-100"}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  {cand.party && (
                    <div
                      className="w-8 h-8 rounded flex items-center justify-center text-white text-[10px] font-black flex-shrink-0"
                      style={{ background: cand.color }}
                    >
                      {cand.party}
                    </div>
                  )}
                  <div>
                    <div className="font-bold text-slate-200 text-sm">{cand.name}</div>
                    {cand.party && (
                      <div className="text-[10px] text-slate-500 flex items-center gap-1.5">
                        <span>{cand.party}</span>
                        {isWinner && (
                          <span className="text-green-400 font-bold">✅ Elegido</span>
                        )}
                        {advancesToBalotaje && (
                          <span className="text-yellow-400 font-bold">→ Balotaje</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black" style={{ color: cand.color }}>
                    {pct.toFixed(1)}%
                  </div>
                  <div className="text-xs text-slate-500">
                    {votes.toLocaleString("es-ES")}
                  </div>
                </div>
              </div>
              <div className="h-2 bg-[#1e3a5f] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, backgroundColor: cand.color }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Section A: Resultados por región */}
      <div className="space-y-3">
        <div className="label-sm">Resultados por región</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {REGION_DATA.map((region) => {
            const regionVotes = getPresRegionVotes(region.id as RegionId);
            const regionPct = PRES_BY_REGION[region.id as RegionId];
            const leadCand = DISPLAY_CANDS.reduce((a, b) =>
              (regionPct[a] ?? 0) >= (regionPct[b] ?? 0) ? a : b
            );
            return (
              <div key={region.id} className="card p-4">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <div className="label-xs">{region.id}</div>
                    <div className="text-sm font-black text-slate-100">{region.name}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  {DISPLAY_CANDS.map((candId) => {
                    const pctVal = (regionPct[candId] ?? 0) * 100;
                    const votes = regionVotes[candId] ?? 0;
                    const isLeader = candId === leadCand;
                    const color = CAND_COLORS[candId];
                    return (
                      <div key={candId}>
                        <div className="flex justify-between text-xs mb-0.5">
                          <span className={isLeader ? "font-bold text-slate-100" : "text-slate-400"}>
                            {CAND_NAMES[candId]}
                          </span>
                          <span className={isLeader ? "font-black" : "font-semibold"} style={{ color }}>
                            {votes.toLocaleString("es-ES")} ({pctVal.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="h-1.5 bg-[#1e3a5f] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${pctVal}%`, backgroundColor: color }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section B: Resultados por distrito */}
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="label-sm">Resultados por distrito</div>
          <select
            className="text-xs bg-[#0a1628] border border-[#1e3a5f] rounded px-2 py-1 text-slate-300 focus:outline-none focus:border-slate-400"
            value={presDistFilter}
            onChange={(e) => {
              setPresDistFilter(e.target.value);
              setShowAllDistricts(false);
            }}
          >
            <option value="all">Todas las regiones</option>
            {Object.entries(REGION_LABELS).map(([id, name]) => (
              <option key={id} value={id}>{id} — {name}</option>
            ))}
          </select>
        </div>

        <div className="card overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#1e3a5f]">
                <th className="text-left py-2 px-3 text-slate-400 font-semibold">Distrito</th>
                <th className="text-left py-2 px-2 text-slate-400 font-semibold">Región</th>
                <th className="text-right py-2 px-2 text-slate-400 font-semibold">TV</th>
                <th className="text-right py-2 px-2 font-semibold" style={{ color: CAND_COLORS.vinyas }}>Vinyas</th>
                <th className="text-right py-2 px-2 font-semibold" style={{ color: CAND_COLORS.calleja }}>Calleja</th>
                <th className="text-right py-2 px-3 font-semibold" style={{ color: CAND_COLORS.santos }}>Santos</th>
              </tr>
            </thead>
            <tbody>
              {displayedDistricts.map((dist) => (
                <tr key={dist.distId} className="border-b border-[#1e3a5f]/40 hover:bg-white/5">
                  <td className="py-1.5 px-3 text-slate-300">{dist.distName}</td>
                  <td className="py-1.5 px-2 text-slate-500">{dist.regionId}</td>
                  <td className="py-1.5 px-2 text-right text-slate-400 tabular-nums">
                    {Math.round(dist.tv).toLocaleString("es-ES")}
                  </td>
                  {(["vinyas", "calleja", "santos"] as const).map((candId, idx) => {
                    const v = dist.votes[candId] ?? 0;
                    const p = ((dist.pct[candId] ?? 0) * 100).toFixed(1);
                    return (
                      <td
                        key={candId}
                        className={`py-1.5 ${idx === 2 ? "px-3" : "px-2"} text-right tabular-nums`}
                        style={{ color: CAND_COLORS[candId] }}
                      >
                        {v.toLocaleString("es-ES")} ({p}%)
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          {filteredDistricts.length > 30 && (
            <div className="p-3 text-center border-t border-[#1e3a5f]">
              <button
                type="button"
                className="text-xs font-bold text-slate-400 hover:text-slate-200 transition-colors"
                onClick={() => setShowAllDistricts((v) => !v)}
              >
                {showAllDistricts
                  ? `▲ Mostrar menos`
                  : `▼ Ver todos (${filteredDistricts.length} distritos)`}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Selector de fase */}
      <div className="card p-4">
        <div className="label-sm mb-3">Avance por fase de escrutinio</div>
        <PhaseBar phaseIdx={phaseIdx} onChange={setPhaseIdx} />
      </div>
    </div>
  );
}
