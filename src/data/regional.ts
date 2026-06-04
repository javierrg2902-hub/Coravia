import { dhondt5 } from "@/lib/dhondt";
import type { RegionData } from "@/types/election";

const REGION_LIST: Omit<RegionData, "seats">[] = [
  {
    id: "E1", name: "DF Monteblanco", padron: 4200000,
    govCands: [
      { id: "flores",  name: "Ana Flores",     party: "PL",     color: "#ffc90d" },
      { id: "ruiz",    name: "Pedro Ruiz",      party: "MORENA", color: "#7a0000" },
      { id: "vera",    name: "Carmen Vera",     party: "RC",     color: "#00abff" },
      { id: "mendoza", name: "Carlos Mendoza",  party: null,     partyName: "Independiente", color: "#6b7280" },
    ],
    partyPct: { PLP:.08, PC:.07, DC:.04, PM:.05, MD:.01, PL:.16, PAC:.01, PAN:.015, MORENA:.22, RC:.12, FPLN:.02, PBG:.005, EP:.20 },
    govPct: { flores: .39, ruiz: .36, vera: .14, mendoza: .05, blank: .04, null: .02 },
  },
  {
    id: "E2", name: "Florente", padron: 2760000,
    govCands: [
      { id: "morales",    name: "Luis Morales",       party: "PC",     color: "#0053b4" },
      { id: "garcia",     name: "Rosa García",        party: "MORENA", color: "#7a0000" },
      { id: "castellano", name: "Tomás Castellano",   party: "PAN",    color: "#06338e" },
    ],
    partyPct: { PLP:.14, PC:.14, DC:.04, PM:.03, MD:.005, PL:.07, PAC:.01, PAN:.10, MORENA:.13, RC:.12, FPLN:.08, PBG:.005, EP:.13 },
    govPct: { morales: .44, garcia: .40, castellano: .09, blank: .05, null: .02 },
  },
  {
    id: "E3", name: "Litoral", padron: 2520000,
    govCands: [
      { id: "torres", name: "Javier Torres", party: "PL",     color: "#ffc90d" },
      { id: "luna",   name: "Sofía Luna",    party: "EP",     color: "#e32642" },
      { id: "acosta", name: "Héctor Acosta", party: "MORENA", color: "#7a0000" },
    ],
    partyPct: { PLP:.07, PC:.05, DC:.03, PM:.14, MD:.005, PL:.22, PAC:.01, PAN:.005, MORENA:.20, RC:.08, FPLN:.005, PBG:.005, EP:.18 },
    govPct: { torres: .40, luna: .38, acosta: .12, blank: .07, null: .03 },
  },
  {
    id: "E4", name: "Palmdale", padron: 2320000,
    govCands: [
      { id: "reyes",   name: "Carlos Reyes",    party: "RC",     color: "#00abff" },
      { id: "silva",   name: "Isabel Silva",    party: "EP",     color: "#e32642" },
      { id: "mendez",  name: "Diego Méndez",    party: "PAN",    color: "#06338e" },
      { id: "aguirre", name: "Patricia Aguirre", party: null,    partyName: "Independiente", color: "#9ca3af" },
    ],
    partyPct: { PLP:.08, PC:.07, DC:.02, PM:.01, MD:.005, PL:.05, PAC:.01, PAN:.005, MORENA:.10, RC:.28, FPLN:.12, PBG:.00, EP:.25 },
    govPct: { reyes: .35, silva: .29, mendez: .20, aguirre: .10, blank: .04, null: .02 },
  },
  {
    id: "E5", name: "Sta. Catalina", padron: 2160000,
    govCands: [
      { id: "romero",  name: "Marta Romero",   party: "PLP",    color: "#03427b" },
      { id: "castro",  name: "Felipe Castro",  party: "PC",     color: "#0053b4" },
      { id: "delgado", name: "Jorge Delgado",  party: "DC",     color: "#377fcb" },
    ],
    partyPct: { PLP:.28, PC:.22, DC:.18, PM:.05, MD:.01, PL:.04, PAC:.02, PAN:.015, MORENA:.05, RC:.10, FPLN:.005, PBG:.00, EP:.03 },
    govPct: { romero: .43, castro: .38, delgado: .10, blank: .07, null: .02 },
  },
  {
    id: "E6", name: "Castellón", padron: 1800000,
    govCands: [
      { id: "navarro", name: "Roberto Navarro", party: "PM",     color: "#4f25b6" },
      { id: "rios",    name: "Laura Ríos",      party: "MORENA", color: "#7a0000" },
      { id: "guerrero",name: "Sergio Guerrero", party: "PL",     color: "#ffc90d" },
      { id: "vidal",   name: "Ana Vidal",       party: null,     partyName: "Independiente", color: "#9ca3af" },
    ],
    partyPct: { PLP:.07, PC:.06, DC:.03, PM:.22, MD:.00, PL:.28, PAC:.01, PAN:.005, MORENA:.20, RC:.08, FPLN:.005, PBG:.00, EP:.04 },
    govPct: { navarro: .38, rios: .42, guerrero: .09, vidal: .05, blank: .04, null: .02 },
  },
  {
    id: "E7", name: "Alcalá", padron: 1540000,
    govCands: [
      { id: "herrera", name: "Pablo Herrera",   party: "PLP",    color: "#03427b" },
      { id: "jimenez", name: "Elena Jiménez",   party: "DC",     color: "#377fcb" },
      { id: "espinoza",name: "Marco Espinoza",  party: "PC",     color: "#0053b4" },
    ],
    partyPct: { PLP:.32, PC:.18, DC:.23, PM:.07, MD:.02, PL:.03, PAC:.01, PAN:.04, MORENA:.03, RC:.05, FPLN:.005, PBG:.005, EP:.01 },
    govPct: { herrera: .46, jimenez: .33, espinoza: .14, blank: .05, null: .02 },
  },
  {
    id: "E8", name: "Río Bravo", padron: 1084631,
    govCands: [
      { id: "vargas", name: "Miguel Vargas",   party: "PAN",    color: "#06338e" },
      { id: "ortiz",  name: "Gloria Ortiz",    party: "MORENA", color: "#7a0000" },
      { id: "pena",   name: "Andrés Peña",     party: "DC",     color: "#377fcb" },
      { id: "ibarra", name: "Sofía Ibarra",    party: null,     partyName: "Independiente", color: "#9ca3af" },
    ],
    partyPct: { PLP:.08, PC:.08, DC:.07, PM:.04, MD:.01, PL:.05, PAC:.03, PAN:.22, MORENA:.24, RC:.10, FPLN:.01, PBG:.02, EP:.05 },
    govPct: { vargas: .35, ortiz: .32, pena: .17, ibarra: .08, blank: .06, null: .02 },
  },
];

export const REGION_DATA: RegionData[] = REGION_LIST.map((reg) => ({
  ...reg,
  seats: dhondt5(reg.partyPct),
}));
