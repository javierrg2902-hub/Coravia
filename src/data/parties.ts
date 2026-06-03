import type { PartyId, RegionId } from "@/types/election";

export const PID: PartyId[] = [
  "PLP", "PC", "DC", "PM", "MD", "PL",
  "PAC", "PAN", "MORENA", "RC", "FPLN", "PBG", "EP",
];

export const CLR: Record<PartyId, string> = {
  PLP: "#03427b", PC: "#0053b4", DC: "#377fcb", PM: "#4f25b6",
  MD: "#f8b42f", PL: "#ffc90d", PAC: "#c40000", PAN: "#06338e",
  MORENA: "#7a0000", RC: "#00abff", FPLN: "#b11f17", PBG: "#888888", EP: "#e32642",
};

export const NOM: Record<PartyId, string> = {
  PLP: "Partido por la Libertad y Progreso",
  PC: "Partido Constitucionalista",
  DC: "Democracia Cristiana",
  PM: "Partido Moderado",
  MD: "Movimiento Despertar",
  PL: "Partido Liberal",
  PAC: "Aprista Coraveño",
  PAN: "Acción Nacional",
  MORENA: "Regeneración Nacional",
  RC: "Revolución Ciudadana",
  FPLN: "Frente Popular",
  PBG: "Buen Gobierno",
  EP: "Espacio Popular",
};

export const NOM_FULL: Record<PartyId, string> = {
  PLP: "Partido por la Libertad y Progreso",
  PC: "Partido Constitucionalista",
  DC: "Democracia Cristiana",
  PM: "Partido Moderado",
  MD: "Movimiento Despertar",
  PL: "Partido Liberal",
  PAC: "Partido Aprista Coraveño",
  PAN: "Partido Acción Nacional",
  MORENA: "Movimiento de Regeneración Nacional",
  RC: "Revolución Ciudadana",
  FPLN: "Frente Popular de Liberación Nacional",
  PBG: "Partido del Buen Gobierno",
  EP: "Espacio Popular",
};

export const SPECTR: Record<PartyId, number> = {
  FPLN: 5, RC: 15, MORENA: 20, PAC: 25, EP: 30, PL: 40,
  PM: 50, PBG: 52, DC: 60, PLP: 65, MD: 72, PC: 80, PAN: 85,
};

export const STATES: Record<RegionId, string> = {
  E1: "DF Monteblanco",
  E2: "Florente",
  E3: "Litoral",
  E4: "Palmdale",
  E5: "Sta. Catalina",
  E6: "Castellón",
  E7: "Alcalá",
  E8: "Río Bravo",
};

export function specLabel(s: number): string {
  if (s <= 20) return "Izquierda";
  if (s <= 40) return "Centro-izquierda";
  if (s <= 60) return "Centro";
  if (s <= 75) return "Centro-derecha";
  return "Derecha";
}
