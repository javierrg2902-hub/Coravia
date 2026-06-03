"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import RegionCard from "./RegionCard";
import { REGION_DATA } from "@/data/regional";
import type { RegionId } from "@/types/election";

const CoraviaMap = dynamic(() => import("./CoraviaMap"), { ssr: false });

export default function RegionalTab() {
  const [selectedRegion, setSelectedRegion] = useState<RegionId | null>(null);

  const handleSelect = (id: RegionId) => {
    setSelectedRegion((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mapa interactivo */}
        <div className="card p-4">
          <CoraviaMap selectedRegion={selectedRegion} onRegionSelect={handleSelect} />
        </div>

        {/* Lista de regiones */}
        <div className="space-y-3">
          <div className="label-sm">Resultados por región</div>
          {REGION_DATA.map((region) => (
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
