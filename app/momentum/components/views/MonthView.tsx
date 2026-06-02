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
      onPrev={() => setSelectedMonth(shiftMonth(selectedMonth, -1))}
      onNext={() => setSelectedMonth(shiftMonth(selectedMonth, 1))}
      onToday={() => setSelectedMonth(currentMonthKey)}
      isCurrentPeriod={selectedMonth === currentMonthKey}
      periodInput={
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="rounded-lg border-0 bg-transparent px-2 text-sm text-zinc-300 outline-none"
        />
      }
    />
  );
}
