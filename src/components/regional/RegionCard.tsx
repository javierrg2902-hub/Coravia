"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import HemicyclePie from "@/components/hemiciclo/HemicyclePie";
import { CLR, NOM, PID } from "@/data/parties";
import { DIST } from "@/data/districts";
import type { RegionData, PartyId } from "@/types/election";

interface Props {
  region: RegionData;
  isSelected: boolean;
  onClick: () => void;
}

const GOV_PART = 0.70;

export default function RegionCard({ region, isSelected, onClick }: Props) {
  const [hoveredParty, setHoveredParty] = useState<PartyId | null>(null);
  const [selectedParty, setSelectedParty] = useState<PartyId | null>(null);
  const [showDistricts, setShowDistricts] = useState(false);

  const activeParty = selectedParty ?? hoveredParty ?? null;

  const topGovCand = Object.entries(region.govPct)
    .filter(([id]) => id !== "blank" && id !== "null")
    .sort(([, a], [, b]) => b - a)[0];
  const topGov = topGovCand ? region.govCands.find((c) => c.id === topGovCand[0]) : null;
  const govPct = topGovCand ? (topGovCand[1] * 100).toFixed(1) : "—";

  const partyData = PID
    .filter((p) => (region.partyPct[p] ?? 0) > 0)
    .map((p) => ({ name: p, value: (region.partyPct[p] ?? 0) * 100, color: CLR[p] }))
    .sort((a, b) => b.value - a.value);

  const seats = region.seats;
  const seatsEntries = PID.filter((p) => (seats[p] || 0) > 0).map((p) => ({ p, n: seats[p] }));

  // Gov section
  const totalGovVotes = Math.round(region.padron * GOV_PART);
  const hasFirstRoundWinner = Object.entries(region.govPct)
    .filter(([id]) => id !== "blank" && id !== "null")
    .some(([, v]) => v > 0.50);
  const firstRoundWinner = hasFirstRoundWinner
    ? region.govCands.find((c) => (region.govPct[c.id] ?? 0) > 0.50) ?? null
    : null;
  const needsRunoff = !hasFirstRoundWinner;

  // Hemiciclo data
  const hemicicloData = seatsEntries.map(({ p, n }) => ({
    p,
    value: n,
    color: CLR[p],
  }));

  const totalSeats = 5;

  // Districts for this region sorted by tv desc
  const regionDistricts = DIST
    .filter((d) => d.state === region.id)
    .sort((a, b) => b.tv - a.tv);

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
              style={{ color: topGov.color }}
            >
              {topGov.party ?? topGov.partyName ?? "Ind."}
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
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-t border-[#1e3a5f] p-4 space-y-6">

              {/* A. Gobierno regional */}
              <div>
                <div className="label-sm mb-2">Gobierno regional (gobernador)</div>

                {/* Result banner */}
                {firstRoundWinner ? (
                  <div
                    className="rounded-lg p-3 mb-3 flex items-center gap-3 border-l-4 bg-green-500/5"
                    style={{ borderLeftColor: firstRoundWinner.color }}
                  >
                    <div
                      className="w-8 h-8 rounded flex items-center justify-center text-white text-[10px] font-black flex-shrink-0"
                      style={{ background: firstRoundWinner.color }}
                    >
                      {firstRoundWinner.party ?? "Ind"}
                    </div>
                    <div className="flex-1">
                      <div className="text-[10px] text-green-400 font-bold mb-0.5">✅ Elegido en primera vuelta</div>
                      <div className="text-sm font-black text-slate-100">{firstRoundWinner.name}</div>
                      <div className="text-[10px] text-slate-400">{firstRoundWinner.party ?? firstRoundWinner.partyName ?? "Independiente"}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-black text-green-400">
                        {((region.govPct[firstRoundWinner.id] ?? 0) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ) : needsRunoff ? (
                  <div className="rounded-lg p-3 mb-3 border-l-4 border-yellow-500 bg-yellow-500/5">
                    <div className="text-[10px] text-yellow-400 font-bold mb-1">⚠️ Balotaje — Segunda vuelta requerida</div>
                    <div className="text-[10px] text-slate-400">
                      Ningún candidato superó el 50%. Los dos más votados pasan a segunda vuelta.
                    </div>
                  </div>
                ) : null}

                {/* Gov candidates */}
                {region.govCands.map((cand) => {
                  const pctVal = (region.govPct[cand.id] ?? 0) * 100;
                  const votes = Math.round(totalGovVotes * (region.govPct[cand.id] ?? 0));
                  const isLeader = topGov?.id === cand.id;
                  return (
                    <div key={cand.id} className="mb-2">
                      <div className="flex justify-between text-xs mb-0.5">
                        <span className={`${isLeader ? "font-bold text-slate-100" : "text-slate-300"}`}>
                          {cand.name}
                          <span className="text-slate-500 font-normal ml-1">
                            ({cand.party ?? cand.partyName ?? "Ind."})
                          </span>
                        </span>
                        <span className="font-bold" style={{ color: cand.color }}>
                          {votes.toLocaleString("es-ES")} ({pctVal.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="h-1.5 bg-[#1e3a5f] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${pctVal}%`, backgroundColor: cand.color }}
                        />
                      </div>
                    </div>
                  );
                })}

                {/* Blank and null */}
                {(["blank", "null"] as const).map((key) => {
                  const pctVal = (region.govPct[key] ?? 0) * 100;
                  const votes = Math.round(totalGovVotes * (region.govPct[key] ?? 0));
                  const label = key === "blank" ? "En blanco" : "Nulos";
                  const color = key === "blank" ? "#AAAAAA" : "#777777";
                  if (!pctVal) return null;
                  return (
                    <div key={key} className="mb-1 opacity-60">
                      <div className="flex justify-between text-xs mb-0.5">
                        <span className="text-slate-400">{label}</span>
                        <span className="font-bold" style={{ color }}>
                          {votes.toLocaleString("es-ES")} ({pctVal.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="h-1 bg-[#1e3a5f] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${pctVal}%`, backgroundColor: color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* B. Asamblea regional (hemiciclo interactivo) */}
              <div>
                <div className="label-sm mb-2">Asamblea regional</div>
                <HemicyclePie
                  data={hemicicloData}
                  totalSeats={totalSeats}
                  majorityCount={3}
                  showMaj={true}
                  highlightParty={activeParty}
                  onSegmentHover={(p) => setHoveredParty(p)}
                  onSegmentClick={(p) => setSelectedParty(prev => prev === p ? null : p)}
                  centerMain={String(seatsEntries.reduce((s, e) => s + e.n, 0))}
                  centerSub1="escaños"
                />

                {/* Party list below hemiciclo */}
                <div className="mt-2 space-y-1">
                  {seatsEntries.map(({ p, n }) => {
                    const isActive = !activeParty || activeParty === p;
                    return (
                      <motion.div
                        key={p}
                        className="flex items-center gap-2 p-1.5 rounded cursor-pointer hover:bg-white/5"
                        animate={{ opacity: isActive ? 1 : 0.25 }}
                        transition={{ duration: 0.15 }}
                        onClick={() => setSelectedParty(prev => prev === p ? null : p)}
                        onMouseEnter={() => setHoveredParty(p)}
                        onMouseLeave={() => setHoveredParty(null)}
                      >
                        <div
                          className="w-3 h-3 rounded-sm flex-shrink-0"
                          style={{ backgroundColor: CLR[p] }}
                        />
                        <span className="text-xs text-slate-300 flex-1">{NOM[p]}</span>
                        <span className="text-xs font-black text-slate-100">{n}</span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* C. Voto por distrito */}
              <div>
                <button
                  type="button"
                  className="text-xs font-bold text-slate-400 hover:text-slate-200 transition-colors mb-2 flex items-center gap-1"
                  onClick={() => setShowDistricts((v) => !v)}
                >
                  <span>{showDistricts ? "▼" : "▶"}</span>
                  <span>Ver distritos ({regionDistricts.length})</span>
                </button>

                <AnimatePresence>
                  {showDistricts && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-[#1e3a5f]">
                              <th className="text-left py-1.5 pr-3 text-slate-400 font-semibold">Distrito</th>
                              <th className="text-right py-1.5 px-2 text-slate-400 font-semibold">TV</th>
                              {region.govCands.map((c) => (
                                <th
                                  key={c.id}
                                  className="text-right py-1.5 px-2 font-semibold"
                                  style={{ color: c.color }}
                                >
                                  {c.name.split(" ")[0]}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {regionDistricts.map((dist) => (
                              <tr key={dist.id} className="border-b border-[#1e3a5f]/40 hover:bg-white/5">
                                <td className="py-1 pr-3 text-slate-300">{dist.name}</td>
                                <td className="py-1 px-2 text-right text-slate-400 tabular-nums">
                                  {Math.round(dist.tv).toLocaleString("es-ES")}
                                </td>
                                {region.govCands.map((cand) => {
                                  const v = Math.round(dist.tv * (region.govPct[cand.id] ?? 0));
                                  const p = ((region.govPct[cand.id] ?? 0) * 100).toFixed(0);
                                  return (
                                    <td key={cand.id} className="py-1 px-2 text-right tabular-nums" style={{ color: cand.color }}>
                                      {v.toLocaleString("es-ES")} ({p}%)
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
