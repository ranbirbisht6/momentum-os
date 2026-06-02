"use client";

import type { MomentumActions } from "../../hooks/useMomentumStore";
import { PlannerPage } from "../PlannerPage";

export function YearView({
  actions,
  selectedYear,
  setSelectedYear,
  currentYear,
}: {
  actions: MomentumActions;
  selectedYear: number;
  setSelectedYear: (y: number) => void;
  currentYear: number;
}) {
  return (
    <PlannerPage
      scope="annual"
      actions={actions}
      periodValue={selectedYear}
      setPeriodValue={(v) => setSelectedYear(Number(v) || currentYear)}
      onPrev={() => setSelectedYear(selectedYear - 1)}
      onNext={() => setSelectedYear(selectedYear + 1)}
      onToday={() => setSelectedYear(currentYear)}
      isCurrentPeriod={selectedYear === currentYear}
      periodInput={
        <input
          type="number"
          min={2000}
          max={2100}
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value) || currentYear)}
          className="w-20 rounded-lg border-0 bg-transparent px-2 text-sm text-zinc-300 outline-none"
        />
      }
    />
  );
}
