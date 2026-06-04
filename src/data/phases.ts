import { PID } from "@/data/parties";
import { SORTED } from "@/data/districts";
import type { Phase, PhaseData, PartyVotes } from "@/types/election";

export const SEATS = 25;
export const THR = 0.03;
export const TMESAS = 24566;
export const MAJ = 13;

export const PHASES: Phase[] = [
  { n: "F1", d: 17 }, { n: "F2", d: 26 }, { n: "F3", d: 35 },
  { n: "F4", d: 44 }, { n: "F5", d: 48 }, { n: "F6", d: 57 },
  { n: "F7", d: 61 }, { n: "F8", d: 67 }, { n: "F9", d: 70 },
  { n: "F10", d: 75 }, { n: "F11", d: 78 }, { n: "F12", d: 82 },
  { n: "F13", d: 85 }, { n: "F14", d: 89 }, { n: "F15", d: 90 },
];

export function cumData(n: number): PhaseData {
  const ds = SORTED.slice(0, n);
  const mc = ds.reduce((s, d) => s + d.mesas, 0);
  const votes = {} as PartyVotes;
  PID.forEach((p) => {
    votes[p] = ds.reduce((s, d) => s + ((d[p] as number) || 0), 0);
  });
  return {
    mc,
    pct: ((mc / TMESAS) * 100).toFixed(2),
    tv: ds.reduce((s, d) => s + d.tv, 0),
    bl: ds.reduce((s, d) => s + d.bl, 0),
    nl: ds.reduce((s, d) => s + d.nl, 0),
    vv: ds.reduce((s, d) => s + d.vv, 0),
    votes,
    ds,
  };
}

export const CACHE: PhaseData[] = PHASES.map((ph) => cumData(ph.d));
