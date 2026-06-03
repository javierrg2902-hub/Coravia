"use client";

import { motion } from "framer-motion";
import { CLR } from "@/data/parties";
import { REGION_DATA } from "@/data/regional";
import type { RegionId } from "@/types/election";

interface Props {
  selectedRegion: RegionId | null;
  onRegionSelect: (id: RegionId) => void;
}

// Polígonos del mapa ficticio de Coravia — mismo layout que el SVG
const REGION_PATHS: Record<RegionId, { d: string; label: [number, number] }> = {
  E5: { d: "M 20 20 L 200 20 L 200 120 L 140 150 L 20 150 Z",     label: [110, 95]  },
  E7: { d: "M 200 20 L 380 20 L 380 140 L 280 140 L 200 120 Z",   label: [290, 90]  },
  E8: { d: "M 20 150 L 140 150 L 140 270 L 20 270 Z",             label: [80, 212]  },
  E1: { d: "M 140 150 L 280 140 L 280 260 L 140 270 Z",           label: [210, 207] },
  E6: { d: "M 280 140 L 480 140 L 480 260 L 280 260 Z",           label: [380, 200] },
  E4: { d: "M 20 270 L 140 270 L 160 380 L 20 380 Z",             label: [90, 330]  },
  E3: { d: "M 140 270 L 280 260 L 300 380 L 160 380 Z",           label: [230, 325] },
  E2: { d: "M 280 260 L 480 260 L 480 380 L 300 380 Z",           label: [390, 320] },
};

const REGION_NAMES: Record<RegionId, string> = {
  E1: "DF Monteblanco", E2: "Florente", E3: "Litoral", E4: "Palmdale",
  E5: "Sta. Catalina",  E6: "Castellón", E7: "Alcalá", E8: "Río Bravo",
};

function getRegionColor(regionId: RegionId): string {
  const region = REGION_DATA.find((r) => r.id === regionId);
  if (!region) return "#1e3a5f";
  const topCand = Object.entries(region.govPct)
    .filter(([id]) => id !== "blank" && id !== "null")
    .sort(([, a], [, b]) => b - a)[0];
  if (!topCand) return "#1e3a5f";
  const govCand = region.govCands.find((c) => c.id === topCand[0]);
  return govCand ? CLR[govCand.party] + "cc" : "#1e3a5f";
}

export default function CoraviaMap({ selectedRegion, onRegionSelect }: Props) {
  return (
    <div className="w-full">
      <div className="label-sm mb-2">Mapa Electoral — República de Coravia</div>
      <svg
        viewBox="0 0 500 400"
        className="w-full max-w-lg mx-auto rounded-lg overflow-hidden"
        style={{ background: "#060f1e" }}
        aria-label="Mapa interactivo de regiones de Coravia"
      >
        {(Object.entries(REGION_PATHS) as [RegionId, { d: string; label: [number, number] }][]).map(
          ([regionId, { d, label }]) => {
            const isSelected = selectedRegion === regionId;
            const color = getRegionColor(regionId);
            return (
              <g key={regionId} style={{ cursor: "pointer" }} onClick={() => onRegionSelect(regionId)}>
                <motion.path
                  d={d}
                  fill={color}
                  stroke={isSelected ? "#EAB308" : "#060f1e"}
                  strokeWidth={isSelected ? 2.5 : 1.5}
                  whileHover={{ opacity: 0.85, scale: 1.01 }}
                  animate={{ opacity: isSelected ? 1 : 0.75 }}
                  transition={{ duration: 0.15 }}
                  style={{ transformOrigin: `${label[0]}px ${label[1]}px` }}
                />
                <text
                  x={label[0]} y={label[1] - 7}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="700"
                  fill={isSelected ? "#EAB308" : "white"}
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  {regionId}
                </text>
                <text
                  x={label[0]} y={label[1] + 7}
                  textAnchor="middle"
                  fontSize="7.5"
                  fill={isSelected ? "#EAB308" : "#94a3b8"}
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  {REGION_NAMES[regionId]}
                </text>
              </g>
            );
          }
        )}
      </svg>
      {/* Leyenda de colores por partido */}
      <div className="mt-3 flex flex-wrap gap-2 justify-center">
        {REGION_DATA.map((r) => {
          const color = getRegionColor(r.id);
          const topCand = Object.entries(r.govPct)
            .filter(([id]) => id !== "blank" && id !== "null")
            .sort(([, a], [, b]) => b - a)[0];
          const govCand = topCand ? r.govCands.find((c) => c.id === topCand[0]) : null;
          if (!govCand) return null;
          return (
            <button
              key={r.id}
              onClick={() => onRegionSelect(r.id)}
              className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] transition-all border ${
                selectedRegion === r.id ? "border-yellow-400" : "border-[#1e3a5f]"
              }`}
            >
              <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ backgroundColor: CLR[govCand.party] }} />
              <span className="text-slate-400">{r.id}</span>
              <span className="font-bold" style={{ color: CLR[govCand.party] }}>{govCand.party}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
