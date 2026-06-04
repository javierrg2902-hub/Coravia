"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import RegionCard from "./RegionCard";
import { REGION_DATA } from "@/data/regional";
import { dhondt5 } from "@/lib/dhondt";
import type { RegionId, RegionData, LiveResultsJson } from "@/types/election";

const CoraviaMap = dynamic(() => import("./CoraviaMap"), { ssr: false });

interface Props {
  liveData: LiveResultsJson | null;
}

export default function RegionalTab({ liveData }: Props) {
  const [selectedRegion, setSelectedRegion] = useState<RegionId | null>(null);

  const regionData: RegionData[] = useMemo(() => {
    if (!liveData || liveData.metadata.modo !== "en_vivo" || liveData.regionales.length === 0) {
      return REGION_DATA;
    }
    const liveMap = new Map(liveData.regionales.map((r) => [r.regionId, r]));
    return REGION_DATA.map((region) => {
      const live = liveMap.get(region.id);
      if (!live) return region;
      const partyPct = { ...region.partyPct, ...live.partyPct };
      const govPct = { ...region.govPct, ...live.govPct };
      return { ...region, partyPct, govPct, seats: dhondt5(partyPct) };
    });
  }, [liveData]);

  const handleSelect = (id: RegionId) => {
    setSelectedRegion((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mapa interactivo */}
        <div className="card p-4">
          <CoraviaMap regionData={regionData} selectedRegion={selectedRegion} onRegionSelect={handleSelect} />
        </div>

        {/* Lista de regiones */}
        <div className="space-y-3">
          <div className="label-sm">Resultados por región</div>
          {regionData.map((region) => (
            <RegionCard
              key={region.id}
              region={region}
              isSelected={selectedRegion === region.id}
              onClick={() => handleSelect(region.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
