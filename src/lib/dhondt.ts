import { PID } from "@/data/parties";
import { SEATS, THR } from "@/data/phases";
import type { PartyId, SeatMap } from "@/types/election";

const REGIONAL_SEATS = 5;

export function dhondt(votes: Partial<Record<PartyId, number>>, vv: number): SeatMap {
  const result: SeatMap = {} as SeatMap;
  PID.forEach((p) => (result[p] = 0));
  if (!vv) return result;
  const eligible = PID.filter((p) => (votes[p] || 0) / vv >= THR);
  if (!eligible.length) return result;
  const quotients: { p: PartyId; q: number; v: number }[] = [];
  eligible.forEach((p) => {
    const v = votes[p] || 0;
    for (let d = 1; d <= SEATS; d++) {
      quotients.push({ p, q: v / d, v });
    }
  });
  // Empate exacto de cociente → desempate por votos totales descendente.
  // La norma electoral requiere sorteo; esto es un desempate determinista.
  quotients.sort((a, b) => b.q - a.q || b.v - a.v);
  quotients.slice(0, SEATS).forEach(({ p }) => result[p]++);
  return result;
}

export function dhondt5(partyPct: Partial<Record<PartyId, number>>): SeatMap {
  const result: SeatMap = {} as SeatMap;
  PID.forEach((p) => (result[p] = 0));
  const eligible = PID.filter((p) => (partyPct[p] || 0) >= THR);
  if (!eligible.length) return result;
  const quotients: { p: PartyId; q: number; v: number }[] = [];
  eligible.forEach((p) => {
    const v = partyPct[p] || 0;
    for (let d = 1; d <= REGIONAL_SEATS; d++) {
      quotients.push({ p, q: v / d, v });
    }
  });
  quotients.sort((a, b) => b.q - a.q || b.v - a.v);
  quotients.slice(0, REGIONAL_SEATS).forEach(({ p }) => result[p]++);
  return result;
}
