"use client";

import { useEffect, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { PRIORITIES } from "../constants";
import type { CreateCategoryInput, Priority } from "../types";
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

  useEffect(() => {
    if (!open) return;
    setTitle("");
    setDescription("");
    setSubtasks([""]);
    setPriority("medium");
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

  return (
    <Modal open={open} title="New category" onClose={onClose}>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim()) return;
          onSave({
            title: title.trim(),
            description: description.trim() || undefined,
            subtaskTitles: subtasks,
            ...(showPriority ? { priority } : {}),
          });
          onClose();
        }}
      >
        <div>
          <label className="mb-1.5 block text-xs text-zinc-500">Category title</label>
          <TextInput
            value={title}
            onChange={setTitle}
            placeholder="Ireland Applications"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs text-zinc-500">
            Description <span className="text-zinc-600">(optional)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tasks required before admission deadlines."
            rows={2}
            className="w-full resize-none rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-violet-500/20"
          />
        </div>
        <div className="space-y-2">
          <p className="text-xs text-zinc-500">Subtasks</p>
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
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
                aria-label="Remove subtask"
              >
                <Minus className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addRow}
            className="flex items-center gap-2 text-xs text-violet-400 hover:text-violet-300"
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
            Save category
          </PrimaryButton>
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
