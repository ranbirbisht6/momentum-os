"use client";

import { useState } from "react";
import type { MomentumActions } from "../../hooks/useMomentumStore";
import { toDateKey } from "../../utils";
import { PageContainer } from "../design/PageContainer";
import { Surface } from "../design/Surface";

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

  const weekKey = toDateKey(new Date()).slice(0, 10);

  return (
    <PageContainer className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <Surface className="space-y-3">
          <h2 className="text-lg font-semibold text-[var(--text)]">Quick Review</h2>
          <textarea
            value={quick}
            onChange={(e) => setQuick(e.target.value)}
            rows={5}
            placeholder="What mattered most this week?"
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
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
            className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white"
          >
            Save quick review
          </button>
        </Surface>

        <Surface className="space-y-3">
          <h2 className="text-lg font-semibold text-[var(--text)]">Detailed Review</h2>
          <div className="grid gap-2">
            {Object.entries(details).map(([key, value]) => (
              <input
                key={key}
                value={value}
                onChange={(e) =>
                  setDetails((current) => ({ ...current, [key]: e.target.value }))
                }
                placeholder={labelFor(key)}
                className="min-h-10 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
              />
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
            className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white"
          >
            Save detailed review
          </button>
        </Surface>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-[var(--text)]">Review History</h2>
        {actions.store.reviews.map((review) => (
          <Surface key={review.id} padding="sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-[var(--text)]">
                {review.type === "quick" ? "Quick Review" : "Detailed Review"}
              </p>
              <span className="text-xs soft-text">{review.weekKey}</span>
            </div>
            <p className="mt-2 text-sm muted-text">
              {review.prompt || review.nextWeekPlan || review.wins}
            </p>
          </Surface>
        ))}
      </section>
    </PageContainer>
  );
}

function labelFor(key: string) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase());
}
