"use client";

import { useMemo, useState } from "react";
import type { MomentumActions } from "../../hooks/useMomentumStore";
import type { JournalType } from "../../types";
import { PageContainer } from "../design/PageContainer";
import { Surface } from "../design/Surface";

const TYPES: { value: JournalType; label: string }[] = [
  { value: "morning", label: "Morning Planning" },
  { value: "reflection", label: "Daily Reflection" },
  { value: "brain-dump", label: "Brain Dump" },
  { value: "notes", label: "Notes" },
];

export function JournalView({ actions }: { actions: MomentumActions }) {
  const [type, setType] = useState<JournalType>("morning");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [query, setQuery] = useState("");

  const entries = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions.store.journalEntries;
    return actions.store.journalEntries.filter(
      (entry) =>
        entry.title.toLowerCase().includes(q) ||
        entry.body.toLowerCase().includes(q),
    );
  }, [actions.store.journalEntries, query]);

  return (
    <PageContainer className="space-y-6">
      <Surface className="space-y-3">
        <div className="grid gap-3 md:grid-cols-[12rem_1fr]">
          <select
            value={type}
            onChange={(e) => setType(e.target.value as JournalType)}
            className="min-h-11 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--text)]"
          >
            {TYPES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Entry title"
            className="min-h-11 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
          />
        </div>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={6}
          placeholder="Write freely..."
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
        />
        <button
          type="button"
          onClick={() => {
            if (!title.trim() && !body.trim()) return;
            actions.addJournalEntry({
              type,
              title: title.trim() || TYPES.find((item) => item.value === type)?.label || "Journal",
              body,
            });
            setTitle("");
            setBody("");
          }}
          className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white"
        >
          Save entry
        </button>
      </Surface>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search journal..."
        className="min-h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
      />

      <div className="grid gap-3 md:grid-cols-2">
        {entries.map((entry) => (
          <Surface key={entry.id} padding="sm">
            <p className="text-xs font-semibold uppercase tracking-wider soft-text">
              {TYPES.find((item) => item.value === entry.type)?.label}
            </p>
            <h2 className="mt-1 text-base font-semibold text-[var(--text)]">
              {entry.title}
            </h2>
            <p className="mt-2 line-clamp-4 text-sm muted-text">{entry.body}</p>
          </Surface>
        ))}
      </div>
    </PageContainer>
  );
}
