"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";

import Header from "@/components/layout/Header";
import TabNav, { TabId } from "@/components/layout/TabNav";
import PhaseBar from "@/components/scrutiny/PhaseBar";
import Hemicycle from "@/components/hemiciclo/Hemicycle";
import ResultsGrid from "@/components/resultados/ResultsGrid";
import ResultsChart from "@/components/resultados/ResultsChart";
import ResultsTable from "@/components/resultados/ResultsTable";
import SeatDistribution from "@/components/resultados/SeatDistribution";
import DistrictExplorer from "@/components/districts/DistrictExplorer";
import Pactometro from "@/components/pactometro/Pactometro";
import PresidencialTab from "@/components/presidencial/PresidencialTab";

import { useElectionData } from "@/hooks/useElectionData";
import { useElectionCalc } from "@/hooks/useElectionCalc";
import { TMESAS } from "@/data/phases";

const RegionalTab = dynamic(() => import("@/components/regional/RegionalTab"), { ssr: false });
const ComparacionTab = dynamic(() => import("@/components/comparacion/ComparacionTab"), { ssr: false });

export default function ElectionDashboard() {
  const [activeTab, setActiveTab] = useState<TabId>("resultados");
  const [chartMode, setChartMode] = useState<"votos" | "escanos">("votos");

  const {
    phaseIdx, setPhaseIdx,
    activePhaseData, isLive,
    escrutinadoPct, faseName, lastPolled, error,
  } = useElectionData();

  const { seats, results, totalSeats, countedIds } = useElectionCalc(activePhaseData);

  return (
    <div className="min-h-screen bg-[#060f1e]">
      <Header
        pct={escrutinadoPct}
        mc={activePhaseData.mc}
        faseName={faseName}
        isLive={isLive}
        lastPolled={lastPolled}
      />
      <TabNav active={activeTab} onChange={setActiveTab} />

      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">

        {/* Error de conexión — solo si falla el polling */}
        {error && (
          <div className="card border-yellow-800/50 bg-yellow-900/10 p-3 mb-4 text-xs text-yellow-300 flex items-center gap-2">
            <span>⚠️</span>
            <span>No se pudo actualizar: {error}. Mostrando datos anteriores.</span>
          </div>
        )}

        {/* Selector de fase — visible en todas las pestañas excepto regional y comparación */}
        {activeTab !== "regional" && activeTab !== "comparacion" && (
          <div className="card p-3 mb-4">
            <div className="label-xs mb-2">Fase de escrutinio</div>
            <PhaseBar phaseIdx={phaseIdx} onChange={setPhaseIdx} />
          </div>
        )}

        {/* Estadísticas globales rápidas */}
        {(activeTab === "resultados" || activeTab === "hemiciclo") && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4">
            {([
              ["Votos válidos",   activePhaseData.vv.toLocaleString("es-ES"),  "text-slate-100"],
              ["Escrutado",       `${escrutinadoPct}%`,                        "text-yellow-400"],
              ["Mesas",           `${activePhaseData.mc.toLocaleString("es-ES")} / ${TMESAS.toLocaleString("es-ES")}`, "text-slate-300"],
              ["Escaños asig.",   `${totalSeats} / 25`,                        "text-blue-400"],
            ] as [string, string, string][]).map(([label, value, cls]) => (
              <div key={label} className="card p-3 text-center">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">{label}</div>
                <div className={`text-base sm:text-lg font-black ${cls} tabular-nums leading-tight`}>{value}</div>
              </div>
            ))}
          </div>
        )}

        {/* Transición de pestaña */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >

            {/* ── Resultados ── */}
            {activeTab === "resultados" && (
              <div className="space-y-4 sm:space-y-6">
                <ResultsGrid results={results} />
                <div className="card p-4">
                  <SeatDistribution seats={seats} />
                </div>
                <div className="card p-4">
                  <div className="flex items-center justify-between mb-3 gap-2">
                    <div className="label-sm">Gráfico de resultados</div>
                    {/* Botones con toque mínimo 44px */}
                    <div className="flex gap-1">
                      {(["votos", "escanos"] as const).map((m) => (
                        <button
                          key={m}
                          onClick={() => setChartMode(m)}
                          aria-pressed={chartMode === m}
                          className={`
                            px-4 py-2.5 rounded text-xs font-bold transition-all min-h-[44px]
                            ${chartMode === m
                              ? "bg-yellow-500 text-black"
                              : "bg-[#0c1e3a] text-slate-400 border border-[#1e3a5f] hover:border-slate-500"
                            }
                          `}
                        >
                          {m === "votos" ? "% Voto" : "Escaños"}
                        </button>
                      ))}
                    </div>
                  </div>
                  <ResultsChart results={results} mode={chartMode} />
                </div>
                <div className="card p-4">
                  <div className="label-sm mb-3">Tabla completa de resultados</div>
                  <ResultsTable results={results} totalVotos={activePhaseData.vv} />
                </div>
              </div>
            )}

            {/* ── Hemiciclo ── */}
            {activeTab === "hemiciclo" && (
              <div className="card p-4 md:p-6">
                <Hemicycle seats={seats} results={results} totalSeats={totalSeats} />
              </div>
            )}

            {/* ── Distritos ── */}
            {activeTab === "distritos" && (
              <DistrictExplorer countedIds={countedIds} />
            )}

            {/* ── Pactómetro ── */}
            {activeTab === "pactometro" && (
              <div className="card p-4 md:p-6">
                <div className="label-xs mb-0.5">Calculadora de coaliciones</div>
                <div className="text-base sm:text-lg font-black text-slate-100 mb-4">
                  Pactómetro de investidura
                </div>
                <Pactometro seats={seats} />
              </div>
            )}

            {/* ── Presidencial ── */}
            {activeTab === "presidencial" && (
              <PresidencialTab phaseIdx={phaseIdx} setPhaseIdx={setPhaseIdx} />
            )}

            {/* ── Regional ── */}
            {activeTab === "regional" && <RegionalTab />}

            {/* ── Comparación ── */}
            {activeTab === "comparacion" && <ComparacionTab phaseIdx={phaseIdx} />}

          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer institucional */}
      <footer className="border-t border-[#1e3a5f] mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-1">
          <div className="text-xs text-slate-600 uppercase tracking-widest">
            Portal Oficial de Resultados · República de Coravia · Elecciones Generales 2026
          </div>
          <div className="text-[11px] text-slate-700">
            Resultados provisionales no definitivos · Datos se actualizan automáticamente
          </div>
        </div>
      </footer>
    </div>
  );
}
