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
    <nav className="bg-[#0a1628] border-b border-[#1e3a5f]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex overflow-x-auto tab-scroll">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              aria-current={active === tab.id ? "page" : undefined}
              className={`
                flex-shrink-0 flex items-center gap-1.5 px-4 py-3 text-xs font-bold
                border-b-2 transition-all whitespace-nowrap
                ${active === tab.id
                  ? "border-yellow-400 text-yellow-400"
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600"
                }
              `}
            >
              <span className="text-sm">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
