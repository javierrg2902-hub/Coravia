"use client";

import { motion } from "framer-motion";

interface Props {
  pct: string;
  mc: number;
  total: number;
  faseName: string;
  isLive: boolean;
}

export default function ScrutinyProgress({ pct, mc, total, faseName, isLive }: Props) {
  const width = Math.min(parseFloat(pct) || 0, 100);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="label-xs">ESCRUTINIO</span>
          <span className="text-[11px] font-bold text-yellow-400">{faseName}</span>
          {isLive && (
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[9px] font-bold text-green-400 uppercase tracking-wider">En vivo</span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-slate-400">
            {mc.toLocaleString("es-ES")} / {total.toLocaleString("es-ES")} mesas
          </span>
          <span className="text-sm font-black text-yellow-400">{width.toFixed(2)}%</span>
        </div>
      </div>
      <div className="h-2 w-full bg-[#1e3a5f] rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: "linear-gradient(90deg, #1d4ed8 0%, #EAB308 100%)",
          }}
          initial={{ width: "0%" }}
          animate={{ width: `${width}%` }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}
