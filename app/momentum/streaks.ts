import { BADGES } from "./constants";
import type { MomentumStore, StreakMeta } from "./types";
import {
  flattenAnnualSubtasks,
  flattenDailySubtasks,
  flattenMonthlySubtasks,
  progressPercent,
  toDateKey,
} from "./utils";

function dayQualifies(store: MomentumStore, dateKey: string) {
  const subtasks = flattenDailySubtasks(store.dailyCategories, dateKey);
  if (subtasks.length === 0) return false;
  const done = subtasks.filter((s) => s.completed).length;
  return progressPercent(done, subtasks.length) === 100;
}

function dateKeyBefore(key: string) {
  const d = new Date(key + "T12:00:00");
  d.setDate(d.getDate() - 1);
  return toDateKey(d);
}

export function computeStreakFromStore(
  store: MomentumStore,
  todayKey: string,
): Pick<StreakMeta, "currentStreak" | "bestStreak" | "lastQualifiedDateKey"> {
  let streak = 0;
  let cursor = todayKey;

  if (!dayQualifies(store, cursor)) {
    cursor = dateKeyBefore(cursor);
  }

  while (dayQualifies(store, cursor)) {
    streak += 1;
    cursor = dateKeyBefore(cursor);
  }

  let best = streak;
  const checked = new Set<string>();
  const allDates = [
    ...new Set(store.dailyCategories.map((c) => c.dateKey)),
  ].sort().reverse();

  for (const dateKey of allDates) {
    if (checked.has(dateKey) || !dayQualifies(store, dateKey)) continue;
    let run = 0;
    let c = dateKey;
    while (dayQualifies(store, c) && !checked.has(c)) {
      checked.add(c);
      run += 1;
      c = dateKeyBefore(c);
    }
    best = Math.max(best, run);
  }

  const lastQualified = allDates.find((d) => dayQualifies(store, d)) ?? null;

  return {
    currentStreak: streak,
    bestStreak: Math.max(best, streak),
    lastQualifiedDateKey: lastQualified,
  };
}

export function computeUnlockedBadges(store: MomentumStore): string[] {
  const unlocked = new Set(store.streak.unlockedBadges);
  const totalCompleted = flattenDailySubtasks(store.dailyCategories).filter(
    (s) => s.completed,
  ).length;
  const monthlyDone = flattenMonthlySubtasks(store.monthlyCategories).filter(
    (s) => s.completed,
  ).length;
  const annualDone = flattenAnnualSubtasks(store.annualCategories).filter(
    (s) => s.completed,
  ).length;
  const { currentStreak, bestStreak } = store.streak;

  if (totalCompleted >= 1) unlocked.add("first-task");
  if (totalCompleted >= 25) unlocked.add("tasks-25");
  if (monthlyDone >= 5) unlocked.add("goals-5");
  if (annualDone >= 3) unlocked.add("annual-3");
  if (currentStreak >= 3 || bestStreak >= 3) unlocked.add("streak-3");
  if (currentStreak >= 7 || bestStreak >= 7) unlocked.add("streak-7");
  if (currentStreak >= 14 || bestStreak >= 14) unlocked.add("streak-14");
  if (currentStreak >= 30 || bestStreak >= 30) unlocked.add("streak-30");

  return BADGES.filter((b) => unlocked.has(b.id)).map((b) => b.id);
}

export function refreshStreakMeta(
  store: MomentumStore,
  todayKey: string,
): StreakMeta {
  const computed = computeStreakFromStore(store, todayKey);
  const streak: StreakMeta = {
    ...store.streak,
    ...computed,
    bestStreak: Math.max(store.streak.bestStreak, computed.bestStreak),
  };
  const withBadges = { ...store, streak };
  return {
    ...streak,
    unlockedBadges: computeUnlockedBadges(withBadges),
  };
}
