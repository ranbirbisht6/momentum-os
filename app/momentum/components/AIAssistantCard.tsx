"use client";

import { memo } from "react";
import { Brain, Sparkles } from "lucide-react";
import type { AssistantInsight } from "../types";
import { Surface } from "./design/Surface";

function AIAssistantCardInner({
  insight,
  compact = false,
}: {
  insight: AssistantInsight;
  compact?: boolean;
}) {
  return (
    <Surface className={compact ? "" : "border-[var(--border-strong)]"}>
      <div className="flex gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)] accent-text">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <p className="text-lg font-semibold tracking-tight text-[var(--text)]">
              {insight.greeting}
            </p>
            <p className="mt-1 text-sm muted-text">{insight.subtitle}</p>
          </div>

          {insight.tasksLeftToday > 0 && (
            <p className="text-sm text-[var(--text)]">
              You have {insight.tasksLeftToday} task
              {insight.tasksLeftToday === 1 ? "" : "s"} left today.
            </p>
          )}

          {!compact && (
            <div className="space-y-2 border-t pt-3 text-sm muted-text" style={{ borderColor: "var(--border)" }}>
              {insight.mostActiveCategory && (
                <p>
                  <span className="soft-text">Most active category:</span>{" "}
                  {insight.mostActiveCategory}
                </p>
              )}
              {insight.suggestedNextAction && (
                <p>
                  <span className="soft-text">Suggested next action:</span>{" "}
                  {insight.suggestedNextAction}
                </p>
              )}
            </div>
          )}

          {insight.recommendations.length > 0 && (
            <ul
              className={`space-y-2 ${compact ? "" : "border-t pt-3"}`}
              style={compact ? undefined : { borderColor: "var(--border)" }}
            >
              {insight.recommendations.map((line) => (
                <li
                  key={line}
                  className="flex gap-2 text-xs leading-relaxed muted-text"
                >
                  <Brain className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-text" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Surface>
  );
}

export const AIAssistantCard = memo(AIAssistantCardInner);
