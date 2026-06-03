"use client";

import { useMemo } from "react";
import { dhondt } from "@/lib/dhondt";
import { makeSeatOrder } from "@/lib/electionUtils";
import { PID } from "@/data/parties";
import type { PhaseData, PartyResult, SeatMap } from "@/types/election";

export function useElectionCalc(phaseData: PhaseData) {
  const seats: SeatMap = useMemo(
    () => dhondt(phaseData.votes, phaseData.vv),
    [phaseData.votes, phaseData.vv]
  );

  const results: PartyResult[] = useMemo(
    () =>
      PID.map((p) => ({
        p,
        v: phaseData.votes[p] ?? 0,
        s: seats[p] ?? 0,
        pct: phaseData.vv ? ((phaseData.votes[p] ?? 0) / phaseData.vv) * 100 : 0,
      })).sort((a, b) => b.v - a.v || a.p.localeCompare(b.p)),
    [phaseData.votes, phaseData.vv, seats]
  );

  const leader = results[0];

  const seatOrder = useMemo(() => makeSeatOrder(seats), [seats]);

  const countedIds = useMemo(
    () => new Set(phaseData.ds.map((d) => d.id)),
    [phaseData.ds]
  );

  const totalSeats = useMemo(
    () => PID.reduce((s, p) => s + (seats[p] ?? 0), 0),
    [seats]
  );

  return { seats, results, leader, seatOrder, countedIds, totalSeats };
}
