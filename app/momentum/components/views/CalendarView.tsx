"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  GripVertical,
  RefreshCcw,
  Bell,
} from "lucide-react";
import type { MomentumActions } from "../../hooks/useMomentumStore";
import { useToast } from "../../hooks/useToast";
import type { CalendarMode, DailyCategory } from "../../types";
import { categoryIsComplete, toDateKey } from "../../utils";
import { PageContainer } from "../design/PageContainer";
import { Surface } from "../design/Surface";
import { EmptyState } from "../ui/EmptyState";

const MODES: { value: CalendarMode; label: string }[] = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
];

const HOURS = ["8 AM", "10 AM", "12 PM", "2 PM", "4 PM", "6 PM"];

export function CalendarView({ actions }: { actions: MomentumActions }) {
  const toast = useToast();
  const [mode, setMode] = useState<CalendarMode>("week");
  const [anchor, setAnchor] = useState(() => new Date());
  const todayKey = toDateKey(new Date());

  const visibleDays = useMemo(() => getVisibleDays(anchor, mode), [anchor, mode]);
  const tasksByDate = useMemo(() => {
    const map = new Map<string, DailyCategory[]>();
    for (const task of actions.store.dailyCategories) {
      map.set(task.dateKey, [...(map.get(task.dateKey) ?? []), task]);
    }
    return map;
  }, [actions.store.dailyCategories]);

  const totalVisibleTasks = visibleDays.reduce(
    (total, date) => total + (tasksByDate.get(toDateKey(date))?.length ?? 0),
    0,
  );

  const shift = (amount: number) => {
    setAnchor((current) => {
      const next = new Date(current);
      if (mode === "month") next.setMonth(next.getMonth() + amount);
      else next.setDate(next.getDate() + amount * (mode === "day" ? 1 : 7));
      return next;
    });
  };

  const moveTask = (taskId: string, dateKey: string) => {
    if (dateKey < todayKey) {
      toast.error("Cannot schedule work in the past");
      return;
    }
    const moved = actions.moveDailyCategory(taskId, dateKey);
    if (moved) toast.success("Task scheduled");
  };

  return (
    <PageContainer className="space-y-6">
      <Surface className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between" padding="lg">
        <div>
          <span className="section-label">Calendar</span>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
            {anchor.toLocaleDateString(undefined, { month: "long", year: "numeric" })}
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 muted-text">
            Drag tasks between days to schedule work, goals, deadlines, and reminder-driven tasks in one place.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => shift(-1)} className="rounded-xl border border-[var(--border)] p-2 muted-text transition hover:bg-[var(--surface-soft)]" aria-label="Previous">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => setAnchor(new Date())} className="min-h-10 rounded-xl border border-[var(--border)] px-4 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface-soft)]">
            Today
          </button>
          <button type="button" onClick={() => shift(1)} className="rounded-xl border border-[var(--border)] p-2 muted-text transition hover:bg-[var(--surface-soft)]" aria-label="Next">
            <ChevronRight className="h-4 w-4" />
          </button>
          <div className="ml-0 flex rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-1 sm:ml-2">
            {MODES.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setMode(item.value)}
                className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${
                  mode === item.value
                    ? "bg-[var(--surface)] text-[var(--text)] shadow-sm"
                    : "muted-text hover:text-[var(--text)]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </Surface>

      {totalVisibleTasks === 0 && (
        <EmptyState
          icon="."
          title="Your calendar is open"
          hint="Add tasks from Today or drop existing work onto dates to build a focused schedule."
        />
      )}

      {mode === "day" ? (
        <DaySchedule
          date={visibleDays[0]}
          tasks={tasksByDate.get(toDateKey(visibleDays[0])) ?? []}
          onDropTask={moveTask}
        />
      ) : (
        <div
          className={`grid gap-3 ${
            mode === "month" ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-7" : "grid-cols-1 md:grid-cols-2 xl:grid-cols-7"
          }`}
        >
          {visibleDays.map((date) => {
            const key = toDateKey(date);
            const tasks = tasksByDate.get(key) ?? [];
            const isCurrentMonth = date.getMonth() === anchor.getMonth();
            return (
              <DayColumn
                key={key}
                date={date}
                tasks={tasks}
                muted={mode === "month" && !isCurrentMonth}
                past={key < todayKey}
                onDropTask={(taskId) => moveTask(taskId, key)}
              />
            );
          })}
        </div>
      )}
    </PageContainer>
  );
}

function DayColumn({
  date,
  tasks,
  muted,
  past,
  onDropTask,
}: {
  date: Date;
  tasks: DailyCategory[];
  muted?: boolean;
  past?: boolean;
  onDropTask: (taskId: string) => void;
}) {
  return (
    <Surface padding="sm" className={`min-h-56 card-hover ${muted ? "opacity-55" : ""}`}>
      <div
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          const id = event.dataTransfer.getData("text/task-id");
          if (id) onDropTask(id);
        }}
        className="flex min-h-48 flex-col"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="section-label">
              {date.toLocaleDateString(undefined, { weekday: "short" })}
            </p>
            <p className="mt-1 text-3xl font-semibold text-[var(--text)]">{date.getDate()}</p>
          </div>
          <span className="rounded-full bg-[var(--surface-soft)] px-2.5 py-1 text-xs muted-text">
            {past ? "Past" : tasks.length}
          </span>
        </div>
        <div className="mt-4 space-y-2">
          {tasks.slice(0, 4).map((task) => (
            <TaskChip key={task.id} task={task} />
          ))}
          {tasks.length > 4 && (
            <p className="text-xs muted-text">+{tasks.length - 4} more tasks</p>
          )}
        </div>
        {tasks.length === 0 && (
          <div className="mt-4 grid flex-1 place-items-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface-soft)] p-4 text-center text-xs muted-text">
            {past ? "Read-only" : "Drop tasks here"}
          </div>
        )}
      </div>
    </Surface>
  );
}

function DaySchedule({
  date,
  tasks,
  onDropTask,
}: {
  date: Date;
  tasks: DailyCategory[];
  onDropTask: (taskId: string, dateKey: string) => void;
}) {
  const key = toDateKey(date);
  return (
    <Surface className="space-y-5" padding="lg">
      <div className="flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--accent-soft)]">
          <CalendarDays className="h-5 w-5 accent-text" />
        </div>
        <div>
          <p className="section-label">{date.toLocaleDateString(undefined, { weekday: "long" })}</p>
          <h3 className="text-2xl font-semibold text-[var(--text)]">
            {date.toLocaleDateString(undefined, { month: "long", day: "numeric" })}
          </h3>
        </div>
      </div>
      <div
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          const id = event.dataTransfer.getData("text/task-id");
          if (id) onDropTask(id, key);
        }}
        className="space-y-3"
      >
        {HOURS.map((hour, index) => (
          <div key={hour} className="grid gap-3 border-t border-[var(--border)] pt-3 md:grid-cols-[5rem_1fr]">
            <p className="text-xs font-semibold soft-text">{hour}</p>
            <div className="min-h-20 rounded-2xl bg-[var(--surface-soft)] p-3">
              {index === 0
                ? tasks.map((task) => <TaskChip key={task.id} task={task} wide />)
                : null}
            </div>
          </div>
        ))}
      </div>
    </Surface>
  );
}

function TaskChip({ task, wide = false }: { task: DailyCategory; wide?: boolean }) {
  const complete = categoryIsComplete(task);
  const colorClass = task.priority === "critical"
    ? "border-l-red-500"
    : task.priority === "high"
      ? "border-l-amber-500"
      : task.priority === "low"
        ? "border-l-emerald-600"
        : "border-l-stone-400";
  return (
    <div
      draggable
      onDragStart={(event) => event.dataTransfer.setData("text/task-id", task.id)}
      className={`mb-2 rounded-2xl border border-l-4 border-[var(--border)] bg-[var(--surface)] p-3 text-xs shadow-sm transition hover:border-[var(--accent)] ${colorClass} ${
        complete ? "opacity-60" : ""
      } ${wide ? "flex items-center justify-between gap-3" : ""}`}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <GripVertical className="h-3.5 w-3.5 shrink-0 soft-text" />
          <p className={`truncate font-semibold ${complete ? "text-[var(--muted-soft)] line-through" : "text-[var(--text)]"}`}>
            {task.title}
          </p>
        </div>
        <p className="mt-2 flex flex-wrap items-center gap-2 muted-text">
          <Clock3 className="h-3.5 w-3.5" />
          <span>{task.scheduledAt || "Anytime"}</span>
          {task.reminder.offset !== "none" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--accent-soft)] px-2 py-0.5 accent-text">
              <Bell className="h-3 w-3" />
              {task.reminder.offset}
            </span>
          )}
          {task.recurrence.frequency !== "none" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--surface-soft)] px-2 py-0.5">
              <RefreshCcw className="h-3 w-3" />
              {task.recurrence.frequency}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}

function getVisibleDays(anchor: Date, mode: CalendarMode) {
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
