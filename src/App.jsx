import { useState, useMemo, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts";

const PID = ["PLP","PC","DC","PM","MD","PL","PAC","PAN","MORENA","RC","FPLN","PBG","EP"];
const CLR = {PLP:"#03427b",PC:"#0053b4",DC:"#377fcb",PM:"#4f25b6",MD:"#f8b42f",PL:"#ffc90d",PAC:"#c40000",PAN:"#06338e",MORENA:"#7a0000",RC:"#00abff",FPLN:"#b11f17",PBG:"#888",EP:"#e32642"};
const NOM = {PLP:"Partido por la Libertad y Progreso",PC:"Partido Constitucionalista",DC:"Democracia Cristiana",PM:"Partido Moderado",MD:"Movimiento Despertar",PL:"Partido Liberal",PAC:"Aprista Coraveño",PAN:"Acción Nacional",MORENA:"Regeneración Nacional",RC:"Revolución Ciudadana",FPLN:"Frente Popular",PBG:"Buen Gobierno",EP:"Espacio Popular"};
const SPECTR = {FPLN:5,RC:15,MORENA:20,PAC:25,EP:30,PL:40,PM:50,PBG:52,DC:60,PLP:65,MD:72,PC:80,PAN:85};
const STATES = {E1:"DF Monteblanco",E2:"Florente",E3:"Litoral",E4:"Palmdale",E5:"Sta.Catalina",E6:"Castellón",E7:"Alcalá",E8:"Río Bravo"};
const SEATS = 25, THR = 0.03, TMESAS = 24566, MAJ = 13;

const PR = {
  E1:{PLP:.08,PC:.07,DC:.04,PM:.05,MD:.01,PL:.16,PAC:.01,PAN:.015,MORENA:.22,RC:.12,FPLN:.02,PBG:.005,EP:.20},
  E2:{PLP:.14,PC:.14,DC:.04,PM:.03,MD:.005,PL:.07,PAC:.01,PAN:.10,MORENA:.13,RC:.12,FPLN:.08,PBG:.005,EP:.13},
  E3:{PLP:.07,PC:.05,DC:.03,PM:.14,MD:.005,PL:.22,PAC:.01,PAN:.005,MORENA:.20,RC:.08,FPLN:.005,PBG:.005,EP:.18},
  E4:{PLP:.08,PC:.07,DC:.02,PM:.01,MD:.005,PL:.05,PAC:.01,PAN:.005,MORENA:.10,RC:.28,FPLN:.12,PBG:.00,EP:.25},
  E5:{PLP:.28,PC:.22,DC:.18,PM:.05,MD:.01,PL:.04,PAC:.02,PAN:.015,MORENA:.05,RC:.10,FPLN:.005,PBG:.00,EP:.03},
  E6:{PLP:.07,PC:.06,DC:.03,PM:.22,MD:.00,PL:.28,PAC:.01,PAN:.005,MORENA:.20,RC:.08,FPLN:.005,PBG:.00,EP:.04},
  E7:{PLP:.28,PC:.22,DC:.18,PM:.05,MD:.01,PL:.04,PAC:.02,PAN:.015,MORENA:.05,RC:.10,FPLN:.005,PBG:.00,EP:.03},
  E8:{PLP:.08,PC:.08,DC:.07,PM:.04,MD:.01,PL:.05,PAC:.03,PAN:.22,MORENA:.24,RC:.10,FPLN:.01,PBG:.02,EP:.05},
  D03:{PLP:.20,PC:.38,DC:.14,PM:.05,MD:.005,PL:.03,PAC:.02,PAN:.01,MORENA:.04,RC:.10,FPLN:.005,PBG:.00,EP:.02},
  PLPs:{PLP:.40,PC:.18,DC:.14,PM:.05,MD:.005,PL:.03,PAC:.02,PAN:.01,MORENA:.04,RC:.10,FPLN:.005,PBG:.00,EP:.02},
  D10:{PLP:.20,PC:.18,DC:.35,PM:.05,MD:.005,PL:.03,PAC:.02,PAN:.005,MORENA:.04,RC:.10,FPLN:.00,PBG:.00,EP:.02},
  MORs:{PLP:.05,PC:.04,DC:.01,PM:.18,MD:.00,PL:.22,PAC:.005,PAN:.00,MORENA:.38,RC:.08,FPLN:.005,PBG:.00,EP:.03},
  PCs:{PLP:.15,PC:.32,DC:.03,PM:.02,MD:.005,PL:.04,PAC:.005,PAN:.08,MORENA:.10,RC:.10,FPLN:.05,PBG:.00,EP:.10},
  D55:{PLP:.06,PC:.22,DC:.015,PM:.01,MD:.00,PL:.02,PAC:.005,PAN:.03,MORENA:.30,RC:.08,FPLN:.04,PBG:.00,EP:.22},
  DCPs:{PLP:.08,PC:.08,DC:.18,PM:.04,MD:.01,PL:.05,PAC:.15,PAN:.15,MORENA:.15,RC:.08,FPLN:.01,PBG:.02,EP:.00},
};

function gp(id, st) {
  if (id === "E7-D03") return PR.D03;
  if (id === "E5-D04" || id === "E5-D39") return PR.PLPs;
  if (id === "E7-D10") return PR.D10;
  if (id === "E6-D45" || id === "E6-D47") return PR.MORs;
  if (["E2-D49","E2-D50","E2-D51","E2-D52"].includes(id)) return PR.PCs;
  if (id === "E2-D55") return PR.D55;
  if (id === "E8-D82" || id === "E8-D83") return PR.DCPs;
  return PR[st];
}

function getPart(m) {
  if (m <= 5) return .57; if (m <= 19) return .62; if (m <= 41) return .65;
  if (m <= 62) return .68; if (m <= 171) return .71; if (m <= 189) return .72;
  if (m <= 229) return .73; if (m <= 256) return .74; if (m <= 356) return .75;
  if (m <= 386) return .76; if (m <= 472) return .78; if (m <= 526) return .79;
  if (m <= 563) return .80; if (m <= 658) return .81; if (m <= 926) return .82;
  if (m <= 2473) return .83; return .84;
}

const RAW = [
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

const DIST = RAW.map(([id, name, state, reg, mesas]) => {
  const prof = gp(id, state);
  const par  = getPart(mesas);
  const tv   = Math.round(reg * par);
  const bl   = Math.round(tv * .022);
  const nl   = Math.round(tv * .018);
  const vv   = tv - bl - nl;
  const v    = {};
  let sm = 0;
  PID.forEach(k => { v[k] = Math.round(vv * (prof[k] || 0)); sm += v[k]; });
  const top = PID.reduce((a, b) => v[a] > v[b] ? a : b);
  v[top] += (vv - sm);
  return { id, name, state, reg, mesas, par, tv, bl, nl, vv, ...v };
});

const SORTED = [...DIST].sort((a, b) => a.mesas - b.mesas || a.id.localeCompare(b.id));

const PHASES = [
  {n:"F1",d:17},{n:"F2",d:26},{n:"F3",d:35},{n:"F4",d:44},{n:"F5",d:48},
  {n:"F6",d:57},{n:"F7",d:61},{n:"F8",d:67},{n:"F9",d:70},{n:"F10",d:75},
  {n:"F11",d:78},{n:"F12",d:82},{n:"F13",d:85},{n:"F14",d:89},{n:"F15",d:90},
];

function cumData(n) {
  const ds    = SORTED.slice(0, n);
  const mc    = ds.reduce((s, d) => s + d.mesas, 0);
  const votes = {};
  PID.forEach(p => { votes[p] = ds.reduce((s, d) => s + (d[p] || 0), 0); });
  return {
    mc, pct: ((mc / TMESAS) * 100).toFixed(2),
    tv:  ds.reduce((s, d) => s + d.tv, 0),
    bl:  ds.reduce((s, d) => s + d.bl, 0),
    nl:  ds.reduce((s, d) => s + d.nl, 0),
    vv:  ds.reduce((s, d) => s + d.vv, 0),
    votes, ds,
  };
}

function dhondt(votes, vv) {
  if (!vv) return {};
  const el = PID.filter(p => (votes[p] || 0) / vv >= THR);
  if (!el.length) return {};
  const qs = [];
  el.forEach(p => { for (let d = 1; d <= SEATS; d++) qs.push({ p, q: (votes[p] || 0) / d }); });
  qs.sort((a, b) => b.q - a.q);
  const r = {};
  PID.forEach(p => r[p] = 0);
  qs.slice(0, SEATS).forEach(({ p }) => r[p]++);
  return r;
}

function makeSeatOrder(seats) {
  return PID
    .filter(p => seats[p] > 0)
    .sort((a, b) => (SPECTR[a] || 50) - (SPECTR[b] || 50))
    .flatMap(p => Array(seats[p]).fill(p));
}

const CACHE = PHASES.map(ph => cumData(ph.d));

// ─── DATOS PRESIDENCIALES ────────────────────────────────
const PRES_CANDS = [
  { id:"vinyas",  name:"Rodrigo Vinyas",  party:"PLP",    color:"#03427b" },
  { id:"calleja", name:"María Calleja",   party:"MORENA", color:"#7a0000" },
  { id:"santos",  name:"Héctor Santos",   party:"RC",     color:"#00abff" },
  { id:"blank",   name:"En blanco",       party:null,     color:"#AAAAAA" },
  { id:"null",    name:"Nulos",           party:null,     color:"#777777" },
];

const PRES_BY_PHASE = [
  { vinyas:.52, calleja:.29, santos:.11, blank:.06, null:.02 },
  { vinyas:.51, calleja:.30, santos:.11, blank:.06, null:.02 },
  { vinyas:.50, calleja:.31, santos:.11, blank:.06, null:.02 },
  { vinyas:.49, calleja:.31, santos:.12, blank:.06, null:.02 },
  { vinyas:.48, calleja:.32, santos:.12, blank:.06, null:.02 },
  { vinyas:.47, calleja:.33, santos:.12, blank:.06, null:.02 },
  { vinyas:.47, calleja:.33, santos:.12, blank:.06, null:.02 },
  { vinyas:.46, calleja:.34, santos:.12, blank:.06, null:.02 },
  { vinyas:.46, calleja:.34, santos:.12, blank:.06, null:.02 },
  { vinyas:.46, calleja:.34, santos:.12, blank:.06, null:.02 },
  { vinyas:.45, calleja:.35, santos:.12, blank:.06, null:.02 },
  { vinyas:.45, calleja:.35, santos:.12, blank:.06, null:.02 },
  { vinyas:.44, calleja:.35, santos:.13, blank:.06, null:.02 },
  { vinyas:.44, calleja:.35, santos:.13, blank:.06, null:.02 },
  { vinyas:.44, calleja:.35, santos:.13, blank:.06, null:.02 },
];

const PRES_TOTAL_PADRON    = 608869;
const PRES_PARTICIPACION   = 0.70;

// ─── DATOS REGIONALES ────────────────────────────────────
const REGION_LIST = [
  { id:"E1", name:"DF Monteblanco", padron:4200000,
    govCands:[
      {id:"flores",name:"Ana Flores",party:"PL",color:"#ffc90d"},
      {id:"ruiz",name:"Pedro Ruiz",party:"MORENA",color:"#7a0000"},
      {id:"vera",name:"Carmen Vera",party:"RC",color:"#00abff"},
    ],
    partyPct:{PLP:.08,PC:.07,DC:.04,PM:.05,MD:.01,PL:.16,PAC:.01,PAN:.015,MORENA:.22,RC:.12,FPLN:.02,PBG:.005,EP:.20},
    govPct:{flores:.41,ruiz:.38,vera:.14,blank:.05,null:.02},
  },
  { id:"E2", name:"Florente", padron:2881000,
    govCands:[
      {id:"morales",name:"Luis Morales",party:"PC",color:"#0053b4"},
      {id:"garcia",name:"Rosa García",party:"MORENA",color:"#7a0000"},
    ],
    partyPct:{PLP:.14,PC:.14,DC:.04,PM:.03,MD:.005,PL:.07,PAC:.01,PAN:.10,MORENA:.13,RC:.12,FPLN:.08,PBG:.005,EP:.13},
    govPct:{morales:.48,garcia:.42,blank:.07,null:.03},
  },
  { id:"E3", name:"Litoral", padron:2424000,
    govCands:[
      {id:"torres",name:"Javier Torres",party:"PL",color:"#ffc90d"},
      {id:"luna",name:"Sofía Luna",party:"EP",color:"#e32642"},
    ],
    partyPct:{PLP:.07,PC:.05,DC:.03,PM:.14,MD:.005,PL:.22,PAC:.01,PAN:.005,MORENA:.20,RC:.08,FPLN:.005,PBG:.005,EP:.18},
    govPct:{torres:.45,luna:.42,blank:.10,null:.03},
  },
  { id:"E4", name:"Palmdale", padron:1853000,
    govCands:[
      {id:"reyes",name:"Carlos Reyes",party:"RC",color:"#00abff"},
      {id:"silva",name:"Isabel Silva",party:"EP",color:"#e32642"},
      {id:"mendez",name:"Diego Méndez",party:"PAN",color:"#06338e"},
    ],
    partyPct:{PLP:.08,PC:.07,DC:.02,PM:.01,MD:.005,PL:.05,PAC:.01,PAN:.005,MORENA:.10,RC:.28,FPLN:.12,PBG:.00,EP:.25},
    govPct:{reyes:.38,silva:.32,mendez:.22,blank:.06,null:.02},
  },
  { id:"E5", name:"Sta. Catalina", padron:1967000,
    govCands:[
      {id:"romero",name:"Marta Romero",party:"PLP",color:"#03427b"},
      {id:"castro",name:"Felipe Castro",party:"PC",color:"#0053b4"},
    ],
    partyPct:{PLP:.28,PC:.22,DC:.18,PM:.05,MD:.01,PL:.04,PAC:.02,PAN:.015,MORENA:.05,RC:.10,FPLN:.005,PBG:.00,EP:.03},
    govPct:{romero:.46,castro:.42,blank:.09,null:.03},
  },
  { id:"E6", name:"Castellón", padron:1708000,
    govCands:[
      {id:"navarro",name:"Roberto Navarro",party:"PM",color:"#4f25b6"},
      {id:"rios",name:"Laura Ríos",party:"MORENA",color:"#7a0000"},
    ],
    partyPct:{PLP:.07,PC:.06,DC:.03,PM:.22,MD:.00,PL:.28,PAC:.01,PAN:.005,MORENA:.20,RC:.08,FPLN:.005,PBG:.00,EP:.04},
    govPct:{navarro:.43,rios:.47,blank:.07,null:.03},
  },
  { id:"E7", name:"Alcalá", padron:1587000,
    govCands:[
      {id:"herrera",name:"Pablo Herrera",party:"PLP",color:"#03427b"},
      {id:"jimenez",name:"Elena Jiménez",party:"DC",color:"#377fcb"},
    ],
    partyPct:{PLP:.28,PC:.22,DC:.18,PM:.05,MD:.01,PL:.04,PAC:.02,PAN:.015,MORENA:.05,RC:.10,FPLN:.005,PBG:.00,EP:.03},
    govPct:{herrera:.48,jimenez:.40,blank:.09,null:.03},
  },
  { id:"E8", name:"Río Bravo", padron:1389000,
    govCands:[
      {id:"vargas",name:"Miguel Vargas",party:"PAN",color:"#06338e"},
      {id:"ortiz",name:"Gloria Ortiz",party:"MORENA",color:"#7a0000"},
      {id:"pena",name:"Andrés Peña",party:"DC",color:"#377fcb"},
    ],
    partyPct:{PLP:.08,PC:.08,DC:.07,PM:.04,MD:.01,PL:.05,PAC:.03,PAN:.22,MORENA:.24,RC:.10,FPLN:.01,PBG:.02,EP:.05},
    govPct:{vargas:.38,ortiz:.35,pena:.18,blank:.07,null:.02},
  },
];

function dhondt5(partyPct) {
  const el = PID.filter(p => (partyPct[p] || 0) >= THR);
  if (!el.length) return {};
  const qs = [];
  el.forEach(p => { for (let d = 1; d <= 5; d++) qs.push({ p, q: (partyPct[p] || 0) / d }); });
  qs.sort((a, b) => b.q - a.q);
  const r = {}; PID.forEach(p => r[p] = 0);
  qs.slice(0, 5).forEach(({ p }) => r[p]++);
  return r;
}

const REGION_DATA = REGION_LIST.map(reg => ({
  ...reg, seats: dhondt5(reg.partyPct),
}));

// ─── HEMICICLO SVG ────────────────────────────────────────
const ARC_CX = 200, ARC_CY = 195;
const ARC_R = 112, ARC_THICK = 76;
const ARC_START = 176, ARC_END = 4, ARC_SPAN = ARC_START - ARC_END;

function arcPt(r, deg) {
  const rad = deg * Math.PI / 180;
  return [ARC_CX + r * Math.cos(rad), ARC_CY - r * Math.sin(rad)];
}

function annSeg(rMid, thick, dS, dE) {
  if (Math.abs(dS - dE) < 0.08) return "";
  const ro = rMid + thick / 2, ri = rMid - thick / 2;
  const [x1o, y1o] = arcPt(ro, dS), [x2o, y2o] = arcPt(ro, dE);
  const [x1i, y1i] = arcPt(ri, dS), [x2i, y2i] = arcPt(ri, dE);
  const la = Math.abs(dS - dE) > 180 ? 1 : 0;
  return `M ${x1o.toFixed(1)} ${y1o.toFixed(1)} A ${ro} ${ro} 0 ${la} 1 ${x2o.toFixed(1)} ${y2o.toFixed(1)} L ${x2i.toFixed(1)} ${y2i.toFixed(1)} A ${ri} ${ri} 0 ${la} 0 ${x1i.toFixed(1)} ${y1i.toFixed(1)} Z`;
}

// Bug fix #1: renombrado de HemicycleSVG → HemicyclePie para coincidir con su uso
function HemicyclePie({ data, totalSeats, majLine, centerMain, centerSub1, centerSub2, onSegmentHover, onSegmentClick, showMaj }) {
  const total = data.reduce((s, d) => s + (d.value || 0), 0) || 1;
  let cursor = 0;
  const segments = data.map(d => {
    const dS = ARC_START - (cursor / total) * ARC_SPAN;
    const dE = ARC_START - ((cursor + (d.value || 0)) / total) * ARC_SPAN;
    cursor += (d.value || 0);
    return { ...d, path: annSeg(ARC_R, ARC_THICK, dS, dE) };
  });

  const ts = totalSeats || total;
  const majSeats = majLine || Math.floor(ts / 2) + 1;
  const majDeg   = ARC_START - (majSeats / ts) * ARC_SPAN;
  const [mlx1, mly1] = arcPt(ARC_R - ARC_THICK / 2 - 6, majDeg);
  const [mlx2, mly2] = arcPt(ARC_R + ARC_THICK / 2 + 10, majDeg);

  const [bx1] = arcPt(ARC_R + ARC_THICK / 2, ARC_START);
  const [bx2] = arcPt(ARC_R + ARC_THICK / 2, ARC_END);

  return (
    <div style={{ width:"100%", maxWidth:520, margin:"0 auto" }}>
      <svg viewBox="0 0 400 210" style={{ width:"100%", overflow:"visible" }} aria-hidden="true">
        <path d={annSeg(ARC_R, ARC_THICK, ARC_START, ARC_END)} fill="#1e3a5f" />
        {segments.map((s, i) => s.path ? (
          <path key={i} d={s.path} fill={s.color}
            onMouseEnter={() => onSegmentHover && s.name !== "_" && onSegmentHover(s.name)}
            onMouseLeave={() => onSegmentHover && onSegmentHover(null)}
            onClick={() => onSegmentClick && s.name !== "_" && onSegmentClick(s.name)}
            style={{ cursor: onSegmentClick ? "pointer" : "default" }}
          />
        ) : null)}
        {(showMaj || majLine) && (
          <>
            <line x1={mlx1.toFixed(1)} y1={mly1.toFixed(1)} x2={mlx2.toFixed(1)} y2={mly2.toFixed(1)}
              stroke="#EAB308" strokeWidth="2.5" strokeDasharray="6 4" opacity=".9" />
            {/* Bug fix #2: mlx2 es un array, comparar mlx2[0] con ARC_CX */}
            <text x={mlx2[0] > ARC_CX ? mlx2[0] + 5 : mlx2[0] - 5}
              y={(mly2 - 6).toFixed(0)}
              fill="#EAB308" fontSize="9" fontWeight="800"
              textAnchor={mlx2[0] > ARC_CX ? "start" : "end"}>
              Mayoría abs.
            </text>
          </>
        )}
        <text x="200" y="163" textAnchor="middle" fill="#ffffff" fontSize="40" fontWeight="900">{centerMain}</text>
        {centerSub1 && <text x="200" y="178" textAnchor="middle" fill="#94a3b8" fontSize="10">{centerSub1}</text>}
        {centerSub2 && <text x="200" y="192" textAnchor="middle" fill="#64748b" fontSize="10">{centerSub2}</text>}
        <line x1={bx1.toFixed(1)} y1={ARC_CY} x2={bx2.toFixed(1)} y2={ARC_CY} stroke="#1e3a5f" strokeWidth="2" />
      </svg>
    </div>
  );
}

// ─── PHASE BAR ────────────────────────────────────────────
function PhaseBar({ phaseIdx, setPhaseIdx }) {
  return (
    <div style={{ display:"flex", overflowX:"auto", gap:1, paddingBottom:2 }} role="tablist" aria-label="Fase de escrutinio">
      {PHASES.map((ph, i) => (
        <button key={i} type="button" onClick={() => setPhaseIdx(i)}
          role="tab"
          aria-selected={phaseIdx === i}
          aria-label={`Fase ${ph.n}, ${CACHE[i].pct}% escrutado`}
          style={{
            padding:"5px 8px", background: phaseIdx === i ? "#0c1e3a" : "none", border:"none",
            borderBottom: phaseIdx === i ? "3px solid #2563EB" : "3px solid transparent",
            color: phaseIdx === i ? "#fff" : "#64748b", cursor:"pointer",
            fontWeight: phaseIdx === i ? 700 : 400, fontSize:11, whiteSpace:"nowrap",
          }}>
          {ph.n}
          <div style={{ fontSize:9, color: phaseIdx === i ? "#EAB308" : "#334155", textAlign:"center" }}>
            {CACHE[i].pct}%
          </div>
        </button>
      ))}
    </div>
  );
}

// ─── HEMICYCLE ────────────────────────────────────────────
function specLabel(p) {
  const s = SPECTR[p] || 50;
  if (s <= 20) return "Izquierda";
  if (s <= 38) return "Centro-izquierda";
  if (s <= 57) return "Centro";
  if (s <= 73) return "Centro-derecha";
  return "Derecha";
}

function Hemicycle({ seats, results, vv }) {
  const [hovered, setHovered]   = useState(null);
  const [selected, setSelected] = useState(null);
  const active = selected || hovered;

  const hemData = PID
    .filter(p => (seats[p] || 0) > 0)
    .sort((a, b) => (SPECTR[a] || 50) - (SPECTR[b] || 50))
    .map(p => ({
      name: p, value: seats[p] || 0,
      color: !active || p === active ? CLR[p] : CLR[p] + "28",
    }));

  const partyCards = PID.filter(p => (seats[p] || 0) > 0).sort((a, b) => (seats[b] || 0) - (seats[a] || 0));

  function handleClick(p) { setSelected(prev => prev === p ? null : p); }

  return (
    <div>
      <div style={{ textAlign:"center", marginBottom:6, minHeight:20 }}>
        {active ? (
          <span style={{ color:CLR[active], fontWeight:800, fontSize:13 }}>
            {active} — {NOM[active]}
          </span>
        ) : (
          <span style={{ color:"#EAB308", fontWeight:800, fontSize:13 }}>Mayoría absoluta</span>
        )}
      </div>

      <HemicyclePie
        data={hemData}
        totalSeats={SEATS}
        majLine={MAJ}
        showMaj
        centerMain={active ? (seats[active] || 0) : SEATS}
        centerSub1={active ? "escaños" : "Diputados/as"}
        centerSub2={active ? (results?.find(r => r.p === active)?.pct.toFixed(1) + "% del voto") : "a repartir"}
        onSegmentHover={setHovered}
        onSegmentClick={p => setSelected(prev => prev === p ? null : p)}
      />

      <div style={{ textAlign:"center", color:"#64748b", fontSize:12, marginTop:6, marginBottom:20 }}>
        Mayoría absoluta: <b style={{ color:"#e2e8f0" }}>{MAJ}</b>
        <span style={{ margin:"0 8px", color:"#334155" }}>·</span>
        Total escaños: <b style={{ color:"#e2e8f0" }}>{SEATS}</b>
        {selected && (
          <button type="button" onClick={() => setSelected(null)} aria-label="Limpiar selección de partido"
            style={{ marginLeft:12, padding:"2px 8px", background:"transparent", border:"1px solid #1e3a5f", color:"#475569", borderRadius:5, cursor:"pointer", fontSize:10 }}>
            × Limpiar selección
          </button>
        )}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:8 }}>
        {partyCards.map(p => {
          const res    = results?.find(r => r.p === p);
          const isSel  = selected === p;
          const isHov  = hovered === p;
          const isActv = isSel || isHov;
          const isDim  = active && !isActv;
          return (
            <div key={p} onClick={() => handleClick(p)}
              onMouseEnter={() => setHovered(p)} onMouseLeave={() => setHovered(null)}
              role="button" tabIndex={0}
              onKeyDown={e => e.key === "Enter" && handleClick(p)}
              aria-pressed={isSel}
              aria-label={`${NOM[p]}: ${seats[p]} escaños`}
              style={{
                background: isSel ? "#0f2040" : "#0c1e3a", borderRadius:10,
                padding: isSel ? "14px 10px 12px" : "14px 10px 10px", textAlign:"center",
                border: isSel ? "2px solid " + CLR[p] : "2px solid transparent",
                borderTop: "3px solid " + CLR[p],
                opacity: isDim ? 0.35 : 1, cursor:"pointer", position:"relative",
                transition:"opacity 0.15s, background 0.15s", userSelect:"none",
              }}>
              <div style={{
                width:40, height:40, borderRadius:8, background:CLR[p],
                display:"flex", alignItems:"center", justifyContent:"center",
                margin:"0 auto 8px", fontWeight:900, fontSize:11, color:"#fff",
                letterSpacing:"0.04em",
                boxShadow: isActv ? "0 0 14px " + CLR[p] + "99" : "none",
                transition:"box-shadow 0.15s",
              }}>{p}</div>
              <div style={{ fontSize:28, fontWeight:900, color:"#fff", lineHeight:1 }}>{seats[p]}</div>
              <div style={{ fontSize:9, color:"#64748b", marginTop:5, textTransform:"uppercase", letterSpacing:"0.06em", lineHeight:1.3 }}>{NOM[p]}</div>
              {isSel && res && (
                <div style={{ marginTop:10, borderTop:"1px solid " + CLR[p] + "55", paddingTop:8 }}>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:4, marginBottom:4 }}>
                    <div style={{ background:"#060f1e", borderRadius:6, padding:"5px 4px" }}>
                      <div style={{ color:"#475569", fontSize:8 }}>% VOTO</div>
                      <div style={{ color:"#EAB308", fontWeight:800, fontSize:14 }}>{res.pct.toFixed(1)}%</div>
                    </div>
                    <div style={{ background:"#060f1e", borderRadius:6, padding:"5px 4px" }}>
                      <div style={{ color:"#475569", fontSize:8 }}>VOTOS</div>
                      <div style={{ color:"#94a3b8", fontWeight:700, fontSize:10, lineHeight:1.5 }}>{res.v.toLocaleString("es-ES")}</div>
                    </div>
                  </div>
                  <div style={{ background:"#060f1e", borderRadius:6, padding:"5px 6px", display:"flex", justifyContent:"space-between" }}>
                    <span style={{ color:"#475569", fontSize:8 }}>ESPECTRO</span>
                    <span style={{ color:CLR[p], fontWeight:700, fontSize:9 }}>{specLabel(p)}</span>
                  </div>
                </div>
              )}
              {isHov && !isSel && res && (
                <div style={{
                  position:"absolute", bottom:"calc(100% + 8px)", left:"50%",
                  transform:"translateX(-50%)", background:"#060f1e",
                  border:"1px solid " + CLR[p] + "77", borderRadius:8, padding:"8px 12px",
                  zIndex:20, minWidth:140, pointerEvents:"none",
                  boxShadow:"0 6px 24px #0008", textAlign:"left",
                }}>
                  <div style={{ color:CLR[p], fontWeight:800, fontSize:10, marginBottom:6 }}>{NOM[p]}</div>
                  {[
                    ["% Voto", res.pct.toFixed(2) + "%", "#EAB308"],
                    ["Votos", res.v.toLocaleString("es-ES"), "#94a3b8"],
                    ["Escaños", seats[p], CLR[p]],
                    ["Espectro", specLabel(p), "#64748b"],
                  ].map(([l, v, c]) => (
                    <div key={l} style={{ display:"flex", justifyContent:"space-between", gap:10, fontSize:10, marginBottom:2 }}>
                      <span style={{ color:"#475569" }}>{l}</span>
                      <span style={{ color:c, fontWeight:700 }}>{v}</span>
                    </div>
                  ))}
                  <div style={{ marginTop:5, fontSize:8, color:"#334155", textAlign:"center" }}>Clic para fijar detalles</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── DISTRICT CARD ────────────────────────────────────────
function DistrictCard({ d, counted }) {
  const [open, setOpen] = useState(false);
  const [hovP, setHovP] = useState(null);
  const [selP, setSelP] = useState(null);

  const ranked   = PID.map(p => ({ p, v: d[p] || 0 })).sort((a, b) => b.v - a.v).filter(x => x.v > 0);
  const winner   = ranked[0];
  const winColor = winner ? CLR[winner.p] : "#1e3a5f";
  const chartData = ranked.slice(0, 8).map(x => ({ name: x.p, votos: x.v, color: CLR[x.p] }));
  const activeP  = selP || hovP;

  function handleCardClick() { if (counted) { setOpen(v => !v); setSelP(null); setHovP(null); } }
  function stopProp(e) { e.stopPropagation(); }
  function handleBadgeClick(e, p) { e.stopPropagation(); setSelP(prev => prev === p ? null : p); }

  return (
    <div onClick={handleCardClick} style={{
      background: open ? "#0f2040" : "#0c1e3a", borderRadius:8, padding:"8px 10px",
      borderLeft:"3px solid " + (counted ? winColor : "#1e3a5f"),
      opacity: counted ? 1 : .45, cursor: counted ? "pointer" : "default",
    }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:4 }}>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:5 }}>
            <span style={{ color:"#94a3b8", fontWeight:700, fontSize:11 }}>{d.id}</span>
            {counted && <span style={{ fontSize:9, background:"#22c55e22", color:"#22c55e", borderRadius:4, padding:"1px 4px" }}>✓</span>}
          </div>
          <div style={{ color: counted ? "#e2e8f0" : "#475569", fontSize:11, marginTop:1 }}>{d.name}</div>
        </div>
        <div style={{ textAlign:"right", flexShrink:0 }}>
          {counted && winner && <div style={{ color:CLR[winner.p], fontWeight:900, fontSize:12 }}>{winner.p}</div>}
          <div style={{ color:"#334155", fontSize:9 }}>{d.mesas}m</div>
        </div>
      </div>

      {open && counted && (
        <div style={{ marginTop:10 }} onClick={stopProp}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:4, marginBottom:8 }}>
            {[
              ["Registrados", d.reg.toLocaleString("es-ES"), "#64748b"],
              ["Participación", (d.par * 100).toFixed(1) + "%", "#94a3b8"],
              ["V. Válidos", d.vv.toLocaleString("es-ES"), "#22c55e"],
            ].map(([l, v, c]) => (
              <div key={l} style={{ background:"#060f1e", borderRadius:6, padding:"5px 6px", textAlign:"center" }}>
                <div style={{ color:"#475569", fontSize:9 }}>{l}</div>
                <div style={{ color:c, fontWeight:700, fontSize:11 }}>{v}</div>
              </div>
            ))}
          </div>
          {activeP && (
            <div style={{
              background:CLR[activeP] + "22", border:"1px solid " + CLR[activeP] + "66",
              borderRadius:6, padding:"5px 10px", marginBottom:6,
              display:"flex", justifyContent:"space-between", alignItems:"center",
            }}>
              <span style={{ color:CLR[activeP], fontWeight:800, fontSize:12 }}>{activeP}</span>
              <span style={{ color:"#e2e8f0", fontSize:11 }}>
                {d[activeP]?.toLocaleString("es-ES")} votos
                {" · "}
                <b style={{ color:"#EAB308" }}>
                  {d.vv ? ((d[activeP] / d.vv) * 100).toFixed(1) : 0}%
                </b>
              </span>
            </div>
          )}
          <ResponsiveContainer width="100%" height={130}>
            <BarChart data={chartData} margin={{ top:4, right:4, bottom:16, left:-24 }} onMouseLeave={() => setHovP(null)}>
              <XAxis dataKey="name" tick={{ fill:"#64748b", fontSize:9 }} angle={-45} textAnchor="end" />
              <YAxis tick={{ fill:"#64748b", fontSize:9 }} />
              <Tooltip contentStyle={{ background:"#0c1e3a", border:"1px solid #1e3a5f", borderRadius:6, color:"#e2e8f0", fontSize:11 }} cursor={{ fill:"#ffffff05" }} />
              <Bar dataKey="votos" radius={[3,3,0,0]} onMouseEnter={data => setHovP(data.name)}>
                {chartData.map((e, i) => (
                  <Cell key={i} fill={e.color} opacity={!activeP || e.name === activeP ? 1 : 0.15} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display:"flex", flexWrap:"wrap", gap:3, marginTop:4 }}>
            {ranked.map(({ p, v }) => {
              const pct    = d.vv ? ((v / d.vv) * 100).toFixed(1) : "0";
              const isActv = activeP === p;
              const isDim  = activeP && !isActv;
              return (
                <div key={p}
                  onMouseEnter={e => { e.stopPropagation(); setHovP(p); }}
                  onMouseLeave={e => { e.stopPropagation(); setHovP(null); }}
                  onClick={e => handleBadgeClick(e, p)}
                  style={{
                    background: isActv ? CLR[p] + "44" : CLR[p] + "18",
                    border:"1px solid " + CLR[p] + (isActv ? "cc" : "44"),
                    borderRadius:5, padding:"2px 6px", fontSize:10,
                    opacity: isDim ? 0.3 : 1, cursor:"pointer",
                    transition:"opacity 0.12s, background 0.12s",
                  }}>
                  <span style={{ color:CLR[p], fontWeight:700 }}>{p}</span>
                  <span style={{ color:"#94a3b8", marginLeft:3 }}>{pct}%</span>
                </div>
              );
            })}
          </div>
          {selP && (
            <button type="button" onClick={e => { e.stopPropagation(); setSelP(null); }}
              aria-label="Limpiar selección de partido"
              style={{ marginTop:5, padding:"2px 8px", background:"transparent", border:"1px solid #1e3a5f", color:"#475569", borderRadius:4, cursor:"pointer", fontSize:9 }}>
              × Limpiar
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── PACTÓMETRO ───────────────────────────────────────────
function Pactometro({ seats }) {
  const [pg, setPg]     = useState({});
  const [hovP, setHovP] = useState(null);
  const ws     = PID.filter(p => (seats[p] || 0) > 0).sort((a, b) => (seats[b] || 0) - (seats[a] || 0));
  const favor  = ws.filter(p => pg[p] === "f").reduce((s, p) => s + (seats[p] || 0), 0);
  const contra = ws.filter(p => pg[p] === "c").reduce((s, p) => s + (seats[p] || 0), 0);
  const abs    = ws.filter(p => pg[p] === "a").reduce((s, p) => s + (seats[p] || 0), 0);
  const unas   = SEATS - favor - contra - abs;
  const first  = favor >= MAJ;
  const second = !first && favor > contra && favor > 0;
  const hasAny = ws.some(p => pg[p]);

  function toggle(p, g) { setPg(prev => ({ ...prev, [p]: prev[p] === g ? undefined : g })); }
  function clear() { setPg({}); }

  const pactData = PID
    .filter(p => (seats[p] || 0) > 0)
    .sort((a, b) => (SPECTR[a] || 50) - (SPECTR[b] || 50))
    .map(p => {
      const baseColor = pg[p] === "f" ? "#22c55e" : pg[p] === "a" ? "#EAB308" : pg[p] === "c" ? "#ef4444" : "#2d4a6e";
      return { name: p, value: seats[p] || 0, color: hovP && p !== hovP ? baseColor + "28" : baseColor };
    });

  const resultColor = first ? "#22c55e" : second ? "#84cc16" : "#ef4444";
  const resultBg    = first ? "#052e16" : second ? "#1a2e05" : "#1a0808";
  const resultBdr   = first ? "#22c55e" : second ? "#84cc16" : "#ef4444";
  let resultLabel   = "RESULTADO DE VOTACIÓN";
  if (first) resultLabel = "1.ª VOTACIÓN — MAYORÍA ABSOLUTA";
  else if (second) resultLabel = "2.ª VOTACIÓN — MAYORÍA SIMPLE";
  let resultMain    = "Asigna votos para ver resultado";
  if (hasAny) resultMain = first ? "✓ APROBADO" : second ? "✓ APROBADO EN 2.ª VOTACIÓN" : "✗ RECHAZADO";
  let resultDetail  = "";
  if (first) resultDetail = favor + " votos a favor ≥ " + MAJ + " (mayoría absoluta)";
  else if (second) resultDetail = favor + " A favor > " + contra + " En contra · Pasa en 2.ª votación";
  else if (favor === contra && favor > 0) resultDetail = "Empate " + favor + "–" + contra + " · No pasa en 2.ª votación";
  else if (favor > 0) resultDetail = favor + " A favor ≤ " + contra + " En contra · Rechazado";
  const vote1ok = first, vote2ok = first || second;
  const tallyColors = [["#22c55e", favor], ["#EAB308", abs], ["#ef4444", contra], ["#1e3a5f", unas]];

  return (
    <div>
      <HemicyclePie
        data={pactData} totalSeats={SEATS} majLine={MAJ} showMaj
        centerMain={favor + "/" + MAJ}
        centerSub1={hovP ? hovP + " · " + (seats[hovP] || 0) + " esc." : "a favor"}
        centerSub2={hovP ? (pg[hovP] === "f" ? "✓ A FAVOR" : pg[hovP] === "a" ? "· ABSTENCIÓN" : pg[hovP] === "c" ? "✗ EN CONTRA" : "Sin asignar") : "mayoría absoluta"}
        onSegmentHover={setHovP}
      />

      <div style={{ display:"flex", flexWrap:"wrap", gap:8, justifyContent:"center", marginBottom:16, marginTop:4, fontSize:11 }}>
        {[["A FAVOR","#22c55e",favor],["ABSTENCIÓN","#EAB308",abs],["EN CONTRA","#ef4444",contra],["Sin asignar","#2d4a6e",unas]].map(([l, c, v]) => (
          <div key={l} style={{ display:"flex", alignItems:"center", gap:5 }}>
            <div style={{ width:10, height:10, borderRadius:3, background:c, flexShrink:0 }} />
            <span style={{ color:"#64748b" }}>{l}:</span>
            <span style={{ color:c, fontWeight:700 }}>{v}</span>
          </div>
        ))}
      </div>

      <p style={{ color:"#64748b", fontSize:12, margin:"0 0 14px" }}>
        El Gobierno aprueba con <b style={{ color:"#e2e8f0" }}>{MAJ}+ A FAVOR</b> (1.ª votación) o más <b style={{ color:"#22c55e" }}>A FAVOR</b> que <b style={{ color:"#ef4444" }}>EN CONTRA</b> (2.ª votación).
      </p>

      <div style={{ display:"flex", flexDirection:"column", gap:5, marginBottom:16 }}>
        {ws.map(p => {
          const g = pg[p];
          const btns = [["f","A FAVOR","#22c55e"],["a","ABSTENCIÓN","#EAB308"],["c","EN CONTRA","#ef4444"]];
          return (
            <div key={p}
              onMouseEnter={() => setHovP(p)} onMouseLeave={() => setHovP(null)}
              style={{
                display:"flex", alignItems:"center", gap:8, borderRadius:8, padding:"7px 10px", flexWrap:"wrap",
                background: hovP === p ? CLR[p] + "22" : "#0c1e3a",
                border:"1px solid " + (hovP === p ? CLR[p] + "66" : "transparent"),
                opacity: hovP && hovP !== p ? 0.4 : 1,
                transition:"opacity 0.15s, background 0.15s",
              }}>
              <div style={{ display:"flex", alignItems:"center", gap:6, flex:"1 1 120px" }}>
                <div style={{ width:9, height:9, borderRadius:"50%", background:CLR[p], flexShrink:0 }} />
                <span style={{ fontWeight:700, color:"#f1f5f9", fontSize:12 }}>{p}</span>
                <span style={{ color:"#334155", fontSize:10, flex:1 }}>{NOM[p]}</span>
                <span style={{ color:"#EAB308", fontWeight:700, fontSize:12 }}>{seats[p]}</span>
              </div>
              <div style={{ display:"flex", gap:3 }}>
                {btns.map(([code, label, color]) => (
                  <button key={code} type="button" onClick={() => toggle(p, code)}
                    aria-pressed={g === code}
                    aria-label={`${NOM[p]}: ${label}`}
                    style={{
                      padding:"4px 8px", borderRadius:6, cursor:"pointer", fontWeight:700, fontSize:10,
                      background: g === code ? color + "33" : "transparent",
                      border:"1.5px solid " + (g === code ? color : "#1e3a5f"),
                      color: g === code ? color : "#475569",
                    }}>{label}</button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ background:"#0c1e3a", borderRadius:8, overflow:"hidden", height:22, display:"flex", marginBottom:10 }}>
        {tallyColors.map(([c, n], i) =>
          n > 0 ? (
            <div key={i} style={{ width:((n / SEATS) * 100) + "%", background:c, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color: i === 3 ? "transparent" : "#000", opacity: i === 3 ? .3 : 1 }}>
              {n}
            </div>
          ) : null
        )}
      </div>

      {hasAny ? (
        <div style={{ background:resultBg, border:"2px solid " + resultBdr, borderRadius:12, padding:"18px 20px", textAlign:"center" }}>
          <div style={{ fontSize:10, color:"#64748b", fontWeight:700, letterSpacing:"0.1em", marginBottom:6 }}>{resultLabel}</div>
          <div style={{ fontSize:26, fontWeight:900, color:resultColor, marginBottom:6 }}>{resultMain}</div>
          {resultDetail && <div style={{ color:"#64748b", fontSize:12, marginBottom:14 }}>{resultDetail}</div>}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {[
              ["1.ª Votación", "Mayoría absoluta (≥" + MAJ + ")", vote1ok, favor + " de " + MAJ + " votos"],
              ["2.ª Votación", "Mayoría simple (A favor > En contra)", vote2ok, first ? "(Innecesaria)" : favor + " vs " + contra],
            ].map(([title, subtitle, ok, detail]) => (
              <div key={title} style={{ background:"#0a1628", borderRadius:8, padding:"10px 12px", border:"1px solid " + (ok ? "#22c55e33" : "#1e3a5f") }}>
                <div style={{ fontSize:10, color:"#64748b", fontWeight:700, marginBottom:2 }}>{title}</div>
                <div style={{ fontSize:11, color:"#475569", marginBottom:6 }}>{subtitle}</div>
                <div style={{ fontSize:14, fontWeight:700, color: ok ? "#22c55e" : "#ef4444" }}>{ok ? "✓ Pasa" : "✗ No pasa"}</div>
                <div style={{ fontSize:11, color:"#334155", marginTop:2 }}>{detail}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ background:"#0c1e3a", borderRadius:12, padding:24, textAlign:"center", color:"#334155", fontSize:13 }}>
          Asigna los votos de cada partido para calcular el resultado
        </div>
      )}
      {hasAny && (
        <button type="button" onClick={clear} aria-label="Limpiar todas las asignaciones"
          style={{ marginTop:10, padding:"5px 14px", background:"transparent", border:"1px solid #1e3a5f", color:"#475569", borderRadius:8, cursor:"pointer", fontSize:11 }}>
          Limpiar
        </button>
      )}
    </div>
  );
}

// ─── RESULTS GRID ─────────────────────────────────────────
function ResultsGrid({ results, vv, seats, highlight, setHighlight, selected, setSelected }) {
  const visible = results.filter(r => r.v > 0);
  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:6 }}>
      {visible.map(({ p, v, pct }) => {
        const ok    = vv && v / vv >= THR;
        const isHov = highlight === p, isSel = selected === p;
        const isActv = isHov || isSel;
        const isDim  = (highlight || selected) && !isActv;
        return (
          <div key={p}
            onMouseEnter={() => setHighlight(p)} onMouseLeave={() => setHighlight(null)}
            onClick={() => setSelected(prev => prev === p ? null : p)}
            role="button" tabIndex={0}
            onKeyDown={e => e.key === "Enter" && setSelected(prev => prev === p ? null : p)}
            aria-pressed={isSel}
            aria-label={`${NOM[p]}: ${pct.toFixed(1)}% del voto`}
            style={{
              background: isActv ? CLR[p] + "cc" : CLR[p] + "55",
              border:"1.5px solid " + CLR[p] + (isSel ? "ff" : "77"),
              borderRadius:8, padding:"8px 10px", cursor:"pointer",
              opacity: isDim ? 0.3 : 1, position:"relative",
              transition:"opacity 0.15s, background 0.15s",
            }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontWeight:900, color:"#fff", fontSize:12, letterSpacing:"0.04em" }}>{p}</span>
              <span style={{ fontWeight:800, color:"#fff", fontSize:12 }}>{pct.toFixed(1)}%</span>
            </div>
            {!ok && <div style={{ color:"rgba(255,255,255,0.45)", fontSize:8, marginTop:1 }}>✗ bajo umbral</div>}
            {isSel && (
              <div style={{ marginTop:7, borderTop:"1px solid rgba(255,255,255,0.2)", paddingTop:6 }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:4, marginBottom:4 }}>
                  {[["Votos", v.toLocaleString("es-ES")], ["Escaños", seats[p] || 0]].map(([l, val]) => (
                    <div key={l} style={{ background:"rgba(0,0,0,0.25)", borderRadius:5, padding:"4px 5px" }}>
                      <div style={{ color:"rgba(255,255,255,0.45)", fontSize:8 }}>{l}</div>
                      <div style={{ color:"#fff", fontWeight:700, fontSize:11 }}>{val}</div>
                    </div>
                  ))}
                </div>
                <div style={{ background:"rgba(0,0,0,0.25)", borderRadius:5, padding:"3px 6px", display:"flex", justifyContent:"space-between", fontSize:9 }}>
                  <span style={{ color:"rgba(255,255,255,0.45)" }}>Espectro</span>
                  <span style={{ color:"#fff", fontWeight:700 }}>{specLabel(p)}</span>
                </div>
              </div>
            )}
            {isHov && !isSel && (
              <div style={{
                position:"absolute", bottom:"calc(100% + 8px)", left:"50%", transform:"translateX(-50%)",
                background:"#060f1e", border:"1px solid " + CLR[p] + "99",
                borderRadius:8, padding:"9px 12px", zIndex:30, minWidth:155, pointerEvents:"none",
                boxShadow:"0 6px 24px #000b",
              }}>
                <div style={{ color:CLR[p], fontWeight:800, fontSize:10, marginBottom:5 }}>{NOM[p]}</div>
                {[
                  ["Votos", v.toLocaleString("es-ES"), "#94a3b8"],
                  ["% Voto", pct.toFixed(2) + "%", "#EAB308"],
                  ["Escaños", seats[p] || 0, CLR[p]],
                  ["Espectro", specLabel(p), "#64748b"],
                ].map(([l, val, c]) => (
                  <div key={l} style={{ display:"flex", justifyContent:"space-between", gap:10, fontSize:10, marginBottom:2 }}>
                    <span style={{ color:"#475569" }}>{l}</span>
                    <span style={{ color:c, fontWeight:700 }}>{val}</span>
                  </div>
                ))}
                <div style={{ marginTop:5, fontSize:8, color:"#334155", textAlign:"center" }}>Clic para fijar</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── RESULTS CHART ────────────────────────────────────────
function ResultsChart({ results, vv, seats, highlight, onHover }) {
  const [mode, setMode] = useState("pct");
  const data = results
    .filter(({ p, v }) => mode === "seats" ? (seats[p] || 0) > 0 : vv && v / vv >= THR / 2)
    .map(({ p, v, pct }) => ({
      name: p,
      value: mode === "pct" ? parseFloat(pct.toFixed(2)) : (seats[p] || 0),
      color: CLR[p],
      label: mode === "pct" ? pct.toFixed(1) + "%" : String(seats[p] || 0),
    }))
    .sort((a, b) => b.value - a.value);

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const p    = payload[0].payload.name;
    const item = results.find(r => r.p === p);
    return (
      <div style={{ background:"#0a1628", border:"1px solid #1e3a5f", borderRadius:8, padding:"10px 14px", fontSize:12 }}>
        <div style={{ color:CLR[p], fontWeight:900, marginBottom:4 }}>{p} — {NOM[p]}</div>
        <div style={{ color:"#94a3b8" }}>Votos: <b style={{ color:"#e2e8f0" }}>{item?.v.toLocaleString("es-ES")}</b></div>
        <div style={{ color:"#94a3b8" }}>% Voto: <b style={{ color:"#EAB308" }}>{item?.pct.toFixed(2)}%</b></div>
        <div style={{ color:"#94a3b8" }}>Escaños: <b style={{ color:CLR[p] }}>{seats[p] || 0}</b></div>
        <div style={{ color: vv && item?.v / vv >= THR ? "#22c55e" : "#ef4444", fontSize:10, marginTop:4 }}>
          {vv && item?.v / vv >= THR ? "✓ Supera umbral 3%" : "✗ Bajo umbral 3%"}
        </div>
      </div>
    );
  };

  const btnSt = active => ({
    padding:"4px 10px", borderRadius:6, cursor:"pointer", fontSize:10, fontWeight:700,
    background: active ? "#2563EB22" : "transparent",
    border:"1.5px solid " + (active ? "#2563EB" : "#1e3a5f"),
    color: active ? "#60a5fa" : "#475569",
  });

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12, flexWrap:"wrap", gap:6 }}>
        <span style={{ color:"#475569", fontSize:10, fontWeight:700, letterSpacing:"0.08em" }}>
          {mode === "pct" ? "% VOTO POR PARTIDO" : "ESCAÑOS POR PARTIDO"}
        </span>
        <div style={{ display:"flex", gap:4 }}>
          <button type="button" style={btnSt(mode === "pct")} onClick={() => setMode("pct")}>% Voto</button>
          <button type="button" style={btnSt(mode === "seats")} onClick={() => setMode("seats")}>Escaños</button>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={Math.max(200, data.length * 34)}>
        <BarChart data={data} layout="vertical" margin={{ top:0, right:52, bottom:0, left:8 }} barSize={20}
          onMouseLeave={() => onHover && onHover(null)}>
          <XAxis type="number" tick={{ fill:"#475569", fontSize:9 }}
            tickFormatter={v => mode === "pct" ? v + "%" : String(v)} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="name"
            tick={({ x, y, payload }) => (
              <g transform={`translate(${x},${y})`}>
                <circle cx={-12} cy={0} r={5} fill={CLR[payload.value] || "#888"}
                  opacity={!highlight || payload.value === highlight ? 1 : 0.25} />
                <text x={-22} y={0} dy={4} textAnchor="end"
                  fill={highlight && payload.value !== highlight ? "#334155" : "#94a3b8"}
                  fontSize={11} fontWeight={700}>{payload.value}</text>
              </g>
            )}
            width={52} axisLine={false} tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill:"#ffffff05" }} />
          <Bar dataKey="value" radius={[0,4,4,0]} onMouseEnter={data => onHover && onHover(data.name)}>
            {data.map((e, i) => (
              <Cell key={i} fill={e.color} opacity={!highlight || e.name === highlight ? 1 : 0.18} />
            ))}
            <LabelList dataKey="label" position="right" style={{ fill:"#94a3b8", fontSize:10, fontWeight:700 }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── PRESIDENCIAL TAB ─────────────────────────────────────
function PresidencialTab({ phaseIdx, setPhaseIdx }) {
  const phase     = PRES_BY_PHASE[phaseIdx];
  const totalVotos = Math.round(PRES_TOTAL_PADRON * PRES_PARTICIPACION);

  const candidates = PRES_CANDS.map(c => ({
    ...c,
    pct:   (phase[c.id] || 0) * 100,
    votos: Math.round(totalVotos * (phase[c.id] || 0)),
  })).sort((a, b) => b.pct - a.pct);

  const valid   = candidates.filter(c => c.id !== "blank" && c.id !== "null");
  const leader  = valid[0];

  const card  = { background:"#0a1628", border:"1px solid #1e3a5f", borderRadius:12, padding:14, marginBottom:14 };
  const secH  = { color:"#475569", fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:10, marginTop:0 };

  return (
    <div>
      <div style={card}>
        <p style={secH}>Fase de escrutinio</p>
        <PhaseBar phaseIdx={phaseIdx} setPhaseIdx={setPhaseIdx} />
      </div>

      {leader && (
        <div style={{ ...card, borderLeft:"4px solid " + leader.color }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 }}>
            <div>
              <div style={{ color:"#475569", fontSize:10, fontWeight:700, letterSpacing:"0.1em", marginBottom:2 }}>CANDIDATO/A LÍDER</div>
              <div style={{ display:"flex", alignItems:"baseline", gap:8 }}>
                <span style={{ color:leader.color, fontWeight:900, fontSize:20 }}>{leader.name}</span>
                <span style={{ color:"#94a3b8", fontSize:12 }}>{leader.party ? NOM[leader.party] : ""}</span>
              </div>
            </div>
            <div style={{ display:"flex", gap:14 }}>
              {[["Votos", leader.votos.toLocaleString("es-ES"), "#fff"],["% Voto", leader.pct.toFixed(1) + "%", "#EAB308"]].map(([l, v, c]) => (
                <div key={l} style={{ textAlign:"center" }}>
                  <div style={{ color:"#475569", fontSize:10 }}>{l}</div>
                  <div style={{ color:c, fontWeight:900, fontSize:16 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div style={card}>
        <p style={secH}>Candidatos — Presidencia de Coravia</p>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {candidates.map((c, idx) => (
            <div key={c.id} style={{ background:"#0c1e3a", borderRadius:8, padding:"10px 14px", borderLeft:"3px solid " + c.color }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                <div>
                  <span style={{ fontWeight:800, color:c.color, fontSize:13 }}>#{idx + 1} {c.name}</span>
                  {c.party && <span style={{ color:"#64748b", fontSize:11, marginLeft:8 }}>{c.party} · {NOM[c.party]}</span>}
                </div>
                <span style={{ fontWeight:900, color:"#fff", fontSize:16 }}>{c.pct.toFixed(1)}%</span>
              </div>
              <div style={{ background:"#060f1e", borderRadius:4, height:8, overflow:"hidden" }}>
                <div style={{ width: Math.min(c.pct / (candidates[0].pct || 1) * 100, 100) + "%", height:"100%", background:c.color, transition:"width .4s" }} />
              </div>
              <div style={{ color:"#475569", fontSize:10, marginTop:4 }}>{c.votos.toLocaleString("es-ES")} votos</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop:12, color:"#334155", fontSize:10, textAlign:"center" }}>
          Padrón: {PRES_TOTAL_PADRON.toLocaleString("es-ES")} · Participación: {(PRES_PARTICIPACION * 100).toFixed(0)}% · Datos simulados
        </div>
      </div>
    </div>
  );
}

// ─── REGIONAL TAB ─────────────────────────────────────────
function RegionalTab() {
  const [expanded, setExpanded] = useState(null);

  const card = { background:"#0a1628", border:"1px solid #1e3a5f", borderRadius:12, padding:14, marginBottom:14 };
  const secH = { color:"#475569", fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:10, marginTop:0 };

  return (
    <div>
      <div style={card}>
        <p style={secH}>Elecciones regionales · 8 Estados · Datos simulados</p>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {REGION_DATA.map(reg => {
            const govResults = reg.govCands.map(c => ({ ...c, pct: (reg.govPct[c.id] || 0) * 100 })).sort((a, b) => b.pct - a.pct);
            const govLeader  = govResults[0];
            const isOpen     = expanded === reg.id;
            const topParties = PID.filter(p => (reg.seats[p] || 0) > 0).sort((a, b) => (reg.seats[b] || 0) - (reg.seats[a] || 0));

            return (
              <div key={reg.id} style={{ background:"#0c1e3a", borderRadius:10, overflow:"hidden", border:"1px solid #1e3a5f" }}>
                {/* Header */}
                <button type="button"
                  onClick={() => setExpanded(prev => prev === reg.id ? null : reg.id)}
                  aria-expanded={isOpen}
                  aria-label={`${reg.name}: expandir resultados`}
                  style={{
                    width:"100%", background:"none", border:"none", cursor:"pointer",
                    padding:"10px 14px", display:"flex", justifyContent:"space-between", alignItems:"center",
                    borderLeft:"4px solid " + govLeader.color,
                  }}>
                  <div style={{ textAlign:"left" }}>
                    <div style={{ color:"#e2e8f0", fontWeight:800, fontSize:13 }}>{reg.id} · {reg.name}</div>
                    <div style={{ color:"#64748b", fontSize:10 }}>Padrón: {reg.padron.toLocaleString("es-ES")}</div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ color:govLeader.color, fontWeight:800, fontSize:12 }}>{govLeader.name}</div>
                      <div style={{ color:"#EAB308", fontSize:11, fontWeight:700 }}>{govLeader.pct.toFixed(1)}%</div>
                    </div>
                    <span style={{ color:"#334155", fontSize:14 }}>{isOpen ? "▲" : "▼"}</span>
                  </div>
                </button>

                {/* Expanded */}
                {isOpen && (
                  <div style={{ padding:"0 14px 14px" }}>
                    {/* Gobierno regional */}
                    <div style={{ marginBottom:12 }}>
                      <div style={{ color:"#475569", fontSize:9, fontWeight:700, letterSpacing:"0.1em", marginBottom:6 }}>GOBIERNO REGIONAL</div>
                      {govResults.map((c, idx) => (
                        <div key={c.id} style={{ marginBottom:6 }}>
                          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                            <span style={{ color: idx === 0 ? c.color : "#94a3b8", fontWeight: idx === 0 ? 800 : 400, fontSize:12 }}>
                              {c.name}{c.party ? " (" + c.party + ")" : ""}
                            </span>
                            <span style={{ color:"#e2e8f0", fontWeight:700, fontSize:12 }}>{c.pct.toFixed(1)}%</span>
                          </div>
                          <div style={{ background:"#060f1e", borderRadius:3, height:6, overflow:"hidden" }}>
                            <div style={{ width: Math.min(c.pct / (govResults[0].pct || 1) * 100, 100) + "%", height:"100%", background:c.color }} />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Asamblea regional (5 escaños) */}
                    <div>
                      <div style={{ color:"#475569", fontSize:9, fontWeight:700, letterSpacing:"0.1em", marginBottom:6 }}>ASAMBLEA REGIONAL · 5 ESCAÑOS · D'Hondt</div>
                      <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                        {topParties.map(p => (
                          <div key={p} style={{ background:CLR[p] + "25", border:"1px solid " + CLR[p] + "55", borderRadius:6, padding:"4px 10px", display:"flex", gap:5, alignItems:"center" }}>
                            <span style={{ fontWeight:700, color:CLR[p], fontSize:11 }}>{p}</span>
                            <span style={{ fontWeight:900, color:"#fff", fontSize:13 }}>{reg.seats[p]}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────
const TABS = [
  { id:"res",  label:"📊 Resultados" },
  { id:"hem",  label:"🏛️ Hemiciclo" },
  { id:"dis",  label:"🗂️ Distritos" },
  { id:"pac",  label:"🤝 Pactómetro" },
  { id:"pre",  label:"🗳️ Presidencial" },
  { id:"reg",  label:"🏘️ Regional" },
];

export default function App() {
  const [tab, setTab]               = useState("res");
  const [phaseIdx, setPhaseIdx]     = useState(0);
  const [stateFilter, setStateFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied]         = useState(false);
  const [showCSV, setShowCSV]       = useState(false);
  const [resHighlight, setResHighlight] = useState(null);
  const [resSelected, setResSelected]   = useState(null);

  useEffect(() => { setResHighlight(null); setResSelected(null); }, [phaseIdx]);

  const C       = CACHE[phaseIdx];
  const seats   = useMemo(() => dhondt(C.votes, C.vv), [phaseIdx]);
  const results = useMemo(() => PID.map(p => ({ p, v: C.votes[p] || 0, s: seats[p] || 0, pct: C.vv ? ((C.votes[p] || 0) / C.vv * 100) : 0 })).sort((a, b) => b.v - a.v), [phaseIdx, seats]);
  const leader  = results[0];
  const cIds    = useMemo(() => new Set(C.ds.map(d => d.id)), [phaseIdx]);

  const filteredDist = useMemo(() => {
    let arr = stateFilter === "all" ? SORTED : SORTED.filter(d => d.state === stateFilter);
    if (searchQuery) arr = arr.filter(d => d.id.toLowerCase().includes(searchQuery.toLowerCase()) || d.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return arr;
  }, [stateFilter, searchQuery]);

  const csvText = useMemo(() => {
    const lines = [
      '"' + PHASES[phaseIdx].n + ' | ' + C.pct + '% Escrutado | ' + C.mc + '/' + TMESAS + ' Mesas"',
      '"Votos válidos:' + C.vv.toLocaleString("es-ES") + ' | Blancos:' + C.bl.toLocaleString("es-ES") + ' | Nulos:' + C.nl.toLocaleString("es-ES") + '"',
      '""',
      '"Siglas","Partido","Votos","% Voto","Escaños","Supera 3%"',
    ];
    results.forEach(({ p, v, pct }) => {
      const sup = C.vv && v / C.vv >= THR ? "SÍ" : "NO";
      lines.push('"' + p + '","' + NOM[p] + '","' + v + '","' + pct.toFixed(2) + '%","' + (seats[p] || 0) + '","' + sup + '"');
    });
    return lines.join("\n");
  }, [phaseIdx, C, results, seats]);

  function doCopy() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(csvText)
        .then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); })
        .catch(() => setShowCSV(true));
    } else {
      setShowCSV(true);
    }
  }

  const card  = { background:"#0a1628", border:"1px solid #1e3a5f", borderRadius:12, padding:14, marginBottom:14 };
  const inner = { background:"#0c1e3a", borderRadius:8, padding:"10px 12px" };
  const secH  = { color:"#475569", fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:10, marginTop:0 };
  const btn   = { padding:"5px 12px", background:"transparent", border:"1px solid #1e3a5f", color:"#64748b", borderRadius:8, cursor:"pointer", fontSize:11, fontWeight:600 };

  return (
    <div style={{ minHeight:"100vh", background:"#060f1e", color:"#e2e8f0", fontFamily:"'Segoe UI',system-ui,sans-serif", fontSize:13 }}>
      <header style={{ background:"linear-gradient(180deg,#0d1f3c,#060f1e)", borderBottom:"2px solid #1e3a5f", padding:"12px 16px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8 }}>
            <div>
              <div style={{ fontWeight:900, fontSize:"clamp(12px,3vw,18px)", color:"#fff" }}>🗳️ Coravia 2024 · Elecciones Generales</div>
              <div style={{ color:"#475569", fontSize:10 }}>Voto Simulado · D'Hondt · Umbral 3% · {SEATS} escaños · 90 distritos</div>
            </div>
            <div style={{ background:"#0c1e3a", borderRadius:8, padding:"6px 12px", textAlign:"right" }}>
              <div style={{ color:"#EAB308", fontWeight:700, fontSize:13 }}>{C.pct}% escrutado</div>
              <div style={{ color:"#475569", fontSize:10 }}>{PHASES[phaseIdx].n} · {C.mc.toLocaleString("es-ES")}/{TMESAS.toLocaleString("es-ES")} mesas</div>
            </div>
          </div>
          <div style={{ marginTop:10, background:"#0c1e3a", borderRadius:6, height:6, overflow:"hidden" }}>
            <div style={{ width:C.pct + "%", height:"100%", background:"linear-gradient(90deg,#1d4ed8,#EAB308)", transition:"width .6s" }} />
          </div>
        </div>
      </header>

      <main role="main" style={{ maxWidth:1100, margin:"0 auto", padding:"14px 12px" }}>
        <nav aria-label="Secciones" style={{ display:"flex", borderBottom:"1px solid #1e3a5f", marginBottom:14, overflowX:"auto" }}>
          {TABS.map(t => (
            <button key={t.id} type="button" onClick={() => setTab(t.id)}
              aria-current={t.id === tab ? "page" : undefined}
              style={{
                padding:"10px 14px", background:"none", border:"none",
                borderBottom: t.id === tab ? "3px solid #2563EB" : "3px solid transparent",
                color: t.id === tab ? "#fff" : "#64748b", cursor:"pointer",
                fontWeight: t.id === tab ? 700 : 400, fontSize:"clamp(11px,2vw,13px)", whiteSpace:"nowrap",
              }}>{t.label}</button>
          ))}
        </nav>

        {/* ── RESULTADOS ───────────────────────────────── */}
        {tab === "res" && (
          <div>
            <div style={card}>
              <p style={secH}>Fase de escrutinio</p>
              <PhaseBar phaseIdx={phaseIdx} setPhaseIdx={setPhaseIdx} />
            </div>
            <div style={card}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10, flexWrap:"wrap", gap:6 }}>
                <span style={{ color:"#94a3b8", fontWeight:700, fontSize:12 }}>{PHASES[phaseIdx].n} · {C.pct}% · {PHASES[phaseIdx].d}/90 distritos</span>
                <div style={{ display:"flex", gap:5 }}>
                  <button type="button" onClick={doCopy} aria-label={copied ? "CSV copiado" : "Copiar CSV al portapapeles"}
                    style={{ ...btn, color: copied ? "#22c55e" : "#64748b", borderColor: copied ? "#22c55e" : "#1e3a5f" }}>
                    {copied ? "✓ Copiado" : "📋 CSV"}
                  </button>
                  <button type="button" onClick={() => setShowCSV(v => !v)} aria-expanded={showCSV} aria-label="Ver CSV"
                    style={{ ...btn, borderColor: showCSV ? "#EAB308" : "#1e3a5f", color: showCSV ? "#EAB308" : "#64748b" }}>
                    ▼ Ver
                  </button>
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(110px,1fr))", gap:8, marginBottom: showCSV ? 12 : 0 }}>
                {[
                  ["Votos válidos", C.vv.toLocaleString("es-ES"), "#22c55e", C.tv ? (C.vv / C.tv * 100).toFixed(1) + "% del total" : null],
                  ["Mesas", C.mc.toLocaleString("es-ES") + "/" + TMESAS.toLocaleString("es-ES"), "#94a3b8", C.pct + "% escrutado"],
                  ["Blancos", C.bl.toLocaleString("es-ES"), "#64748b", C.tv ? (C.bl / C.tv * 100).toFixed(2) + "% del total" : null],
                  ["Nulos", C.nl.toLocaleString("es-ES"), "#64748b", C.tv ? (C.nl / C.tv * 100).toFixed(2) + "% del total" : null],
                ].map(([l, v, c, pct]) => (
                  <div key={l} style={{ ...inner, textAlign:"center" }}>
                    <div style={{ color:"#475569", fontSize:10, marginBottom:3 }}>{l}</div>
                    <div style={{ color:c, fontWeight:700, fontSize:12 }}>{v}</div>
                    {pct && <div style={{ color:"#334155", fontSize:9, marginTop:3 }}>{pct}</div>}
                  </div>
                ))}
              </div>
              {showCSV && (
                <textarea readOnly value={csvText} onClick={e => e.target.select()}
                  aria-label="Datos CSV"
                  style={{ width:"100%", height:160, background:"#060f1e", border:"1px solid #1e3a5f", borderRadius:8, padding:10, color:"#94a3b8", fontSize:10, fontFamily:"monospace", resize:"vertical", boxSizing:"border-box", marginTop:10 }} />
              )}
            </div>

            {C.vv > 0 && leader && (
              <div style={{ ...card, borderLeft:"4px solid " + CLR[leader.p] }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 }}>
                  <div>
                    <div style={{ color:"#475569", fontSize:10, fontWeight:700, letterSpacing:"0.1em", marginBottom:2 }}>PARTIDO LÍDER</div>
                    <div style={{ display:"flex", alignItems:"baseline", gap:8 }}>
                      <span style={{ color:CLR[leader.p], fontWeight:900, fontSize:20 }}>{leader.p}</span>
                      <span style={{ color:"#94a3b8", fontSize:12 }}>{NOM[leader.p]}</span>
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:14 }}>
                    {[["Votos", leader.v.toLocaleString("es-ES"), "#fff"],["% Voto", leader.pct.toFixed(1) + "%", "#EAB308"],["Escaños", leader.s, CLR[leader.p]]].map(([l, v, c]) => (
                      <div key={l} style={{ textAlign:"center" }}>
                        <div style={{ color:"#475569", fontSize:10 }}>{l}</div>
                        <div style={{ color:c, fontWeight:900, fontSize:16 }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {C.vv > 0 && (
              <div style={card}>
                <p style={secH}>Partidos · Clic para detalles · Hover para resaltar</p>
                <ResultsGrid results={results} vv={C.vv} seats={seats}
                  highlight={resHighlight} setHighlight={setResHighlight}
                  selected={resSelected}   setSelected={setResSelected} />
                {resSelected && (
                  <button type="button" onClick={() => setResSelected(null)} aria-label="Limpiar selección"
                    style={{ marginTop:8, padding:"3px 10px", background:"transparent", border:"1px solid #1e3a5f", color:"#475569", borderRadius:5, cursor:"pointer", fontSize:10 }}>
                    × Limpiar selección
                  </button>
                )}
              </div>
            )}

            {C.vv > 0 && (
              <div style={card}>
                <ResultsChart results={results} vv={C.vv} seats={seats}
                  highlight={resHighlight || resSelected} onHover={setResHighlight} />
              </div>
            )}

            <div style={card}>
              <p style={secH}>Resultados por partido</p>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                  <thead>
                    <tr style={{ borderBottom:"1px solid #1e3a5f" }}>
                      {["","Sigla","Partido","Votos","%","Esc.","✓",""].map((h, i) => (
                        <th key={i} scope="col" style={{ padding:"6px 8px", color:"#475569", fontWeight:700, fontSize:10, letterSpacing:"0.05em", textAlign: i <= 2 ? "left" : "right" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.map(({ p, v, s, pct }) => {
                      const ok = C.vv && v / C.vv >= THR;
                      return (
                        <tr key={p} style={{ borderBottom:"1px solid #0c1e3a", opacity: ok ? 1 : .5 }}>
                          <td style={{ padding:"6px 8px" }}><div style={{ width:9, height:9, borderRadius:"50%", background:CLR[p] }} /></td>
                          <td style={{ padding:"6px 8px", fontWeight:800, color:"#f1f5f9" }}>{p}</td>
                          <td style={{ padding:"6px 8px", color:"#475569", fontSize:11 }}>{NOM[p]}</td>
                          <td style={{ padding:"6px 8px", textAlign:"right", color:"#94a3b8" }}>{v.toLocaleString("es-ES")}</td>
                          <td style={{ padding:"6px 8px", textAlign:"right", color:"#e2e8f0" }}>{pct.toFixed(2)}%</td>
                          <td style={{ padding:"6px 8px", textAlign:"right", fontWeight:900, fontSize:15, color:CLR[p] }}>{s}</td>
                          <td style={{ padding:"6px 8px", textAlign:"right", color: ok ? "#22c55e" : "#ef4444", fontWeight:700, fontSize:11 }}>{ok ? "✓" : "✗"}</td>
                          <td style={{ padding:"6px 8px", minWidth:60 }}>
                            <div style={{ background:"#0c1e3a", borderRadius:3, height:10, overflow:"hidden" }}>
                              <div style={{ width: Math.min(pct / 25 * 100, 100) + "%", height:"100%", background:CLR[p] }} />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={card}>
              <p style={secH}>{"Distribución D'Hondt · Mayoría absoluta: " + MAJ + " escaños"}</p>
              <div style={{ display:"flex", gap:3, flexWrap:"wrap", marginBottom:10 }}>
                {PID.filter(p => seats[p] > 0).sort((a, b) => (seats[b] || 0) - (seats[a] || 0)).flatMap(p =>
                  Array(seats[p]).fill(p).map((pp, i) => (
                    <div key={p + "-" + i} title={pp + " — " + NOM[pp]}
                      style={{ width:20, height:20, borderRadius:3, background:CLR[pp], flexShrink:0 }} />
                  ))
                )}
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {PID.filter(p => seats[p] > 0).sort((a, b) => (seats[b] || 0) - (seats[a] || 0)).map(p => (
                  <div key={p} style={{ background:CLR[p] + "25", border:"1px solid " + CLR[p] + "55", borderRadius:6, padding:"4px 10px", display:"flex", gap:6, alignItems:"center" }}>
                    <span style={{ fontWeight:700, color:CLR[p], fontSize:12 }}>{p}</span>
                    <span style={{ fontWeight:900, color:"#fff", fontSize:14 }}>{seats[p]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── HEMICICLO ────────────────────────────────── */}
        {tab === "hem" && (
          <div style={card}>
            <p style={secH}>{"Hemiciclo · Parlamento de Coravia · " + PHASES[phaseIdx].n + " · " + C.pct + "% escrutado"}</p>
            <div style={{ marginBottom:12 }}><PhaseBar phaseIdx={phaseIdx} setPhaseIdx={setPhaseIdx} /></div>
            <Hemicycle key={phaseIdx} seats={seats} results={results} vv={C.vv} />
          </div>
        )}

        {/* ── DISTRITOS ────────────────────────────────── */}
        {tab === "dis" && (
          <div style={card}>
            <p style={secH}>{"Explorador · " + PHASES[phaseIdx].n + " · " + PHASES[phaseIdx].d + "/90 contabilizados · Clic para ver detalle"}</p>
            <div style={{ marginBottom:10 }}><PhaseBar phaseIdx={phaseIdx} setPhaseIdx={setPhaseIdx} /></div>
            <div style={{ display:"flex", gap:4, overflowX:"auto", marginBottom:8, paddingBottom:4 }} role="group" aria-label="Filtrar por estado">
              <button type="button" onClick={() => setStateFilter("all")} aria-pressed={stateFilter === "all"}
                style={{ ...btn, borderColor: stateFilter === "all" ? "#2563EB" : "#1e3a5f", color: stateFilter === "all" ? "#fff" : "#64748b", whiteSpace:"nowrap", fontSize:10 }}>
                🌎 Todos
              </button>
              {Object.entries(STATES).map(([id, name]) => (
                <button key={id} type="button" onClick={() => setStateFilter(id)} aria-pressed={stateFilter === id}
                  style={{ ...btn, borderColor: stateFilter === id ? "#2563EB" : "#1e3a5f", color: stateFilter === id ? "#fff" : "#64748b", whiteSpace:"nowrap", fontSize:10 }}>
                  {id} {name}
                </button>
              ))}
            </div>
            <input
              type="search"
              placeholder="Buscar distrito por ID o nombre..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              maxLength={100}
              autoComplete="off"
              spellCheck="false"
              aria-label="Buscar distrito"
              style={{ width:"100%", background:"#0c1e3a", border:"1px solid #1e3a5f", borderRadius:8, padding:"7px 12px", color:"#e2e8f0", fontSize:12, marginBottom:10, boxSizing:"border-box" }}
            />
            <div style={{ display:"flex", gap:10, marginBottom:10, fontSize:11 }}>
              <span style={{ color:"#22c55e" }}>● Contabilizado</span>
              <span style={{ color:"#475569", opacity:.6 }}>● Pendiente</span>
              <span style={{ color:"#334155", marginLeft:"auto" }}>{filteredDist.filter(d => cIds.has(d.id)).length} contab. / {filteredDist.length} mostrados</span>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))", gap:8 }}>
              {filteredDist.map(d => <DistrictCard key={d.id} d={d} counted={cIds.has(d.id)} />)}
            </div>
            {filteredDist.length === 0 && (
              <div style={{ textAlign:"center", color:"#334155", padding:30 }}>Sin resultados para "{searchQuery}"</div>
            )}
          </div>
        )}

        {/* ── PACTÓMETRO ───────────────────────────────── */}
        {tab === "pac" && (
          <div style={card}>
            <p style={secH}>{"Pactómetro · " + PHASES[phaseIdx].n + " · " + SEATS + " escaños · Mayoría absoluta: " + MAJ}</p>
            <div style={{ marginBottom:14 }}><PhaseBar phaseIdx={phaseIdx} setPhaseIdx={setPhaseIdx} /></div>
            <Pactometro key={phaseIdx} seats={seats} />
          </div>
        )}

        {/* ── PRESIDENCIAL ─────────────────────────────── */}
        {tab === "pre" && (
          <PresidencialTab phaseIdx={phaseIdx} setPhaseIdx={setPhaseIdx} />
        )}

        {/* ── REGIONAL ─────────────────────────────────── */}
        {tab === "reg" && (
          <RegionalTab />
        )}

        <footer style={{ textAlign:"center", color:"#1e3a5f", fontSize:10, paddingBottom:20 }}>
          Voto Simulado · D'Hondt · Umbral 3%<br />
          República de Coravia · Elecciones Generales 2024
        </footer>
      </main>
    </div>
  );
}
