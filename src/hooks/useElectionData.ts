"use client";

import { useState, useEffect, useMemo } from "react";
import { CACHE, PHASES } from "@/data/phases";
import { PID } from "@/data/parties";
import type { PhaseData, LiveResultsJson } from "@/types/election";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "/Coravia";
const POLL_INTERVAL = 30_000;

export function useElectionData() {
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [liveData, setLiveData] = useState<LiveResultsJson | null>(null);
  const [lastPolled, setLastPolled] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const poll = async () => {
      try {
        const res = await fetch(`${BASE}/data/resultados.json?t=${Date.now()}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: LiveResultsJson = await res.json();
        if (!active) return;
        setLiveData(json);
        setLastPolled(new Date());
        setPhaseIdx((prev) => {
          const incoming = json.metadata.faseIdx;
          if (incoming >= 0 && incoming < PHASES.length) return incoming;
          return prev;
        });
        setError(null);
      } catch (e) {
        if (active) setError(String(e));
      }
    };
    poll();
    const id = setInterval(poll, POLL_INTERVAL);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  const activePhaseData: PhaseData = useMemo(() => {
    if (!liveData || liveData.metadata.modo === "simulado") {
      return CACHE[phaseIdx] ?? CACHE[0];
    }
    const base = CACHE[phaseIdx] ?? CACHE[0];
    const lv = liveData.parlamentarias;
    if (!lv.votosValidos) return base;
    const votes = { ...base.votes };
    PID.forEach((p) => {
      if (lv.votos[p] !== undefined) votes[p] = lv.votos[p]!;
    });
    return {
      ...base,
      votes,
      vv: lv.votosValidos || base.vv,
      bl: lv.blancos || base.bl,
      nl: lv.nulos || base.nl,
      mc: liveData.metadata.mesasContadas || base.mc,
      pct: liveData.metadata.escrutinadoPct || base.pct,
    };
  }, [phaseIdx, liveData]);

  const isLive = liveData?.metadata.modo === "en_vivo";
  const escrutinadoPct = liveData?.metadata.escrutinadoPct ?? activePhaseData.pct;
  const faseName = liveData?.metadata.faseName ?? PHASES[phaseIdx]?.n ?? "F1";

  return {
    phaseIdx,
    setPhaseIdx,
    activePhaseData,
    liveData,
    lastPolled,
    error,
    isLive,
    escrutinadoPct,
    faseName,
    phases: PHASES,
  };
}
