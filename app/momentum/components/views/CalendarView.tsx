"use client";

import { useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import type { MomentumActions } from "../../hooks/useMomentumStore";
import type { CalendarMode, DailyCategory } from "../../types";
import { categoryIsComplete, toDateKey } from "../../utils";
import { PageContainer } from "../design/PageContainer";
import { Surface } from "../design/Surface";

const MODES: { value: CalendarMode; label: string }[] = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "agenda", label: "Agenda" },
];

export function CalendarView({ actions }: { actions: MomentumActions }) {
  const [mode, setMode] = useState<CalendarMode>("week");
  const [anchor, setAnchor] = useState(() => new Date());

  const visibleDays = useMemo(() => getVisibleDays(anchor, mode), [anchor, mode]);
  const tasksByDate = useMemo(() => {
    const map = new Map<string, DailyCategory[]>();
    for (const task of actions.store.dailyCategories) {
      map.set(task.dateKey, [...(map.get(task.dateKey) ?? []), task]);
    }
    return map;
  }, [actions.store.dailyCategories]);

  const shift = (amount: number) => {
    setAnchor((current) => {
      const next = new Date(current);
      if (mode === "month") next.setMonth(next.getMonth() + amount);
      else next.setDate(next.getDate() + amount * (mode === "day" ? 1 : 7));
      return next;
    });
  };

  return (
    <PageContainer className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => shift(-1)}
            className="rounded-lg p-2 muted-text hover:bg-[var(--surface-soft)]"
            aria-label="Previous"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div>
            <p className="text-sm font-semibold text-[var(--text)]">
              {anchor.toLocaleDateString(undefined, {
                month: "long",
                year: "numeric",
              })}
            </p>
            <p className="text-xs muted-text">Drag tasks onto a date to schedule.</p>
          </div>
          <button
            type="button"
            onClick={() => shift(1)}
            className="rounded-lg p-2 muted-text hover:bg-[var(--surface-soft)]"
            aria-label="Next"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="flex rounded-lg border border-[var(--border)] bg-[var(--surface)] p-1">
          {MODES.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setMode(item.value)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                mode === item.value
                  ? "bg-[var(--accent-soft)] accent-text"
                  : "muted-text hover:text-[var(--text)]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div
        className={`grid gap-3 ${
          mode === "day" ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-7"
        }`}
      >
        {visibleDays.map((date) => {
          const key = toDateKey(date);
          const tasks = tasksByDate.get(key) ?? [];
          return (
            <Surface
              key={key}
              className="min-h-44"
              padding="sm"
            >
              <div
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  const id = event.dataTransfer.getData("text/task-id");
                  if (id) actions.moveDailyCategory(id, key);
                }}
                className="flex min-h-36 flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider soft-text">
                      {date.toLocaleDateString(undefined, { weekday: "short" })}
                    </p>
                    <p className="text-lg font-semibold text-[var(--text)]">
                      {date.getDate()}
                    </p>
                  </div>
                  <CalendarDays className="h-4 w-4 soft-text" />
                </div>
                {tasks.map((task) => (
                  <TaskChip key={task.id} task={task} />
                ))}
                {tasks.length === 0 && (
                  <p className="mt-4 text-xs muted-text">Drop tasks here.</p>
                )}
              </div>
            </Surface>
          );
        })}
      </div>
    </PageContainer>
  );
}

function TaskChip({ task }: { task: DailyCategory }) {
  const complete = categoryIsComplete(task);
  return (
    <div
      draggable
      onDragStart={(event) => event.dataTransfer.setData("text/task-id", task.id)}
      className={`rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] p-2 text-xs shadow-sm ${
        complete ? "opacity-60" : ""
      }`}
    >
      <p
        className={`font-medium ${
          complete ? "text-[var(--muted-soft)] line-through" : "text-[var(--text)]"
        }`}
      >
        {task.title}
      </p>
      <p className="mt-1 muted-text">
        {task.scheduledAt || "Anytime"}
        {task.reminder.offset !== "none" ? ` - ${task.reminder.offset}` : ""}
      </p>
    </div>
  );
}

function getVisibleDays(anchor: Date, mode: CalendarMode) {
  if (mode === "agenda") {
    return Array.from({ length: 14 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() + index);
      return date;
    });
  }

  if (mode === "day") return [anchor];

  if (mode === "week") {
    const start = new Date(anchor);
    start.setDate(anchor.getDate() - anchor.getDay());
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return date;
    });
  }

  const first = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  first.setDate(first.getDate() - first.getDay());
  return Array.from({ length: 35 }, (_, index) => {
    const date = new Date(first);
    date.setDate(first.getDate() + index);
    return date;
  });
}
