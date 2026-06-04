"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList,
} from "recharts";
import { CLR, NOM } from "@/data/parties";
import type { PartyResult } from "@/types/election";

interface Props {
  results: PartyResult[];
  mode: "votos" | "escanos";
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ payload: PartyResult & { label: string; value: number } }>;
}

function CustomTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-[#0a1628] border border-[#1e3a5f] rounded p-2 text-xs shadow-xl">
      <div className="font-bold text-slate-200 mb-1">{NOM[d.p] ?? d.p}</div>
      <div className="text-slate-400">
        {d.value.toLocaleString("es-ES")}
        {typeof d.pct === "number" ? ` (${d.pct.toFixed(1)}%)` : ""}
      </div>
    </div>
  );
}

export default function ResultsChart({ results, mode }: Props) {
  const data = results
    .filter((r) => (mode === "votos" ? r.v > 0 : r.s > 0))
    .map((r) => ({
      ...r,
      label: r.p,
      value: mode === "votos" ? r.v : r.s,
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <ResponsiveContainer width="100%" height={Math.max(data.length * 32, 200)}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 40, top: 4, bottom: 4 }}>
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="label"
          width={44}
          tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
        <Bar dataKey="value" radius={[0, 3, 3, 0]} maxBarSize={22}>
          {data.map((d) => (
            <Cell key={d.p} fill={CLR[d.p] ?? "#555"} />
          ))}
          <LabelList
            dataKey="value"
            position="right"
            style={{ fill: "#94a3b8", fontSize: 10, fontWeight: 600 }}
            formatter={(v: number) =>
              mode === "votos"
                ? v > 999999
                  ? `${(v / 1000000).toFixed(1)}M`
                  : v > 999
                  ? `${(v / 1000).toFixed(0)}k`
                  : String(v)
                : String(v)
            }
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
