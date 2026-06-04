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
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      onMouseEnter={() => onHover(p)}
      onMouseLeave={() => onHover(null)}
      /* min-h-[52px] garantiza el mínimo de 44px de toque con padding */
      className={`
        w-full text-left p-2.5 rounded border transition-all min-h-[52px]
        ${isSelected
          ? "border-yellow-400 bg-[#1e3a5f]"
          : "border-[#1e3a5f] bg-[#0c1e3a] hover:border-slate-500"
        }
      `}
    >
      <div className="flex items-center justify-between gap-1 mb-1.5">
        <span
          className="text-xs font-black uppercase"
          style={{ color }}
        >
          {p}
        </span>
        <span className="text-xl font-black text-slate-100 tabular-nums leading-none">{seats}</span>
      </div>
      {/* Nombre completo — mínimo 11px para legibilidad */}
      <div className="text-[11px] text-slate-500 leading-tight mb-1.5 line-clamp-2">{NOM[p]}</div>
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-slate-300 font-semibold">{pct.toFixed(1)}%</span>
        <span className="text-[10px] text-slate-500 hidden sm:inline">{specLabel(SPECTR[p])}</span>
      </div>
      {/* Mini barra */}
      <div className="mt-1.5 h-1 w-full bg-[#1e3a5f] rounded-full overflow-hidden">
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
