import type { PresCand, PresPhaseResult } from "@/types/election";

export const PRES_CANDS: PresCand[] = [
  { id: "vinyas",     name: "Rodrigo Vinyas",      party: "PLP",    color: "#03427b" },
  { id: "calleja",    name: "María Calleja",        party: "MORENA", color: "#7a0000" },
  { id: "monterroso", name: "Carlos Monterroso",    party: "PC",     color: "#0053b4" },
  { id: "cano",       name: "Ricardo Cano",         party: "PL",     color: "#ffc90d" },
  { id: "santos",     name: "Héctor Santos",        party: "RC",     color: "#00abff" },
  { id: "alcantara",  name: "Beatriz Alcántara",    party: "DC",     color: "#377fcb" },
  { id: "salinas",    name: "Arturo Salinas",       party: "PM",     color: "#4f25b6" },
  { id: "herreraD",   name: "Daniela Herrera",      party: "EP",     color: "#e32642" },
  { id: "ibanez",     name: "Roberto Ibáñez",       party: "PAN",    color: "#06338e" },
  { id: "nieto",      name: "Claudia Nieto",        party: "FPLN",   color: "#b11f17" },
  { id: "restrepo",   name: "Yolanda Restrepo",     party: "PAC",    color: "#c40000" },
  { id: "ramos",      name: "Alejandro Ramos",      party: null,     color: "#6b7280" },
  { id: "vargasM",    name: "Fernando Vargas",      party: "MD",     color: "#f8b42f" },
  { id: "peralta",    name: "Manuel Peralta",       party: "PBG",    color: "#888888" },
  { id: "blank",      name: "En blanco",            party: null,     color: "#AAAAAA" },
  { id: "null",       name: "Nulos",                party: null,     color: "#777777" },
];

// Each phase must sum to exactly 1.00
// Story: early phases favor Vinyas (PLP strongholds), late phases MORENA districts catch up → balotaje
export const PRES_BY_PHASE: PresPhaseResult[] = [
  // F1
  { vinyas:.24, calleja:.17, monterroso:.10, cano:.08, santos:.08, alcantara:.07, salinas:.05, herreraD:.05, ibanez:.04, nieto:.03, restrepo:.02, ramos:.02, vargasM:.01, peralta:.01, blank:.02, null:.01 },
  // F2
  { vinyas:.23, calleja:.18, monterroso:.10, cano:.08, santos:.08, alcantara:.07, salinas:.05, herreraD:.05, ibanez:.04, nieto:.03, restrepo:.02, ramos:.02, vargasM:.01, peralta:.01, blank:.02, null:.01 },
  // F3
  { vinyas:.23, calleja:.18, monterroso:.09, cano:.08, santos:.08, alcantara:.07, salinas:.05, herreraD:.05, ibanez:.04, nieto:.03, restrepo:.02, ramos:.02, vargasM:.01, peralta:.01, blank:.02, null:.01 },
  // F4
  { vinyas:.22, calleja:.19, monterroso:.09, cano:.08, santos:.08, alcantara:.07, salinas:.05, herreraD:.05, ibanez:.04, nieto:.03, restrepo:.02, ramos:.02, vargasM:.01, peralta:.01, blank:.02, null:.01 },
  // F5
  { vinyas:.22, calleja:.19, monterroso:.09, cano:.08, santos:.08, alcantara:.07, salinas:.05, herreraD:.05, ibanez:.04, nieto:.03, restrepo:.02, ramos:.02, vargasM:.01, peralta:.01, blank:.02, null:.01 },
  // F6
  { vinyas:.22, calleja:.20, monterroso:.09, cano:.08, santos:.08, alcantara:.07, salinas:.05, herreraD:.05, ibanez:.03, nieto:.03, restrepo:.02, ramos:.02, vargasM:.01, peralta:.01, blank:.02, null:.01 },
  // F7
  { vinyas:.21, calleja:.20, monterroso:.09, cano:.08, santos:.08, alcantara:.07, salinas:.05, herreraD:.05, ibanez:.04, nieto:.03, restrepo:.02, ramos:.02, vargasM:.01, peralta:.01, blank:.02, null:.01 },
  // F8
  { vinyas:.21, calleja:.20, monterroso:.09, cano:.08, santos:.08, alcantara:.07, salinas:.05, herreraD:.05, ibanez:.04, nieto:.03, restrepo:.02, ramos:.02, vargasM:.01, peralta:.01, blank:.02, null:.01 },
  // F9
  { vinyas:.21, calleja:.21, monterroso:.09, cano:.08, santos:.08, alcantara:.07, salinas:.05, herreraD:.04, ibanez:.04, nieto:.03, restrepo:.02, ramos:.02, vargasM:.01, peralta:.01, blank:.02, null:.01 },
  // F10
  { vinyas:.21, calleja:.21, monterroso:.09, cano:.08, santos:.08, alcantara:.07, salinas:.05, herreraD:.04, ibanez:.04, nieto:.03, restrepo:.02, ramos:.02, vargasM:.01, peralta:.01, blank:.02, null:.01 },
  // F11
  { vinyas:.21, calleja:.21, monterroso:.09, cano:.08, santos:.08, alcantara:.07, salinas:.05, herreraD:.04, ibanez:.03, nieto:.03, restrepo:.02, ramos:.02, vargasM:.01, peralta:.01, blank:.02, null:.01 },
  // F12
  { vinyas:.21, calleja:.21, monterroso:.09, cano:.08, santos:.08, alcantara:.07, salinas:.05, herreraD:.04, ibanez:.04, nieto:.03, restrepo:.02, ramos:.02, vargasM:.01, peralta:.01, blank:.02, null:.01 },
  // F13
  { vinyas:.21, calleja:.21, monterroso:.09, cano:.08, santos:.08, alcantara:.07, salinas:.05, herreraD:.04, ibanez:.04, nieto:.03, restrepo:.02, ramos:.02, vargasM:.01, peralta:.01, blank:.02, null:.01 },
  // F14
  { vinyas:.21, calleja:.21, monterroso:.09, cano:.08, santos:.08, alcantara:.07, salinas:.05, herreraD:.04, ibanez:.04, nieto:.03, restrepo:.02, ramos:.02, vargasM:.01, peralta:.01, blank:.02, null:.01 },
  // F15
  { vinyas:.21, calleja:.21, monterroso:.09, cano:.08, santos:.08, alcantara:.07, salinas:.05, herreraD:.04, ibanez:.04, nieto:.03, restrepo:.02, ramos:.02, vargasM:.01, peralta:.01, blank:.02, null:.01 },
];

export const PRES_TOTAL_PADRON = 608869;
export const PRES_PARTICIPACION = 0.70;
