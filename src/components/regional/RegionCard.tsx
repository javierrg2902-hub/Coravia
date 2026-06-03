"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { CLR, NOM, PID } from "@/data/parties";
import { dhondt5 } from "@/lib/dhondt";
import type { RegionData } from "@/types/election";

interface Props {
  region: RegionData;
  isSelected: boolean;
  onClick: () => void;
}

export default function RegionCard({ region, isSelected, onClick }: Props) {
  const topGovCand = Object.entries(region.govPct)
    .filter(([id]) => id !== "blank" && id !== "null")
    .sort(([, a], [, b]) => b - a)[0];
  const topGov = topGovCand ? region.govCands.find((c) => c.id === topGovCand[0]) : null;
  const govPct = topGovCand ? (topGovCand[1] * 100).toFixed(1) : "—";

  const partyData = PID
    .filter((p) => (region.partyPct[p] ?? 0) > 0)
    .map((p) => ({ name: p, value: (region.partyPct[p] ?? 0) * 100, color: CLR[p] }))
    .sort((a, b) => b.value - a.value);

  const seats = dhondt5(region.partyPct);
  const seatsEntries = PID.filter((p) => (seats[p] || 0) > 0).map((p) => ({ p, n: seats[p] }));

  return (
    <div
      onClick={onClick}
      className={`card cursor-pointer transition-all hover:border-slate-500 ${
        isSelected ? "border-yellow-400/60" : ""
      }`}
    >
      {/* Cabecera */}
      <div className="p-4 flex items-start justify-between">
        <div>
          <div className="label-xs mb-0.5">{region.id}</div>
          <div className="text-sm font-black text-slate-100">{region.name}</div>
          <div className="text-xs text-slate-500 mt-0.5">
            Padrón: {region.padron.toLocaleString("es-ES")}
          </div>
        </div>
        {topGov && (
          <div className="text-right">
            <div
              className="text-xs font-black uppercase"
              style={{ color: CLR[topGov.party] }}
            >
              {topGov.party}
            </div>
            <div className="text-lg font-black text-slate-100">{govPct}%</div>
            <div className="text-[10px] text-slate-500">{topGov.name}</div>
          </div>
        )}
      </div>

      {/* Escaños regionales */}
      <div className="px-4 pb-3 flex items-center gap-2">
        <span className="label-xs">Asamblea regional:</span>
        <div className="flex gap-1">
          {seatsEntries.map(({ p, n }) =>
            Array(n).fill(0).map((_, i) => (
              <div
                key={`${p}-${i}`}
                className="w-4 h-4 rounded-sm"
                style={{ backgroundColor: CLR[p] }}
                title={`${p}: ${NOM[p]}`}
              />
            ))
          )}
        </div>
      </div>

      {/* Detalle expandido */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-[#1e3a5f] p-4 space-y-4">
              {/* Candidatos a gobernador */}
              <div>
                <div className="label-sm mb-2">Candidatos al gobierno regional</div>
                {region.govCands.map((cand) => {
                  const pct = ((region.govPct[cand.id] ?? 0) * 100).toFixed(1);
                  return (
                    <div key={cand.id} className="mb-2">
                      <div className="flex justify-between text-xs mb-0.5">
                        <span className="text-slate-300">{cand.name}</span>
                        <span className="font-bold" style={{ color: cand.color }}>{pct}%</span>
                      </div>
                      <div className="h-1.5 bg-[#1e3a5f] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${pct}%`, backgroundColor: cand.color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Gráfico de partidos */}
              <div>
                <div className="label-sm mb-2">Voto parlamentario en la región</div>
                <ResponsiveContainer width="100%" height={120}>
                  <BarChart data={partyData} layout="vertical" margin={{ left: 8, right: 30, top: 2, bottom: 2 }}>
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" width={36} tick={{ fill: "#94a3b8", fontSize: 9, fontWeight: 700 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: "#0a1628", border: "1px solid #1e3a5f", borderRadius: 6, fontSize: 11 }}
                      formatter={(v: number) => [`${v.toFixed(1)}%`, "Voto"]}
                    />
                    <Bar dataKey="value" radius={[0, 3, 3, 0]} maxBarSize={14}>
                      {partyData.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
