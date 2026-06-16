"use client";

import { memo, useMemo } from "react";
import {
  Calendar,
  ChevronRight,
  Flame,
  Layers,
  Rocket,
  Target,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { buildAssistantInsights } from "../../lib/assistant";
import { getRecentCategories } from "../../lib/dashboard";
import { resolveUserName } from "../../lib/user";
import type { MomentumActions } from "../../hooks/useMomentumStore";
import { categoryProgress, pickTodayFocus } from "../../utils";
import { AIAssistantCard } from "../AIAssistantCard";
import { PageContainer } from "../design/PageContainer";
import { Surface } from "../design/Surface";

function DashboardViewInner({ actions }: { actions: MomentumActions }) {
  const {
    hydrated,
    todayKey,
    currentMonthKey,
    currentYear,
    store,
    todayProgress,
    todayCategories,
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

  const focus = useMemo(
    () => (hydrated ? pickTodayFocus(todayCategories) : null),
    [hydrated, todayCategories],
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

  const recent = useMemo(
    () => (hydrated ? getRecentCategories(todayCategories) : []),
    [hydrated, todayCategories],
  );

  return (
    <PageContainer className="space-y-8">
      {insight && <AIAssistantCard insight={insight} />}

      <Surface>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)]">
            <Target className="h-5 w-5 accent-text" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider soft-text">
              Today&apos;s focus
            </p>
            {focus ? (
              <>
                <p className="mt-2 text-lg font-semibold text-[var(--text)]">
                  {focus.categoryTitle}
                </p>
                <p className="mt-1 text-sm accent-text">{focus.subtaskTitle}</p>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs muted-text">
                    <span>Completion</span>
                    <span>{focus.percent}%</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--surface-soft)]">
                    <div
                      className="h-full rounded-full bg-[var(--accent)] transition-all"
                      style={{ width: `${focus.percent}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs soft-text">Next pending task</p>
                </div>
              </>
            ) : (
              <p className="mt-2 text-sm muted-text">
                {hydrated ? "All caught up for today." : "Loading..."}
              </p>
            )}
          </div>
        </div>
      </Surface>

      <div className="grid gap-3 sm:grid-cols-3">
        <ProgressCard
          icon={Calendar}
          label="Today"
          completed={hydrated ? todayProgress.completed : 0}
          total={hydrated ? todayProgress.total : 0}
          percent={hydrated ? todayProgress.percent : 0}
        />
        <ProgressCard
          icon={TrendingUp}
          label="Month"
          completed={hydrated ? monthProgress.completed : 0}
          total={hydrated ? monthProgress.total : 0}
          percent={hydrated ? monthProgress.percent : 0}
        />
        <ProgressCard
          icon={Rocket}
          label="Year"
          completed={hydrated ? yearProgress.completed : 0}
          total={hydrated ? yearProgress.total : 0}
          percent={hydrated ? yearProgress.percent : 0}
        />
      </div>

      {recent.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 soft-text" />
            <h2 className="text-sm font-semibold text-[var(--text)]">
              Recent tasks
            </h2>
          </div>
          <Surface padding="none" className="divide-y divide-[var(--border)]">
            {recent.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between px-5 py-4 sm:px-6"
              >
                <div>
                  <p className="text-sm font-medium text-[var(--text)]">
                    {cat.title}
                  </p>
                  <p className="mt-0.5 text-xs muted-text">
                    {cat.completed}/{cat.total} completed
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 soft-text" />
              </div>
            ))}
          </Surface>
        </section>
      )}

      <Surface className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent-soft)]">
            <Flame className="h-6 w-6 accent-text" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider soft-text">
              Current streak
            </p>
            <p className="text-2xl font-semibold tabular-nums text-[var(--text)]">
              {hydrated ? store.streak.currentStreak : "-"}{" "}
              <span className="text-base font-normal muted-text">days</span>
            </p>
          </div>
        </div>
        <p className="text-xs muted-text">
          Best {hydrated ? store.streak.bestStreak : "-"} days
        </p>
      </Surface>
    </PageContainer>
  );
}

function ProgressCard({
  icon: Icon,
  label,
  completed,
  total,
  percent,
}: {
  icon: LucideIcon;
  label: string;
  completed: number;
  total: number;
  percent: number;
}) {
  return (
    <div className="surface rounded-xl border px-4 py-4">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 accent-text" />
        <p className="text-xs font-medium muted-text">{label}</p>
      </div>
      <p className="mt-3 text-2xl font-semibold tabular-nums text-[var(--text)]">
        {completed}/{total}
      </p>
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-[var(--surface-soft)]">
        <div
          className="h-full rounded-full bg-[var(--accent)]"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export const DashboardView = memo(DashboardViewInner);
