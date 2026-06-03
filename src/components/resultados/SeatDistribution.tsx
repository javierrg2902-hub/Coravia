"use client";

import { motion } from "framer-motion";
import { CLR, NOM } from "@/data/parties";
import { makeSeatOrder } from "@/lib/electionUtils";
import { MAJ } from "@/data/phases";
import type { SeatMap } from "@/types/election";

interface Props {
  seats: SeatMap;
}

export default function SeatDistribution({ seats }: Props) {
  const order = makeSeatOrder(seats);
  const totals: Record<string, number> = {};
  order.forEach((p) => { totals[p] = (totals[p] || 0) + 1; });

  return (
    <div>
      <div className="label-sm mb-3">Distribución de escaños — Ley D&apos;Hondt</div>
      {/* Franja de escaños */}
      <div className="flex gap-px h-8 rounded overflow-hidden mb-3">
        {order.map((p, i) => (
          <motion.div
            key={`${p}-${i}`}
            className="flex-1 h-full"
            style={{ backgroundColor: CLR[p] }}
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ delay: i * 0.008, duration: 0.15 }}
            title={`${p}: ${NOM[p]}`}
          />
        ))}
        {/* Línea de mayoría */}
        <div
          className="absolute h-8 w-px bg-yellow-400 z-10"
          style={{ left: `${(MAJ / 25) * 100}%` }}
        />
      </div>
      {/* Leyenda */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(totals)
          .sort(([, a], [, b]) => b - a)
          .map(([p, n]) => (
            <div key={p} className="flex items-center gap-1.5">
              <div
                className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                style={{ backgroundColor: CLR[p as keyof typeof CLR] }}
              />
              <span className="text-[11px] font-bold text-slate-300">{p}</span>
              <span className="text-[11px] font-black text-slate-100">{n}</span>
            </div>
          ))}
      </div>
    </div>
  );
}
