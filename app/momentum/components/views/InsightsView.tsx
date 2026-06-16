"use client";

import { memo, useEffect, useMemo, useState, type ReactNode } from "react";
import { Award, CheckCircle2, Flame, TrendingUp } from "lucide-react";
import { BADGES } from "../../constants";
import {
  monthlyCompletionRate,
  weeklyCompletionRate,
} from "../../lib/insightsMetrics";
import type { MomentumActions } from "../../hooks/useMomentumStore";
import { PageContainer } from "../design/PageContainer";
import { Surface } from "../design/Surface";
import { BarChart } from "../ui/BarChart";

function InsightsViewInner({
  actions,
  analyticsOnly = false,
}: {
  actions: MomentumActions;
  analyticsOnly?: boolean;
}) {
  const { store, hydrated, setNotes } = actions;
  const [notes, setLocalNotes] = useState("");

  useEffect(() => {
    if (!hydrated) return;
    const id = window.setTimeout(() => setLocalNotes(store.notes), 0);
    return () => window.clearTimeout(id);
  }, [hydrated, store.notes]);

  useEffect(() => {
    if (!hydrated || analyticsOnly) return;
    const t = window.setTimeout(() => setNotes(notes), 400);
    return () => window.clearTimeout(t);
  }, [notes, hydrated, setNotes, analyticsOnly]);

  const weekly = useMemo(
    () => (hydrated ? weeklyCompletionRate(store) : []),
    [hydrated, store],
  );
  const monthly = useMemo(
    () => (hydrated ? monthlyCompletionRate(store) : []),
    [hydrated, store],
  );

  if (analyticsOnly) {
    return (
      <PageContainer className="space-y-8">
        <section className="grid gap-3 sm:grid-cols-2">
          <Surface>
            <p className="text-xs font-semibold uppercase tracking-wider soft-text">
              Weekly rate
            </p>
            <p className="mt-2 text-3xl font-semibold tabular-nums text-[var(--text)]">
              {weekly.at(-1)?.percent ?? 0}%
            </p>
            <p className="mt-1 text-sm muted-text">
              Latest daily completion snapshot.
            </p>
          </Surface>
          <Surface>
            <p className="text-xs font-semibold uppercase tracking-wider soft-text">
              Monthly rate
            </p>
            <p className="mt-2 text-3xl font-semibold tabular-nums text-[var(--text)]">
              {monthly.at(-1)?.percent ?? 0}%
            </p>
            <p className="mt-1 text-sm muted-text">
              Current month progress snapshot.
            </p>
          </Surface>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-[var(--text)]">
            Completion history
          </h2>
          <div className="grid gap-4 lg:grid-cols-2">
            <Surface padding="sm">
              <p className="mb-4 text-xs soft-text">Weekly</p>
              <BarChart data={weekly} />
            </Surface>
            <Surface padding="sm">
              <p className="mb-4 text-xs soft-text">Monthly</p>
              <BarChart data={monthly} />
            </Surface>
          </div>
        </section>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="space-y-10">
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-[var(--text)]">Notes</h2>
        <textarea
          value={notes}
          onChange={(e) => setLocalNotes(e.target.value)}
          rows={6}
          placeholder="Capture ideas, reflections, or planning notes..."
          className="w-full resize-y rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none placeholder:text-[var(--muted-soft)] focus:border-[var(--accent)]"
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-[var(--text)]">Streaks</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Surface className="flex items-center gap-4">
            <MetricIcon>
              <Flame className="h-5 w-5 accent-text" />
            </MetricIcon>
            <div>
              <p className="text-xs muted-text">Current streak</p>
              <p className="text-2xl font-semibold tabular-nums text-[var(--text)]">
                {hydrated ? store.streak.currentStreak : "-"}{" "}
                <span className="text-sm font-normal muted-text">days</span>
              </p>
            </div>
          </Surface>
          <Surface className="flex items-center gap-4">
            <MetricIcon>
              <TrendingUp className="h-5 w-5 accent-text" />
            </MetricIcon>
            <div>
              <p className="text-xs muted-text">Best streak</p>
              <p className="text-2xl font-semibold tabular-nums text-[var(--text)]">
                {hydrated ? store.streak.bestStreak : "-"}{" "}
                <span className="text-sm font-normal muted-text">days</span>
              </p>
            </div>
          </Surface>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-[var(--text)]">Achievements</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {BADGES.map((badge) => {
            const unlocked = store.streak.unlockedBadges.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${
                  unlocked
                    ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                    : "border-[var(--border)] opacity-55"
                }`}
              >
                {unlocked ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 accent-text" />
                ) : (
                  <Award className="h-4 w-4 shrink-0 soft-text" />
                )}
                <div>
                  <p className="text-sm font-medium text-[var(--text)]">
                    {badge.name}
                  </p>
                  <p className="text-xs muted-text">{badge.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-[var(--text)]">
          Completion history
        </h2>
        <div className="space-y-6">
          <div>
            <p className="mb-2 text-xs soft-text">Weekly</p>
            <Surface padding="sm">
              <BarChart data={weekly} />
            </Surface>
          </div>
          <div>
            <p className="mb-2 text-xs soft-text">Monthly</p>
            <Surface padding="sm">
              <BarChart data={monthly} />
            </Surface>
          </div>
        </div>
      </section>
    </PageContainer>
  );
}

function MetricIcon({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)]">
      {children}
    </div>
  );
}

export const InsightsView = memo(InsightsViewInner);
