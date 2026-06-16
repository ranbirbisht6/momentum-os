"use client";

import { useState } from "react";
import { Check, Flag, Plus, Target, Trophy } from "lucide-react";
import type { MomentumActions } from "../../hooks/useMomentumStore";
import type { Goal, GoalMilestone } from "../../types";
import { PageContainer } from "../design/PageContainer";
import { Surface } from "../design/Surface";
import { EmptyState } from "../ui/EmptyState";

export function GoalsView({ actions }: { actions: MomentumActions }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Personal");

  return (
    <PageContainer className="space-y-6">
      <Surface className="grid gap-6 lg:grid-cols-[1fr_0.9fr]" padding="lg">
        <div>
          <span className="section-label">Goals System</span>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
            Turn outcomes into weekly execution.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 muted-text">
            Goals decompose into milestones, monthly targets, weekly targets, and daily actions so ambition has a visible operating rhythm.
          </p>
        </div>
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
          <div className="grid gap-3">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Lose 20kg, MBA Preparation, Build Startup..."
              className="input-shell min-h-12 rounded-2xl px-4 text-sm placeholder:text-[var(--muted-soft)]"
            />
            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Category"
                className="input-shell min-h-12 rounded-2xl px-4 text-sm"
              />
              <button
                type="button"
                onClick={() => {
                  if (actions.createGoal(title, "", category)) setTitle("");
                }}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]"
              >
                <Plus className="h-4 w-4" />
                Create Goal
              </button>
            </div>
          </div>
        </div>
      </Surface>

      {actions.store.goals.length === 0 ? (
        <EmptyState
          icon="G"
          title="No goals yet"
          hint="Create your first goal and Momentum will build the milestone, monthly, weekly, and daily execution structure."
        />
      ) : (
        <div className="grid gap-5 xl:grid-cols-2">
          {actions.store.goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onToggle={(milestoneId) =>
                actions.toggleGoalMilestone(goal.id, milestoneId)
              }
            />
          ))}
        </div>
      )}
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
  const firstMilestone = goal.milestones[0];

  return (
    <Surface className="space-y-6 card-hover">
      <div className="flex items-start justify-between gap-5">
        <div className="min-w-0">
          <span className="section-label">{goal.category}</span>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--text)]">
            {goal.title}
          </h3>
          <p className="mt-2 text-sm muted-text">
            {done} of {total} milestones complete
          </p>
        </div>
        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-[var(--accent-soft)]">
          <span className="stat-value text-xl font-semibold accent-text">{percent}%</span>
        </div>
      </div>

      <div>
        <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-soft)]">
          <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${percent}%` }} />
        </div>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {["Goal", "Milestones", "Targets", "Actions"].map((label, index) => (
            <div key={label} className={`h-1 rounded-full ${index === 0 || percent > index * 25 ? "bg-[var(--accent)]" : "bg-[var(--surface-soft)]"}`} />
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {goal.milestones.map((milestone) => (
          <MilestoneCard key={milestone.id} milestone={milestone} onToggle={onToggle} />
        ))}
      </div>

      {firstMilestone && (
        <div className="grid gap-3 border-t border-[var(--border)] pt-5 md:grid-cols-3">
          <PlanColumn title="Monthly Targets" items={firstMilestone.monthlyTargets.map((item) => item.title)} />
          <PlanColumn title="Weekly Targets" items={firstMilestone.weeklyTargets.map((item) => item.title)} />
          <PlanColumn title="Daily Actions" items={firstMilestone.dailyActions.map((item) => item.title)} />
        </div>
      )}
    </Surface>
  );
}

function MilestoneCard({
  milestone,
  onToggle,
}: {
  milestone: GoalMilestone;
  onToggle: (milestoneId: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onToggle(milestone.id)}
      className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4 text-left transition hover:border-[var(--accent)]"
    >
      <div className="flex items-start gap-3">
        <span
          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border ${
            milestone.completed
              ? "border-[var(--accent)] bg-[var(--accent)] text-white"
              : "border-[var(--border-strong)] bg-[var(--surface)]"
          }`}
        >
          {milestone.completed && <Check className="h-3.5 w-3.5" />}
        </span>
        <div className="min-w-0">
          <p className={`text-sm font-semibold ${milestone.completed ? "text-[var(--muted-soft)] line-through" : "text-[var(--text)]"}`}>
            {milestone.title}
          </p>
          <p className="mt-2 flex items-center gap-1 text-xs muted-text">
            <Flag className="h-3.5 w-3.5" />
            {milestone.monthlyTargets.length} monthly / {milestone.weeklyTargets.length} weekly / {milestone.dailyActions.length} daily
          </p>
        </div>
      </div>
    </button>
  );
}

function PlanColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
      <div className="flex items-center gap-2">
        {title === "Daily Actions" ? (
          <Target className="h-4 w-4 accent-text" />
        ) : (
          <Trophy className="h-4 w-4 accent-text" />
        )}
        <p className="text-xs font-semibold uppercase tracking-[0.12em] soft-text">{title}</p>
      </div>
      <ul className="mt-3 space-y-2">
        {items.slice(0, 3).map((item) => (
          <li key={item} className="text-sm text-[var(--text)]">{item}</li>
        ))}
      </ul>
    </div>
  );
}
