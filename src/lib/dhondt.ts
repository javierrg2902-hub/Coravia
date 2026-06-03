import { PID } from "@/data/parties";
import type { PartyId, SeatMap } from "@/types/election";

const SEATS = 25;
const THR = 0.03;

export function dhondt(votes: Partial<Record<PartyId, number>>, vv: number): SeatMap {
  const result: SeatMap = {} as SeatMap;
  PID.forEach((p) => (result[p] = 0));
  if (!vv) return result;
  const eligible = PID.filter((p) => (votes[p] || 0) / vv >= THR);
  if (!eligible.length) return result;
  const quotients: { p: PartyId; q: number }[] = [];
  eligible.forEach((p) => {
    for (let d = 1; d <= SEATS; d++) {
      quotients.push({ p, q: (votes[p] || 0) / d });
    }
  });
  quotients.sort((a, b) => b.q - a.q);
  quotients.slice(0, SEATS).forEach(({ p }) => result[p]++);
  return result;
}

export function dhondt5(partyPct: Partial<Record<PartyId, number>>): SeatMap {
  const result: SeatMap = {} as SeatMap;
  PID.forEach((p) => (result[p] = 0));
  const eligible = PID.filter((p) => (partyPct[p] || 0) >= THR);
  if (!eligible.length) return result;
  const quotients: { p: PartyId; q: number }[] = [];
  eligible.forEach((p) => {
    for (let d = 1; d <= 5; d++) {
      quotients.push({ p, q: (partyPct[p] || 0) / d });
    }
  });
  quotients.sort((a, b) => b.q - a.q);
  quotients.slice(0, 5).forEach(({ p }) => result[p]++);
  return result;
}
