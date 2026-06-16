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
type PlanningCategory =
  | "personal"
  | "study"
  | "startup"
  | "career"
  | "fitness"
  | "finance"
  | "health"
  | "creative";

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

const CATEGORY_OPTIONS: { value: PlanningCategory; label: string }[] = [
  { value: "personal", label: "Personal" },
  { value: "study", label: "Study" },
  { value: "startup", label: "Startup" },
  { value: "career", label: "Career" },
  { value: "fitness", label: "Fitness" },
  { value: "finance", label: "Finance" },
  { value: "health", label: "Health" },
  { value: "creative", label: "Creative" },
];

export function AIPlanningView({ actions }: { actions: MomentumActions }) {
  const [goal, setGoal] = useState("");
  const [category, setCategory] = useState<PlanningCategory>("personal");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState<Priority>("high");
  const [hours, setHours] = useState("6");
  const [experience, setExperience] = useState<Experience>("intermediate");
  const [plan, setPlan] = useState(() =>
    buildPlan("", "personal", "high", 6, "intermediate"),
  );
  const todayKey = actions.todayKey;

  const metrics = useMemo(
    () =>
      estimatePlan(goal, category, deadline, priority, Number(hours) || 0, experience),
    [goal, category, deadline, priority, hours, experience],
  );

  const regenerate = () => {
    setPlan(buildPlan(goal, category, priority, Number(hours) || 0, experience));
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
              <span className="text-xs font-semibold uppercase tracking-[0.12em] soft-text">Category</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as PlanningCategory)}
                className="input-shell mt-2 min-h-12 w-full rounded-2xl px-4 text-sm"
              >
                {CATEGORY_OPTIONS.map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
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
                if (actions.createAiPlan(goal || "AI generated plan", category, deadline)) {
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

function buildPlan(
  goal: string,
  category: PlanningCategory,
  priority: Priority,
  hours: number,
  experience: Experience,
) {
  const title = goal.trim() || "Your goal";
  const pace = hours >= 10 ? "aggressive" : hours >= 5 ? "steady" : "light";
  const depth = experience === "beginner" ? "foundation-first" : experience === "advanced" ? "execution-heavy" : "balanced";
  const template = CATEGORY_TEMPLATES[category];
  return {
    milestones: [
      `1. Define the measurable outcome for ${title}`,
      `2. ${template.milestone}`,
      `3. Build a ${depth} execution system`,
      `4. ${template.proof}`,
    ].join("\n"),
    monthly: [
      `Month 1: ${template.monthOne}`,
      `Month 2: Execute the highest-leverage ${priority} workstreams`,
      `Month 3: ${template.monthThree}`,
    ].join("\n"),
    weekly: [
      `Plan ${pace} weekly ${template.weeklyUnit}`,
      template.weeklyAction,
      "Review blockers, update metrics, and prepare next week",
    ].join("\n"),
    daily: [
      template.dailyAction,
      template.dailyAdmin,
      "Log progress and choose tomorrow's next action",
    ].join("\n"),
  };
}

function estimatePlan(
  goal: string,
  category: PlanningCategory,
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
    !goal.trim() ? "Goal clarity is still low." : CATEGORY_TEMPLATES[category].risk,
  ];
  const bottlenecks = [
    CATEGORY_TEMPLATES[category].bottleneck,
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

const CATEGORY_TEMPLATES: Record<
  PlanningCategory,
  {
    milestone: string;
    proof: string;
    monthOne: string;
    monthThree: string;
    weeklyUnit: string;
    weeklyAction: string;
    dailyAction: string;
    dailyAdmin: string;
    risk: string;
    bottleneck: string;
  }
> = {
  personal: {
    milestone: "Clarify habits, constraints, and personal success metrics",
    proof: "Complete a visible personal progress checkpoint",
    monthOne: "Build routines, reduce friction, and set a tracking cadence",
    monthThree: "Review behavior change and stabilize the system",
    weeklyUnit: "focus blocks",
    weeklyAction: "Complete one meaningful personal milestone slice",
    dailyAction: "Take one visible personal action",
    dailyAdmin: "Remove one source of friction",
    risk: "Competing life priorities can dilute consistency.",
    bottleneck: "Unclear personal success metric",
  },
  study: {
    milestone: "Map the syllabus, weak areas, and exam-style output",
    proof: "Complete a timed practice checkpoint",
    monthOne: "Diagnose weak topics and build a revision calendar",
    monthThree: "Run mocks, analyze mistakes, and tighten recall",
    weeklyUnit: "study blocks",
    weeklyAction: "Finish one module and one practice set",
    dailyAction: "Complete one focused study session",
    dailyAdmin: "Review flashcards or mistake notes",
    risk: "Passive reading may replace active recall.",
    bottleneck: "Weak feedback loop after practice",
  },
  startup: {
    milestone: "Validate the customer, problem, and wedge",
    proof: "Ship or demo a testable MVP slice",
    monthOne: "Interview users, scope the wedge, and define traction metrics",
    monthThree: "Ship, measure usage, and iterate toward retention",
    weeklyUnit: "build/sell blocks",
    weeklyAction: "Ship one product slice or customer learning",
    dailyAction: "Complete one build or customer development action",
    dailyAdmin: "Update assumptions and metrics",
    risk: "Building too much before validation can slow learning.",
    bottleneck: "Unvalidated customer problem",
  },
  career: {
    milestone: "Define target role, gap map, and positioning",
    proof: "Complete a portfolio, resume, or interview checkpoint",
    monthOne: "Audit skills, sharpen positioning, and set outreach targets",
    monthThree: "Interview, negotiate, or publish career proof",
    weeklyUnit: "career blocks",
    weeklyAction: "Finish one skill, portfolio, or outreach milestone",
    dailyAction: "Complete one skill or outreach action",
    dailyAdmin: "Update resume, tracker, or portfolio notes",
    risk: "Unfocused applications can create low-quality volume.",
    bottleneck: "Weak role positioning",
  },
  fitness: {
    milestone: "Set baseline metrics, routine, and recovery plan",
    proof: "Complete a measurable body or performance checkpoint",
    monthOne: "Stabilize training, nutrition, sleep, and baseline tracking",
    monthThree: "Measure adaptation and adjust training load",
    weeklyUnit: "training blocks",
    weeklyAction: "Complete the planned workouts and recovery checks",
    dailyAction: "Complete training, steps, or mobility target",
    dailyAdmin: "Log meals, sleep, or recovery",
    risk: "Overtraining or inconsistent recovery can stall progress.",
    bottleneck: "Poor recovery and tracking consistency",
  },
  finance: {
    milestone: "Map income, expenses, debt, and investment priorities",
    proof: "Complete a budget, savings, or payoff checkpoint",
    monthOne: "Build the baseline budget and automate tracking",
    monthThree: "Review cashflow, rebalance goals, and reduce leakage",
    weeklyUnit: "finance review blocks",
    weeklyAction: "Complete one budget, savings, or investment action",
    dailyAction: "Track one money decision or transaction category",
    dailyAdmin: "Review spend and update the tracker",
    risk: "Untracked small expenses can quietly break the plan.",
    bottleneck: "Incomplete cashflow visibility",
  },
  health: {
    milestone: "Define symptoms, habits, appointments, and care routines",
    proof: "Complete a measurable health habit checkpoint",
    monthOne: "Stabilize sleep, movement, nutrition, and care schedule",
    monthThree: "Review biomarkers, symptoms, and habit consistency",
    weeklyUnit: "health blocks",
    weeklyAction: "Complete one care routine or health review",
    dailyAction: "Complete one core health habit",
    dailyAdmin: "Log symptoms, energy, or recovery",
    risk: "Ignoring recovery signals can create setbacks.",
    bottleneck: "Inconsistent tracking of health signals",
  },
  creative: {
    milestone: "Define the creative brief, output cadence, and feedback loop",
    proof: "Publish or present a finished creative slice",
    monthOne: "Build the concept, references, and production rhythm",
    monthThree: "Ship a polished body of work and gather feedback",
    weeklyUnit: "creation blocks",
    weeklyAction: "Finish one draft, iteration, or published piece",
    dailyAction: "Create one focused draft or revision",
    dailyAdmin: "Capture references and update the idea queue",
    risk: "Perfectionism can block shipping.",
    bottleneck: "Lack of feedback and publishing cadence",
  },
};
