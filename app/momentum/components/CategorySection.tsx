"use client";

import { memo, useState, type FormEvent } from "react";
import {
  Check,
  ChevronDown,
  MoreHorizontal,
  Plus,
  Trash2,
} from "lucide-react";
import type { Priority, Subtask } from "../types";
import { PRIORITY_DOT } from "../constants";
import { subtaskProgress } from "../utils";
import { ConfirmModal } from "./ui/ConfirmModal";

export type CategoryData = {
  id: string;
  title: string;
  description?: string;
  subtasks: Subtask[];
  priority?: Priority;
};

function CategorySectionInner({
  category,
  showPriority,
  defaultOpen = false,
  newTaskValue,
  onNewTaskChange,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onDeleteCategory,
  onEditCategory,
  flashTaskId,
}: {
  category: CategoryData;
  showPriority?: boolean;
  defaultOpen?: boolean;
  newTaskValue: string;
  onNewTaskChange: (v: string) => void;
  onAddTask: () => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onDeleteCategory: () => void;
  onEditCategory?: () => void;
  flashTaskId?: string | null;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteTask, setDeleteTask] = useState<Subtask | null>(null);
  const progress = subtaskProgress(category.subtasks);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    onAddTask();
  };

  return (
    <>
      <article className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="flex min-w-0 flex-1 items-start gap-3 text-left"
          >
            <ChevronDown
              className={`mt-1 h-4 w-4 shrink-0 text-zinc-500 transition-transform ${open ? "" : "-rotate-90"}`}
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-medium text-zinc-100">
                  {category.title}
                </h3>
                {showPriority && category.priority && (
                  <span className="inline-flex items-center gap-1.5 text-[0.65rem] uppercase tracking-wider text-zinc-500">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${PRIORITY_DOT[category.priority]}`}
                    />
                    {category.priority}
                  </span>
                )}
              </div>
              {category.description && (
                <p className="mt-1 text-sm text-zinc-500">{category.description}</p>
              )}
              <p className="mt-2 text-xs text-zinc-500">
                {progress.completed}/{progress.total} tasks
                {progress.total > 0 ? ` · ${progress.percent}%` : ""}
              </p>
              {progress.total > 0 && (
                <div className="mt-3 h-1 overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-violet-500/80 transition-all duration-500"
                    style={{ width: `${progress.percent}%` }}
                  />
                </div>
              )}
            </div>
          </button>
          <div className="flex shrink-0 gap-1">
            {onEditCategory && (
              <button
                type="button"
                onClick={onEditCategory}
                className="rounded-lg p-2 text-zinc-600 hover:bg-white/5 hover:text-zinc-400"
                aria-label="Edit category"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="rounded-lg p-2 text-zinc-600 hover:bg-white/5 hover:text-red-400"
              aria-label="Delete category"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {open && (
          <div className="mt-5 border-t border-white/[0.06] pt-4">
            <ul className="space-y-0.5">
              {category.subtasks.map((task) => (
                <li key={task.id}>
                  <div
                    className={`group flex items-center gap-3 rounded-lg py-2 pr-1 transition-colors ${
                      flashTaskId === task.id
                        ? "bg-emerald-500/5"
                        : "hover:bg-white/[0.02]"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => onToggleTask(task.id)}
                      aria-pressed={task.completed}
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition ${
                        task.completed
                          ? "complete-pop border-emerald-500/50 bg-emerald-500/15"
                          : "border-zinc-600 hover:border-zinc-400"
                      }`}
                    >
                      {task.completed && (
                        <Check className="h-3 w-3 text-emerald-400" strokeWidth={3} />
                      )}
                    </button>
                    <span
                      className={`min-w-0 flex-1 text-sm ${
                        task.completed
                          ? "text-zinc-600 line-through"
                          : "text-zinc-300"
                      }`}
                    >
                      {task.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => setDeleteTask(task)}
                      className="rounded p-1 text-zinc-700 opacity-0 transition group-hover:opacity-100 hover:text-red-400"
                      aria-label={`Delete ${task.title}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <form onSubmit={onSubmit} className="mt-3 flex gap-2">
              <input
                type="text"
                value={newTaskValue}
                onChange={(e) => onNewTaskChange(e.target.value)}
                placeholder="Add subtask"
                className="h-9 flex-1 rounded-lg border border-white/[0.06] bg-transparent px-3 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-violet-500/20"
              />
              <button
                type="submit"
                disabled={!newTaskValue.trim()}
                className="flex h-9 items-center gap-1 rounded-lg bg-violet-600/90 px-3 text-xs font-medium text-white hover:bg-violet-500 disabled:opacity-40"
              >
                <Plus className="h-3.5 w-3.5" />
                Add
              </button>
            </form>
          </div>
        )}
      </article>

      <ConfirmModal
        open={confirmDelete}
        title="Delete category?"
        message={`Remove "${category.title}" and all its tasks?`}
        onConfirm={onDeleteCategory}
        onClose={() => setConfirmDelete(false)}
      />
      <ConfirmModal
        open={!!deleteTask}
        title="Delete task?"
        message={`Remove "${deleteTask?.title}"?`}
        onConfirm={() => {
          if (deleteTask) onDeleteTask(deleteTask.id);
        }}
        onClose={() => setDeleteTask(null)}
      />
    </>
  );
}

export const CategorySection = memo(CategorySectionInner);
