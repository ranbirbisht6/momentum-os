"use client";

import { useMemo, useState } from "react";
import { PenLine, Search, Send } from "lucide-react";
import type { MomentumActions } from "../../hooks/useMomentumStore";
import type { JournalType } from "../../types";
import { PageContainer } from "../design/PageContainer";
import { Surface } from "../design/Surface";
import { EmptyState } from "../ui/EmptyState";

const TYPES: { value: JournalType; label: string; prompt: string }[] = [
  { value: "morning", label: "Morning Planning", prompt: "What would make today meaningful?" },
  { value: "reflection", label: "Daily Reflection", prompt: "What did today teach you?" },
  { value: "brain-dump", label: "Brain Dump", prompt: "Clear the mental queue." },
  { value: "notes", label: "Notes", prompt: "Capture an idea, decision, or note." },
];

export function JournalView({ actions }: { actions: MomentumActions }) {
  const [type, setType] = useState<JournalType>("morning");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [query, setQuery] = useState("");

  const activeType = TYPES.find((item) => item.value === type) ?? TYPES[0];
  const entries = useMemo(() => {
    const q = query.trim().toLowerCase();
    const sorted = [...actions.store.journalEntries].sort((a, b) => b.createdAt - a.createdAt);
    if (!q) return sorted;
    return sorted.filter(
      (entry) =>
        entry.title.toLowerCase().includes(q) ||
        entry.body.toLowerCase().includes(q),
    );
  }, [actions.store.journalEntries, query]);

  return (
    <PageContainer className="space-y-6">
      <Surface className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]" padding="lg">
        <div>
          <span className="section-label">Journal</span>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
            Think clearly, then move cleanly.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 muted-text">
            Morning planning, reflection, brain dumps, and notes live together in a searchable local notebook.
          </p>
          <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {TYPES.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setType(item.value)}
                className={`rounded-2xl border p-3 text-left transition ${
                  type === item.value
                    ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                    : "border-[var(--border)] bg-[var(--surface-soft)] hover:border-[var(--accent)]"
                }`}
              >
                <p className="text-sm font-semibold text-[var(--text)]">{item.label}</p>
                <p className="mt-1 text-xs muted-text">{item.prompt}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
          <div className="flex items-center gap-2">
            <PenLine className="h-4 w-4 accent-text" />
            <p className="text-sm font-semibold text-[var(--text)]">{activeType.label}</p>
          </div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Entry title"
            className="input-shell mt-4 min-h-12 w-full rounded-2xl px-4 text-sm placeholder:text-[var(--muted-soft)]"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={8}
            placeholder={activeType.prompt}
            className="input-shell mt-3 w-full resize-y rounded-2xl px-4 py-3 text-sm placeholder:text-[var(--muted-soft)]"
          />
          <button
            type="button"
            onClick={() => {
              if (!title.trim() && !body.trim()) return;
              actions.addJournalEntry({
                type,
                title: title.trim() || activeType.label,
                body,
              });
              setTitle("");
              setBody("");
            }}
            className="mt-3 inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-5 text-sm font-semibold text-white"
          >
            <Send className="h-4 w-4" />
            Save entry
          </button>
        </div>
      </Surface>

      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 soft-text" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search journal..."
          className="input-shell min-h-12 w-full rounded-2xl pl-11 pr-4 text-sm placeholder:text-[var(--muted-soft)]"
        />
      </div>

      {entries.length === 0 ? (
        <EmptyState
          icon="J"
          title={query ? "No matching entries" : "No journal entries yet"}
          hint={query ? "Try a different search term." : "Save your first note, reflection, or morning plan to start building your personal archive."}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {entries.map((entry) => (
            <Surface key={entry.id} padding="sm" className="card-hover">
              <p className="section-label">
                {TYPES.find((item) => item.value === entry.type)?.label}
              </p>
              <h3 className="mt-2 text-lg font-semibold tracking-tight text-[var(--text)]">
                {entry.title}
              </h3>
              <p className="mt-3 line-clamp-5 text-sm leading-6 muted-text">{entry.body}</p>
              <p className="mt-4 text-xs soft-text">
                {new Date(entry.createdAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </Surface>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
