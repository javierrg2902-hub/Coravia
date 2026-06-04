"use client";

import { motion } from "framer-motion";
import { annSeg, ARC_R, ARC_THICK, ARC_START, ARC_END, ARC_SPAN, arcPt, ARC_CX, ARC_CY } from "@/lib/electionUtils";
import { MAJ, SEATS } from "@/data/phases";
import type { PartyId } from "@/types/election";

interface SegmentData {
  p: PartyId;
  value: number;
  color: string;
}

interface Props {
  data: SegmentData[];
  totalSeats: number;
  centerMain?: string;
  centerSub1?: string;
  centerSub2?: string;
  highlightParty?: PartyId | null;
  onSegmentHover?: (p: PartyId | null) => void;
  onSegmentClick?: (p: PartyId) => void;
  showMaj?: boolean;
  majorityCount?: number;
}

export default function HemicyclePie({
  data,
  totalSeats,
  centerMain,
  centerSub1,
  centerSub2,
  highlightParty,
  onSegmentHover,
  onSegmentClick,
  showMaj = true,
  majorityCount,
}: Props) {
  const total = data.reduce((s, d) => s + (d.value || 0), 0) || 1;
  let cursor = 0;

  // Majority line angle
  const effectiveMaj = majorityCount ?? MAJ;
  const majPct = effectiveMaj / (totalSeats || SEATS);
  const majDeg = ARC_START - majPct * ARC_SPAN;
  const [mlx1, mly1] = arcPt(ARC_R - ARC_THICK / 2 - 4, majDeg);
  const [mlx2, mly2] = arcPt(ARC_R + ARC_THICK / 2 + 4, majDeg);

  return (
    <svg viewBox="0 0 400 210" className="w-full max-w-sm mx-auto" aria-label="Hemiciclo parlamentario">
      {/* Arco de fondo */}
      <path
        d={annSeg(ARC_R, ARC_THICK, ARC_START, ARC_END)}
        fill="#0c1e3a"
        stroke="#1e3a5f"
        strokeWidth={0.5}
      />

      {/* Segmentos por partido */}
      {data.map((d) => {
        const dS = ARC_START - (cursor / total) * ARC_SPAN;
        const dE = ARC_START - ((cursor + (d.value || 0)) / total) * ARC_SPAN;
        cursor += d.value || 0;
        if (!d.value) return null;
        const isHighlighted = !highlightParty || highlightParty === d.p;
        return (
          <motion.path
            key={d.p}
            d={annSeg(ARC_R, ARC_THICK, dS, dE)}
            fill={d.color}
            stroke="#060f1e"
            strokeWidth={0.8}
            animate={{ opacity: isHighlighted ? 1 : 0.2 }}
            transition={{ duration: 0.15 }}
            style={{ cursor: onSegmentClick ? "pointer" : "default" }}
            onMouseEnter={() => onSegmentHover?.(d.p)}
            onMouseLeave={() => onSegmentHover?.(null)}
            onClick={() => onSegmentClick?.(d.p)}
          />
        );
      })}

      {/* Línea de mayoría absoluta */}
      {showMaj && (
        <g>
          <line
            x1={mlx1} y1={mly1} x2={mlx2} y2={mly2}
            stroke="#EAB308" strokeWidth={1.5} strokeDasharray="3,2"
          />
          <text
            x={mlx2 + 3} y={mly2 + 3}
            fontSize="7" fill="#EAB308" fontWeight="bold"
          >
            {effectiveMaj}
          </text>
        </g>
      )}

      {/* Texto central */}
      {centerMain && (
        <text x={ARC_CX} y={ARC_CY - 8} textAnchor="middle"
          fontSize="28" fontWeight="900" fill="#f1f5f9" className="tabular-nums">
          {centerMain}
        </text>
      )}
      {centerSub1 && (
        <text x={ARC_CX} y={ARC_CY + 10} textAnchor="middle"
          fontSize="8" fill="#94a3b8" fontWeight="600">
          {centerSub1}
        </text>
      )}
      {centerSub2 && (
        <text x={ARC_CX} y={ARC_CY + 20} textAnchor="middle"
          fontSize="7" fill="#64748b">
          {centerSub2}
        </text>
      )}

      {/* Etiqueta mayoría */}
      {showMaj && (
        <text x={ARC_CX} y={203} textAnchor="middle"
          fontSize="7" fill="#475569">
          Mayoría absoluta: {effectiveMaj} escaños
        </text>
      )}
    </svg>
  );
}
