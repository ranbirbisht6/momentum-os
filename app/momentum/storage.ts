import {
  EMPTY_STREAK,
  LEGACY_STORAGE_KEY,
  STORAGE_KEY,
  STORAGE_KEY_V2,
} from "./constants";
import type {
  AnnualCategory,
  DailyCategory,
  MomentumStore,
  MonthlyCategory,
  Priority,
  Subtask,
} from "./types";
import { createId, toDateKey } from "./utils";
import { nextOrder, sortByOrder } from "./utils/categories";

export const EMPTY_STORE: MomentumStore = {
  dailyCategories: [],
  monthlyCategories: [],
  annualCategories: [],
  notes: "",
  streak: { ...EMPTY_STREAK, unlockedBadges: [] },
};

function migrateSubtask(raw: Record<string, unknown>): Subtask {
  return {
    id: String(raw.id ?? createId()),
    title: String(raw.title ?? ""),
    completed: Boolean(raw.completed),
    createdAt: Number(raw.createdAt ?? Date.now()),
  };
}

function migrateDailyCategory(
  raw: Record<string, unknown>,
  index: number,
): DailyCategory {
  const subtasks = Array.isArray(raw.subtasks)
    ? (raw.subtasks as Record<string, unknown>[]).map(migrateSubtask)
    : [];
  return {
    id: String(raw.id ?? createId()),
    title: String(raw.title ?? ""),
    description: String(raw.description ?? ""),
    priority: (raw.priority as Priority) ?? "medium",
    dateKey: String(raw.dateKey ?? toDateKey(new Date())),
    subtasks,
    createdAt: Number(raw.createdAt ?? Date.now()),
    order: Number(raw.order ?? index),
  };
}

function migrateMonthlyCategory(
  raw: Record<string, unknown>,
  index: number,
): MonthlyCategory {
  const subtasks = Array.isArray(raw.subtasks)
    ? (raw.subtasks as Record<string, unknown>[]).map(migrateSubtask)
    : [];
  return {
    id: String(raw.id ?? createId()),
    title: String(raw.title ?? ""),
    description: String(raw.description ?? ""),
    monthKey: String(raw.monthKey ?? ""),
    subtasks,
    createdAt: Number(raw.createdAt ?? Date.now()),
    order: Number(raw.order ?? index),
  };
}

function migrateAnnualCategory(
  raw: Record<string, unknown>,
  index: number,
): AnnualCategory {
  const subtasks = Array.isArray(raw.subtasks)
    ? (raw.subtasks as Record<string, unknown>[]).map(migrateSubtask)
    : [];
  return {
    id: String(raw.id ?? createId()),
    title: String(raw.title ?? ""),
    description: String(raw.description ?? ""),
    year: Number(raw.year ?? new Date().getFullYear()),
    subtasks,
    createdAt: Number(raw.createdAt ?? Date.now()),
    order: Number(raw.order ?? index),
  };
}

/** v2 flat daily task → category with one subtask */
function taskToDailyCategory(raw: Record<string, unknown>, index: number): DailyCategory {
  const completed = Boolean(raw.completed);
  return {
    id: String(raw.id ?? createId()),
    title: String(raw.title ?? "Untitled"),
    description: "",
    priority: (raw.priority as Priority) ?? "medium",
    dateKey: String(raw.dateKey ?? toDateKey(new Date())),
    subtasks: [
      {
        id: createId(),
        title: String(raw.title ?? "Task"),
        completed,
        createdAt: Number(raw.createdAt ?? Date.now()),
      },
    ],
    createdAt: Number(raw.createdAt ?? Date.now()),
    order: Number(raw.order ?? index),
  };
}

function goalToMonthlyCategory(raw: Record<string, unknown>, index: number): MonthlyCategory {
  const completed = Boolean(raw.completed);
  return {
    id: String(raw.id ?? createId()),
    title: String(raw.title ?? "Untitled"),
    description: "",
    monthKey: String(raw.monthKey ?? ""),
    subtasks: [
      {
        id: createId(),
        title: String(raw.title ?? "Goal"),
        completed,
        createdAt: Number(raw.createdAt ?? Date.now()),
      },
    ],
    createdAt: Number(raw.createdAt ?? Date.now()),
    order: index,
  };
}

function objectiveToAnnualCategory(
  raw: Record<string, unknown>,
  index: number,
): AnnualCategory {
  const completed = Boolean(raw.completed);
  return {
    id: String(raw.id ?? createId()),
    title: String(raw.title ?? "Untitled"),
    description: "",
    year: Number(raw.year ?? new Date().getFullYear()),
    subtasks: [
      {
        id: createId(),
        title: String(raw.title ?? "Objective"),
        completed,
        createdAt: Number(raw.createdAt ?? Date.now()),
      },
    ],
    createdAt: Number(raw.createdAt ?? Date.now()),
    order: index,
  };
}

function migrateFromLegacyFlat(partial: Record<string, unknown>): MomentumStore {
  const dailyTasks = Array.isArray(partial.dailyTasks)
    ? (partial.dailyTasks as Record<string, unknown>[])
    : [];
  const monthlyGoals = Array.isArray(partial.monthlyGoals)
    ? (partial.monthlyGoals as Record<string, unknown>[])
    : [];
  const annualObjectives = Array.isArray(partial.annualObjectives)
    ? (partial.annualObjectives as Record<string, unknown>[])
    : [];

  return {
    dailyCategories: dailyTasks.map(taskToDailyCategory),
    monthlyCategories: monthlyGoals.map(goalToMonthlyCategory),
    annualCategories: annualObjectives.map(objectiveToAnnualCategory),
    notes: typeof partial.notes === "string" ? partial.notes : "",
    streak: {
      ...EMPTY_STREAK,
      ...((partial.streak as object) ?? {}),
      unlockedBadges:
        (partial.streak as { unlockedBadges?: string[] })?.unlockedBadges ?? [],
    },
  };
}

export function normalizeStore(partial: Partial<MomentumStore> & Record<string, unknown>): MomentumStore {
  const hasNewShape =
    Array.isArray(partial.dailyCategories) ||
    Array.isArray(partial.monthlyCategories) ||
    Array.isArray(partial.annualCategories);

  if (!hasNewShape && (partial.dailyTasks || partial.monthlyGoals || partial.annualObjectives)) {
    return migrateFromLegacyFlat(partial);
  }

  const dailyCategories = (partial.dailyCategories ?? []).map((c, i) =>
    migrateDailyCategory(c as unknown as Record<string, unknown>, i),
  );
  const monthlyCategories = (partial.monthlyCategories ?? []).map((c, i) =>
    migrateMonthlyCategory(c as unknown as Record<string, unknown>, i),
  );
  const annualCategories = (partial.annualCategories ?? []).map((c, i) =>
    migrateAnnualCategory(c as unknown as Record<string, unknown>, i),
  );

  return {
    dailyCategories: sortByOrder(dailyCategories),
    monthlyCategories: sortByOrder(monthlyCategories),
    annualCategories: sortByOrder(annualCategories),
    notes: typeof partial.notes === "string" ? partial.notes : "",
    displayName:
      typeof partial.displayName === "string" ? partial.displayName : undefined,
    streak: {
      ...EMPTY_STREAK,
      ...(partial.streak ?? {}),
      unlockedBadges: partial.streak?.unlockedBadges ?? [],
    },
  };
}

export function parseStoreJson(raw: string): MomentumStore {
  const parsed = JSON.parse(raw) as Partial<MomentumStore> & Record<string, unknown>;
  return normalizeStore(parsed);
}

function loadFromKey(key: string): MomentumStore | null {
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  return parseStoreJson(raw);
}

export function loadStore(): MomentumStore {
  if (typeof window === "undefined") return EMPTY_STORE;
  try {
    const current = loadFromKey(STORAGE_KEY);
    if (current) return current;

    const v2 = loadFromKey(STORAGE_KEY_V2);
    if (v2) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(v2));
      return v2;
    }

    const legacy = loadFromKey(LEGACY_STORAGE_KEY);
    if (legacy) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(legacy));
      return legacy;
    }

    return EMPTY_STORE;
  } catch {
    return EMPTY_STORE;
  }
}

export function saveStore(store: MomentumStore) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function createSubtask(title: string): Subtask {
  return {
    id: createId(),
    title: title.trim(),
    completed: false,
    createdAt: Date.now(),
  };
}
