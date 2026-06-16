"use client";

import { useState } from "react";
import { Check, Flag, Plus } from "lucide-react";
import type { MomentumActions } from "../../hooks/useMomentumStore";
import type { Goal } from "../../types";
import { PageContainer } from "../design/PageContainer";
import { Surface } from "../design/Surface";

export function GoalsView({ actions }: { actions: MomentumActions }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Personal");

  return (
    <PageContainer className="space-y-6">
      <Surface>
        <div className="grid gap-3 md:grid-cols-[1fr_12rem_auto]">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Lose 20kg, MBA Preparation, Build Startup..."
            className="min-h-11 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--text)] outline-none placeholder:text-[var(--muted-soft)] focus:border-[var(--accent)]"
          />
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category"
            className="min-h-11 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
          />
          <button
            type="button"
            onClick={() => {
              if (actions.createGoal(title, "", category)) setTitle("");
            }}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[var(--accent)] px-4 text-sm font-semibold text-white"
          >
            <Plus className="h-4 w-4" />
            Goal
          </button>
        </div>
      </Surface>

      <div className="grid gap-4 lg:grid-cols-2">
        {actions.store.goals.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            onToggle={(milestoneId) =>
              actions.toggleGoalMilestone(goal.id, milestoneId)
            }
          />
        ))}
        {actions.store.goals.length === 0 && (
          <Surface className="lg:col-span-2">
            <p className="text-sm muted-text">
              Create a goal and Momentum will break it into milestones, monthly
              targets, weekly targets, and daily actions.
            </p>
          </Surface>
        )}
      </div>
    </PageContainer>
  );
}

function GoalCard({
  goal,
  onToggle,
}: {
  goal: Goal;
  onToggle: (milestoneId: string) => void;
}) {
  const total = goal.milestones.length;
  const done = goal.milestones.filter((m) => m.completed).length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <Surface className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider soft-text">
            {goal.category}
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-[var(--text)]">
            {goal.title}
          </h2>
        </div>
        <div className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-sm font-semibold accent-text">
          {percent}%
        </div>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-[var(--surface-soft)]">
        <div className="h-full bg-[var(--accent)]" style={{ width: `${percent}%` }} />
      </div>
      <div className="space-y-3">
        {goal.milestones.map((milestone) => (
          <div key={milestone.id} className="rounded-lg border border-[var(--border)] p-3">
            <button
              type="button"
              onClick={() => onToggle(milestone.id)}
              className="flex w-full items-start gap-2 text-left"
            >
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                  milestone.completed
                    ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                    : "border-[var(--border-strong)]"
                }`}
              >
                {milestone.completed && <Check className="h-3 w-3" />}
              </span>
              <span className="font-medium text-[var(--text)]">{milestone.title}</span>
            </button>
            <div className="mt-3 grid gap-2 text-xs muted-text sm:grid-cols-3">
              <span className="inline-flex items-center gap-1">
                <Flag className="h-3 w-3" />
                {milestone.monthlyTargets.length} monthly
              </span>
              <span>{milestone.weeklyTargets.length} weekly</span>
              <span>{milestone.dailyActions.length} daily actions</span>
            </div>
          </div>
        ))}
      </div>
    </Surface>
  );
}
