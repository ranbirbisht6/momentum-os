"use client";

import type { MomentumActions } from "../../hooks/useMomentumStore";
import { shiftMonth } from "../../utils";
import { PlannerPage } from "../PlannerPage";

export function MonthView({
  actions,
  selectedMonth,
  setSelectedMonth,
  currentMonthKey,
}: {
  actions: MomentumActions;
  selectedMonth: string;
  setSelectedMonth: (m: string) => void;
  currentMonthKey: string;
}) {
  return (
    <PlannerPage
      scope="monthly"
      actions={actions}
      periodValue={selectedMonth}
      setPeriodValue={setSelectedMonth}
      onPrev={() => {
        const previous = shiftMonth(selectedMonth, -1);
        if (previous >= currentMonthKey) setSelectedMonth(previous);
      }}
      onNext={() => setSelectedMonth(shiftMonth(selectedMonth, 1))}
      onToday={() => setSelectedMonth(currentMonthKey)}
      isCurrentPeriod={selectedMonth === currentMonthKey}
      periodInput={
        <input
          type="month"
          min={currentMonthKey}
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 py-1.5 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
        />
      }
    />
  );
}
