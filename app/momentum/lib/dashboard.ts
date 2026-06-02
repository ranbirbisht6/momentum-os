import type { DailyCategory } from "../types";
import { subtaskProgress } from "../utils";

export function getMostActiveCategoryToday(categories: DailyCategory[]) {
  if (categories.length === 0) return null;
  const ranked = categories
    .map((c) => ({
      title: c.title,
      pending: subtaskProgress(c.subtasks).pending,
      total: c.subtasks.length,
    }))
    .sort((a, b) => b.pending - a.pending || b.total - a.total);
  return ranked[0] ?? null;
}

export function getRecentCategories(categories: DailyCategory[], limit = 5) {
  return categories
    .map((c) => ({
      id: c.id,
      title: c.title,
      ...subtaskProgress(c.subtasks),
    }))
    .filter((c) => c.total > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, limit);
}
