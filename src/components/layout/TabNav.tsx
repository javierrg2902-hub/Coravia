"use client";

export type TabId =
  | "resultados"
  | "hemiciclo"
  | "distritos"
  | "pactometro"
  | "presidencial"
  | "regional"
  | "comparacion";

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: "resultados",   label: "Resultados",   icon: "📊" },
  { id: "hemiciclo",    label: "Hemiciclo",     icon: "🏛️" },
  { id: "distritos",    label: "Distritos",     icon: "🗂️" },
  { id: "pactometro",   label: "Pactómetro",    icon: "🤝" },
  { id: "presidencial", label: "Presidencial",  icon: "🗳️" },
  { id: "regional",     label: "Regional",      icon: "🗺️" },
  { id: "comparacion",  label: "Comparación",   icon: "📈" },
];

interface Props {
  active: TabId;
  onChange: (tab: TabId) => void;
}

export default function TabNav({ active, onChange }: Props) {
  return (
    <nav
      className="bg-[#0a1628] border-b border-[#1e3a5f]"
      aria-label="Secciones del portal"
    >
      {/* Indicador de scroll horizontal — fade derecho */}
      <div className="relative">
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#0a1628] to-transparent pointer-events-none z-10 sm:hidden" />
        <div className="flex overflow-x-auto tab-scroll max-w-7xl mx-auto px-2 sm:px-4">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              aria-current={active === tab.id ? "page" : undefined}
              aria-label={tab.label}
              /* Mínimo 44px de alto (py-3 + texto), ancho mínimo garantizado con min-w */
              className={`
                flex-shrink-0 min-w-[52px] flex flex-col sm:flex-row items-center
                justify-center sm:gap-1.5 px-3 sm:px-4 py-3 text-[10px] sm:text-xs
                font-bold border-b-2 transition-all whitespace-nowrap
                ${active === tab.id
                  ? "border-yellow-400 text-yellow-400"
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600"
                }
              `}
            >
              {/* Icono siempre visible — texto visible desde sm en adelante */}
              <span className="text-base sm:text-sm leading-none">{tab.icon}</span>
              <span className="mt-0.5 sm:mt-0 leading-none">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
