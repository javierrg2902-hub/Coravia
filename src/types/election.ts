export type PartyId =
  | "PLP" | "PC" | "DC" | "PM" | "MD" | "PL"
  | "PAC" | "PAN" | "MORENA" | "RC" | "FPLN" | "PBG" | "EP";

export type RegionId = "E1" | "E2" | "E3" | "E4" | "E5" | "E6" | "E7" | "E8";

export type PartyVotes = Record<PartyId, number>;
export type SeatMap = Record<PartyId, number>;

export interface District {
  id: string;
  name: string;
  state: RegionId;
  reg: number;
  mesas: number;
  par: number;
  tv: number;
  bl: number;
  nl: number;
  vv: number;
  [party: string]: string | number;
}

export interface PhaseData {
  mc: number;
  pct: string;
  tv: number;
  bl: number;
  nl: number;
  vv: number;
  votes: PartyVotes;
  ds: District[];
}

export interface PartyResult {
  p: PartyId;
  v: number;
  s: number;
  pct: number;
}

export interface PresCand {
  id: string;
  name: string;
  party: PartyId | null;
  color: string;
}

export type PresPhaseResult = Record<string, number>;

export interface GovCandidate {
  id: string;
  name: string;
  party: PartyId;
  color: string;
}

export interface RegionData {
  id: RegionId;
  name: string;
  padron: number;
  govCands: GovCandidate[];
  partyPct: Partial<Record<PartyId, number>>;
  govPct: Record<string, number>;
  seats: SeatMap;
}

export interface LiveResultsJson {
  metadata: {
    eleccion: string;
    fechaActualizacion: string;
    faseName: string;
    faseIdx: number;
    mesasContadas: number;
    mesasTotal: number;
    escrutinadoPct: string;
    modo: "simulado" | "en_vivo";
  };
  parlamentarias: {
    votosValidos: number;
    blancos: number;
    nulos: number;
    votos: Partial<Record<PartyId, number>>;
  };
  presidencial: Record<string, number>;
  regionales: Array<{
    regionId: RegionId;
    govPct: Record<string, number>;
    partyPct: Partial<Record<PartyId, number>>;
  }>;
}

export interface HistoricalElectionResult {
  year: number;
  label: string;
  votosPct: Partial<Record<PartyId, number>>;
  escanos: Partial<Record<PartyId, number>>;
  presidencial: {
    candidato: string;
    partido: PartyId;
    pct: number;
  };
  gobernadores: Array<{
    regionId: RegionId;
    ganador: string;
    partido: PartyId;
    pct: number;
  }>;
}

export interface HistoricalDataJson {
  elecciones: HistoricalElectionResult[];
}

export type CoalitionStance = "favor" | "abstention" | "contra" | "none";

export interface Phase {
  n: string;
  d: number;
}
