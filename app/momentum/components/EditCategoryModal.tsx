"use client";

import { useEffect, useState } from "react";
import { PRIORITIES } from "../constants";
import type { Priority } from "../types";
import { Modal } from "./ui/Modal";
import { PrimaryButton, SelectInput, TextInput } from "./ui/inputs";

export function EditCategoryModal({
  open,
  title: initialTitle,
  description: initialDescription = "",
  priority: initialPriority,
  showPriority,
  onClose,
  onSave,
}: {
  open: boolean;
  title: string;
  description?: string;
  priority?: Priority;
  showPriority: boolean;
  onClose: () => void;
  onSave: (data: {
    title: string;
    description: string;
    priority?: Priority;
  }) => void;
}) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [priority, setPriority] = useState<Priority>(initialPriority ?? "medium");

  useEffect(() => {
    if (open) {
      setTitle(initialTitle);
      setDescription(initialDescription);
      setPriority(initialPriority ?? "medium");
    }
  }, [open, initialTitle, initialDescription, initialPriority]);

  return (
    <Modal open={open} title="Edit category" onClose={onClose}>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim()) return;
          onSave({
            title: title.trim(),
            description: description.trim(),
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
          className="w-full resize-none rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-violet-500/20"
        />
        {showPriority && (
          <SelectInput value={priority} onChange={setPriority} options={PRIORITIES} />
        )}
        <div className="flex gap-2 pt-2">
          <PrimaryButton type="submit">Save</PrimaryButton>
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 flex-1 rounded-xl border border-white/10 text-sm text-zinc-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}
