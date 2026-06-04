"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell,
} from "recharts";
import { CLR, NOM, PID } from "@/data/parties";
import type { HistoricalElectionResult } from "@/types/election";

interface Props {
  elections: Array<HistoricalElectionResult & { votosPct: Record<string, number> }>;
  highlightedParty: string | null;
  setHighlightedParty: (p: string | null) => void;
  hiddenParties: Set<string>;
  metric: "votos" | "escanos";
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ color: string; name: string | number; value: number }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0a1628] border border-[#1e3a5f] rounded p-3 text-xs shadow-xl">
      <div className="font-bold text-slate-200 mb-2">{NOM[label as keyof typeof NOM] ?? label}</div>
      {payload.map((entry) => (
        <div key={entry.name} className="flex justify-between gap-4" style={{ color: entry.color }}>
          <span>{entry.name}</span>
          <span className="font-bold">{entry.value.toFixed(1)}{entry.name === "escanos" ? "" : "%"}</span>
        </div>
      ))}
    </div>
  );
}

export default function ElectionComparison({ elections, highlightedParty, setHighlightedParty, hiddenParties, metric }: Props) {
  const chartData = PID
    .filter((p) => !hiddenParties.has(p))
    .filter((p) => elections.some((e) => (e.votosPct[p] ?? 0) > 1))
    .map((p) => {
      const row: Record<string, string | number> = { partido: p };
      elections.forEach((e) => {
        if (metric === "votos") {
          row[String(e.year)] = e.votosPct[p] ?? 0;
        } else {
          row[String(e.year)] = (e.escanos[p] ?? 0) as number;
        }
      });
      return row;
    })
    .sort((a, b) => (b[String(elections[elections.length - 1].year)] as number) - (a[String(elections[elections.length - 1].year)] as number));

  const YEAR_COLORS = ["#3b82f6", "#8b5cf6", "#EAB308"];

  return (
    <div className="card p-4">
      <div className="label-sm mb-4">
        Comparativa de {metric === "votos" ? "voto por partido (%)" : "escaños por partido"}
      </div>
      <ResponsiveContainer width="100%" height={Math.max(chartData.length * 40, 320)}>
        <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 50, top: 4, bottom: 4 }}>
          <XAxis type="number" tick={{ fill: "#64748b", fontSize: 10 }} />
          <YAxis
            type="category"
            dataKey="partido"
            width={44}
            tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
          <Legend
            wrapperStyle={{ paddingTop: 12, fontSize: 11, color: "#94a3b8" }}
          />
          {elections.map((e, i) => (
            <Bar
              key={e.year}
              dataKey={String(e.year)}
              name={String(e.year)}
              fill={YEAR_COLORS[i] ?? "#888"}
              maxBarSize={12}
              radius={[0, 3, 3, 0]}
              onClick={(data) => {
                const pid = data?.partido as string;
                if (pid) setHighlightedParty(highlightedParty === pid ? null : pid);
              }}
            >
              {chartData.map((entry, idx) => (
                <Cell
                  key={`cell-${idx}`}
                  fill={YEAR_COLORS[i] ?? "#888"}
                  opacity={highlightedParty && highlightedParty !== entry.partido ? 0.2 : 1}
                />
              ))}
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
