"use client";

import { useMemo, useState } from "react";
import { ArrowRight, CalendarCheck, CheckCircle2, Sparkles, Wand2, type LucideIcon } from "lucide-react";
import type { MomentumActions } from "../../hooks/useMomentumStore";
import { PageContainer } from "../design/PageContainer";
import { Surface } from "../design/Surface";

export function AIPlanningView({ actions }: { actions: MomentumActions }) {
  const [prompt, setPrompt] = useState("");
  const preview = useMemo(() => buildPreview(prompt), [prompt]);

  return (
    <PageContainer className="space-y-6">
      <Surface className="grid gap-7 lg:grid-cols-[0.95fr_1.05fr]" padding="lg">
        <div className="space-y-5">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[var(--accent-soft)]">
            <Sparkles className="h-6 w-6 accent-text" />
          </div>
          <div>
            <span className="section-label">AI Planning</span>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
              Generate a roadmap you can actually execute.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 muted-text">
              This is a polished local planning workflow today, designed so real AI generation can plug in later without changing the user experience.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
          <label className="text-sm font-semibold text-[var(--text)]" htmlFor="ai-goal">
            Goal Input
          </label>
          <textarea
            id="ai-goal"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={6}
            placeholder="Build Startup, Learn AI, MBA Preparation, Lose 20kg..."
            className="input-shell mt-3 w-full resize-y rounded-2xl px-4 py-3 text-sm placeholder:text-[var(--muted-soft)]"
          />
          <button
            type="button"
            onClick={() => {
              if (actions.createAiPlan(prompt)) setPrompt("");
            }}
            disabled={!prompt.trim()}
            className="mt-3 inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)] disabled:opacity-40"
          >
            <Wand2 className="h-4 w-4" />
            Generate Roadmap
          </button>
        </div>
      </Surface>

      <section className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <Surface className="space-y-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="section-label">Generated Roadmap</span>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--text)]">
                {preview.goal}
              </h3>
            </div>
            <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold accent-text">
              MVP local
            </span>
          </div>
          <div className="space-y-3">
            {preview.milestones.map((milestone, index) => (
              <div key={milestone} className="flex gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[var(--surface)] text-sm font-semibold accent-text">
                  {index + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-[var(--text)]">{milestone}</p>
                  <p className="mt-1 text-xs muted-text">Milestone with weekly and daily execution below.</p>
                </div>
              </div>
            ))}
          </div>
        </Surface>

        <div className="grid gap-5">
          <PlanPanel title="Weekly Plan" icon={CalendarCheck} items={preview.weekly} />
          <PlanPanel title="Daily Actions" icon={CheckCircle2} items={preview.daily} />
        </div>
      </section>

      <Surface className="space-y-4">
        <span className="section-label">Execution Flow</span>
        <div className="grid gap-3 md:grid-cols-4">
          {["Goal", "Milestones", "Weekly Plan", "Daily Actions"].map((label, index, items) => (
            <div key={label} className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
              <span className="text-sm font-semibold text-[var(--text)]">{label}</span>
              {index < items.length - 1 && <ArrowRight className="ml-auto hidden h-4 w-4 soft-text md:block" />}
            </div>
          ))}
        </div>
      </Surface>
    </PageContainer>
  );
}

function PlanPanel({
  title,
  icon: Icon,
  items,
}: {
  title: string;
  icon: LucideIcon;
  items: string[];
}) {
  return (
    <Surface className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--accent-soft)]">
          <Icon className="h-4 w-4 accent-text" />
        </div>
        <h3 className="text-base font-semibold text-[var(--text)]">{title}</h3>
      </div>
      <ul className="grid gap-2">
        {items.map((item) => (
          <li key={item} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-sm text-[var(--text)]">
            {item}
          </li>
        ))}
      </ul>
    </Surface>
  );
}

function buildPreview(prompt: string) {
  const goal = prompt.trim() || "Build a meaningful goal";
  return {
    goal,
    milestones: [
      `Clarify the outcome for ${goal}`,
      "Design the system and success metrics",
      "Ship proof of progress",
      "Review, refine, and scale",
    ],
    weekly: [
      "Choose one measurable milestone slice",
      "Block two focused execution sessions",
      "Review blockers and adjust the plan",
    ],
    daily: [
      "Complete one deep work action",
      "Log progress in Momentum",
      "Prepare the next action before shutdown",
    ],
  };
}
