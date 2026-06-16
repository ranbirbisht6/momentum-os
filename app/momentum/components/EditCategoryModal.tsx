"use client";

import { useEffect, useState } from "react";
import {
  PRIORITIES,
  RECURRENCE_OPTIONS,
  REMINDER_OPTIONS,
  TASK_TAGS,
  TASK_TAG_STYLES,
} from "../constants";
import type {
  Priority,
  RecurrenceFrequency,
  RecurrenceRule,
  ReminderOffset,
  ReminderRule,
  TaskTag,
} from "../types";
import { toDateKey } from "../utils";
import { Modal } from "./ui/Modal";
import { PrimaryButton, SelectInput, TextInput } from "./ui/inputs";

export function EditCategoryModal({
  open,
  title: initialTitle,
  description: initialDescription = "",
  priority: initialPriority,
  tags: initialTags = [],
  recurrence: initialRecurrence = { frequency: "none" },
  reminder: initialReminder = { offset: "none" },
  scheduledAt: initialScheduledAt = "",
  deadline: initialDeadline = "",
  showPriority,
  onClose,
  onSave,
}: {
  open: boolean;
  title: string;
  description?: string;
  priority?: Priority;
  tags?: TaskTag[];
  recurrence?: RecurrenceRule;
  reminder?: ReminderRule;
  scheduledAt?: string;
  deadline?: string;
  showPriority: boolean;
  onClose: () => void;
  onSave: (data: {
    title: string;
    description: string;
    priority?: Priority;
    tags: TaskTag[];
    recurrence: RecurrenceRule;
    reminder: ReminderRule;
    scheduledAt?: string;
    deadline?: string;
  }) => void;
}) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [priority, setPriority] = useState<Priority>(initialPriority ?? "medium");
  const [tags, setTags] = useState<TaskTag[]>(initialTags);
  const [recurrence, setRecurrence] = useState<RecurrenceFrequency>(
    initialRecurrence.frequency,
  );
  const [customEveryDays, setCustomEveryDays] = useState(
    String(initialRecurrence.customEveryDays ?? 3),
  );
  const [reminder, setReminder] = useState<ReminderOffset>(initialReminder.offset);
  const [customReminderMinutes, setCustomReminderMinutes] = useState(
    String(initialReminder.customMinutes ?? 90),
  );
  const [scheduledAt, setScheduledAt] = useState(initialScheduledAt);
  const [deadline, setDeadline] = useState(initialDeadline);
  const todayKey = toDateKey(new Date());

  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => {
      setTitle(initialTitle);
      setDescription(initialDescription);
      setPriority(initialPriority ?? "medium");
      setTags(initialTags);
      setRecurrence(initialRecurrence.frequency);
      setCustomEveryDays(String(initialRecurrence.customEveryDays ?? 3));
      setReminder(initialReminder.offset);
      setCustomReminderMinutes(String(initialReminder.customMinutes ?? 90));
      setScheduledAt(initialScheduledAt);
      setDeadline(initialDeadline);
    }, 0);
    return () => window.clearTimeout(id);
  }, [
    open,
    initialTitle,
    initialDescription,
    initialPriority,
    initialTags,
    initialRecurrence,
    initialReminder,
    initialScheduledAt,
    initialDeadline,
  ]);

  const toggleTag = (tag: TaskTag) => {
    setTags((current) =>
      current.includes(tag)
        ? current.filter((item) => item !== tag)
        : [...current, tag],
    );
  };

  return (
    <Modal open={open} title="Edit task" onClose={onClose}>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim()) return;
          onSave({
            title: title.trim(),
            description: description.trim(),
            tags,
            recurrence: {
              frequency: recurrence,
              customEveryDays:
                recurrence === "custom"
                  ? Math.max(1, Number(customEveryDays) || 1)
                  : undefined,
            },
            reminder: {
              offset: reminder,
              customMinutes:
                reminder === "custom"
                  ? Math.max(1, Number(customReminderMinutes) || 1)
                  : undefined,
            },
            scheduledAt: scheduledAt || undefined,
            deadline: deadline || undefined,
            ...(showPriority ? { priority } : {}),
          });
          onClose();
        }}
      >
        <TextInput value={title} onChange={setTitle} placeholder="Category title" />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          rows={2}
          className="w-full resize-none rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--text)] outline-none placeholder:text-[var(--muted-soft)] focus:border-[var(--accent)]"
        />
        <div className="space-y-2">
          <p className="text-xs muted-text">Tags</p>
          <div className="flex flex-wrap gap-2">
            {TASK_TAGS.map((tag) => {
              const active = tags.includes(tag.value);
              return (
                <button
                  key={tag.value}
                  type="button"
                  onClick={() => toggleTag(tag.value)}
                  aria-pressed={active}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                    active
                      ? TASK_TAG_STYLES[tag.value]
                      : "tag-pill hover:border-[var(--border-strong)]"
                  }`}
                >
                  {tag.label}
                </button>
              );
            })}
          </div>
        </div>
        {showPriority && (
          <SelectInput value={priority} onChange={setPriority} options={PRIORITIES} />
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-1.5">
            <span className="text-xs muted-text">Repeat</span>
            <SelectInput
              value={recurrence}
              onChange={setRecurrence}
              options={RECURRENCE_OPTIONS}
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs muted-text">Reminder</span>
            <SelectInput
              value={reminder}
              onChange={setReminder}
              options={REMINDER_OPTIONS}
            />
          </label>
          {recurrence === "custom" && (
            <TextInput
              value={customEveryDays}
              onChange={setCustomEveryDays}
              placeholder="Every days"
            />
          )}
          {reminder === "custom" && (
            <TextInput
              value={customReminderMinutes}
              onChange={setCustomReminderMinutes}
              placeholder="Reminder minutes"
            />
          )}
          <input
            type="time"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            className="min-h-11 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
          />
          <input
            type="date"
            min={todayKey}
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="min-h-11 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
          />
        </div>
        <div className="flex gap-2 pt-2">
          <PrimaryButton type="submit">Save</PrimaryButton>
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 flex-1 rounded-lg border border-[var(--border)] text-sm muted-text transition hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}
