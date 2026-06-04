import { DIST } from "@/data/districts";
import { REGION_DATA } from "@/data/regional";
import { PRES_TOTAL_PADRON, PRES_PARTICIPACION } from "@/data/presidential";
import { PID } from "@/data/parties";
import type { RegionId } from "@/types/election";

export const PRES_CAND_IDS = [
  "vinyas", "calleja", "monterroso", "cano", "santos", "alcantara",
  "salinas", "herreraD", "ibanez", "nieto", "restrepo", "ramos",
  "vargasM", "peralta", "blank", "null",
] as const;
export type PresCandId = typeof PRES_CAND_IDS[number];

// Presidential percentages per region (final result)
export const PRES_BY_REGION: Record<RegionId, Record<PresCandId, number>> = {
  E1: { vinyas:.18, calleja:.20, monterroso:.10, cano:.09, santos:.08, alcantara:.06, salinas:.06, herreraD:.07, ibanez:.04, nieto:.03, restrepo:.02, ramos:.02, vargasM:.01, peralta:.01, blank:.02, null:.01 },
  E2: { vinyas:.22, calleja:.18, monterroso:.11, cano:.08, santos:.08, alcantara:.07, salinas:.05, herreraD:.04, ibanez:.05, nieto:.03, restrepo:.02, ramos:.02, vargasM:.01, peralta:.01, blank:.02, null:.01 },
  E3: { vinyas:.19, calleja:.21, monterroso:.08, cano:.10, santos:.07, alcantara:.06, salinas:.06, herreraD:.08, ibanez:.04, nieto:.03, restrepo:.02, ramos:.02, vargasM:.01, peralta:.01, blank:.02, null:.01 },
  E4: { vinyas:.17, calleja:.18, monterroso:.09, cano:.07, santos:.12, alcantara:.07, salinas:.05, herreraD:.07, ibanez:.05, nieto:.04, restrepo:.03, ramos:.02, vargasM:.01, peralta:.01, blank:.02, null:.01 },
  E5: { vinyas:.28, calleja:.15, monterroso:.13, cano:.07, santos:.07, alcantara:.10, salinas:.04, herreraD:.03, ibanez:.04, nieto:.02, restrepo:.02, ramos:.02, vargasM:.01, peralta:.01, blank:.02, null:.01 },
  E6: { vinyas:.18, calleja:.22, monterroso:.08, cano:.10, santos:.07, alcantara:.06, salinas:.08, herreraD:.06, ibanez:.04, nieto:.03, restrepo:.02, ramos:.02, vargasM:.01, peralta:.01, blank:.02, null:.01 },
  E7: { vinyas:.27, calleja:.15, monterroso:.12, cano:.07, santos:.08, alcantara:.10, salinas:.05, herreraD:.03, ibanez:.04, nieto:.02, restrepo:.02, ramos:.02, vargasM:.01, peralta:.01, blank:.02, null:.01 },
  E8: { vinyas:.18, calleja:.22, monterroso:.09, cano:.07, santos:.08, alcantara:.06, salinas:.05, herreraD:.05, ibanez:.08, nieto:.03, restrepo:.03, ramos:.02, vargasM:.01, peralta:.01, blank:.02, null:.01 },
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
  PLP:    { vinyas:.85, calleja:.00, monterroso:.06, cano:.02, santos:.00, alcantara:.03, salinas:.00, herreraD:.00, ibanez:.00, nieto:.00, restrepo:.00, ramos:.01, vargasM:.00, peralta:.00, blank:.02, null:.01 },
  PC:     { vinyas:.06, calleja:.00, monterroso:.80, cano:.02, santos:.00, alcantara:.06, salinas:.00, herreraD:.00, ibanez:.00, nieto:.00, restrepo:.00, ramos:.01, vargasM:.00, peralta:.00, blank:.03, null:.02 },
  DC:     { vinyas:.05, calleja:.00, monterroso:.08, cano:.03, santos:.00, alcantara:.75, salinas:.00, herreraD:.00, ibanez:.00, nieto:.00, restrepo:.00, ramos:.02, vargasM:.00, peralta:.00, blank:.05, null:.02 },
  PM:     { vinyas:.00, calleja:.08, monterroso:.00, cano:.00, santos:.00, alcantara:.00, salinas:.72, herreraD:.05, ibanez:.00, nieto:.00, restrepo:.04, ramos:.02, vargasM:.00, peralta:.00, blank:.06, null:.03 },
  MD:     { vinyas:.00, calleja:.08, monterroso:.00, cano:.00, santos:.00, alcantara:.00, salinas:.10, herreraD:.00, ibanez:.00, nieto:.00, restrepo:.06, ramos:.02, vargasM:.65, peralta:.00, blank:.06, null:.03 },
  PL:     { vinyas:.00, calleja:.06, monterroso:.00, cano:.72, santos:.00, alcantara:.00, salinas:.04, herreraD:.08, ibanez:.00, nieto:.00, restrepo:.00, ramos:.02, vargasM:.00, peralta:.00, blank:.05, null:.03 },
  PAC:    { vinyas:.00, calleja:.10, monterroso:.00, cano:.00, santos:.00, alcantara:.00, salinas:.00, herreraD:.05, ibanez:.06, nieto:.00, restrepo:.68, ramos:.02, vargasM:.00, peralta:.00, blank:.06, null:.03 },
  PAN:    { vinyas:.00, calleja:.10, monterroso:.00, cano:.00, santos:.00, alcantara:.00, salinas:.00, herreraD:.00, ibanez:.70, nieto:.00, restrepo:.05, ramos:.01, vargasM:.00, peralta:.04, blank:.07, null:.03 },
  MORENA: { vinyas:.00, calleja:.82, monterroso:.00, cano:.00, santos:.00, alcantara:.00, salinas:.00, herreraD:.03, ibanez:.03, nieto:.00, restrepo:.05, ramos:.01, vargasM:.00, peralta:.00, blank:.04, null:.02 },
  RC:     { vinyas:.00, calleja:.05, monterroso:.03, cano:.00, santos:.76, alcantara:.00, salinas:.00, herreraD:.00, ibanez:.00, nieto:.08, restrepo:.00, ramos:.01, vargasM:.00, peralta:.00, blank:.05, null:.02 },
  FPLN:   { vinyas:.00, calleja:.06, monterroso:.00, cano:.00, santos:.12, alcantara:.00, salinas:.00, herreraD:.04, ibanez:.00, nieto:.70, restrepo:.00, ramos:.01, vargasM:.00, peralta:.00, blank:.05, null:.02 },
  PBG:    { vinyas:.00, calleja:.08, monterroso:.00, cano:.00, santos:.00, alcantara:.00, salinas:.00, herreraD:.00, ibanez:.10, nieto:.00, restrepo:.00, ramos:.02, vargasM:.06, peralta:.62, blank:.08, null:.04 },
  EP:     { vinyas:.00, calleja:.10, monterroso:.00, cano:.06, santos:.00, alcantara:.00, salinas:.00, herreraD:.72, ibanez:.00, nieto:.00, restrepo:.04, ramos:.01, vargasM:.00, peralta:.00, blank:.05, null:.02 },
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
    const acc: Record<string, number> = {};
    for (const cid of PRES_CAND_IDS) { acc[cid] = 0; }
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
