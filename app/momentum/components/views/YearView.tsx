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
      onPrev={() => {
        if (selectedYear > currentYear) setSelectedYear(selectedYear - 1);
      }}
      onNext={() => setSelectedYear(selectedYear + 1)}
      onToday={() => setSelectedYear(currentYear)}
      isCurrentPeriod={selectedYear === currentYear}
      periodInput={
        <input
          type="number"
          min={currentYear}
          max={2100}
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value) || currentYear)}
          className="w-24 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 py-1.5 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
        />
      }
    />
  );
}
