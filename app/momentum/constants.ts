import type { LucideIcon } from "lucide-react";
import {
  Brain,
  Calendar,
  CalendarRange,
  LayoutDashboard,
  Settings,
  Sparkles,
  Target,
} from "lucide-react";
import type { Priority, TabId } from "./types";

export const STORAGE_KEY = "momentum-os-v3";
export const STORAGE_KEY_V2 = "momentum-os-v2";
export const LEGACY_STORAGE_KEY = "momentum-dashboard-v1";
export const MAX_CATEGORIES = 10;
export const DISPLAY_NAME_KEY = "momentum-display-name";

export const PRIORITIES: { value: Priority; label: string }[] = [
  { value: "critical", label: "Critical" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

export const PRIORITY_DOT: Record<Priority, string> = {
  critical: "bg-red-400",
  high: "bg-orange-400",
  medium: "bg-violet-400",
  low: "bg-emerald-400",
};

export const NAV_ITEMS: { id: TabId; label: string; icon: LucideIcon }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "today", label: "Today", icon: Target },
  { id: "month", label: "Month", icon: Calendar },
  { id: "year", label: "Year", icon: CalendarRange },
  { id: "insights", label: "Insights", icon: Brain },
  { id: "settings", label: "Settings", icon: Settings },
];

export const TAB_TITLES: Record<TabId, { title: string; subtitle?: string }> = {
  dashboard: { title: "Dashboard" },
  today: { title: "Today" },
  month: { title: "Month" },
  year: { title: "Year" },
  insights: { title: "Insights" },
  settings: { title: "Settings" },
};

export const BADGES = [
  { id: "first-task", name: "First Step", description: "Complete your first task" },
  { id: "streak-3", name: "On Fire", description: "3-day completion streak" },
  { id: "streak-7", name: "Week Warrior", description: "7-day completion streak" },
  { id: "streak-14", name: "Unstoppable", description: "14-day completion streak" },
  { id: "streak-30", name: "Legend", description: "30-day completion streak" },
  { id: "tasks-25", name: "Producer", description: "Complete 25 tasks total" },
  { id: "goals-5", name: "Planner", description: "Complete 5 monthly tasks" },
  { id: "annual-3", name: "Visionary", description: "Complete 3 annual tasks" },
] as const;

export const EMPTY_STREAK = {
  currentStreak: 0,
  bestStreak: 0,
  lastQualifiedDateKey: null,
  unlockedBadges: [] as string[],
};
