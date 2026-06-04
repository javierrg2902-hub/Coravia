import { DIST } from "@/data/districts";
import { REGION_DATA } from "@/data/regional";
import { PRES_TOTAL_PADRON, PRES_PARTICIPACION } from "@/data/presidential";
import { PID } from "@/data/parties";
import type { RegionId } from "@/types/election";

export const PRES_CAND_IDS = ["vinyas", "calleja", "santos", "blank", "null"] as const;
export type PresCandId = typeof PRES_CAND_IDS[number];

// Presidential percentages per region (final result)
export const PRES_BY_REGION: Record<RegionId, Record<PresCandId, number>> = {
  E1: { vinyas: .40, calleja: .38, santos: .14, blank: .06, null: .02 },
  E2: { vinyas: .44, calleja: .35, santos: .13, blank: .06, null: .02 },
  E3: { vinyas: .38, calleja: .36, santos: .15, blank: .08, null: .03 },
  E4: { vinyas: .35, calleja: .32, santos: .22, blank: .08, null: .03 },
  E5: { vinyas: .58, calleja: .24, santos: .10, blank: .06, null: .02 },
  E6: { vinyas: .37, calleja: .40, santos: .13, blank: .07, null: .03 },
  E7: { vinyas: .60, calleja: .22, santos: .11, blank: .05, null: .02 },
  E8: { vinyas: .36, calleja: .37, santos: .14, blank: .09, null: .04 },
};

const TOTAL_PADRON = REGION_DATA.reduce((s, r) => s + r.padron, 0);

export function getPresRegionVotes(regionId: RegionId): Record<PresCandId, number> {
  const region = REGION_DATA.find(r => r.id === regionId)!;
  const fraction = region.padron / TOTAL_PADRON;
  const regionTotal = PRES_TOTAL_PADRON * PRES_PARTICIPACION * fraction;
  const pct = PRES_BY_REGION[regionId];
  const votes = {} as Record<PresCandId, number>;
  for (const cand of PRES_CAND_IDS) {
    votes[cand] = Math.round(regionTotal * pct[cand]);
  }
  return votes;
}

// Party → presidential candidate affinity (how party voters split in presidential)
const AFFINITY: Record<string, Record<PresCandId, number>> = {
  PLP:    { vinyas: .88, calleja: .05, santos: .04, blank: .02, null: .01 },
  PC:     { vinyas: .65, calleja: .17, santos: .12, blank: .04, null: .02 },
  DC:     { vinyas: .55, calleja: .19, santos: .19, blank: .05, null: .02 },
  PM:     { vinyas: .28, calleja: .37, santos: .22, blank: .08, null: .05 },
  MD:     { vinyas: .22, calleja: .43, santos: .24, blank: .07, null: .04 },
  PL:     { vinyas: .30, calleja: .38, santos: .22, blank: .07, null: .03 },
  PAC:    { vinyas: .12, calleja: .52, santos: .26, blank: .07, null: .03 },
  PAN:    { vinyas: .15, calleja: .55, santos: .20, blank: .07, null: .03 },
  MORENA: { vinyas: .05, calleja: .79, santos: .10, blank: .04, null: .02 },
  RC:     { vinyas: .08, calleja: .18, santos: .62, blank: .08, null: .04 },
  FPLN:   { vinyas: .08, calleja: .22, santos: .55, blank: .10, null: .05 },
  PBG:    { vinyas: .15, calleja: .40, santos: .32, blank: .08, null: .05 },
  EP:     { vinyas: .07, calleja: .50, santos: .32, blank: .07, null: .04 },
};

export interface DistrictPresResult {
  distId: string;
  distName: string;
  regionId: RegionId;
  tv: number;
  vv: number;
  pct: Record<PresCandId, number>;
  votes: Record<PresCandId, number>;
}

let _cache: DistrictPresResult[] | null = null;

export function getPresDistrictResults(): DistrictPresResult[] {
  if (_cache) return _cache;
  _cache = DIST.map((dist) => {
    const acc: Record<string, number> = { vinyas: 0, calleja: 0, santos: 0, blank: 0, null: 0 };
    for (const pid of PID) {
      const partyVotes = (dist[pid] as number) || 0;
      if (partyVotes <= 0) continue;
      const aff = AFFINITY[pid];
      if (!aff) continue;
      for (const cand of PRES_CAND_IDS) {
        acc[cand] += partyVotes * aff[cand];
      }
    }
    const total = Object.values(acc).reduce((s, v) => s + v, 0) || 1;
    const pct = {} as Record<PresCandId, number>;
    const votes = {} as Record<PresCandId, number>;
    for (const cand of PRES_CAND_IDS) {
      pct[cand] = acc[cand] / total;
      votes[cand] = Math.round(acc[cand]);
    }
    return { distId: dist.id, distName: dist.name, regionId: dist.state, tv: dist.tv, vv: dist.vv, pct, votes };
  });
  return _cache;
}
