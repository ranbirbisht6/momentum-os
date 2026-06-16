import type { ChartPoint, MomentumStore } from "./types";
import {
  categoryProgress,
  toDateKey,
  toMonthKey,
} from "./utils";
import type { Priority } from "./types";

export function dailyChart(store: MomentumStore, days = 7): ChartPoint[] {
  const points: ChartPoint[] = [];
  const end = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(end);
    d.setDate(d.getDate() - i);
    const key = toDateKey(d);
    const progress = categoryProgress(
      store.dailyCategories.filter((c) => c.dateKey === key),
    );
    points.push({
      label: d.toLocaleDateString(undefined, { weekday: "short" }),
      percent: progress.percent,
      completed: progress.completed,
      total: progress.total,
    });
  }

  return points;
}

export function monthlyChart(store: MomentumStore, months = 6): ChartPoint[] {
  const points: ChartPoint[] = [];
  const end = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(end.getFullYear(), end.getMonth() - i, 1);
    const key = toMonthKey(d);
    const progress = categoryProgress(
      store.monthlyCategories.filter((c) => c.monthKey === key),
    );
    points.push({
      label: d.toLocaleDateString(undefined, { month: "short" }),
      percent: progress.percent,
      completed: progress.completed,
      total: progress.total,
    });
  }

  return points;
}

export function annualChart(store: MomentumStore, years = 5): ChartPoint[] {
  const current = new Date().getFullYear();
  const points: ChartPoint[] = [];

  for (let y = current - (years - 1); y <= current; y++) {
    const progress = categoryProgress(
      store.annualCategories.filter((c) => c.year === y),
    );
    points.push({
      label: String(y),
      percent: progress.percent,
      completed: progress.completed,
      total: progress.total,
    });
  }

  return points;
}

export function taskStatistics(store: MomentumStore) {
  const categories = store.dailyCategories;
  const progress = categoryProgress(categories);
  const byPriority: Record<Priority, number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  };

  for (const cat of categories) {
    byPriority[cat.priority] += Math.max(1, cat.subtasks.length);
  }

  return {
    total: progress.total,
    categories: categories.length,
    completed: progress.completed,
    pending: progress.pending,
    inProgress: 0,
    completionRate: progress.percent,
    byPriority,
  };
}
