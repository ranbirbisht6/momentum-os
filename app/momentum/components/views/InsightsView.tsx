"use client";

import { memo, useEffect, useMemo, useState } from "react";
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

function InsightsViewInner({ actions }: { actions: MomentumActions }) {
  const { store, hydrated, setNotes } = actions;
  const [notes, setLocalNotes] = useState("");

  useEffect(() => {
    if (hydrated) setLocalNotes(store.notes);
  }, [hydrated, store.notes]);

  useEffect(() => {
    if (!hydrated) return;
    const t = window.setTimeout(() => setNotes(notes), 400);
    return () => clearTimeout(t);
  }, [notes, hydrated, setNotes]);

  const weekly = useMemo(() => (hydrated ? weeklyCompletionRate(store) : []), [hydrated, store]);
  const monthly = useMemo(() => (hydrated ? monthlyCompletionRate(store) : []), [hydrated, store]);

  return (
    <PageContainer className="space-y-10">
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-zinc-400">Notes</h2>
        <textarea
          value={notes}
          onChange={(e) => setLocalNotes(e.target.value)}
          rows={6}
          placeholder="Capture ideas, reflections, or planning notes…"
          className="w-full resize-y rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-sm text-zinc-300 placeholder:text-zinc-600 outline-none focus:border-violet-500/20"
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-zinc-400">Streaks</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Surface className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/10">
              <Flame className="h-5 w-5 text-orange-400" />
            </div>
            <div>
              <p className="text-xs text-zinc-500">Current streak</p>
              <p className="text-2xl font-semibold tabular-nums text-zinc-100">
                {hydrated ? store.streak.currentStreak : "—"}{" "}
                <span className="text-sm font-normal text-zinc-500">days</span>
              </p>
            </div>
          </Surface>
          <Surface className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10">
              <TrendingUp className="h-5 w-5 text-violet-400" />
            </div>
            <div>
              <p className="text-xs text-zinc-500">Best streak</p>
              <p className="text-2xl font-semibold tabular-nums text-zinc-100">
                {hydrated ? store.streak.bestStreak : "—"}{" "}
                <span className="text-sm font-normal text-zinc-500">days</span>
              </p>
            </div>
          </Surface>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-medium text-zinc-400">Achievements</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {BADGES.map((badge) => {
            const unlocked = store.streak.unlockedBadges.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${
                  unlocked
                    ? "border-emerald-500/20 bg-emerald-500/5"
                    : "border-white/[0.06] opacity-50"
                }`}
              >
                {unlocked ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                ) : (
                  <Award className="h-4 w-4 shrink-0 text-zinc-600" />
                )}
                <div>
                  <p className="text-sm font-medium text-zinc-300">{badge.name}</p>
                  <p className="text-xs text-zinc-600">{badge.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-medium text-zinc-400">Completion history</h2>
        <div className="space-y-6">
          <div>
            <p className="mb-2 text-xs text-zinc-600">Weekly</p>
            <Surface padding="sm">
              <BarChart data={weekly} gradient="from-violet-500/80 to-violet-600/80" />
            </Surface>
          </div>
          <div>
            <p className="mb-2 text-xs text-zinc-600">Monthly</p>
            <Surface padding="sm">
              <BarChart data={monthly} gradient="from-cyan-500/80 to-cyan-600/80" />
            </Surface>
          </div>
        </div>
      </section>
    </PageContainer>
  );
}

export const InsightsView = memo(InsightsViewInner);
