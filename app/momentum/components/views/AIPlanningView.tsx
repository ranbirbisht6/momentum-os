"use client";

import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import type { MomentumActions } from "../../hooks/useMomentumStore";
import { PageContainer } from "../design/PageContainer";
import { Surface } from "../design/Surface";

export function AIPlanningView({ actions }: { actions: MomentumActions }) {
  const [prompt, setPrompt] = useState("");
  const preview = useMemo(() => buildPreview(prompt), [prompt]);

  return (
    <PageContainer className="space-y-6">
      <Surface className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-soft)]">
            <Sparkles className="h-5 w-5 accent-text" />
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-[var(--text)]">
              AI Planning Assistant
            </h2>
            <p className="mt-1 text-sm muted-text">
              Local planning blueprint today. External AI can plug into this flow later.
            </p>
          </div>
        </div>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          placeholder="Enter a goal, for example: Build Startup, Learn AI, MBA Preparation..."
          className="w-full resize-y rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none placeholder:text-[var(--muted-soft)] focus:border-[var(--accent)]"
        />
        <button
          type="button"
          onClick={() => {
            if (actions.createAiPlan(prompt)) setPrompt("");
          }}
          disabled={!prompt.trim()}
          className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
        >
          Generate plan
        </button>
      </Surface>

      <div className="grid gap-4 lg:grid-cols-4">
        {preview.map((section) => (
          <Surface key={section.title} padding="sm">
            <p className="text-xs font-semibold uppercase tracking-wider soft-text">
              {section.title}
            </p>
            <ul className="mt-3 space-y-2 text-sm text-[var(--text)]">
              {section.items.map((item) => (
                <li key={item} className="rounded-lg bg-[var(--surface-soft)] px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
          </Surface>
        ))}
      </div>
    </PageContainer>
  );
}

function buildPreview(prompt: string) {
  const goal = prompt.trim() || "Your goal";
  return [
    {
      title: "Milestones",
      items: [`Clarify ${goal}`, "Build the system", "Complete proof of progress"],
    },
    {
      title: "Monthly Plan",
      items: ["Define outcomes", "Execute core work", "Review and refine"],
    },
    {
      title: "Weekly Plan",
      items: ["Plan focused blocks", "Complete milestone slice", "Review progress"],
    },
    {
      title: "Daily Tasks",
      items: ["One deep work session", "One small admin task", "Log progress"],
    },
  ];
}
