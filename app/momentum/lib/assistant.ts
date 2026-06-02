import type { AssistantInsight, MomentumStore } from "../types";
import {
  aggregateProgress,
  flattenDailySubtasks,
  flattenMonthlySubtasks,
  pickTodayFocus,
  subtaskProgress,
} from "../utils";
import { formatGreeting } from "./greeting";
import { getMostActiveCategoryToday } from "./dashboard";

export function buildAssistantInsights(
  store: MomentumStore,
  todayKey: string,
  currentMonthKey: string,
  userName?: string | null,
): AssistantInsight {
  const todayCats = store.dailyCategories.filter((c) => c.dateKey === todayKey);
  const todaySubtasks = flattenDailySubtasks(store.dailyCategories, todayKey);
  const todayProgress = aggregateProgress(todaySubtasks);
  const monthSubtasks = flattenMonthlySubtasks(
    store.monthlyCategories,
    currentMonthKey,
  );
  const monthProgress = aggregateProgress(monthSubtasks);
  const focus = pickTodayFocus(todayCats);
  const mostActive = getMostActiveCategoryToday(todayCats);

  const suggestedNextAction = focus
    ? `Finish ${focus.subtaskTitle}`
    : null;

  const recommendations: string[] = [];

  if (todayProgress.total > 0) {
    recommendations.push(
      `You completed ${todayProgress.percent}% of today's tasks.`,
    );
  }

  if (monthProgress.total > 0 && monthProgress.pending > 0) {
    recommendations.push(
      `You are behind monthly goals by ${monthProgress.pending} task${monthProgress.pending === 1 ? "" : "s"}.`,
    );
  }

  const streak = store.streak.currentStreak;
  if (streak > 0 && todayProgress.pending > 0) {
    const needed = Math.min(2, todayProgress.pending);
    recommendations.push(
      `Complete ${needed} more task${needed === 1 ? "" : "s"} to maintain your ${streak}-day streak.`,
    );
  }

  if (focus) {
    recommendations.push(`Focus on: ${focus.categoryTitle}`);
  } else if (mostActive) {
    recommendations.push(`Most activity is in ${mostActive.title} today.`);
  }

  if (todayProgress.total === 0) {
    recommendations.push("Add a category on Today to start planning.");
  }

  return {
    greeting: formatGreeting(userName),
    subtitle: "Ready to make progress today?",
    tasksLeftToday: todayProgress.pending,
    mostActiveCategory: mostActive?.title ?? null,
    suggestedNextAction,
    recommendations: recommendations.slice(0, 4),
  };
}
