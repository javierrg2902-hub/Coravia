"use client";

import { PRES_CANDS, PRES_BY_PHASE, PRES_TOTAL_PADRON, PRES_PARTICIPACION } from "@/data/presidential";
import PhaseBar from "@/components/scrutiny/PhaseBar";

interface Props {
  phaseIdx: number;
  setPhaseIdx: (i: number) => void;
}

export default function PresidencialTab({ phaseIdx, setPhaseIdx }: Props) {
  const phase = PRES_BY_PHASE[phaseIdx] ?? PRES_BY_PHASE[0];
  const totalVotos = Math.round(PRES_TOTAL_PADRON * PRES_PARTICIPACION);

  const mainCands = PRES_CANDS.filter((c) => c.party !== null);
  const leader = mainCands.reduce((a, b) =>
    (phase[a.id] ?? 0) > (phase[b.id] ?? 0) ? a : b
  );

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
            ["Candidatos",             String(mainCands.length)],
          ] as [string, string][]).map(([l, v]) => (
            <div key={l} className="card-inner p-3 text-center">
              <div className="label-xs mb-1">{l}</div>
              <div className="text-xl font-black text-slate-100">{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Banner del candidato líder */}
      <div
        className="card p-4 flex items-center gap-4 border-l-4"
        style={{ borderLeftColor: leader.color }}
      >
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-black text-sm flex-shrink-0"
          style={{ background: leader.color }}
        >
          {leader.party}
        </div>
        <div className="flex-1">
          <div className="label-xs mb-0.5">Candidato líder</div>
          <div className="text-lg font-black text-slate-100">{leader.name}</div>
          <div className="text-xs text-slate-400">{leader.party}</div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-black" style={{ color: leader.color }}>
            {((phase[leader.id] ?? 0) * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-slate-500">del voto</div>
        </div>
      </div>

      {/* Barras de candidatos */}
      <div className="space-y-3">
        <div className="label-sm">Resultados por candidato</div>
        {PRES_CANDS.map((cand) => {
          const pct = (phase[cand.id] ?? 0) * 100;
          const votes = Math.round(totalVotos * (phase[cand.id] ?? 0));
          return (
            <div key={cand.id} className="card p-4">
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
                      <div className="text-[10px] text-slate-500">{cand.party}</div>
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

      {/* Selector de fase */}
      <div className="card p-4">
        <div className="label-sm mb-3">Avance por fase de escrutinio</div>
        <PhaseBar phaseIdx={phaseIdx} onChange={setPhaseIdx} />
      </div>
    </div>
  );
}
