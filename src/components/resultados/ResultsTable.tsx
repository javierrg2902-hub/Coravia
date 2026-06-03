"use client";

import { CLR, NOM, SPECTR, specLabel } from "@/data/parties";
import type { PartyResult } from "@/types/election";

interface Props {
  results: PartyResult[];
  totalVotos: number;
}

export default function ResultsTable({ results, totalVotos }: Props) {
  return (
    <div className="overflow-x-auto rounded-lg border border-[#1e3a5f]">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-[#0c1e3a] border-b border-[#1e3a5f]">
            <th className="text-left px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">Partido</th>
            <th className="text-right px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">Votos</th>
            <th className="text-right px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">%</th>
            <th className="text-right px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">Escaños</th>
            <th className="text-right px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 hidden md:table-cell">Espectro</th>
          </tr>
        </thead>
        <tbody>
          {results.filter((r) => r.v > 0).map((r, i) => (
            <tr
              key={r.p}
              className={`border-b border-[#1e3a5f]/50 ${i % 2 === 0 ? "" : "bg-[#0c1e3a]/30"}`}
            >
              <td className="px-3 py-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-4 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: CLR[r.p] }}
                  />
                  <div>
                    <span
                      className="font-black uppercase text-xs"
                      style={{ color: CLR[r.p] }}
                    >
                      {r.p}
                    </span>
                    <div className="text-[9px] text-slate-500 hidden sm:block">{NOM[r.p]}</div>
                  </div>
                </div>
              </td>
              <td className="px-3 py-2 text-right tabular-nums text-slate-300">
                {r.v.toLocaleString("es-ES")}
              </td>
              <td className="px-3 py-2 text-right tabular-nums font-bold text-slate-200">
                {r.pct.toFixed(2)}%
              </td>
              <td className="px-3 py-2 text-right">
                <span
                  className="font-black text-sm"
                  style={{ color: r.s > 0 ? CLR[r.p] : "#475569" }}
                >
                  {r.s}
                </span>
              </td>
              <td className="px-3 py-2 text-right text-slate-500 hidden md:table-cell">
                {specLabel(SPECTR[r.p])}
              </td>
            </tr>
          ))}
          {/* Fila de totales */}
          <tr className="bg-[#0c1e3a] font-bold">
            <td className="px-3 py-2 text-slate-400 text-[10px] uppercase tracking-wider">Total</td>
            <td className="px-3 py-2 text-right tabular-nums text-slate-200">
              {totalVotos.toLocaleString("es-ES")}
            </td>
            <td className="px-3 py-2 text-right text-slate-200">100%</td>
            <td className="px-3 py-2 text-right text-yellow-400">
              {results.reduce((s, r) => s + r.s, 0)}
            </td>
            <td className="hidden md:table-cell" />
          </tr>
        </tbody>
      </table>
    </div>
  );
}
