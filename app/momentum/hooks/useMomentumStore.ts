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
  MomentumStore,
  MonthlyCategory,
  Priority,
} from "../types";
import {
  aggregateProgress,
  flattenDailySubtasks,
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

export function useMomentumStore() {
  const [store, setStore] = useState<MomentumStore>(EMPTY_STORE);
  const [hydrated, setHydrated] = useState(false);

  const todayKey = toDateKey(new Date());
  const currentMonthKey = toMonthKey(new Date());
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    setStore(loadStore());
    setHydrated(true);
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
    const subtasks = flattenDailySubtasks(store.dailyCategories, todayKey);
    return aggregateProgress(subtasks);
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
    (id: string, patch: Partial<Pick<DailyCategory, "title" | "description" | "priority">>) => {
      updateStore((prev) => ({
        ...prev,
        dailyCategories: prev.dailyCategories.map((c) =>
          c.id === id ? { ...c, ...patch } : c,
        ),
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
      updateStore((prev) => ({
        ...prev,
        dailyCategories: prev.dailyCategories.map((c) =>
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
    (id: string, patch: Partial<Pick<MonthlyCategory, "title" | "description">>) => {
      updateStore((prev) => ({
        ...prev,
        monthlyCategories: prev.monthlyCategories.map((c) =>
          c.id === id ? { ...c, ...patch } : c,
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
    (id: string, patch: Partial<Pick<AnnualCategory, "title" | "description">>) => {
      updateStore((prev) => ({
        ...prev,
        annualCategories: prev.annualCategories.map((c) =>
          c.id === id ? { ...c, ...patch } : c,
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
    deleteDailyCategory,
    addDailySubtask,
    toggleDailySubtask,
    deleteDailySubtask,
    createMonthlyCategory,
    updateMonthlyCategory,
    deleteMonthlyCategory,
    addMonthlySubtask,
    toggleMonthlySubtask,
    deleteMonthlySubtask,
    createAnnualCategory,
    updateAnnualCategory,
    deleteAnnualCategory,
    addAnnualSubtask,
    toggleAnnualSubtask,
    deleteAnnualSubtask,
    setNotes,
    setDisplayName,
    exportData,
    importData,
  };
}

export type MomentumActions = ReturnType<typeof useMomentumStore>;
