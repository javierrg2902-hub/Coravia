"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { CLR, NOM } from "@/data/parties";
import { PID } from "@/data/parties";
import type { District } from "@/types/election";

interface Props {
  d: District;
  counted: boolean;
}

export default function DistrictCard({ d, counted }: Props) {
  const [open, setOpen] = useState(false);
  const [hovP, setHovP] = useState<string | null>(null);
  const [selP, setSelP] = useState<string | null>(null);

  const ranked = PID
    .map((p) => ({ p, v: (d[p] as number) || 0 }))
    .filter((x) => x.v > 0)
    .sort((a, b) => b.v - a.v);
  const winner = ranked[0];
  const winColor = winner ? CLR[winner.p] : "#1e3a5f";
  const chartData = ranked.slice(0, 8).map((x) => ({
    name: x.p, votos: x.v, color: CLR[x.p],
  }));
  const activeP = selP || hovP;

  return (
    <div
      onClick={() => counted && (setOpen((v) => !v), setSelP(null))}
      className={`rounded-lg px-3 py-2 border-l-2 transition-colors ${
        open ? "bg-[#0f2040]" : "bg-[#0c1e3a]"
      } ${counted ? "cursor-pointer hover:bg-[#0f2040]" : "opacity-45"}`}
      style={{ borderLeftColor: counted ? winColor : "#1e3a5f" }}
    >
      <div className="flex justify-between items-start gap-2">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-bold text-[11px]">{d.id}</span>
            {counted && (
              <span className="text-[9px] bg-green-500/15 text-green-400 rounded px-1">✓</span>
            )}
          </div>
          <div className={`text-[11px] mt-0.5 ${counted ? "text-slate-200" : "text-slate-500"}`}>
            {d.name}
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          {counted && winner && (
            <div className="text-xs font-black" style={{ color: CLR[winner.p] }}>{winner.p}</div>
          )}
          <div className="text-[9px] text-slate-600">{d.mesas}m</div>
        </div>
      </div>

      {open && counted && (
        <div className="mt-3" onClick={(e) => e.stopPropagation()}>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {([
              ["Registrados", d.reg.toLocaleString("es-ES"), "text-slate-400"],
              ["Participación", `${(d.par * 100).toFixed(1)}%`, "text-slate-300"],
              ["V. Válidos", d.vv.toLocaleString("es-ES"), "text-green-400"],
            ] as [string, string, string][]).map(([label, val, cls]) => (
              <div key={label} className="bg-[#060f1e] rounded p-2 text-center">
                <div className="text-[9px] text-slate-500">{label}</div>
                <div className={`text-[11px] font-bold ${cls}`}>{val}</div>
              </div>
            ))}
          </div>

          {activeP && (
            <div
              className="rounded p-2 mb-2 flex justify-between items-center text-sm"
              style={{
                background: (CLR[activeP as keyof typeof CLR] ?? "#888") + "22",
                border: `1px solid ${CLR[activeP as keyof typeof CLR] ?? "#888"}66`,
              }}
            >
              <span className="font-black text-xs" style={{ color: CLR[activeP as keyof typeof CLR] ?? "#888" }}>{activeP}</span>
              <span className="text-slate-300 text-xs">
                {((d[activeP] as number) || 0).toLocaleString("es-ES")} ·{" "}
                <b className="text-yellow-400">
                  {d.vv ? (((d[activeP] as number) / d.vv) * 100).toFixed(1) : 0}%
                </b>
              </span>
            </div>
          )}

          <ResponsiveContainer width="100%" height={120}>
            <BarChart
              data={chartData}
              margin={{ top: 2, right: 2, bottom: 14, left: -24 }}
              onMouseLeave={() => setHovP(null)}
            >
              <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 9 }} angle={-45} textAnchor="end" />
              <YAxis tick={{ fill: "#64748b", fontSize: 9 }} />
              <Tooltip
                contentStyle={{ background: "#0c1e3a", border: "1px solid #1e3a5f", borderRadius: 6, fontSize: 11 }}
                cursor={{ fill: "#ffffff05" }}
              />
              <Bar dataKey="votos" radius={[3, 3, 0, 0]} onMouseEnter={(data) => setHovP(data.name)}>
                {chartData.map((e, i) => (
                  <Cell key={i} fill={e.color} opacity={!activeP || e.name === activeP ? 1 : 0.15} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div className="flex flex-wrap gap-1.5 mt-2">
            {ranked.map(({ p, v }) => {
              const pct = d.vv ? ((v / d.vv) * 100).toFixed(1) : "0";
              const isActive = activeP === p;
              return (
                <button
                  key={p}
                  onMouseEnter={() => setHovP(p)}
                  onMouseLeave={() => setHovP(null)}
                  onClick={(e) => { e.stopPropagation(); setSelP((prev) => (prev === p ? null : p)); }}
                  className="rounded px-1.5 py-0.5 text-[10px] transition-opacity"
                  style={{
                    background: CLR[p] + (isActive ? "44" : "18"),
                    border: `1px solid ${CLR[p]}${isActive ? "cc" : "44"}`,
                    opacity: activeP && !isActive ? 0.3 : 1,
                  }}
                >
                  <span className="font-bold" style={{ color: CLR[p] }}>{p}</span>
                  <span className="text-slate-400 ml-1">{pct}%</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
