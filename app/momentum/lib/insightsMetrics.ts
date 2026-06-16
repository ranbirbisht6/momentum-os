import { dailyChart, monthlyChart } from "../analytics";
import type { MomentumStore } from "../types";
import { categoryProgress } from "../utils";

export function weeklyCompletionRate(store: MomentumStore) {
  return dailyChart(store, 7);
}

export function monthlyCompletionRate(store: MomentumStore) {
  return monthlyChart(store, 6);
}

export function categoryPerformance(store: MomentumStore, todayKey: string) {
  return store.dailyCategories
    .filter((c) => c.dateKey === todayKey)
    .map((c) => ({
      title: c.title,
      ...categoryProgress([c]),
    }))
    .filter((c) => c.total > 0)
    .sort((a, b) => b.percent - a.percent);
}

export function mostActiveCategory(store: MomentumStore) {
  const all = [
    ...store.dailyCategories,
    ...store.monthlyCategories,
    ...store.annualCategories,
  ];
  if (all.length === 0) return null;
  const sorted = [...all].sort((a, b) => b.subtasks.length - a.subtasks.length);
  return { title: sorted[0].title, count: sorted[0].subtasks.length };
}

export function consistencyScore(store: MomentumStore) {
  const last7 = dailyChart(store, 7);
  const activeDays = last7.filter((d) => d.total > 0).length;
  const perfectDays = last7.filter((d) => d.total > 0 && d.percent === 100).length;
  if (activeDays === 0) return 0;
  return Math.round((perfectDays / activeDays) * 100);
}

export function successRate(store: MomentumStore) {
  return categoryProgress(store.dailyCategories).percent;
}

export function completionForecast(store: MomentumStore, todayKey: string) {
  const p = categoryProgress(
    store.dailyCategories.filter((c) => c.dateKey === todayKey),
  );
  if (p.pending === 0) return "On track to finish today.";
  if (p.percent >= 60) return `Likely to finish today with ${p.pending} tasks left.`;
  return `Need focused time on ${p.pending} remaining tasks today.`;
}
