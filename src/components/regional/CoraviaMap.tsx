"use client";

import { motion } from "framer-motion";
import { CLR } from "@/data/parties";
import type { RegionId, RegionData } from "@/types/election";

interface Props {
  regionData: RegionData[];
  selectedRegion: RegionId | null;
  onRegionSelect: (id: RegionId) => void;
}

const REGION_PATHS: Record<RegionId, { d: string; labelX: number; labelY: number }> = {
  E5: { d: "M 20 20 L 200 20 L 200 120 L 140 150 L 20 150 Z",    labelX: 110, labelY: 82 },
  E7: { d: "M 200 20 L 380 20 L 380 140 L 280 140 L 200 120 Z",  labelX: 290, labelY: 75 },
  E8: { d: "M 20 150 L 140 150 L 140 270 L 20 270 Z",            labelX: 80,  labelY: 205 },
  E1: { d: "M 140 150 L 280 140 L 280 260 L 140 270 Z",          labelX: 210, labelY: 200 },
  E6: { d: "M 280 140 L 480 140 L 480 260 L 280 260 Z",          labelX: 380, labelY: 195 },
  E4: { d: "M 20 270 L 140 270 L 160 380 L 20 380 Z",            labelX: 90,  labelY: 325 },
  E3: { d: "M 140 270 L 280 260 L 300 380 L 160 380 Z",          labelX: 225, labelY: 325 },
  E2: { d: "M 280 260 L 480 260 L 480 380 L 300 380 Z",          labelX: 390, labelY: 320 },
};

const REGION_NAMES: Record<RegionId, string> = {
  E1: "DF Monteblanco", E2: "Florente", E3: "Litoral", E4: "Palmdale",
  E5: "Sta. Catalina",  E6: "Castellón", E7: "Alcalá", E8: "Río Bravo",
};

function getRegionLeader(regionId: RegionId, regionData: RegionData[]): { color: string; party: string } | null {
  const region = regionData.find((r) => r.id === regionId);
  if (!region) return null;
  const top = Object.entries(region.govPct)
    .filter(([id]) => id !== "blank" && id !== "null")
    .sort(([, a], [, b]) => b - a)[0];
  if (!top) return null;
  const cand = region.govCands.find((c) => c.id === top[0]);
  return cand ? { color: (cand.party ? CLR[cand.party] : null) ?? cand.color ?? "#888888", party: cand.party ?? cand.partyName ?? "Ind." } : null;
}

export default function CoraviaMap({ regionData, selectedRegion, onRegionSelect }: Props) {
  return (
    <div className="w-full">
      <div className="label-sm mb-3">Mapa Electoral — República de Coravia</div>

      {/* Mapa SVG — texto escalado para que sea legible incluso a 320px */}
      <div className="relative w-full max-w-lg mx-auto">
        <svg
          viewBox="0 0 500 400"
          className="w-full rounded-xl overflow-hidden"
          style={{ background: "#060f1e" }}
          role="img"
          aria-label="Mapa interactivo de las 8 regiones de Coravia"
        >
          {(Object.entries(REGION_PATHS) as [RegionId, typeof REGION_PATHS[RegionId]][]).map(
            ([regionId, { d, labelX, labelY }]) => {
              const isSelected = selectedRegion === regionId;
              const leader = getRegionLeader(regionId, regionData);
              const fillColor = leader ? leader.color + "bb" : "#1e3a5f";

              return (
                <g
                  key={regionId}
                  role="button"
                  tabIndex={0}
                  aria-label={`${REGION_NAMES[regionId]} — pulsa para ver resultados`}
                  aria-pressed={isSelected}
                  style={{ cursor: "pointer" }}
                  onClick={() => onRegionSelect(regionId)}
                  onKeyDown={(e) => e.key === "Enter" && onRegionSelect(regionId)}
                >
                  <motion.path
                    d={d}
                    fill={fillColor}
                    stroke={isSelected ? "#EAB308" : "#060f1e"}
                    strokeWidth={isSelected ? 3 : 1.5}
                    whileHover={{ opacity: 0.9 }}
                    animate={{ opacity: isSelected ? 1 : 0.8 }}
                    transition={{ duration: 0.15 }}
                  />
                  {/* ID de la región — 22px en el viewBox = ~12px en 320px de ancho */}
                  <text
                    x={labelX}
                    y={labelY}
                    textAnchor="middle"
                    fontSize="22"
                    fontWeight="900"
                    fill={isSelected ? "#EAB308" : "white"}
                    style={{ pointerEvents: "none", userSelect: "none" }}
                  >
                    {regionId}
                  </text>
                  {/* Nombre abreviado — 13px en el viewBox */}
                  <text
                    x={labelX}
                    y={labelY + 18}
                    textAnchor="middle"
                    fontSize="13"
                    fill={isSelected ? "#FDE68A" : "#cbd5e1"}
                    style={{ pointerEvents: "none", userSelect: "none" }}
                  >
                    {REGION_NAMES[regionId].split(" ").slice(0, 2).join(" ")}
                  </text>
                </g>
              );
            }
          )}
        </svg>
      </div>

      {/* Leyenda de regiones — botones con toque mínimo garantizado */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
        {regionData.map((r) => {
          const leader = getRegionLeader(r.id, regionData);
          return (
            <button
              key={r.id}
              onClick={() => onRegionSelect(r.id)}
              aria-pressed={selectedRegion === r.id}
              /* min-h-[44px] garantiza toque mínimo */
              className={`
                min-h-[44px] flex items-center gap-2 px-3 py-2 rounded-lg border
                text-left transition-all
                ${selectedRegion === r.id
                  ? "border-yellow-400 bg-[#1e3a5f]"
                  : "border-[#1e3a5f] bg-[#0c1e3a] hover:border-slate-500"
                }
              `}
            >
              {leader && (
                <div
                  className="w-3 h-3 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: leader.color }}
                />
              )}
              <div className="min-w-0">
                <div className={`text-xs font-black ${selectedRegion === r.id ? "text-yellow-400" : "text-slate-300"}`}>
                  {r.id}
                </div>
                <div className="text-[10px] text-slate-500 truncate">{r.name}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
