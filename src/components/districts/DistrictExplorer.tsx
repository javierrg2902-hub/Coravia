"use client";

import { useState, useMemo } from "react";
import DistrictCard from "./DistrictCard";
import { SORTED } from "@/data/districts";
import { STATES } from "@/data/parties";
import type { RegionId } from "@/types/election";

interface Props {
  countedIds: Set<string>;
}

const STATE_KEYS = Object.keys(STATES) as RegionId[];

export default function DistrictExplorer({ countedIds }: Props) {
  const [stateFilter, setStateFilter] = useState<RegionId | "ALL">("ALL");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return SORTED.filter((d) => {
      if (stateFilter !== "ALL" && d.state !== stateFilter) return false;
      if (search && !d.name.toLowerCase().includes(search.toLowerCase()) && !d.id.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [stateFilter, search]);

  const countedCount = filtered.filter((d) => countedIds.has(d.id)).length;

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Buscar distrito..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-[#0c1e3a] border border-[#1e3a5f] rounded px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-600"
        />
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => setStateFilter("ALL")}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
              stateFilter === "ALL"
                ? "bg-yellow-500 text-black"
                : "bg-[#0c1e3a] text-slate-400 border border-[#1e3a5f] hover:border-slate-500"
            }`}
          >
            Todos
          </button>
          {STATE_KEYS.map((k) => (
            <button
              key={k}
              onClick={() => setStateFilter(k)}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                stateFilter === k
                  ? "bg-yellow-500 text-black"
                  : "bg-[#0c1e3a] text-slate-400 border border-[#1e3a5f] hover:border-slate-500"
              }`}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      {/* Contador */}
      <div className="text-xs text-slate-500">
        {filtered.length} distritos · <span className="text-green-400">{countedCount} escrutados</span>
        {stateFilter !== "ALL" && (
          <span className="ml-2 text-slate-600">— {STATES[stateFilter]}</span>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
        {filtered.map((d) => (
          <DistrictCard key={d.id} d={d} counted={countedIds.has(d.id)} />
        ))}
      </div>
    </div>
  );
}
