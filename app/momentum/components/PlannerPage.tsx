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
  aggregateProgress,
  filterCategories,
  shiftDate,
  shiftMonth,
} from "../utils";
import { CategorySection, type CategoryData } from "./CategorySection";
import { EditCategoryModal } from "./EditCategoryModal";
import { NewCategoryModal } from "./NewCategoryModal";
import { PageContainer } from "./design/PageContainer";

type PlannerScope = "daily" | "monthly" | "annual";

export function PlannerPage({
  scope,
  actions,
  periodValue,
  setPeriodValue,
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

  const rawCategories = useMemo(() => {
    if (scope === "daily") return actions.getDailyCategories(String(periodValue));
    if (scope === "monthly") return actions.getMonthlyCategories(String(periodValue));
    return actions.getAnnualCategories(Number(periodValue));
  }, [scope, actions, periodValue]);

  type AnyCategory = DailyCategory | MonthlyCategory | AnnualCategory;

  const categories = useMemo(
    () => filterCategories<AnyCategory>(rawCategories, search, search),
    [rawCategories, search],
  );

  const progress = useMemo(
    () => aggregateProgress(rawCategories.flatMap((c) => c.subtasks)),
    [rawCategories],
  );

  const saveNewCategory = (input: CreateCategoryInput) => {
    let ok = false;
    if (scope === "daily") {
      ok = actions.createDailyCategory(String(periodValue), input);
    } else if (scope === "monthly") {
      ok = actions.createMonthlyCategory(String(periodValue), input);
    } else {
      ok = actions.createAnnualCategory(Number(periodValue), input);
    }
    if (ok) toast.success("Category saved");
    else toast.error(`Maximum ${MAX_CATEGORIES} categories for this period`);
  };

  const mapCategory = (c: AnyCategory): CategoryData => ({
    id: c.id,
    title: c.title,
    description: c.description || undefined,
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
            className="rounded-lg p-2 text-zinc-500 hover:bg-white/5 hover:text-zinc-200"
            aria-label="Previous"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {periodInput}
          <button
            type="button"
            onClick={onNext}
            className="rounded-lg p-2 text-zinc-500 hover:bg-white/5 hover:text-zinc-200"
            aria-label="Next"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          {!isCurrentPeriod && (
            <button
              type="button"
              onClick={onToday}
              className="ml-2 text-xs text-violet-400 hover:text-violet-300"
            >
              Today
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => setShowNewCategory(true)}
          disabled={rawCategories.length >= MAX_CATEGORIES}
          className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500 disabled:opacity-40"
        >
          <Plus className="h-4 w-4" />
          New category
        </button>
      </div>

      <p className="text-xs text-zinc-500">
        {progress.completed}/{progress.total} tasks · {rawCategories.length}/
        {MAX_CATEGORIES} categories
      </p>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search categories and tasks…"
          className="h-10 w-full rounded-xl border border-white/[0.06] bg-white/[0.02] pl-10 pr-4 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-violet-500/20"
        />
      </div>

      {!hydrated && (
        <p className="py-16 text-center text-sm text-zinc-500">Loading…</p>
      )}

      {hydrated && rawCategories.length === 0 && (
        <p className="py-16 text-center text-sm text-zinc-500">
          No categories yet. Create one to organize your tasks.
        </p>
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
                    toast.success("Task completed");
                    setTimeout(() => setFlashId(null), 600);
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
                  toast.success("Category deleted");
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
        showPriority={scope === "daily"}
        onClose={() => setEditing(null)}
        onSave={({ title, description, priority: p }) => {
          if (!editing) return;
          if (scope === "daily") {
            actions.updateDailyCategory(editing.id, {
              title,
              description,
              ...(p ? { priority: p } : {}),
            });
          } else if (scope === "monthly") {
            actions.updateMonthlyCategory(editing.id, { title, description });
          } else {
            actions.updateAnnualCategory(editing.id, { title, description });
          }
          toast.success("Category updated");
        }}
      />
    </PageContainer>
  );
}

export { shiftDate, shiftMonth };
