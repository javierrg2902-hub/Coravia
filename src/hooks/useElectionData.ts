"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { CACHE, PHASES } from "@/data/phases";
import { PID } from "@/data/parties";
import type { PhaseData, LiveResultsJson, PartyId, RegionId } from "@/types/election";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "/Coravia";
const POLL_INTERVAL = 30_000;
// Tamaño máximo aceptable para el JSON (50 KB). Rechazamos respuestas mayores
// para evitar que un archivo maliciosamente grande agote la memoria del navegador.
const MAX_JSON_BYTES = 50_000;

// ─── Validación del JSON externo ──────────────────────────────────────────────
// El archivo resultados.json puede ser editado manualmente. Aunque React escapa
// strings por defecto (protege contra XSS), validamos la forma y los rangos para:
//   1. Prevenir prototype pollution (__proto__, constructor, prototype en claves)
//   2. Evitar valores numéricos fuera de rango que rompan la UI
//   3. Garantizar que solo campos esperados modifiquen el estado de la aplicación

import { hasNoDangerousKeys } from "@/lib/validation";

function safeString(v: unknown, maxLen = 20): string {
  if (typeof v !== "string") return "";
  return v.replace(/<[^>]*>/g, "").slice(0, maxLen);
}

function safeNumber(v: unknown, min: number, max: number, fallback: number): number {
  const n = Number(v);
  if (!isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function validateLiveResults(raw: unknown): LiveResultsJson | null {
  // Rechazar si no es objeto plano
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;

  // Rechazar si contiene claves peligrosas en cualquier nivel del árbol
  if (!hasNoDangerousKeys(raw)) return null;

  const d = raw as Record<string, unknown>;

  // ── metadata ──
  if (!d.metadata || typeof d.metadata !== "object") return null;
  const meta = d.metadata as Record<string, unknown>;

  const faseIdx = safeNumber(meta.faseIdx, 0, PHASES.length - 1, 0);
  const modo = meta.modo === "en_vivo" ? "en_vivo" : "simulado";
  const escrutinadoPct = safeString(meta.escrutinadoPct, 10);
  const faseName = safeString(meta.faseName); // default maxLen=20; 5 was too tight for labels
  const mesasContadas = (meta.mesasContadas !== undefined && meta.mesasContadas !== null)
    ? safeNumber(meta.mesasContadas, 0, 999_999, 0)
    : null;
  const mesasTotal = safeNumber(meta.mesasTotal, 0, 999_999, 0);
  const eleccion = safeString(meta.eleccion, 80);
  const fechaActualizacion = safeString(meta.fechaActualizacion, 30);

  // ── parlamentarias ──
  const rawParl = d.parlamentarias;
  const parlObj =
    rawParl && typeof rawParl === "object" && !Array.isArray(rawParl)
      ? (rawParl as Record<string, unknown>)
      : {};

  const votosValidos = safeNumber(parlObj.votosValidos, 0, 1e9, 0);
  const blancos = safeNumber(parlObj.blancos, 0, 1e9, 0);
  const nulos = safeNumber(parlObj.nulos, 0, 1e9, 0);

  // Solo aceptamos votos de los 13 partidos conocidos; ignoramos cualquier otra clave
  const rawVotos =
    parlObj.votos && typeof parlObj.votos === "object" ? (parlObj.votos as Record<string, unknown>) : {};
  const votos: Partial<Record<PartyId, number>> = {};
  for (const p of PID) {
    if (rawVotos[p] !== undefined) {
      votos[p] = safeNumber(rawVotos[p], 0, 1e9, 0);
    }
  }

  // ── presidencial ──
  const rawPres = d.presidencial;
  const presObj =
    rawPres && typeof rawPres === "object" && !Array.isArray(rawPres)
      ? (rawPres as Record<string, unknown>)
      : {};
  const presidencial: Record<string, number> = {};
  const VALID_CAND_IDS = ["vinyas", "calleja", "santos", "blank", "null"];
  for (const id of VALID_CAND_IDS) {
    if (presObj[id] !== undefined) {
      presidencial[id] = safeNumber(presObj[id], 0, 1, 0);
    }
  }

  // ── regionales ── parse all provided entries; silently skip malformed ones
  const VALID_REGION_IDS = new Set<string>(["E1", "E2", "E3", "E4", "E5", "E6", "E7", "E8"]);
  const rawRegionales = Array.isArray(d.regionales) ? d.regionales : [];
  const regionales: LiveResultsJson["regionales"] = [];
  for (const rawReg of rawRegionales) {
    if (!rawReg || typeof rawReg !== "object" || Array.isArray(rawReg)) continue;
    const reg = rawReg as Record<string, unknown>;
    if (typeof reg.regionId !== "string" || !VALID_REGION_IDS.has(reg.regionId)) continue;

    const rawGovPct =
      reg.govPct && typeof reg.govPct === "object" && !Array.isArray(reg.govPct)
        ? (reg.govPct as Record<string, unknown>)
        : {};
    const govPct: Record<string, number> = {};
    for (const [k, v] of Object.entries(rawGovPct)) {
      govPct[k] = safeNumber(v, 0, 1, 0);
    }

    const rawPartyPct =
      reg.partyPct && typeof reg.partyPct === "object" && !Array.isArray(reg.partyPct)
        ? (reg.partyPct as Record<string, unknown>)
        : {};
    const partyPct: Partial<Record<PartyId, number>> = {};
    for (const p of PID) {
      if (rawPartyPct[p] !== undefined) partyPct[p] = safeNumber(rawPartyPct[p], 0, 1, 0);
    }

    regionales.push({ regionId: reg.regionId as RegionId, govPct, partyPct });
  }

  return {
    metadata: {
      eleccion,
      fechaActualizacion,
      faseName,
      faseIdx,
      mesasContadas,
      mesasTotal,
      escrutinadoPct,
      modo,
    },
    parlamentarias: { votosValidos, blancos, nulos, votos },
    presidencial,
    regionales,
  };
}

// ─── Hook principal ────────────────────────────────────────────────────────────
export function useElectionData() {
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [liveData, setLiveData] = useState<LiveResultsJson | null>(null);
  const [lastPolled, setLastPolled] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const manualPhaseRef = useRef(false);
  // Tracks last server faseIdx so we can detect when the election advances phases
  const serverPhaseRef = useRef<number | null>(null);
  // Tracks fechaActualizacion to skip state updates when data hasn't changed
  const lastFechaRef = useRef<string | null>(null);

  useEffect(() => {
    let active = true;
    let errorCount = 0;
    let timeoutId: ReturnType<typeof setTimeout>;

    const schedule = (delay: number) => {
      if (active) timeoutId = setTimeout(poll, delay);
    };

    async function poll() {
      try {
        const res = await fetch(`${BASE}/data/resultados.json?t=${Date.now()}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        // Comprobamos el tamaño antes de parsear para evitar OOM en JSON gigantes
        const text = await res.text();
        if (text.length > MAX_JSON_BYTES) throw new Error("JSON demasiado grande");

        const raw: unknown = JSON.parse(text);

        // Validamos y saneamos antes de usar en el estado
        const validated = validateLiveResults(raw);
        if (!validated) throw new Error("JSON con formato inválido");

        if (!active) return;

        // Only update data state when content has changed — avoids unnecessary re-renders
        if (validated.metadata.fechaActualizacion !== lastFechaRef.current) {
          lastFechaRef.current = validated.metadata.fechaActualizacion;
          const incoming = validated.metadata.faseIdx;
          const prevServer = serverPhaseRef.current;
          serverPhaseRef.current = incoming;
          setLiveData(validated);
          setPhaseIdx((prev) => {
            if (incoming < 0 || incoming >= PHASES.length) return prev;
            if (manualPhaseRef.current) {
              // Release the manual lock when the server phase advances to a new value.
              // This ensures election-night auto-progress resumes after the user
              // browses a past phase to compare, without forcing an immediate bounce-back.
              if (prevServer !== null && incoming !== prevServer) {
                manualPhaseRef.current = false;
                return incoming;
              }
              return prev;
            }
            return incoming;
          });
        } else {
          serverPhaseRef.current = validated.metadata.faseIdx;
        }

        errorCount = 0;
        setLastPolled(new Date());
        setError(null);
        schedule(POLL_INTERVAL);
      } catch (e) {
        // Error informativo para el desarrollador; no se muestra datos externos al usuario
        errorCount = Math.min(errorCount + 1, 10);
        if (active) {
          setError(e instanceof Error ? e.message : "Error desconocido");
          // Exponential back-off: 60s, 120s, 240s … capped at 5 min
          schedule(Math.min(POLL_INTERVAL * (2 ** errorCount), 5 * 60_000));
        }
      }
    }

    poll();
    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, []);

  const activePhaseData: PhaseData = useMemo(() => {
    if (!liveData || liveData.metadata.modo === "simulado") {
      return CACHE[phaseIdx] ?? CACHE[0];
    }
    const base = CACHE[phaseIdx] ?? CACHE[0];
    const lv = liveData.parlamentarias;
    // Guard before computing votes — avoids allocating an object that gets discarded
    if (lv.votosValidos === 0) return base;
    const votes = { ...base.votes };
    PID.forEach((p) => {
      if (lv.votos[p] !== undefined) votes[p] = lv.votos[p]!;
    });
    return {
      ...base,
      votes,
      vv: lv.votosValidos,
      bl: lv.blancos ?? base.bl,
      nl: lv.nulos ?? base.nl,
      mc: liveData.metadata.mesasContadas ?? base.mc,
      pct: liveData.metadata.escrutinadoPct || base.pct,
    };
  }, [phaseIdx, liveData]);

  const isLive = liveData?.metadata.modo === "en_vivo";
  // Use || (not ??) so empty-string from safeString falls through to the cache value
  const escrutinadoPct = liveData?.metadata.escrutinadoPct || activePhaseData.pct;
  const faseName = liveData?.metadata.faseName || PHASES[phaseIdx]?.n || "F1";

  const selectPhase = useCallback((i: number) => {
    manualPhaseRef.current = true;
    setPhaseIdx(i);
  }, []);

  return {
    phaseIdx,
    setPhaseIdx: selectPhase,
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
