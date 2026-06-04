"use client";

import ScrutinyProgress from "@/components/scrutiny/ScrutinyProgress";
import { TMESAS } from "@/data/phases";

interface Props {
  pct: string;
  mc: number;
  faseName: string;
  isLive: boolean;
  lastPolled: Date | null;
}

export default function Header({ pct, mc, faseName, isLive, lastPolled }: Props) {
  return (
    <header className="bg-[#0a1628] border-b border-[#1e3a5f] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          {/* Título institucional */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-700 to-yellow-500 flex items-center justify-center text-white font-black text-xs">
              CR
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">
                República de Coravia
              </div>
              <div className="text-sm font-black text-slate-100 leading-tight">
                Elecciones Generales 2026
              </div>
            </div>
          </div>

          {/* Separador */}
          <div className="hidden md:block w-px h-8 bg-[#1e3a5f]" />

          {/* Barra de escrutinio */}
          <div className="flex-1 min-w-0">
            <ScrutinyProgress
              pct={pct}
              mc={mc}
              total={TMESAS}
              faseName={faseName}
              isLive={isLive}
            />
          </div>

          {/* Timestamp */}
          {lastPolled && (
            <div className="flex-shrink-0 text-[10px] text-slate-500 hidden lg:block">
              Actualizado {lastPolled.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
