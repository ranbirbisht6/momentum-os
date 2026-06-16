"use client";

import { memo, useState, type FormEvent } from "react";
import {
  Check,
  ChevronDown,
  MoreHorizontal,
  Plus,
  Trash2,
} from "lucide-react";
import { PRIORITY_DOT, TASK_TAGS, TASK_TAG_STYLES } from "../constants";
import type { Priority, Subtask, TaskTag } from "../types";
import { categoryIsComplete, subtaskProgress } from "../utils";
import { ConfirmModal } from "./ui/ConfirmModal";

export type CategoryData = {
  id: string;
  title: string;
  description?: string;
  subtasks: Subtask[];
  priority?: Priority;
  completed?: boolean;
  tags: TaskTag[];
};

function CategorySectionInner({
  category,
  showPriority,
  defaultOpen = false,
  newTaskValue,
  onNewTaskChange,
  onAddTask,
  onToggleCategory,
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
  onToggleCategory: () => void;
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
  const completed = categoryIsComplete(category);
  const parentLocked = category.subtasks.length > 0;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    onAddTask();
  };

  return (
    <>
      <article
        className={`surface rounded-xl border p-5 transition sm:p-6 ${
          completed ? "opacity-80" : ""
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <button
              type="button"
              onClick={parentLocked ? undefined : onToggleCategory}
              disabled={parentLocked}
              aria-pressed={completed}
              title={
                parentLocked
                  ? "Completed automatically when all subtasks are done"
                  : "Toggle task"
              }
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition ${
                completed
                  ? "complete-pop border-[var(--accent)] bg-[var(--accent)] text-white"
                  : "border-[var(--border-strong)] bg-[var(--surface)] text-transparent hover:border-[var(--accent)]"
              } ${parentLocked ? "cursor-default" : ""}`}
            >
              {completed && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
            </button>

            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="flex min-w-0 flex-1 items-start gap-3 text-left"
            >
              <ChevronDown
                className={`mt-1 h-4 w-4 shrink-0 soft-text transition-transform ${
                  open ? "" : "-rotate-90"
                }`}
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3
                    className={`text-base font-semibold tracking-tight ${
                      completed
                        ? "text-[var(--muted-soft)] line-through"
                        : "text-[var(--text)]"
                    }`}
                  >
                    {category.title}
                  </h3>
                  {showPriority && category.priority && (
                    <span className="inline-flex items-center gap-1.5 text-[0.65rem] uppercase tracking-wider soft-text">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${PRIORITY_DOT[category.priority]}`}
                      />
                      {category.priority}
                    </span>
                  )}
                  {category.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`inline-flex rounded-full px-2 py-0.5 text-[0.68rem] font-medium ${TASK_TAG_STYLES[tag]}`}
                    >
                      {TASK_TAGS.find((t) => t.value === tag)?.label ?? tag}
                    </span>
                  ))}
                </div>
                {category.description && (
                  <p
                    className={`mt-1 text-sm ${
                      completed ? "soft-text line-through" : "muted-text"
                    }`}
                  >
                    {category.description}
                  </p>
                )}
                <p className="mt-2 text-xs soft-text">
                  {progress.completed}/{progress.total} tasks
                  {progress.total > 0 ? ` - ${progress.percent}%` : ""}
                </p>
                {progress.total > 0 && (
                  <div className="mt-3 h-1 overflow-hidden rounded-full bg-[var(--surface-soft)]">
                    <div
                      className="h-full rounded-full bg-[var(--accent)] transition-all duration-500"
                      style={{ width: `${progress.percent}%` }}
                    />
                  </div>
                )}
              </div>
            </button>
          </div>

          <div className="flex shrink-0 gap-1">
            {onEditCategory && (
              <button
                type="button"
                onClick={onEditCategory}
                className="rounded-lg p-2 soft-text transition hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"
                aria-label="Edit category"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="rounded-lg p-2 soft-text transition hover:bg-[var(--surface-soft)] hover:text-[var(--danger)]"
              aria-label="Delete category"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {open && (
          <div className="mt-5 border-t pt-4" style={{ borderColor: "var(--border)" }}>
            <ul className="space-y-0.5">
              {category.subtasks.map((task) => (
                <li key={task.id}>
                  <div
                    className={`group flex items-center gap-3 rounded-lg py-2 pr-1 transition-colors ${
                      flashTaskId === task.id
                        ? "bg-[var(--accent-soft)]"
                        : "hover:bg-[var(--surface-soft)]"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => onToggleTask(task.id)}
                      aria-pressed={task.completed}
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition ${
                        task.completed
                          ? "complete-pop border-[var(--accent)] bg-[var(--accent)]"
                          : "border-[var(--border-strong)] hover:border-[var(--accent)]"
                      }`}
                    >
                      {task.completed && (
                        <Check className="h-3 w-3 text-white" strokeWidth={3} />
                      )}
                    </button>
                    <span
                      className={`min-w-0 flex-1 text-sm ${
                        task.completed
                          ? "text-[var(--muted-soft)] line-through opacity-80"
                          : "text-[var(--text)]"
                      }`}
                    >
                      {task.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => setDeleteTask(task)}
                      className="rounded p-1 soft-text opacity-0 transition group-hover:opacity-100 hover:text-[var(--danger)]"
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
                className="h-9 flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--text)] outline-none placeholder:text-[var(--muted-soft)] focus:border-[var(--accent)]"
              />
              <button
                type="submit"
                disabled={!newTaskValue.trim()}
                className="flex h-9 items-center gap-1 rounded-lg bg-[var(--accent)] px-3 text-xs font-medium text-white transition hover:bg-[var(--accent-strong)] disabled:opacity-40"
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
        title="Delete task group?"
        message={`Remove "${category.title}" and all its subtasks?`}
        onConfirm={onDeleteCategory}
        onClose={() => setConfirmDelete(false)}
      />
      <ConfirmModal
        open={!!deleteTask}
        title="Delete subtask?"
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
