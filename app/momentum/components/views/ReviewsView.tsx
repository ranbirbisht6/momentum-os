"use client";

import { useState } from "react";
import { BookOpenCheck, ClipboardCheck, Lightbulb, Save, type LucideIcon } from "lucide-react";
import type { MomentumActions } from "../../hooks/useMomentumStore";
import { toDateKey } from "../../utils";
import { PageContainer } from "../design/PageContainer";
import { Surface } from "../design/Surface";
import { EmptyState } from "../ui/EmptyState";

const DETAIL_FIELDS = [
  "wins",
  "losses",
  "lessons",
  "habits",
  "productivity",
  "focus",
  "nextWeekPlan",
] as const;

export function ReviewsView({ actions }: { actions: MomentumActions }) {
  const [quick, setQuick] = useState("");
  const [details, setDetails] = useState({
    wins: "",
    losses: "",
    lessons: "",
    habits: "",
    productivity: "",
    focus: "",
    nextWeekPlan: "",
  });
  const [monthly, setMonthly] = useState({
    progressSummary: "",
    goalsAchieved: "",
    productivityScore: "",
  });

  const weekKey = toDateKey(new Date()).slice(0, 10);
  const monthKey = toDateKey(new Date()).slice(0, 7);

  return (
    <PageContainer className="space-y-6">
      <Surface className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]" padding="lg">
        <div>
          <span className="section-label">Weekly Review</span>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
            Close the week with signal, not guilt.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 muted-text">
            Capture wins, lessons, focus quality, and next week&apos;s plan in a calm guided flow.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <ReviewCue icon={BookOpenCheck} label="Wins" value="What worked?" />
          <ReviewCue icon={Lightbulb} label="Lessons" value="What changed?" />
          <ReviewCue icon={ClipboardCheck} label="Plan" value="What is next?" />
        </div>
      </Surface>

      <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
        <Surface className="space-y-4">
          <div>
            <span className="section-label">Quick Review</span>
            <h3 className="mt-2 text-xl font-semibold text-[var(--text)]">
              One prompt reflection
            </h3>
          </div>
          <textarea
            value={quick}
            onChange={(e) => setQuick(e.target.value)}
            rows={7}
            placeholder="What mattered most this week?"
            className="input-shell w-full resize-y rounded-2xl px-4 py-3 text-sm placeholder:text-[var(--muted-soft)]"
          />
          <button
            type="button"
            onClick={() => {
              if (!quick.trim()) return;
              actions.addWeeklyReview({
                type: "quick",
                weekKey,
                prompt: quick,
                wins: "",
                losses: "",
                lessons: "",
                habits: "",
                productivity: "",
                focus: "",
                nextWeekPlan: "",
              });
              setQuick("");
            }}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-5 text-sm font-semibold text-white"
          >
            <Save className="h-4 w-4" />
            Save quick review
          </button>
        </Surface>

        <Surface className="space-y-4">
          <div>
            <span className="section-label">Detailed Review</span>
            <h3 className="mt-2 text-xl font-semibold text-[var(--text)]">
              Guided weekly retrospective
            </h3>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {DETAIL_FIELDS.map((key) => (
              <label key={key} className={key === "nextWeekPlan" ? "md:col-span-2" : ""}>
                <span className="text-xs font-semibold uppercase tracking-[0.12em] soft-text">
                  {labelFor(key)}
                </span>
                <textarea
                  value={details[key]}
                  onChange={(e) =>
                    setDetails((current) => ({ ...current, [key]: e.target.value }))
                  }
                  rows={key === "nextWeekPlan" ? 4 : 3}
                  placeholder={promptFor(key)}
                  className="input-shell mt-2 w-full resize-y rounded-2xl px-4 py-3 text-sm placeholder:text-[var(--muted-soft)]"
                />
              </label>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              actions.addWeeklyReview({
                type: "detailed",
                weekKey,
                prompt: "Detailed weekly review",
                ...details,
              });
              setDetails({
                wins: "",
                losses: "",
                lessons: "",
                habits: "",
                productivity: "",
                focus: "",
                nextWeekPlan: "",
              });
            }}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-5 text-sm font-semibold text-white"
          >
            <Save className="h-4 w-4" />
            Save detailed review
          </button>
        </Surface>
      </div>

      <Surface className="space-y-4">
        <div>
          <span className="section-label">Monthly Review</span>
          <h3 className="mt-2 text-xl font-semibold text-[var(--text)]">
            Progress summary and productivity score
          </h3>
        </div>
        <div className="grid gap-3 md:grid-cols-[1fr_1fr_12rem]">
          <textarea
            value={monthly.progressSummary}
            onChange={(e) => setMonthly((current) => ({ ...current, progressSummary: e.target.value }))}
            rows={4}
            placeholder="Progress Summary"
            className="input-shell w-full resize-y rounded-2xl px-4 py-3 text-sm placeholder:text-[var(--muted-soft)]"
          />
          <textarea
            value={monthly.goalsAchieved}
            onChange={(e) => setMonthly((current) => ({ ...current, goalsAchieved: e.target.value }))}
            rows={4}
            placeholder="Goals Achieved"
            className="input-shell w-full resize-y rounded-2xl px-4 py-3 text-sm placeholder:text-[var(--muted-soft)]"
          />
          <input
            type="number"
            min={0}
            max={100}
            value={monthly.productivityScore}
            onChange={(e) => setMonthly((current) => ({ ...current, productivityScore: e.target.value }))}
            placeholder="Score"
            className="input-shell min-h-12 rounded-2xl px-4 text-sm"
          />
        </div>
        <button
          type="button"
          onClick={() => {
            if (!monthly.progressSummary.trim() && !monthly.goalsAchieved.trim() && !monthly.productivityScore.trim()) return;
            actions.addWeeklyReview({
              type: "monthly",
              weekKey: monthKey,
              prompt: "Monthly review",
              wins: monthly.goalsAchieved,
              losses: "",
              lessons: monthly.progressSummary,
              habits: "",
              productivity: monthly.productivityScore,
              focus: "",
              nextWeekPlan: "",
            });
            setMonthly({ progressSummary: "", goalsAchieved: "", productivityScore: "" });
          }}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-5 text-sm font-semibold text-white"
        >
          <Save className="h-4 w-4" />
          Save monthly review
        </button>
      </Surface>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-[var(--text)]">Review History</h3>
          <span className="text-sm muted-text">{actions.store.reviews.length} entries</span>
        </div>
        {actions.store.reviews.length === 0 ? (
          <EmptyState
            icon="R"
            title="No reviews yet"
            hint="Save a quick or detailed review to build a searchable history of your weekly operating rhythm."
          />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {actions.store.reviews.map((review) => (
              <Surface key={review.id} padding="sm" className="card-hover">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-[var(--text)]">
                    {review.type === "quick"
                      ? "Quick Review"
                      : review.type === "monthly"
                        ? "Monthly Review"
                        : "Detailed Review"}
                  </p>
                  <span className="rounded-full bg-[var(--surface-soft)] px-2.5 py-1 text-xs soft-text">
                    {review.weekKey}
                  </span>
                </div>
                <p className="mt-3 line-clamp-3 text-sm leading-6 muted-text">
                  {review.prompt || review.nextWeekPlan || review.wins}
                </p>
              </Surface>
            ))}
          </div>
        )}
      </section>
    </PageContainer>
  );
}

function ReviewCue({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
      <Icon className="h-5 w-5 accent-text" />
      <p className="mt-3 text-sm font-semibold text-[var(--text)]">{label}</p>
      <p className="mt-1 text-xs muted-text">{value}</p>
    </div>
  );
}

function labelFor(key: string) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase());
}

function promptFor(key: string) {
  const prompts: Record<string, string> = {
    wins: "What moved forward?",
    losses: "What drained time or energy?",
    lessons: "What did this week teach you?",
    habits: "Which habits helped or hurt?",
    productivity: "How did your systems perform?",
    focus: "When were you most focused?",
    nextWeekPlan: "What should next week protect, ship, or simplify?",
  };
  return prompts[key] ?? "Write your reflection";
}
