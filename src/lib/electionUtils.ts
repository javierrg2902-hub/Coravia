import { PID, SPECTR } from "@/data/parties";
import type { PartyId, SeatMap } from "@/types/election";

export function makeSeatOrder(seats: SeatMap): PartyId[] {
  return PID.filter((p) => seats[p] > 0)
    .sort((a, b) => (SPECTR[a] || 50) - (SPECTR[b] || 50))
    .flatMap((p) => Array(seats[p]).fill(p));
}

// SVG hemicicle arc geometry
export const ARC_CX = 200;
export const ARC_CY = 195;
export const ARC_R = 112;
export const ARC_THICK = 76;
export const ARC_START = 176;
export const ARC_END = 4;
export const ARC_SPAN = ARC_START - ARC_END;

export function arcPt(r: number, deg: number): [number, number] {
  const rad = (deg * Math.PI) / 180;
  return [ARC_CX + r * Math.cos(rad), ARC_CY - r * Math.sin(rad)];
}

export function annSeg(rMid: number, thick: number, dS: number, dE: number): string {
  if (Math.abs(dS - dE) < 0.08) return "";
  const ro = rMid + thick / 2;
  const ri = rMid - thick / 2;
  const [x1o, y1o] = arcPt(ro, dS);
  const [x2o, y2o] = arcPt(ro, dE);
  const [x1i, y1i] = arcPt(ri, dS);
  const [x2i, y2i] = arcPt(ri, dE);
  const la = Math.abs(dS - dE) > 180 ? 1 : 0;
  return `M ${x1o.toFixed(1)} ${y1o.toFixed(1)} A ${ro} ${ro} 0 ${la} 1 ${x2o.toFixed(1)} ${y2o.toFixed(1)} L ${x2i.toFixed(1)} ${y2i.toFixed(1)} A ${ri} ${ri} 0 ${la} 0 ${x1i.toFixed(1)} ${y1i.toFixed(1)} Z`;
}
