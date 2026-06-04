import type { PresCand, PresPhaseResult } from "@/types/election";

export const PRES_CANDS: PresCand[] = [
  { id: "vinyas",  name: "Rodrigo Vinyas",  party: "PLP",    color: "#03427b" },
  { id: "calleja", name: "María Calleja",   party: "MORENA", color: "#7a0000" },
  { id: "santos",  name: "Héctor Santos",   party: "RC",     color: "#00abff" },
  { id: "blank",   name: "En blanco",       party: null,     color: "#AAAAAA" },
  { id: "null",    name: "Nulos",           party: null,     color: "#777777" },
];

export const PRES_BY_PHASE: PresPhaseResult[] = [
  { vinyas: .52, calleja: .29, santos: .11, blank: .06, null: .02 },
  { vinyas: .51, calleja: .30, santos: .11, blank: .06, null: .02 },
  { vinyas: .50, calleja: .31, santos: .11, blank: .06, null: .02 },
  { vinyas: .49, calleja: .31, santos: .12, blank: .06, null: .02 },
  { vinyas: .48, calleja: .32, santos: .12, blank: .06, null: .02 },
  { vinyas: .47, calleja: .33, santos: .12, blank: .06, null: .02 },
  { vinyas: .47, calleja: .33, santos: .12, blank: .06, null: .02 },
  { vinyas: .46, calleja: .34, santos: .12, blank: .06, null: .02 },
  { vinyas: .46, calleja: .34, santos: .12, blank: .06, null: .02 },
  { vinyas: .46, calleja: .34, santos: .12, blank: .06, null: .02 },
  { vinyas: .45, calleja: .35, santos: .12, blank: .06, null: .02 },
  { vinyas: .45, calleja: .35, santos: .12, blank: .06, null: .02 },
  { vinyas: .44, calleja: .35, santos: .13, blank: .06, null: .02 },
  { vinyas: .44, calleja: .35, santos: .13, blank: .06, null: .02 },
  { vinyas: .44, calleja: .35, santos: .13, blank: .06, null: .02 },
];

export const PRES_TOTAL_PADRON = 608869;
export const PRES_PARTICIPACION = 0.70;
