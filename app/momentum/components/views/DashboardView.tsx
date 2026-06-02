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
} from "lucide-react";
import { buildAssistantInsights } from "../../lib/assistant";
import { getRecentCategories } from "../../lib/dashboard";
import { resolveUserName } from "../../lib/user";
import type { MomentumActions } from "../../hooks/useMomentumStore";
import {
  aggregateProgress,
  flattenAnnualSubtasks,
  flattenDailySubtasks,
  flattenMonthlySubtasks,
  pickTodayFocus,
} from "../../utils";
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
      aggregateProgress(
        flattenMonthlySubtasks(store.monthlyCategories, currentMonthKey),
      ),
    [store.monthlyCategories, currentMonthKey],
  );

  const yearProgress = useMemo(
    () =>
      aggregateProgress(
        flattenAnnualSubtasks(store.annualCategories, currentYear),
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
          <Target className="mt-0.5 h-5 w-5 text-violet-400" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Today&apos;s focus
            </p>
            {focus ? (
              <>
                <p className="mt-2 text-lg font-medium text-zinc-100">
                  {focus.categoryTitle}
                </p>
                <p className="mt-1 text-sm text-cyan-400/90">{focus.subtaskTitle}</p>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <span>Completion</span>
                    <span>{focus.percent}%</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500/80 transition-all"
                      style={{ width: `${focus.percent}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-zinc-500">Next pending task</p>
                </div>
              </>
            ) : (
              <p className="mt-2 text-sm text-zinc-500">
                {hydrated ? "All caught up for today." : "Loading…"}
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
            <Layers className="h-4 w-4 text-zinc-500" />
            <h2 className="text-sm font-medium text-zinc-400">Recent categories</h2>
          </div>
          <Surface padding="none" className="divide-y divide-white/[0.06]">
            {recent.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between px-5 py-4 sm:px-6"
              >
                <div>
                  <p className="text-sm font-medium text-zinc-200">{cat.title}</p>
                  <p className="mt-0.5 text-xs text-zinc-500">
                    {cat.completed}/{cat.total} completed
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-zinc-600" />
              </div>
            ))}
          </Surface>
        </section>
      )}

      <Surface className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10">
            <Flame className="h-6 w-6 text-orange-400" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-zinc-500">
              Current streak
            </p>
            <p className="text-2xl font-semibold tabular-nums text-zinc-100">
              {hydrated ? store.streak.currentStreak : "—"}{" "}
              <span className="text-base font-normal text-zinc-500">days</span>
            </p>
          </div>
        </div>
        <p className="text-xs text-zinc-600">
          Best {hydrated ? store.streak.bestStreak : "—"} days
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
  icon: typeof Calendar;
  label: string;
  completed: number;
  total: number;
  percent: number;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-4">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-violet-400/80" />
        <p className="text-xs font-medium text-zinc-500">{label}</p>
      </div>
      <p className="mt-3 text-2xl font-semibold tabular-nums text-zinc-100">
        {completed}/{total}
      </p>
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-zinc-800">
        <div
          className="h-full rounded-full bg-violet-500/70"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export const DashboardView = memo(DashboardViewInner);
