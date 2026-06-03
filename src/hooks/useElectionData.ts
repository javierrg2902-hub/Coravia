"use client";

import { useState, useEffect, useMemo } from "react";
import { CACHE, PHASES } from "@/data/phases";
import { PID } from "@/data/parties";
import type { PhaseData, LiveResultsJson, PartyId } from "@/types/election";

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

const DANGEROUS_KEYS = new Set(["__proto__", "constructor", "prototype"]);

function safeString(v: unknown, maxLen = 20): string {
  if (typeof v !== "string") return "";
  return v.replace(/<[^>]*>/g, "").slice(0, maxLen);
}

function safeNumber(v: unknown, min: number, max: number, fallback: number): number {
  const n = Number(v);
  if (!isFinite(n) || isNaN(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function hasNoDangerousKeys(obj: unknown): boolean {
  if (typeof obj !== "object" || obj === null) return true;
  for (const key of Object.keys(obj as object)) {
    if (DANGEROUS_KEYS.has(key)) return false;
    if (!hasNoDangerousKeys((obj as Record<string, unknown>)[key])) return false;
  }
  return true;
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
  const faseName = safeString(meta.faseName, 5);
  const mesasContadas = safeNumber(meta.mesasContadas, 0, 999_999, 0);
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

  // ── regionales ── (opcional; si falta o está mal, ignoramos silenciosamente)
  const regionales: LiveResultsJson["regionales"] = [];

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

  useEffect(() => {
    let active = true;
    const poll = async () => {
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
        setLiveData(validated);
        setLastPolled(new Date());
        setPhaseIdx((prev) => {
          const incoming = validated.metadata.faseIdx;
          if (incoming >= 0 && incoming < PHASES.length) return incoming;
          return prev;
        });
        setError(null);
      } catch (e) {
        // Error informativo para el desarrollador; no se muestra datos externos al usuario
        if (active) setError(e instanceof Error ? e.message : "Error desconocido");
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
    const votes = { ...base.votes };
    PID.forEach((p) => {
      if (lv.votos[p] !== undefined) votes[p] = lv.votos[p]!;
    });
    return {
      ...base,
      votes,
      vv: lv.votosValidos ?? base.vv,
      bl: lv.blancos ?? base.bl,
      nl: lv.nulos ?? base.nl,
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
