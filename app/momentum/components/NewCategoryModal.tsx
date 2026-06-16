"use client";

import { useEffect, useState } from "react";
import { Minus, Plus } from "lucide-react";
import {
  PRIORITIES,
  RECURRENCE_OPTIONS,
  REMINDER_OPTIONS,
  TASK_TAGS,
  TASK_TAG_STYLES,
} from "../constants";
import type {
  CreateCategoryInput,
  Priority,
  RecurrenceFrequency,
  ReminderOffset,
  TaskTag,
} from "../types";
import { toDateKey } from "../utils";
import { Modal } from "./ui/Modal";
import { PrimaryButton, SelectInput, TextInput } from "./ui/inputs";

export function NewCategoryModal({
  open,
  showPriority,
  onClose,
  onSave,
}: {
  open: boolean;
  showPriority: boolean;
  onClose: () => void;
  onSave: (input: CreateCategoryInput) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subtasks, setSubtasks] = useState<string[]>([""]);
  const [priority, setPriority] = useState<Priority>("medium");
  const [tags, setTags] = useState<TaskTag[]>([]);
  const [recurrence, setRecurrence] = useState<RecurrenceFrequency>("none");
  const [customEveryDays, setCustomEveryDays] = useState("3");
  const [reminder, setReminder] = useState<ReminderOffset>("none");
  const [customReminderMinutes, setCustomReminderMinutes] = useState("90");
  const [scheduledAt, setScheduledAt] = useState("");
  const [deadline, setDeadline] = useState("");
  const todayKey = toDateKey(new Date());

  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => {
      setTitle("");
      setDescription("");
      setSubtasks([""]);
      setPriority("medium");
      setTags([]);
      setRecurrence("none");
      setCustomEveryDays("3");
      setReminder("none");
      setCustomReminderMinutes("90");
      setScheduledAt("");
      setDeadline("");
    }, 0);
    return () => window.clearTimeout(id);
  }, [open]);

  const updateSubtask = (index: number, value: string) => {
    setSubtasks((rows) => rows.map((r, i) => (i === index ? value : r)));
  };

  const addRow = () => setSubtasks((rows) => [...rows, ""]);

  const removeRow = (index: number) => {
    setSubtasks((rows) =>
      rows.length <= 1 ? [""] : rows.filter((_, i) => i !== index),
    );
  };

  const toggleTag = (tag: TaskTag) => {
    setTags((current) =>
      current.includes(tag)
        ? current.filter((item) => item !== tag)
        : [...current, tag],
    );
  };

  return (
    <Modal open={open} title="New task" onClose={onClose}>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim()) return;
          onSave({
            title: title.trim(),
            description: description.trim() || undefined,
            subtaskTitles: subtasks,
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
        <div>
          <label className="mb-1.5 block text-xs muted-text">Task title</label>
          <TextInput
            value={title}
            onChange={setTitle}
            placeholder="Ireland Applications"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs muted-text">
            Description <span className="soft-text">(optional)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tasks required before admission deadlines."
            rows={2}
            className="w-full resize-none rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--text)] outline-none placeholder:text-[var(--muted-soft)] focus:border-[var(--accent)]"
          />
        </div>
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
        <div className="space-y-2">
          <p className="text-xs muted-text">Subtasks</p>
          {subtasks.map((row, index) => (
            <div key={index} className="flex gap-2">
              <TextInput
                value={row}
                onChange={(v) => updateSubtask(index, v)}
                placeholder={
                  index === 0
                    ? "IELTS"
                    : index === 1
                      ? "SOP Draft"
                      : "Add subtask"
                }
              />
              <button
                type="button"
                onClick={() => removeRow(index)}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] muted-text transition hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"
                aria-label="Remove subtask"
              >
                <Minus className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addRow}
            className="flex items-center gap-2 text-xs accent-text hover:underline"
          >
            <Plus className="h-3.5 w-3.5" />
            Add subtask
          </button>
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
            <label className="space-y-1.5">
              <span className="text-xs muted-text">Every days</span>
              <TextInput
                value={customEveryDays}
                onChange={setCustomEveryDays}
                placeholder="3"
              />
            </label>
          )}
          {reminder === "custom" && (
            <label className="space-y-1.5">
              <span className="text-xs muted-text">Reminder minutes</span>
              <TextInput
                value={customReminderMinutes}
                onChange={setCustomReminderMinutes}
                placeholder="90"
              />
            </label>
          )}
          <label className="space-y-1.5">
            <span className="text-xs muted-text">Schedule time</span>
            <input
              type="time"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="min-h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs muted-text">Deadline</span>
            <input
              type="date"
              min={todayKey}
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="min-h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
            />
          </label>
        </div>
        <div className="flex gap-2 pt-2">
          <PrimaryButton type="submit" disabled={!title.trim()}>
            Save task
          </PrimaryButton>
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
