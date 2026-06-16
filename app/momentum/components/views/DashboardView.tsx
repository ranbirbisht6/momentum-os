"use client";

import { memo, useMemo } from "react";
import {
  ArrowUpRight,
  BookOpenCheck,
  CalendarClock,
  CheckCircle2,
  Flame,
  PenLine,
  Plus,
  Sparkles,
  Target,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { dailyChart } from "../../analytics";
import { buildAssistantInsights } from "../../lib/assistant";
import { resolveUserName } from "../../lib/user";
import type { MomentumActions } from "../../hooks/useMomentumStore";
import type { DailyCategory, Goal, TabId } from "../../types";
import {
  categoryIsComplete,
  categoryProgress,
  formatDateLabel,
  parseDateKey,
  toDateKey,
} from "../../utils";
import { PageContainer } from "../design/PageContainer";
import { Surface } from "../design/Surface";

function DashboardViewInner({
  actions,
  onNavigate,
}: {
  actions: MomentumActions;
  onNavigate?: (tab: TabId) => void;
}) {
  const {
    hydrated,
    todayKey,
    currentMonthKey,
    currentYear,
    store,
    todayProgress,
  } = actions;

  const userName = useMemo(
    () => (hydrated ? resolveUserName(store) : null),
    [hydrated, store],
  );

  const insight = useMemo(
    () =>
      hydrated
        ? buildAssistantInsights(store, todayKey, currentMonthKey, userName)
        : null,
    [hydrated, store, todayKey, currentMonthKey, userName],
  );

  const monthProgress = useMemo(
    () =>
      categoryProgress(
        store.monthlyCategories.filter((c) => c.monthKey === currentMonthKey),
      ),
    [store.monthlyCategories, currentMonthKey],
  );

  const yearProgress = useMemo(
    () =>
      categoryProgress(
        store.annualCategories.filter((c) => c.year === currentYear),
      ),
    [store.annualCategories, currentYear],
  );

  const weekly = useMemo(() => dailyChart(store, 7), [store]);
  const upcoming = useMemo(() => getUpcomingTasks(store.dailyCategories), [store.dailyCategories]);
  const activeGoals = useMemo(() => store.goals.slice(0, 3), [store.goals]);
  const calendarPreview = useMemo(() => getCalendarPreview(store.dailyCategories), [store.dailyCategories]);
  const isEmptyWorkspace =
    store.dailyCategories.length === 0 &&
    store.monthlyCategories.length === 0 &&
    store.annualCategories.length === 0 &&
    store.goals.length === 0 &&
    store.reviews.length === 0 &&
    store.journalEntries.length === 0;
  const productivityScore = Math.round(
    todayProgress.percent * 0.45 + monthProgress.percent * 0.3 + yearProgress.percent * 0.25,
  );

  return (
    <PageContainer className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <Surface className="overflow-hidden" padding="lg">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="section-label">Momentum OS V3</span>
              <h2 className="mt-3 text-4xl font-semibold tracking-tight text-[var(--text)] sm:text-5xl">
                Your productivity command center.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-6 muted-text">
                Plan today, protect focus, watch goals move, and keep team work visible from one calm operating surface.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate?.("today")}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--accent-strong)]"
            >
              <Plus className="h-4 w-4" />
              Quick Add
            </button>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <MetricTile label="Today's Progress" value={`${todayProgress.percent}%`} helper={`${todayProgress.completed}/${todayProgress.total} complete`} />
            <MetricTile label="Weekly Score" value={`${productivityScore}`} helper="Momentum score" />
            <MetricTile label="Streak" value={`${hydrated ? store.streak.currentStreak : 0}`} helper={`Best ${hydrated ? store.streak.bestStreak : 0} days`} />
          </div>
        </Surface>

        <Surface className="flex flex-col justify-between gap-6" padding="lg">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="section-label">Today</span>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--text)]">
                {formatDateLabel(todayKey)}
              </h3>
            </div>
            <div
              className="grid h-24 w-24 place-items-center rounded-full text-center"
              style={{
                background: `conic-gradient(var(--accent) ${todayProgress.percent}%, var(--surface-soft) 0)`,
              }}
            >
              <div className="grid h-20 w-20 place-items-center rounded-full bg-[var(--surface)]">
                <span className="stat-value text-2xl font-semibold text-[var(--text)]">
                  {todayProgress.percent}%
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <TinyStat label="Tasks" value={todayProgress.total} />
            <TinyStat label="Done" value={todayProgress.completed} />
            <TinyStat label="Open" value={todayProgress.pending} />
          </div>
        </Surface>
      </section>

      {isEmptyWorkspace && (
        <Surface className="grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <span className="section-label">Start here</span>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--text)]">
              Your operating system is ready.
            </h3>
            <p className="mt-2 text-sm leading-6 muted-text">
              Add one task, create one goal, or generate a plan to turn this dashboard from empty state into live command center.
            </p>
          </div>
          <QuickActions onNavigate={onNavigate} />
        </Surface>
      )}

      <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr_0.9fr]">
        <Surface className="space-y-4">
          <SectionHead icon={CalendarClock} title="Upcoming Tasks" action="Today" />
          <div className="space-y-3">
            {upcoming.length > 0 ? (
              upcoming.map((task) => <TaskRow key={task.id} task={task} />)
            ) : (
              <SoftEmpty title="No scheduled tasks" hint="Add a task in Today or drag one onto Calendar." />
            )}
          </div>
        </Surface>

        <Surface className="space-y-4">
          <SectionHead icon={Target} title="Active Goals" action={`${store.goals.length} total`} />
          <div className="space-y-3">
            {activeGoals.length > 0 ? (
              activeGoals.map((goal) => <GoalRow key={goal.id} goal={goal} />)
            ) : (
              <SoftEmpty title="No goals yet" hint="Create a goal and Momentum will break it into milestones." />
            )}
          </div>
        </Surface>

        <Surface className="space-y-4">
          <SectionHead icon={Sparkles} title="AI Insights" action="Local" />
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
            <p className="text-sm font-semibold text-[var(--text)]">
              {insight?.suggestedNextAction ?? "Protect one deep work block today."}
            </p>
            <ul className="mt-3 space-y-2 text-sm muted-text">
              {(insight?.recommendations ?? ["Review one goal", "Schedule one priority task"]).slice(0, 3).map((item) => (
                <li key={item} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 accent-text" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Surface>
      </section>

      {!isEmptyWorkspace && (
        <Surface className="space-y-4">
          <SectionHead icon={Plus} title="Quick Actions" action="Create" />
          <QuickActions onNavigate={onNavigate} />
        </Surface>
      )}

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Surface className="space-y-5">
          <SectionHead icon={TrendingUp} title="Weekly Progress" action={`${monthProgress.percent}% month`} />
          <div className="flex h-48 items-end gap-3">
            {weekly.map((day) => (
              <div key={day.label} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                <div className="flex h-36 w-full items-end rounded-2xl bg-[var(--surface-soft)] p-1">
                  <div
                    className="w-full rounded-xl bg-[var(--accent)] transition-all"
                    style={{ height: `${Math.max(6, day.percent)}%` }}
                  />
                </div>
                <span className="text-xs soft-text">{day.label}</span>
              </div>
            ))}
          </div>
        </Surface>

        <Surface className="space-y-5">
          <SectionHead icon={Flame} title="Calendar Preview" action="Next 7 days" />
          <div className="grid gap-3 sm:grid-cols-7">
            {calendarPreview.map((day) => (
              <div key={day.key} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-3">
                <p className="text-xs font-semibold soft-text">{day.label}</p>
                <p className="mt-1 text-2xl font-semibold text-[var(--text)]">{day.date}</p>
                <p className="mt-3 text-xs muted-text">{day.count} tasks</p>
              </div>
            ))}
          </div>
        </Surface>
      </section>
    </PageContainer>
  );
}

function QuickActions({ onNavigate }: { onNavigate?: (tab: TabId) => void }) {
  const actions: { label: string; hint: string; tab: TabId; icon: LucideIcon }[] = [
    { label: "New Task", hint: "Create work for today", tab: "today", icon: Plus },
    { label: "New Goal", hint: "Set target date", tab: "goals", icon: Target },
    { label: "New Reminder", hint: "Add reminder to task", tab: "today", icon: CalendarClock },
    { label: "AI Plan", hint: "Generate roadmap", tab: "ai-planning", icon: Sparkles },
    { label: "Review Week", hint: "Capture signal", tab: "reviews", icon: BookOpenCheck },
    { label: "Journal", hint: "Write clearly", tab: "journal", icon: PenLine },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {actions.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.label}
            type="button"
            onClick={() => onNavigate?.(item.tab)}
            className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4 text-left transition hover:border-[var(--accent)] hover:bg-[var(--surface)]"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[var(--accent-soft)]">
              <Icon className="h-4 w-4 accent-text" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-[var(--text)]">{item.label}</span>
              <span className="block text-xs muted-text">{item.hint}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

function MetricTile({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] soft-text">{label}</p>
      <p className="stat-value mt-3 text-3xl font-semibold text-[var(--text)]">{value}</p>
      <p className="mt-1 text-xs muted-text">{helper}</p>
    </div>
  );
}

function TinyStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-3 text-center">
      <p className="stat-value text-xl font-semibold text-[var(--text)]">{value}</p>
      <p className="text-xs soft-text">{label}</p>
    </div>
  );
}

function SectionHead({
  icon: Icon,
  title,
  action,
}: {
  icon: LucideIcon;
  title: string;
  action: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--accent-soft)]">
          <Icon className="h-4 w-4 accent-text" />
        </div>
        <h3 className="text-base font-semibold text-[var(--text)]">{title}</h3>
      </div>
      <span className="rounded-full border border-[var(--border)] px-2.5 py-1 text-xs soft-text">
        {action}
      </span>
    </div>
  );
}

function TaskRow({ task }: { task: DailyCategory }) {
  const complete = categoryIsComplete(task);
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-3">
      <div className="min-w-0">
        <p className={`truncate text-sm font-semibold ${complete ? "text-[var(--muted-soft)] line-through" : "text-[var(--text)]"}`}>
          {task.title}
        </p>
        <p className="mt-1 text-xs muted-text">
          {parseDateKey(task.dateKey).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
          {task.scheduledAt ? ` at ${task.scheduledAt}` : " anytime"}
        </p>
      </div>
      <ArrowUpRight className="h-4 w-4 shrink-0 soft-text" />
    </div>
  );
}

function GoalRow({ goal }: { goal: Goal }) {
  const total = goal.milestones.length;
  const done = goal.milestones.filter((milestone) => milestone.completed).length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[var(--text)]">{goal.title}</p>
          <p className="mt-1 text-xs muted-text">{goal.category}</p>
        </div>
        <span className="text-xs font-semibold accent-text">{percent}%</span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--surface)]">
        <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function SoftEmpty({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface-soft)] p-5 text-center">
      <p className="text-sm font-semibold text-[var(--text)]">{title}</p>
      <p className="mt-1 text-xs leading-5 muted-text">{hint}</p>
    </div>
  );
}

function getUpcomingTasks(tasks: DailyCategory[]) {
  const today = toDateKey(new Date());
  return [...tasks]
    .filter((task) => task.dateKey >= today)
    .sort((a, b) => `${a.dateKey}${a.scheduledAt ?? ""}`.localeCompare(`${b.dateKey}${b.scheduledAt ?? ""}`))
    .slice(0, 5);
}

function getCalendarPreview(tasks: DailyCategory[]) {
  const today = new Date();
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);
    const key = toDateKey(date);
    return {
      key,
      label: date.toLocaleDateString(undefined, { weekday: "short" }),
      date: date.getDate(),
      count: tasks.filter((task) => task.dateKey === key).length,
    };
  });
}

export const DashboardView = memo(DashboardViewInner);
