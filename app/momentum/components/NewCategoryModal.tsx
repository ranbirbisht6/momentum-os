"use client";

import { useEffect, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { PRIORITIES, TASK_TAGS, TASK_TAG_STYLES } from "../constants";
import type { CreateCategoryInput, Priority, TaskTag } from "../types";
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

  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => {
      setTitle("");
      setDescription("");
      setSubtasks([""]);
      setPriority("medium");
      setTags([]);
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
