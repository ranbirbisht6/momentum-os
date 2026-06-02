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
    <Surface className={compact ? "" : "border-violet-500/10 bg-violet-500/[0.03]"}>
      <div className="flex gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <p className="text-lg font-medium tracking-tight text-zinc-100">
              {insight.greeting}
            </p>
            <p className="mt-1 text-sm text-zinc-500">{insight.subtitle}</p>
          </div>

          {insight.tasksLeftToday > 0 && (
            <p className="text-sm text-zinc-300">
              You have {insight.tasksLeftToday} task
              {insight.tasksLeftToday === 1 ? "" : "s"} left today.
            </p>
          )}

          {!compact && (
            <div className="space-y-2 border-t border-white/[0.06] pt-3 text-sm text-zinc-400">
              {insight.mostActiveCategory && (
                <p>
                  <span className="text-zinc-500">Most active category:</span>{" "}
                  {insight.mostActiveCategory}
                </p>
              )}
              {insight.suggestedNextAction && (
                <p>
                  <span className="text-zinc-500">Suggested next action:</span>{" "}
                  {insight.suggestedNextAction}
                </p>
              )}
            </div>
          )}

          {insight.recommendations.length > 0 && (
            <ul
              className={`space-y-2 ${compact ? "" : "border-t border-white/[0.06] pt-3"}`}
            >
              {insight.recommendations.map((line) => (
                <li
                  key={line}
                  className="flex gap-2 text-xs leading-relaxed text-zinc-500"
                >
                  <Brain className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-500/70" />
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
