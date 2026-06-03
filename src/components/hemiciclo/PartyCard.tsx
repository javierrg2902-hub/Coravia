"use client";

import { motion } from "framer-motion";
import { CLR, NOM, SPECTR, specLabel } from "@/data/parties";
import type { PartyId } from "@/types/election";

interface Props {
  p: PartyId;
  seats: number;
  pct: number;
  votes: number;
  isHighlighted: boolean;
  isSelected: boolean;
  onClick: () => void;
  onHover: (p: PartyId | null) => void;
}

export default function PartyCard({
  p, seats, pct, votes, isHighlighted, isSelected, onClick, onHover,
}: Props) {
  const color = CLR[p];

  return (
    <motion.button
      animate={{ opacity: isHighlighted ? 1 : 0.35 }}
      transition={{ duration: 0.15 }}
      whileHover={{ scale: 1.03 }}
      onClick={onClick}
      onMouseEnter={() => onHover(p)}
      onMouseLeave={() => onHover(null)}
      className={`
        w-full text-left p-2 rounded border transition-all
        ${isSelected
          ? "border-yellow-400 bg-[#1e3a5f]"
          : "border-[#1e3a5f] bg-[#0c1e3a] hover:border-slate-500"
        }
      `}
    >
      <div className="flex items-center justify-between gap-1 mb-1">
        <span
          className="text-[11px] font-black uppercase"
          style={{ color }}
        >
          {p}
        </span>
        <span className="text-lg font-black text-slate-100 tabular-nums leading-none">
          {seats}
        </span>
      </div>
      <div className="text-[9px] text-slate-500 truncate mb-1">{NOM[p]}</div>
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-slate-400">{pct.toFixed(1)}%</span>
        <span className="text-[8px] text-slate-500">{specLabel(SPECTR[p])}</span>
      </div>
      {/* Mini barra */}
      <div className="mt-1 h-0.5 w-full bg-[#1e3a5f] rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          animate={{ width: `${Math.min(pct * 2.5, 100)}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </motion.button>
  );
}
