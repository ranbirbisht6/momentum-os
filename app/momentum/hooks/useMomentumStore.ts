"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { MAX_CATEGORIES } from "../constants";
import { refreshStreakMeta } from "../streaks";
import {
  EMPTY_STORE,
  createSubtask,
  loadStore,
  parseStoreJson,
  saveStore,
} from "../storage";
import type {
  AnnualCategory,
  CreateCategoryInput,
  DailyCategory,
  Goal,
  JournalEntry,
  MomentumStore,
  MonthlyCategory,
  TeamWorkspace,
  TaskTag,
  WeeklyReview,
} from "../types";
import {
  categoryIsComplete,
  categoryProgress,
  parseDateKey,
  sortByOrder,
  toDateKey,
  toMonthKey,
} from "../utils";
import { createId } from "../utils";
import { nextOrder } from "../utils/categories";

function subtasksFromTitles(titles: string[]) {
  return titles
    .map((t) => t.trim())
    .filter(Boolean)
    .map((title) => createSubtask(title));
}

function tagsFromInput(tags?: TaskTag[]) {
  return [...new Set(tags ?? [])].filter(
    (tag): tag is TaskTag => tag === "urgent" || tag === "doc",
  );
}

function nextRecurrenceDate(category: DailyCategory) {
  const frequency = category.recurrence.frequency;
  if (frequency === "none") return null;
  const date = parseDateKey(category.dateKey);
  if (frequency === "daily") date.setDate(date.getDate() + 1);
  if (frequency === "weekly") date.setDate(date.getDate() + 7);
  if (frequency === "monthly") date.setMonth(date.getMonth() + 1);
  if (frequency === "yearly") date.setFullYear(date.getFullYear() + 1);
  if (frequency === "custom") {
    date.setDate(date.getDate() + Math.max(1, category.recurrence.customEveryDays ?? 1));
  }
  return toDateKey(date);
}

function cloneRecurringCategory(
  category: DailyCategory,
  dateKey: string,
  siblings: DailyCategory[],
): DailyCategory {
  return {
    ...category,
    id: createId(),
    completed: false,
    dateKey,
    createdAt: Date.now(),
    order: nextOrder(siblings),
    sourceRecurringId: category.sourceRecurringId ?? category.id,
    subtasks: category.subtasks.map((task) => ({
      ...task,
      id: createId(),
      completed: false,
      createdAt: Date.now(),
    })),
  };
}

function withRecurringInstance(
  categories: DailyCategory[],
  category: DailyCategory,
) {
  if (!categoryIsComplete(category)) return categories;
  const nextDateKey = nextRecurrenceDate(category);
  if (!nextDateKey) return categories;
  const recurringId = category.sourceRecurringId ?? category.id;
  const exists = categories.some(
    (item) =>
      item.dateKey === nextDateKey &&
      (item.sourceRecurringId === recurringId || item.id === recurringId),
  );
  if (exists) return categories;
  const siblings = categories.filter((item) => item.dateKey === nextDateKey);
  return [cloneRecurringCategory(category, nextDateKey, siblings), ...categories];
}

function goalActions(titles: string[]) {
  return titles.map((title) => ({
    id: createId(),
    title,
    completed: false,
  }));
}

function buildGoal(title: string, description = "", category = "Personal"): Goal {
  const normalized = title.trim() || "New goal";
  return {
    id: createId(),
    title: normalized,
    description,
    category,
    createdAt: Date.now(),
    milestones: [
      {
        id: createId(),
        title: `Foundation for ${normalized}`,
        completed: false,
        monthlyTargets: [
          {
            id: createId(),
            title: "Define scope and success metrics",
            completed: false,
            actions: goalActions(["Write why it matters", "Choose a measurable outcome"]),
          },
        ],
        weeklyTargets: [
          {
            id: createId(),
            title: "Set up the first focused week",
            completed: false,
            actions: goalActions(["Block focus time", "Pick the first deliverable"]),
          },
        ],
        dailyActions: goalActions(["Take one visible step", "Log progress"]),
      },
      {
        id: createId(),
        title: `Execution system for ${normalized}`,
        completed: false,
        monthlyTargets: [
          {
            id: createId(),
            title: "Build repeatable momentum",
            completed: false,
            actions: goalActions(["Review progress weekly", "Adjust targets"]),
          },
        ],
        weeklyTargets: [
          {
            id: createId(),
            title: "Complete a meaningful milestone slice",
            completed: false,
            actions: goalActions(["Plan work blocks", "Ship or submit one asset"]),
          },
        ],
        dailyActions: goalActions(["Complete the smallest next action"]),
      },
    ],
  };
}

export function useMomentumStore() {
  const [store, setStore] = useState<MomentumStore>(EMPTY_STORE);
  const [hydrated, setHydrated] = useState(false);

  const todayKey = toDateKey(new Date());
  const currentMonthKey = toMonthKey(new Date());
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const id = window.setTimeout(() => {
      setStore(loadStore());
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  const withStreak = useCallback(
    (next: MomentumStore): MomentumStore => ({
      ...next,
      streak: refreshStreakMeta(next, todayKey),
    }),
    [todayKey],
  );

  const updateStore = useCallback(
    (updater: (prev: MomentumStore) => MomentumStore) => {
      setStore((prev) => withStreak(updater(prev)));
    },
    [withStreak],
  );

  useEffect(() => {
    if (!hydrated) return;
    saveStore(store);
  }, [store, hydrated]);

  const todayCategories = useMemo(
    () =>
      sortByOrder(store.dailyCategories.filter((c) => c.dateKey === todayKey)),
    [store.dailyCategories, todayKey],
  );

  const todayProgress = useMemo(() => {
    const categories = store.dailyCategories.filter((c) => c.dateKey === todayKey);
    return categoryProgress(categories);
  }, [store.dailyCategories, todayKey]);

  const getDailyCategories = useCallback(
    (dateKey: string) =>
      sortByOrder(store.dailyCategories.filter((c) => c.dateKey === dateKey)),
    [store.dailyCategories],
  );

  const getMonthlyCategories = useCallback(
    (monthKey: string) =>
      sortByOrder(store.monthlyCategories.filter((c) => c.monthKey === monthKey)),
    [store.monthlyCategories],
  );

  const getAnnualCategories = useCallback(
    (year: number) =>
      sortByOrder(store.annualCategories.filter((c) => c.year === year)),
    [store.annualCategories],
  );

  const createDailyCategory = useCallback(
    (dateKey: string, input: CreateCategoryInput) => {
      const count = store.dailyCategories.filter((c) => c.dateKey === dateKey).length;
      if (count >= MAX_CATEGORIES || !input.title.trim()) return false;
      const forDate = store.dailyCategories.filter((c) => c.dateKey === dateKey);
      updateStore((prev) => ({
        ...prev,
        dailyCategories: [
          {
            id: createId(),
            title: input.title.trim(),
            description: (input.description ?? "").trim(),
            priority: input.priority ?? "medium",
            completed: false,
            tags: tagsFromInput(input.tags),
            recurrence: input.recurrence ?? { frequency: "none" },
            reminder: input.reminder ?? { offset: "none" },
            scheduledAt: input.scheduledAt,
            deadline: input.deadline,
            dateKey,
            subtasks: subtasksFromTitles(input.subtaskTitles),
            createdAt: Date.now(),
            order: nextOrder(forDate),
          },
          ...prev.dailyCategories,
        ],
      }));
      return true;
    },
    [store.dailyCategories, updateStore],
  );

  const updateDailyCategory = useCallback(
    (
      id: string,
      patch: Partial<
        Pick<
          DailyCategory,
          | "title"
          | "description"
          | "priority"
          | "tags"
          | "recurrence"
          | "reminder"
          | "scheduledAt"
          | "deadline"
          | "assigneeId"
          | "projectId"
        >
      >,
    ) => {
      updateStore((prev) => ({
        ...prev,
        dailyCategories: prev.dailyCategories.map((c) =>
          c.id === id ? { ...c, ...patch } : c,
        ),
      }));
    },
    [updateStore],
  );

  const toggleDailyCategory = useCallback(
    (id: string) => {
      updateStore((prev) => ({
        ...prev,
        dailyCategories: (() => {
          const updated = prev.dailyCategories.map((c) =>
            c.id === id && c.subtasks.length === 0
              ? { ...c, completed: !c.completed }
              : c,
          );
          const changed = updated.find((c) => c.id === id);
          return changed ? withRecurringInstance(updated, changed) : updated;
        })(),
      }));
    },
    [updateStore],
  );

  const deleteDailyCategory = useCallback(
    (id: string) => {
      updateStore((prev) => ({
        ...prev,
        dailyCategories: prev.dailyCategories.filter((c) => c.id !== id),
      }));
    },
    [updateStore],
  );

  const addDailySubtask = useCallback(
    (categoryId: string, title: string) => {
      if (!title.trim()) return false;
      updateStore((prev) => ({
        ...prev,
        dailyCategories: prev.dailyCategories.map((c) =>
          c.id === categoryId
            ? { ...c, subtasks: [createSubtask(title), ...c.subtasks] }
            : c,
        ),
      }));
      return true;
    },
    [updateStore],
  );

  const toggleDailySubtask = useCallback(
    (categoryId: string, subtaskId: string) => {
      updateStore((prev) => {
        const updated = prev.dailyCategories.map((c) =>
          c.id === categoryId
            ? {
                ...c,
                subtasks: c.subtasks.map((s) =>
                  s.id === subtaskId ? { ...s, completed: !s.completed } : s,
                ),
              }
            : c,
        );
        const changed = updated.find((c) => c.id === categoryId);
        return {
          ...prev,
          dailyCategories: changed
            ? withRecurringInstance(updated, changed)
            : updated,
        };
      });
    },
    [updateStore],
  );

  const deleteDailySubtask = useCallback(
    (categoryId: string, subtaskId: string) => {
      updateStore((prev) => ({
        ...prev,
        dailyCategories: prev.dailyCategories.map((c) =>
          c.id === categoryId
            ? { ...c, subtasks: c.subtasks.filter((s) => s.id !== subtaskId) }
            : c,
        ),
      }));
    },
    [updateStore],
  );

  const createMonthlyCategory = useCallback(
    (monthKey: string, input: CreateCategoryInput) => {
      const count = store.monthlyCategories.filter((c) => c.monthKey === monthKey).length;
      if (count >= MAX_CATEGORIES || !input.title.trim()) return false;
      const forMonth = store.monthlyCategories.filter((c) => c.monthKey === monthKey);
      updateStore((prev) => ({
        ...prev,
        monthlyCategories: [
          {
            id: createId(),
            title: input.title.trim(),
            description: (input.description ?? "").trim(),
            completed: false,
            tags: tagsFromInput(input.tags),
            monthKey,
            subtasks: subtasksFromTitles(input.subtaskTitles),
            createdAt: Date.now(),
            order: nextOrder(forMonth),
          },
          ...prev.monthlyCategories,
        ],
      }));
      return true;
    },
    [store.monthlyCategories, updateStore],
  );

  const updateMonthlyCategory = useCallback(
    (
      id: string,
      patch: Partial<Pick<MonthlyCategory, "title" | "description" | "tags" | "deadline">>,
    ) => {
      updateStore((prev) => ({
        ...prev,
        monthlyCategories: prev.monthlyCategories.map((c) =>
          c.id === id ? { ...c, ...patch } : c,
        ),
      }));
    },
    [updateStore],
  );

  const toggleMonthlyCategory = useCallback(
    (id: string) => {
      updateStore((prev) => ({
        ...prev,
        monthlyCategories: prev.monthlyCategories.map((c) =>
          c.id === id && c.subtasks.length === 0
            ? { ...c, completed: !c.completed }
            : c,
        ),
      }));
    },
    [updateStore],
  );

  const deleteMonthlyCategory = useCallback(
    (id: string) => {
      updateStore((prev) => ({
        ...prev,
        monthlyCategories: prev.monthlyCategories.filter((c) => c.id !== id),
      }));
    },
    [updateStore],
  );

  const addMonthlySubtask = useCallback(
    (categoryId: string, title: string) => {
      if (!title.trim()) return false;
      updateStore((prev) => ({
        ...prev,
        monthlyCategories: prev.monthlyCategories.map((c) =>
          c.id === categoryId
            ? { ...c, subtasks: [createSubtask(title), ...c.subtasks] }
            : c,
        ),
      }));
      return true;
    },
    [updateStore],
  );

  const toggleMonthlySubtask = useCallback(
    (categoryId: string, subtaskId: string) => {
      updateStore((prev) => ({
        ...prev,
        monthlyCategories: prev.monthlyCategories.map((c) =>
          c.id === categoryId
            ? {
                ...c,
                subtasks: c.subtasks.map((s) =>
                  s.id === subtaskId ? { ...s, completed: !s.completed } : s,
                ),
              }
            : c,
        ),
      }));
    },
    [updateStore],
  );

  const deleteMonthlySubtask = useCallback(
    (categoryId: string, subtaskId: string) => {
      updateStore((prev) => ({
        ...prev,
        monthlyCategories: prev.monthlyCategories.map((c) =>
          c.id === categoryId
            ? { ...c, subtasks: c.subtasks.filter((s) => s.id !== subtaskId) }
            : c,
        ),
      }));
    },
    [updateStore],
  );

  const createAnnualCategory = useCallback(
    (year: number, input: CreateCategoryInput) => {
      const count = store.annualCategories.filter((c) => c.year === year).length;
      if (count >= MAX_CATEGORIES || !input.title.trim()) return false;
      const forYear = store.annualCategories.filter((c) => c.year === year);
      updateStore((prev) => ({
        ...prev,
        annualCategories: [
          {
            id: createId(),
            title: input.title.trim(),
            description: (input.description ?? "").trim(),
            completed: false,
            tags: tagsFromInput(input.tags),
            year,
            subtasks: subtasksFromTitles(input.subtaskTitles),
            createdAt: Date.now(),
            order: nextOrder(forYear),
          },
          ...prev.annualCategories,
        ],
      }));
      return true;
    },
    [store.annualCategories, updateStore],
  );

  const updateAnnualCategory = useCallback(
    (
      id: string,
      patch: Partial<Pick<AnnualCategory, "title" | "description" | "tags" | "deadline">>,
    ) => {
      updateStore((prev) => ({
        ...prev,
        annualCategories: prev.annualCategories.map((c) =>
          c.id === id ? { ...c, ...patch } : c,
        ),
      }));
    },
    [updateStore],
  );

  const toggleAnnualCategory = useCallback(
    (id: string) => {
      updateStore((prev) => ({
        ...prev,
        annualCategories: prev.annualCategories.map((c) =>
          c.id === id && c.subtasks.length === 0
            ? { ...c, completed: !c.completed }
            : c,
        ),
      }));
    },
    [updateStore],
  );

  const deleteAnnualCategory = useCallback(
    (id: string) => {
      updateStore((prev) => ({
        ...prev,
        annualCategories: prev.annualCategories.filter((c) => c.id !== id),
      }));
    },
    [updateStore],
  );

  const addAnnualSubtask = useCallback(
    (categoryId: string, title: string) => {
      if (!title.trim()) return false;
      updateStore((prev) => ({
        ...prev,
        annualCategories: prev.annualCategories.map((c) =>
          c.id === categoryId
            ? { ...c, subtasks: [createSubtask(title), ...c.subtasks] }
            : c,
        ),
      }));
      return true;
    },
    [updateStore],
  );

  const toggleAnnualSubtask = useCallback(
    (categoryId: string, subtaskId: string) => {
      updateStore((prev) => ({
        ...prev,
        annualCategories: prev.annualCategories.map((c) =>
          c.id === categoryId
            ? {
                ...c,
                subtasks: c.subtasks.map((s) =>
                  s.id === subtaskId ? { ...s, completed: !s.completed } : s,
                ),
              }
            : c,
        ),
      }));
    },
    [updateStore],
  );

  const deleteAnnualSubtask = useCallback(
    (categoryId: string, subtaskId: string) => {
      updateStore((prev) => ({
        ...prev,
        annualCategories: prev.annualCategories.map((c) =>
          c.id === categoryId
            ? { ...c, subtasks: c.subtasks.filter((s) => s.id !== subtaskId) }
            : c,
        ),
      }));
    },
    [updateStore],
  );

  const setNotes = useCallback(
    (notes: string) => {
      updateStore((prev) => ({ ...prev, notes }));
    },
    [updateStore],
  );

  const setDisplayName = useCallback(
    (displayName: string) => {
      const trimmed = displayName.trim();
      updateStore((prev) => ({
        ...prev,
        displayName: trimmed || undefined,
      }));
    },
    [updateStore],
  );

  const moveDailyCategory = useCallback(
    (id: string, dateKey: string) => {
      updateStore((prev) => {
        const siblings = prev.dailyCategories.filter((c) => c.dateKey === dateKey);
        return {
          ...prev,
          dailyCategories: prev.dailyCategories.map((c) =>
            c.id === id
              ? {
                  ...c,
                  dateKey,
                  order: nextOrder(siblings),
                }
              : c,
          ),
        };
      });
    },
    [updateStore],
  );

  const createGoal = useCallback(
    (title: string, description?: string, category?: string) => {
      if (!title.trim()) return false;
      updateStore((prev) => ({
        ...prev,
        goals: [buildGoal(title, description, category), ...prev.goals],
      }));
      return true;
    },
    [updateStore],
  );

  const toggleGoalMilestone = useCallback(
    (goalId: string, milestoneId: string) => {
      updateStore((prev) => ({
        ...prev,
        goals: prev.goals.map((goal) =>
          goal.id === goalId
            ? {
                ...goal,
                milestones: goal.milestones.map((milestone) =>
                  milestone.id === milestoneId
                    ? { ...milestone, completed: !milestone.completed }
                    : milestone,
                ),
              }
            : goal,
        ),
      }));
    },
    [updateStore],
  );

  const createAiPlan = useCallback(
    (prompt: string) => {
      const title = prompt.trim();
      if (!title) return false;
      const goal = buildGoal(title, "Generated local planning blueprint.", "AI Plan");
      const today = toDateKey(new Date());
      updateStore((prev) => ({
        ...prev,
        goals: [goal, ...prev.goals],
        dailyCategories: [
          {
            id: createId(),
            title: `Plan: ${goal.title}`,
            description: "Review milestones and complete the first daily action.",
            priority: "high",
            completed: false,
            tags: ["doc"],
            recurrence: { frequency: "daily" },
            reminder: { offset: "1h" },
            dateKey: today,
            subtasks: goal.milestones[0].dailyActions.map((action) =>
              createSubtask(action.title),
            ),
            createdAt: Date.now(),
            order: nextOrder(prev.dailyCategories.filter((c) => c.dateKey === today)),
          },
          ...prev.dailyCategories,
        ],
      }));
      return true;
    },
    [updateStore],
  );

  const addWeeklyReview = useCallback(
    (review: Omit<WeeklyReview, "id" | "createdAt">) => {
      updateStore((prev) => ({
        ...prev,
        reviews: [
          {
            ...review,
            id: createId(),
            createdAt: Date.now(),
          },
          ...prev.reviews,
        ],
      }));
    },
    [updateStore],
  );

  const addJournalEntry = useCallback(
    (entry: Omit<JournalEntry, "id" | "createdAt" | "updatedAt">) => {
      updateStore((prev) => ({
        ...prev,
        journalEntries: [
          {
            ...entry,
            id: createId(),
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
          ...prev.journalEntries,
        ],
      }));
    },
    [updateStore],
  );

  const updateTeamWorkspace = useCallback(
    (patch: Partial<Pick<TeamWorkspace, "name" | "kind" | "members" | "projects">>) => {
      updateStore((prev) => ({
        ...prev,
        teamWorkspace: {
          ...prev.teamWorkspace,
          ...patch,
          activity: [
            {
              id: createId(),
              message: "Workspace updated locally.",
              createdAt: Date.now(),
            },
            ...prev.teamWorkspace.activity,
          ].slice(0, 12),
        },
      }));
    },
    [updateStore],
  );

  const assignDailyCategory = useCallback(
    (id: string, assigneeId: string) => {
      updateStore((prev) => ({
        ...prev,
        dailyCategories: prev.dailyCategories.map((c) =>
          c.id === id ? { ...c, assigneeId } : c,
        ),
        teamWorkspace: {
          ...prev.teamWorkspace,
          activity: [
            {
              id: createId(),
              message: "Task assignment updated.",
              createdAt: Date.now(),
            },
            ...prev.teamWorkspace.activity,
          ].slice(0, 12),
        },
      }));
    },
    [updateStore],
  );

  const exportData = useCallback(
    () => JSON.stringify(store, null, 2),
    [store],
  );

  const importData = useCallback(
    (json: string) => {
      try {
        const parsed = parseStoreJson(json);
        setStore(withStreak(parsed));
        return true;
      } catch {
        return false;
      }
    },
    [withStreak],
  );

  return {
    store,
    hydrated,
    todayKey,
    currentMonthKey,
    currentYear,
    todayCategories,
    todayProgress,
    getDailyCategories,
    getMonthlyCategories,
    getAnnualCategories,
    createDailyCategory,
    updateDailyCategory,
    toggleDailyCategory,
    deleteDailyCategory,
    addDailySubtask,
    toggleDailySubtask,
    deleteDailySubtask,
    createMonthlyCategory,
    updateMonthlyCategory,
    toggleMonthlyCategory,
    deleteMonthlyCategory,
    addMonthlySubtask,
    toggleMonthlySubtask,
    deleteMonthlySubtask,
    createAnnualCategory,
    updateAnnualCategory,
    toggleAnnualCategory,
    deleteAnnualCategory,
    addAnnualSubtask,
    toggleAnnualSubtask,
    deleteAnnualSubtask,
    setNotes,
    setDisplayName,
    moveDailyCategory,
    createGoal,
    toggleGoalMilestone,
    createAiPlan,
    addWeeklyReview,
    addJournalEntry,
    updateTeamWorkspace,
    assignDailyCategory,
    exportData,
    importData,
  };
}

export type MomentumActions = ReturnType<typeof useMomentumStore>;
