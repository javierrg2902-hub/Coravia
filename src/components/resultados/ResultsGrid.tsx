"use client";

import { motion } from "framer-motion";
import { CLR, NOM } from "@/data/parties";
import type { PartyResult } from "@/types/election";

interface Props {
  results: PartyResult[];
}

export default function ResultsGrid({ results }: Props) {
  const withVotes = results.filter((r) => r.v > 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {withVotes.map((r, i) => (
        <motion.div
          key={r.p}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03, duration: 0.2 }}
          className="card p-4 border-l-2"
          style={{ borderLeftColor: CLR[r.p] }}
        >
          <div className="flex items-start justify-between mb-2">
            <div>
              <div
                className="text-xs font-black uppercase tracking-wide"
                style={{ color: CLR[r.p] }}
              >
                {r.p}
              </div>
              <div className="text-[10px] text-slate-500 leading-tight">{NOM[r.p]}</div>
            </div>
            {r.s > 0 && (
              <div className="text-center">
                <div className="text-2xl font-black text-slate-100 leading-none">{r.s}</div>
                <div className="text-[9px] text-slate-500">esc.</div>
              </div>
            )}
          </div>
          {/* Barra de votos */}
          <div className="mb-1.5">
            <div className="flex justify-between text-[10px] mb-0.5">
              <span className="text-slate-400">{r.pct.toFixed(2)}%</span>
              <span className="text-slate-500">{r.v.toLocaleString("es-ES")}</span>
            </div>
            <div className="h-1.5 bg-[#1e3a5f] rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: CLR[r.p] }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(r.pct * 2.5, 100)}%` }}
                transition={{ duration: 0.6, delay: i * 0.03 }}
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
