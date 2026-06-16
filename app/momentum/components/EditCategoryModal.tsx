"use client";

import { useEffect, useState } from "react";
import { PRIORITIES, TASK_TAGS, TASK_TAG_STYLES } from "../constants";
import type { Priority, TaskTag } from "../types";
import { Modal } from "./ui/Modal";
import { PrimaryButton, SelectInput, TextInput } from "./ui/inputs";

export function EditCategoryModal({
  open,
  title: initialTitle,
  description: initialDescription = "",
  priority: initialPriority,
  tags: initialTags = [],
  showPriority,
  onClose,
  onSave,
}: {
  open: boolean;
  title: string;
  description?: string;
  priority?: Priority;
  tags?: TaskTag[];
  showPriority: boolean;
  onClose: () => void;
  onSave: (data: {
    title: string;
    description: string;
    priority?: Priority;
    tags: TaskTag[];
  }) => void;
}) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [priority, setPriority] = useState<Priority>(initialPriority ?? "medium");
  const [tags, setTags] = useState<TaskTag[]>(initialTags);

  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => {
      setTitle(initialTitle);
      setDescription(initialDescription);
      setPriority(initialPriority ?? "medium");
      setTags(initialTags);
    }, 0);
    return () => window.clearTimeout(id);
  }, [open, initialTitle, initialDescription, initialPriority, initialTags]);

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
