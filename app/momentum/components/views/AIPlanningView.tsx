"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  Clock,
  Save,
  Sparkles,
  Wand2,
  type LucideIcon,
} from "lucide-react";
import type { MomentumActions } from "../../hooks/useMomentumStore";
import type { Priority } from "../../types";
import { PageContainer } from "../design/PageContainer";
import { Surface } from "../design/Surface";

type Experience = "beginner" | "intermediate" | "advanced";

const PRIORITY_OPTIONS: { value: Priority; label: string }[] = [
  { value: "critical", label: "Critical" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

const EXPERIENCE_OPTIONS: { value: Experience; label: string }[] = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

export function AIPlanningView({ actions }: { actions: MomentumActions }) {
  const [goal, setGoal] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState<Priority>("high");
  const [hours, setHours] = useState("6");
  const [experience, setExperience] = useState<Experience>("intermediate");
  const [plan, setPlan] = useState(() => buildPlan("", "high", 6, "intermediate"));
  const todayKey = actions.todayKey;

  const metrics = useMemo(
    () => estimatePlan(goal, deadline, priority, Number(hours) || 0, experience),
    [goal, deadline, priority, hours, experience],
  );

  const regenerate = () => {
    setPlan(buildPlan(goal, priority, Number(hours) || 0, experience));
  };

  return (
    <PageContainer className="space-y-6">
      <Surface className="grid gap-7 xl:grid-cols-[0.9fr_1.1fr]" padding="lg">
        <div className="space-y-5">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[var(--accent-soft)]">
            <Sparkles className="h-6 w-6 accent-text" />
          </div>
          <div>
            <span className="section-label">AI Planning</span>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
              Build an editable execution roadmap.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 muted-text">
              Generate a local planning blueprint from goal constraints now; the same UX can connect to a real AI service later.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Metric icon={BarChart3} label="Completion Chance" value={`${metrics.chance}%`} />
            <Metric icon={Clock} label="Suggested Hours" value={`${metrics.suggestedHours}/wk`} />
            <Metric icon={AlertTriangle} label="Risk Level" value={metrics.riskLevel} />
          </div>
        </div>

        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
          <div className="grid gap-3 md:grid-cols-2">
            <label className="md:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] soft-text">Goal</span>
              <input
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="Build Startup, Learn AI, MBA Preparation..."
                className="input-shell mt-2 min-h-12 w-full rounded-2xl px-4 text-sm placeholder:text-[var(--muted-soft)]"
              />
            </label>
            <label>
              <span className="text-xs font-semibold uppercase tracking-[0.12em] soft-text">Deadline</span>
              <input
                type="date"
                min={todayKey}
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="input-shell mt-2 min-h-12 w-full rounded-2xl px-4 text-sm"
              />
            </label>
            <label>
              <span className="text-xs font-semibold uppercase tracking-[0.12em] soft-text">Priority</span>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="input-shell mt-2 min-h-12 w-full rounded-2xl px-4 text-sm"
              >
                {PRIORITY_OPTIONS.map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
            </label>
            <label>
              <span className="text-xs font-semibold uppercase tracking-[0.12em] soft-text">Available hours/week</span>
              <input
                type="number"
                min={1}
                max={80}
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="input-shell mt-2 min-h-12 w-full rounded-2xl px-4 text-sm"
              />
            </label>
            <label>
              <span className="text-xs font-semibold uppercase tracking-[0.12em] soft-text">Experience</span>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value as Experience)}
                className="input-shell mt-2 min-h-12 w-full rounded-2xl px-4 text-sm"
              >
                {EXPERIENCE_OPTIONS.map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={regenerate}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]"
            >
              <Wand2 className="h-4 w-4" />
              Generate plan
            </button>
            <button
              type="button"
              onClick={() => {
                if (actions.createAiPlan(goal || "AI generated plan")) {
                  setGoal("");
                }
              }}
              disabled={!goal.trim()}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-[var(--border)] px-5 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface)] disabled:opacity-40"
            >
              <Save className="h-4 w-4" />
              Save to Momentum
            </button>
          </div>
        </div>
      </Surface>

      <section className="grid gap-5 xl:grid-cols-[1fr_0.8fr]">
        <div className="grid gap-5">
          <EditablePlanSection title="Milestones" value={plan.milestones} onChange={(value) => setPlan((current) => ({ ...current, milestones: value }))} />
          <EditablePlanSection title="Monthly Plan" value={plan.monthly} onChange={(value) => setPlan((current) => ({ ...current, monthly: value }))} />
          <EditablePlanSection title="Weekly Plan" value={plan.weekly} onChange={(value) => setPlan((current) => ({ ...current, weekly: value }))} />
          <EditablePlanSection title="Daily Tasks" value={plan.daily} onChange={(value) => setPlan((current) => ({ ...current, daily: value }))} />
        </div>

        <div className="grid gap-5 content-start">
          <InsightPanel title="Risk Factors" items={metrics.risks} />
          <InsightPanel title="Likely Bottlenecks" items={metrics.bottlenecks} />
        </div>
      </section>
    </PageContainer>
  );
}

function Metric({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
      <Icon className="h-4 w-4 accent-text" />
      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] soft-text">{label}</p>
      <p className="stat-value mt-2 text-2xl font-semibold text-[var(--text)]">{value}</p>
    </div>
  );
}

function EditablePlanSection({
  title,
  value,
  onChange,
}: {
  title: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Surface className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-[var(--text)]">{title}</h3>
        <span className="rounded-full bg-[var(--surface-soft)] px-2.5 py-1 text-xs soft-text">Editable</span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        className="input-shell w-full resize-y rounded-2xl px-4 py-3 text-sm leading-6"
      />
    </Surface>
  );
}

function InsightPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <Surface className="space-y-3">
      <h3 className="text-base font-semibold text-[var(--text)]">{title}</h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-sm muted-text">
            {item}
          </li>
        ))}
      </ul>
    </Surface>
  );
}

function buildPlan(goal: string, priority: Priority, hours: number, experience: Experience) {
  const title = goal.trim() || "Your goal";
  const pace = hours >= 10 ? "aggressive" : hours >= 5 ? "steady" : "light";
  const depth = experience === "beginner" ? "foundation-first" : experience === "advanced" ? "execution-heavy" : "balanced";
  return {
    milestones: [
      `1. Define the measurable outcome for ${title}`,
      `2. Build a ${depth} operating system`,
      "3. Complete the first proof of progress",
      "4. Review, refine, and scale the plan",
    ].join("\n"),
    monthly: [
      "Month 1: Clarify scope, setup routines, and complete core foundations",
      `Month 2: Execute the highest-leverage ${priority} workstreams`,
      "Month 3: Consolidate progress, remove bottlenecks, and ship outcomes",
    ].join("\n"),
    weekly: [
      `Plan ${pace} weekly focus blocks`,
      "Complete one milestone slice",
      "Review blockers, update metrics, and prepare next week",
    ].join("\n"),
    daily: [
      "One deep work session",
      "One small admin or follow-up action",
      "Log progress and choose tomorrow's next action",
    ].join("\n"),
  };
}

function estimatePlan(
  goal: string,
  deadline: string,
  priority: Priority,
  hours: number,
  experience: Experience,
) {
  const priorityWeight = priority === "critical" ? 8 : priority === "high" ? 5 : priority === "medium" ? 2 : 0;
  const experienceWeight = experience === "advanced" ? 14 : experience === "intermediate" ? 8 : 2;
  const deadlinePressure = deadline
    ? Math.max(0, 18 - Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000 / 7))
    : 8;
  const chance = Math.max(18, Math.min(94, 48 + experienceWeight + Math.min(hours, 18) * 2 - deadlinePressure + priorityWeight));
  const suggestedHours = Math.max(4, Math.min(20, Math.round((100 - chance) / 8 + hours)));
  const risks = [
    deadline ? "Deadline pressure may compress planning time." : "No deadline can reduce urgency.",
    hours < 5 ? "Available hours are low for meaningful weekly progress." : "Protect the weekly hours from meetings and admin.",
    !goal.trim() ? "Goal clarity is still low." : "Scope creep can dilute the plan.",
  ];
  const bottlenecks = [
    "Unclear success metric",
    "Too many parallel priorities",
    experience === "beginner" ? "Learning curve before execution" : "Decision fatigue during execution",
  ];
  return {
    chance,
    suggestedHours,
    riskLevel: chance >= 75 ? "Low" : chance >= 52 ? "Medium" : "High",
    risks,
    bottlenecks,
  };
}
