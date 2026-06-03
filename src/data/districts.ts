import { PID } from "@/data/parties";
import type { District, RegionId } from "@/types/election";

type RawRow = [string, string, string, number, number];

const RAW: RawRow[] = [
  ["E1-D00","DF Monteblanco","E1",4200000,5600],["E7-D01","San Jacinto","E7",421826,563],
  ["E3-D02","Nuevo Laredo","E3",394437,526],["E7-D03","Villa del Rey","E7",421828,563],
  ["E5-D04","Palomares","E5",394437,526],["E3-D05","San Marcos","E3",394437,526],
  ["E7-D06","Guadalupe","E7",30502,41],["E5-D07","Brazoria","E5",141414,189],
  ["E3-D08","Refugio","E3",191666,256],["E7-D09","San Benito","E7",30502,41],
  ["E7-D10","Hidalgo del Norte","E7",421828,563],["E3-D11","Miramar","E3",191666,256],
  ["E7-D12","Veracruz Chico","E7",30502,41],["E2-D13","Aguaverde","E2",14017,19],
  ["E2-D14","Costilla","E2",266531,356],["E3-D15","Río Salado","E3",289032,386],
  ["E7-D16","Montealto","E7",30502,41],["E7-D17","Progreso","E7",30502,41],
  ["E6-D18","Ciénega","E6",45818,62],["E5-D19","Trinchera","E5",141414,189],
  ["E5-D20","Llano Grande","E5",141414,189],["E3-D21","Peñasco","E3",191666,256],
  ["E6-D22","Mesquite","E6",45818,62],["E7-D23","Palmas del Sur","E7",30502,41],
  ["E7-D24","Buenavista","E7",30502,41],["E2-D25","Laguna del Toro","E2",14017,19],
  ["E2-D26","Soledad","E2",14017,19],["E2-D27","Piedra Blanca","E2",14017,19],
  ["E5-D28","Noria","E5",141414,189],["E3-D29","Sabinas","E3",289032,386],
  ["E3-D30","Eureka","E3",289032,386],["E3-D31","Puerto Barrales","E3",289032,386],
  ["E6-D32","Encinal","E6",45818,62],["E6-D33","Río Bravo D.","E6",45818,62],
  ["E5-D34","Cerralvo","E5",141414,189],["E5-D35","Mier","E5",141414,189],
  ["E5-D36","Camargo","E5",141414,189],["E5-D37","Cruillas","E5",141414,189],
  ["E5-D38","Jiménez del Valle","E5",141414,189],["E5-D39","Guerrero Chico","E5",492837,658],
  ["E7-D40","Las Ánimas","E7",30502,41],["E7-D41","San Lorenzo","E7",30502,41],
  ["E6-D42","Salinas del Norte","E6",45818,62],["E6-D43","Cuatro Ciénegas","E6",45818,62],
  ["E6-D44","Bustamante","E6",45818,62],["E6-D45","Córdoba","E6",693820,926],
  ["E6-D46","Monclova","E6",45818,62],["E6-D47","Magayanes","E6",693818,926],
  ["E6-D48","Lampazos","E6",45818,62],["E2-D49","Sabinal","E2",128248,171],
  ["E2-D50","Allende del Oeste","E2",128248,171],["E2-D51","Candela","E2",128248,171],
  ["E2-D52","Sierra Nueva","E2",128248,171],["E2-D53","Santa Clarita","E2",14017,19],
  ["E2-D54","Zaragoza","E2",14017,19],["E2-D55","Bajamar","E2",1854324,2473],
  ["E2-D56","Cabo Rojo","E2",14017,19],["E2-D57","San Emigdio","E2",14017,19],
  ["E2-D58","Rancho Nuevo","E2",14017,19],["E4-D59","Greensboro","E4",496260,662],
  ["E4-D60","Linares del Este","E4",189940,254],["E4-D61","Miravalles","E4",189940,254],
  ["E4-D62","Agualeguas","E4",189940,254],["E4-D63","San Fernando","E4",189940,254],
  ["E4-D64","Reynosa del Mar","E4",189940,254],["E4-D65","Braunfels","E4",189940,254],
  ["E4-D66","Punta Herrera","E4",171025,229],["E4-D67","Isla Dorada","E4",171025,229],
  ["E4-D68","Charlesville","E4",171025,229],["E4-D69","Jamestown","E4",171025,229],
  ["E8-D70","Bahía Concepción","E8",3036,5],["E8-D71","Punta Arenas N.","E8",3036,5],
  ["E8-D72","Corpus Christi","E8",3036,5],["E8-D73","Nueces","E8",3036,5],
  ["E8-D74","Robstown","E8",3036,5],["E8-D75","Benavides","E8",3036,5],
  ["E8-D76","Calallen","E8",3036,5],["E8-D77","San Patricio","E8",353835,472],
  ["E8-D78","Alice","E8",3036,5],["E8-D79","Falfurrias","E8",3036,5],
  ["E8-D80","Vallehermoso","E8",339592,453],["E8-D81","Zapata","E8",339592,453],
  ["E8-D82","Guerrero","E8",3036,5],["E8-D83","Mier Chico","E8",3036,5],
  ["E8-D84","Dolores","E8",3036,5],["E8-D85","Ocampo del Sur","E8",3036,5],
  ["E8-D86","Hidalgo Viejo","E8",3036,5],["E8-D87","Anáhuac","E8",3036,5],
  ["E8-D88","Cerralvo Sur","E8",3036,5],["E8-D89","Río Grande Sur","E8",3036,5],
];

type VoteProfile = Partial<Record<string, number>>;

const PR: Record<string, VoteProfile> = {
  E1:{PLP:.08,PC:.07,DC:.04,PM:.05,MD:.01,PL:.16,PAC:.01,PAN:.015,MORENA:.22,RC:.12,FPLN:.02,PBG:.005,EP:.20},
  E2:{PLP:.14,PC:.14,DC:.04,PM:.03,MD:.005,PL:.07,PAC:.01,PAN:.10,MORENA:.13,RC:.12,FPLN:.08,PBG:.005,EP:.13},
  E3:{PLP:.07,PC:.05,DC:.03,PM:.14,MD:.005,PL:.22,PAC:.01,PAN:.005,MORENA:.20,RC:.08,FPLN:.005,PBG:.005,EP:.18},
  E4:{PLP:.08,PC:.07,DC:.02,PM:.01,MD:.005,PL:.05,PAC:.01,PAN:.005,MORENA:.10,RC:.28,FPLN:.12,PBG:.00,EP:.25},
  E5:{PLP:.28,PC:.22,DC:.18,PM:.05,MD:.01,PL:.04,PAC:.02,PAN:.015,MORENA:.05,RC:.10,FPLN:.005,PBG:.00,EP:.03},
  E6:{PLP:.07,PC:.06,DC:.03,PM:.22,MD:.00,PL:.28,PAC:.01,PAN:.005,MORENA:.20,RC:.08,FPLN:.005,PBG:.00,EP:.04},
  E7:{PLP:.30,PC:.18,DC:.22,PM:.07,MD:.02,PL:.03,PAC:.01,PAN:.04,MORENA:.03,RC:.05,FPLN:.005,PBG:.005,EP:.01},
  E8:{PLP:.08,PC:.08,DC:.07,PM:.04,MD:.01,PL:.05,PAC:.03,PAN:.22,MORENA:.24,RC:.10,FPLN:.01,PBG:.02,EP:.05},
  D03:{PLP:.20,PC:.38,DC:.14,PM:.05,MD:.005,PL:.03,PAC:.02,PAN:.01,MORENA:.04,RC:.10,FPLN:.005,PBG:.00,EP:.02},
  PLPs:{PLP:.40,PC:.18,DC:.14,PM:.05,MD:.005,PL:.03,PAC:.02,PAN:.01,MORENA:.04,RC:.10,FPLN:.005,PBG:.00,EP:.02},
  D10:{PLP:.20,PC:.18,DC:.35,PM:.05,MD:.005,PL:.03,PAC:.02,PAN:.005,MORENA:.04,RC:.10,FPLN:.00,PBG:.00,EP:.02},
  MORs:{PLP:.05,PC:.04,DC:.01,PM:.18,MD:.00,PL:.22,PAC:.005,PAN:.00,MORENA:.38,RC:.08,FPLN:.005,PBG:.00,EP:.03},
  PCs:{PLP:.15,PC:.32,DC:.03,PM:.02,MD:.005,PL:.04,PAC:.005,PAN:.08,MORENA:.10,RC:.10,FPLN:.05,PBG:.00,EP:.10},
  D55:{PLP:.06,PC:.22,DC:.015,PM:.01,MD:.00,PL:.02,PAC:.005,PAN:.03,MORENA:.30,RC:.08,FPLN:.04,PBG:.00,EP:.22},
  DCPs:{PLP:.08,PC:.08,DC:.18,PM:.04,MD:.01,PL:.05,PAC:.15,PAN:.15,MORENA:.15,RC:.08,FPLN:.01,PBG:.02,EP:.00},
};

function gp(id: string, st: string): VoteProfile {
  if (id === "E7-D03") return PR.D03;
  if (id === "E5-D04" || id === "E5-D39") return PR.PLPs;
  if (id === "E7-D10") return PR.D10;
  if (id === "E6-D45" || id === "E6-D47") return PR.MORs;
  if (["E2-D49","E2-D50","E2-D51","E2-D52"].includes(id)) return PR.PCs;
  if (id === "E2-D55") return PR.D55;
  if (id === "E8-D82" || id === "E8-D83") return PR.DCPs;
  return PR[st] ?? {};
}

function getPart(m: number): number {
  if (m <= 5) return .57; if (m <= 19) return .62; if (m <= 41) return .65;
  if (m <= 62) return .68; if (m <= 171) return .71; if (m <= 189) return .72;
  if (m <= 229) return .73; if (m <= 256) return .74; if (m <= 356) return .75;
  if (m <= 386) return .76; if (m <= 472) return .78; if (m <= 526) return .79;
  if (m <= 563) return .80; if (m <= 658) return .81; if (m <= 926) return .82;
  if (m <= 2473) return .83; return .84;
}

export const DIST: District[] = RAW.map(([id, name, state, reg, mesas]) => {
  const prof = gp(id, state);
  const par = getPart(mesas);
  const tv = Math.round(reg * par);
  const bl = Math.round(tv * .022);
  const nl = Math.round(tv * .018);
  const vv = tv - bl - nl;
  const v: Record<string, number> = {};
  let sm = 0;
  PID.forEach((k) => { v[k] = Math.round(vv * (prof[k] || 0)); sm += v[k]; });
  const top = PID.reduce((a, b) => (v[a] > v[b] ? a : b));
  v[top] += vv - sm;
  return { id, name, state: state as RegionId, reg, mesas, par, tv, bl, nl, vv, ...v };
});

export const SORTED = [...DIST].sort(
  (a, b) => a.mesas - b.mesas || a.id.localeCompare(b.id)
);
