"use client";

import type { MomentumActions } from "../../hooks/useMomentumStore";
import { shiftDate } from "../../utils";
import { PlannerPage } from "../PlannerPage";

export function TodayView({
  actions,
  selectedDate,
  setSelectedDate,
  todayKey,
}: {
  actions: MomentumActions;
  selectedDate: string;
  setSelectedDate: (d: string) => void;
  todayKey: string;
}) {
  return (
    <PlannerPage
      scope="daily"
      actions={actions}
      periodValue={selectedDate}
      setPeriodValue={setSelectedDate}
      onPrev={() => setSelectedDate(shiftDate(selectedDate, -1))}
      onNext={() => setSelectedDate(shiftDate(selectedDate, 1))}
      onToday={() => setSelectedDate(todayKey)}
      isCurrentPeriod={selectedDate === todayKey}
      periodInput={
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="rounded-lg border-0 bg-transparent px-2 text-sm text-zinc-300 outline-none"
        />
      }
    />
  );
}
