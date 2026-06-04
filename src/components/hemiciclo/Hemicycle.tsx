"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import HemicyclePie from "./HemicyclePie";
import PartyCard from "./PartyCard";
import { CLR, NOM, SPECTR, specLabel } from "@/data/parties";
import { MAJ } from "@/data/phases";
import type { SeatMap, PartyResult, PartyId } from "@/types/election";

interface Props {
  seats: SeatMap;
  results: PartyResult[];
  totalSeats: number;
}

export default function Hemicycle({ seats, results, totalSeats }: Props) {
  const [hoveredParty, setHoveredParty] = useState<PartyId | null>(null);
  const [selectedParty, setSelectedParty] = useState<PartyId | null>(null);

  const activeParty = selectedParty ?? hoveredParty;

  const seatsWithParties = results
    .filter((r) => r.s > 0)
    .sort((a, b) => (SPECTR[a.p] || 50) - (SPECTR[b.p] || 50));

  const hemData = seatsWithParties.map((r) => ({
    p: r.p,
    value: r.s,
    color: CLR[r.p],
  }));

  const handleClick = (p: PartyId) => {
    setSelectedParty((prev) => (prev === p ? null : p));
  };

  const selectedResult = selectedParty
    ? results.find((r) => r.p === selectedParty)
    : null;

  return (
    <div className="space-y-4">
      {/* Hemiciclo SVG + detalle */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        <div>
          <HemicyclePie
            data={hemData}
            totalSeats={totalSeats}
            centerMain={String(totalSeats)}
            centerSub1="escaños asignados"
            centerSub2={`Mayoría: ${MAJ}`}
            highlightParty={activeParty}
            onSegmentHover={setHoveredParty}
            onSegmentClick={handleClick}
            showMaj
          />
        </div>

        {/* Panel de detalle al seleccionar */}
        <AnimatePresence mode="wait">
          {selectedResult ? (
            <motion.div
              key={selectedResult.p}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="card p-5 border-l-4"
              style={{ borderLeftColor: CLR[selectedResult.p] }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div
                    className="text-2xl font-black uppercase"
                    style={{ color: CLR[selectedResult.p] }}
                  >
                    {selectedResult.p}
                  </div>
                  <div className="text-sm text-slate-300 font-medium">{NOM[selectedResult.p]}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{specLabel(SPECTR[selectedResult.p])}</div>
                </div>
                <button
                  onClick={() => setSelectedParty(null)}
                  className="text-slate-500 hover:text-slate-300 text-lg"
                >
                  ×
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="card-inner p-3">
                  <div className="label-xs mb-1">Escaños</div>
                  <div className="big-number">{selectedResult.s}</div>
                  <div className="text-xs text-slate-500">de {totalSeats}</div>
                </div>
                <div className="card-inner p-3">
                  <div className="label-xs mb-1">Votos</div>
                  <div className="text-xl font-black text-slate-100">
                    {selectedResult.pct.toFixed(1)}%
                  </div>
                  <div className="text-xs text-slate-500">
                    {selectedResult.v.toLocaleString("es-ES")}
                  </div>
                </div>
              </div>
              {selectedResult.s >= MAJ && (
                <div className="mt-3 p-2 rounded bg-yellow-500/10 border border-yellow-500/30 text-xs text-yellow-400 font-bold text-center">
                  Mayoría absoluta propia
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="hidden lg:flex flex-col items-center justify-center h-48 text-slate-500 text-sm"
            >
              <span className="text-3xl mb-2">🏛️</span>
              Haz clic en un segmento para ver detalles
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Grid de tarjetas de partido */}
      <div>
        <div className="label-sm mb-2">Partidos con representación</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
          {results
            .filter((r) => r.s > 0)
            .sort((a, b) => (SPECTR[a.p] || 50) - (SPECTR[b.p] || 50))
            .map((r) => (
              <PartyCard
                key={r.p}
                p={r.p}
                seats={r.s}
                pct={r.pct}
                votes={r.v}
                isHighlighted={!activeParty || activeParty === r.p}
                isSelected={selectedParty === r.p}
                onClick={() => handleClick(r.p)}
                onHover={setHoveredParty}
              />
            ))}
        </div>
      </div>

      {/* Resumen de mayoría */}
      <div className="card p-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="label-xs mb-1">Total escaños</div>
          <div className="text-2xl font-black text-slate-100">{totalSeats}</div>
        </div>
        <div>
          <div className="label-xs mb-1">Mayoría absoluta</div>
          <div className="text-2xl font-black text-yellow-400">{MAJ}</div>
        </div>
        <div>
          <div className="label-xs mb-1">Partidos con escaños</div>
          <div className="text-2xl font-black text-slate-100">
            {results.filter((r) => r.s > 0).length}
          </div>
        </div>
      </div>
    </div>
  );
}
