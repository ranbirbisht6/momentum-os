"use client";

import { useMemo, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";
import { MAX_CATEGORIES } from "../constants";
import type { MomentumActions } from "../hooks/useMomentumStore";
import { useToast } from "../hooks/useToast";
import type {
  AnnualCategory,
  CreateCategoryInput,
  DailyCategory,
  MonthlyCategory,
} from "../types";
import {
  categoryProgress,
  filterCategories,
  shiftDate,
  shiftMonth,
} from "../utils";
import { CategorySection, type CategoryData } from "./CategorySection";
import { EditCategoryModal } from "./EditCategoryModal";
import { NewCategoryModal } from "./NewCategoryModal";
import { PageContainer } from "./design/PageContainer";

type PlannerScope = "daily" | "monthly" | "annual";
type AnyCategory = DailyCategory | MonthlyCategory | AnnualCategory;

export function PlannerPage({
  scope,
  actions,
  periodValue,
  onPrev,
  onNext,
  onToday,
  isCurrentPeriod,
  periodInput,
}: {
  scope: PlannerScope;
  actions: MomentumActions;
  periodValue: string | number;
  setPeriodValue: (v: string) => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  isCurrentPeriod: boolean;
  periodInput: ReactNode;
}) {
  const toast = useToast();
  const { hydrated } = actions;

  const [search, setSearch] = useState("");
  const [newTasks, setNewTasks] = useState<Record<string, string>>({});
  const [flashId, setFlashId] = useState<string | null>(null);
  const [editing, setEditing] = useState<CategoryData | null>(null);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const todayKey = actions.todayKey;
  const currentMonthKey = actions.currentMonthKey;
  const currentYear = actions.currentYear;
  const isPastDailyPeriod = scope === "daily" && String(periodValue) < todayKey;
  const isPastMonthlyPeriod = scope === "monthly" && String(periodValue) < currentMonthKey;
  const isPastAnnualPeriod = scope === "annual" && Number(periodValue) < currentYear;
  const isPastPeriod = isPastDailyPeriod || isPastMonthlyPeriod || isPastAnnualPeriod;

  const rawCategories = useMemo(() => {
    if (scope === "daily") return actions.getDailyCategories(String(periodValue));
    if (scope === "monthly") return actions.getMonthlyCategories(String(periodValue));
    return actions.getAnnualCategories(Number(periodValue));
  }, [scope, actions, periodValue]);

  const categories = useMemo(
    () => filterCategories<AnyCategory>(rawCategories, search, search),
    [rawCategories, search],
  );

  const progress = useMemo(
    () => categoryProgress(rawCategories),
    [rawCategories],
  );

  const saveNewCategory = (input: CreateCategoryInput) => {
    let ok = false;
    if (isPastPeriod) {
      toast.error("Past periods are read-only");
      return;
    }
    if (scope === "daily") {
      ok = actions.createDailyCategory(String(periodValue), input);
    } else if (scope === "monthly") {
      ok = actions.createMonthlyCategory(String(periodValue), input);
    } else {
      ok = actions.createAnnualCategory(Number(periodValue), input);
    }
    if (ok) toast.success("Task saved");
    else toast.error(`Check the date or maximum ${MAX_CATEGORIES} tasks for this period`);
  };

  const mapCategory = (c: AnyCategory): CategoryData => ({
    id: c.id,
    title: c.title,
    description: c.description || undefined,
    completed: c.completed,
    tags: c.tags,
    recurrence: "recurrence" in c ? c.recurrence : undefined,
    reminder: "reminder" in c ? c.reminder : undefined,
    scheduledAt: "scheduledAt" in c ? c.scheduledAt : undefined,
    deadline: c.deadline,
    subtasks: c.subtasks,
    priority: "priority" in c ? c.priority : undefined,
  });

  return (
    <PageContainer className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onPrev}
            disabled={isCurrentPeriod || isPastPeriod}
            className="rounded-lg p-2 muted-text transition hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"
            aria-label="Previous"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {periodInput}
          <button
            type="button"
            onClick={onNext}
            className="rounded-lg p-2 muted-text transition hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"
            aria-label="Next"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          {!isCurrentPeriod && (
            <button
              type="button"
              onClick={onToday}
              className="ml-2 text-xs font-medium accent-text hover:underline"
            >
              Current
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => setShowNewCategory(true)}
          disabled={rawCategories.length >= MAX_CATEGORIES || isPastPeriod}
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[var(--accent-strong)] disabled:opacity-40"
          title={isPastPeriod ? "Past periods are read-only" : undefined}
        >
          <Plus className="h-4 w-4" />
          New task
        </button>
      </div>

      <p className="text-xs soft-text">
        {progress.completed}/{progress.total} tasks - {rawCategories.length}/
        {MAX_CATEGORIES} groups
        {isPastPeriod ? " - past periods are read-only" : ""}
      </p>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 soft-text" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks and subtasks..."
          className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] pl-10 pr-4 text-sm text-[var(--text)] outline-none placeholder:text-[var(--muted-soft)] focus:border-[var(--accent)]"
        />
      </div>

      {!hydrated && (
        <p className="py-16 text-center text-sm muted-text">Loading...</p>
      )}

      {hydrated && rawCategories.length === 0 && (
        <div className="premium-card rounded-3xl px-6 py-14 text-center">
          <p className="text-lg font-semibold tracking-tight text-[var(--text)]">
            {isPastPeriod ? "No tasks were planned here" : "No tasks yet"}
          </p>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 muted-text">
            {isPastPeriod
              ? "Past periods stay available for review, but new work must be scheduled today or later."
              : "Create your first task group to organize this period."}
          </p>
        </div>
      )}

      {hydrated && categories.length > 0 && (
        <div className="space-y-3">
          {categories.map((cat) => {
            const data = mapCategory(cat);
            return (
              <CategorySection
                key={cat.id}
                category={data}
                showPriority={scope === "daily"}
                newTaskValue={newTasks[cat.id] ?? ""}
                onNewTaskChange={(v) => setNewTasks((p) => ({ ...p, [cat.id]: v }))}
                onToggleCategory={() => {
                  if (scope === "daily") actions.toggleDailyCategory(cat.id);
                  else if (scope === "monthly") actions.toggleMonthlyCategory(cat.id);
                  else actions.toggleAnnualCategory(cat.id);
                  toast.success(cat.completed ? "Task reopened" : "Task completed");
                }}
                onAddTask={() => {
                  const title = (newTasks[cat.id] ?? "").trim();
                  if (!title) return;
                  let ok = false;
                  if (scope === "daily") ok = actions.addDailySubtask(cat.id, title);
                  else if (scope === "monthly") ok = actions.addMonthlySubtask(cat.id, title);
                  else ok = actions.addAnnualSubtask(cat.id, title);
                  if (ok) {
                    setNewTasks((p) => ({ ...p, [cat.id]: "" }));
                    toast.success("Subtask added");
                  }
                }}
                onToggleTask={(taskId) => {
                  const task = cat.subtasks.find((s) => s.id === taskId);
                  if (scope === "daily") actions.toggleDailySubtask(cat.id, taskId);
                  else if (scope === "monthly") actions.toggleMonthlySubtask(cat.id, taskId);
                  else actions.toggleAnnualSubtask(cat.id, taskId);
                  if (task && !task.completed) {
                    setFlashId(taskId);
                    toast.success("Subtask completed");
                    window.setTimeout(() => setFlashId(null), 600);
                  }
                }}
                onDeleteTask={(taskId) => {
                  if (scope === "daily") actions.deleteDailySubtask(cat.id, taskId);
                  else if (scope === "monthly") actions.deleteMonthlySubtask(cat.id, taskId);
                  else actions.deleteAnnualSubtask(cat.id, taskId);
                  toast.success("Subtask deleted");
                }}
                onDeleteCategory={() => {
                  if (scope === "daily") actions.deleteDailyCategory(cat.id);
                  else if (scope === "monthly") actions.deleteMonthlyCategory(cat.id);
                  else actions.deleteAnnualCategory(cat.id);
                  toast.success("Task deleted");
                }}
                onEditCategory={() => setEditing(data)}
                flashTaskId={flashId}
              />
            );
          })}
        </div>
      )}

      <NewCategoryModal
        open={showNewCategory}
        showPriority={scope === "daily"}
        onClose={() => setShowNewCategory(false)}
        onSave={saveNewCategory}
      />

      <EditCategoryModal
        open={!!editing}
        title={editing?.title ?? ""}
        description={editing?.description ?? ""}
        priority={editing?.priority}
        tags={editing?.tags ?? []}
        recurrence={editing?.recurrence}
        reminder={editing?.reminder}
        scheduledAt={editing?.scheduledAt}
        deadline={editing?.deadline}
        showPriority={scope === "daily"}
        onClose={() => setEditing(null)}
        onSave={({
          title,
          description,
          priority: p,
          tags,
          recurrence,
          reminder,
          scheduledAt,
          deadline,
        }) => {
          if (!editing) return;
          if (scope === "daily") {
            actions.updateDailyCategory(editing.id, {
              title,
              description,
              tags,
              recurrence,
              reminder,
              scheduledAt,
              deadline,
              ...(p ? { priority: p } : {}),
            });
          } else if (scope === "monthly") {
            actions.updateMonthlyCategory(editing.id, { title, description, tags, deadline });
          } else {
            actions.updateAnnualCategory(editing.id, { title, description, tags, deadline });
          }
          toast.success("Task updated");
        }}
      />
    </PageContainer>
  );
}

export { shiftDate, shiftMonth };
