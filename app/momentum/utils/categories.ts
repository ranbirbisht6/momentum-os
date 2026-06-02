import type {
  AnnualCategory,
  DailyCategory,
  MonthlyCategory,
  Priority,
  ProgressSnapshot,
  Subtask,
  TodayFocus,
} from "../types";
import { progressPercent } from "../utils";

export const PRIORITY_WEIGHT: Record<Priority, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

export function subtaskProgress(subtasks: Subtask[]): ProgressSnapshot {
  const total = subtasks.length;
  const completed = subtasks.filter((s) => s.completed).length;
  return {
    completed,
    total,
    pending: total - completed,
    percent: progressPercent(completed, total),
  };
}

export function sortByOrder<T extends { order: number }>(items: T[]) {
  return [...items].sort((a, b) => a.order - b.order);
}

export function nextOrder<T extends { order: number }>(items: T[]) {
  if (items.length === 0) return 0;
  return Math.max(...items.map((i) => i.order)) + 1;
}

export function flattenDailySubtasks(categories: DailyCategory[], dateKey?: string) {
  const cats = dateKey
    ? categories.filter((c) => c.dateKey === dateKey)
    : categories;
  return cats.flatMap((c) => c.subtasks);
}

export function flattenMonthlySubtasks(categories: MonthlyCategory[], monthKey?: string) {
  const cats = monthKey
    ? categories.filter((c) => c.monthKey === monthKey)
    : categories;
  return cats.flatMap((c) => c.subtasks);
}

export function flattenAnnualSubtasks(categories: AnnualCategory[], year?: number) {
  const cats = year ? categories.filter((c) => c.year === year) : categories;
  return cats.flatMap((c) => c.subtasks);
}

export function aggregateProgress(subtasks: Subtask[]): ProgressSnapshot {
  return subtaskProgress(subtasks);
}

export function pickTodayFocus(categories: DailyCategory[]): TodayFocus | null {
  const today = categories
    .map((c) => ({ category: c, progress: subtaskProgress(c.subtasks) }))
    .filter((x) => x.progress.pending > 0)
    .sort(
      (a, b) =>
        PRIORITY_WEIGHT[a.category.priority] - PRIORITY_WEIGHT[b.category.priority],
    );

  if (today.length === 0) return null;

  const { category } = today[0];
  const subtask = category.subtasks.find((s) => !s.completed);
  if (!subtask) return null;

  const progress = subtaskProgress(category.subtasks);
  return {
    categoryTitle: category.title,
    subtaskTitle: subtask.title,
    priority: category.priority,
    percent: progress.percent,
  };
}

export function filterCategories<
  T extends { title: string; subtasks: Subtask[] },
>(categories: T[], categoryQuery: string, subtaskQuery: string): T[] {
  const cq = categoryQuery.trim().toLowerCase();
  const sq = subtaskQuery.trim().toLowerCase();

  if (!cq && !sq) return categories;

  return categories
    .map((cat) => {
      const categoryMatch = !cq || cat.title.toLowerCase().includes(cq);
      const filteredSubtasks = sq
        ? cat.subtasks.filter((s) => s.title.toLowerCase().includes(sq))
        : cat.subtasks;

      if (sq) {
        if (filteredSubtasks.length === 0 && !categoryMatch) return null;
        return { ...cat, subtasks: filteredSubtasks };
      }

      return categoryMatch ? cat : null;
    })
    .filter((c): c is T => c !== null);
}
