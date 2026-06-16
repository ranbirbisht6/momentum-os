import type { LucideIcon } from "lucide-react";
import {
  Brain,
  Calendar,
  CalendarRange,
  ChartNoAxesColumnIncreasing,
  Goal,
  PenLine,
  LayoutDashboard,
  NotepadText,
  Settings,
  Moon,
  Sparkles,
  Users,
  Target,
} from "lucide-react";
import type {
  Priority,
  ReminderOffset,
  RecurrenceFrequency,
  TabId,
  TaskTag,
  TeamWorkspace,
} from "./types";

export const STORAGE_KEY = "momentum-os-v3";
export const STORAGE_KEY_V2 = "momentum-os-v2";
export const LEGACY_STORAGE_KEY = "momentum-dashboard-v1";
export const MAX_CATEGORIES = 10;
export const DISPLAY_NAME_KEY = "momentum-display-name";
export const THEME_KEY = "momentum-theme";

export const PRIORITIES: { value: Priority; label: string }[] = [
  { value: "critical", label: "Critical" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

export const PRIORITY_DOT: Record<Priority, string> = {
  critical: "bg-red-500",
  high: "bg-amber-500",
  medium: "bg-stone-400",
  low: "bg-emerald-600",
};

export const TASK_TAGS: { value: TaskTag; label: string }[] = [
  { value: "urgent", label: "Urgent" },
  { value: "doc", label: "Doc" },
];

export const RECURRENCE_OPTIONS: {
  value: RecurrenceFrequency;
  label: string;
}[] = [
  { value: "none", label: "No repeat" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
  { value: "custom", label: "Custom" },
];

export const REMINDER_OPTIONS: { value: ReminderOffset; label: string }[] = [
  { value: "none", label: "No reminder" },
  { value: "15m", label: "15 minutes" },
  { value: "30m", label: "30 minutes" },
  { value: "1h", label: "1 hour" },
  { value: "3h", label: "3 hours" },
  { value: "1d", label: "1 day" },
  { value: "custom", label: "Custom" },
];

export const TASK_TAG_STYLES: Record<TaskTag, string> = {
  urgent: "tag-urgent",
  doc: "tag-doc",
};

export const PRIMARY_NAV_ITEMS: { id: TabId; label: string; icon: LucideIcon }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "today", label: "Today", icon: Target },
  { id: "month", label: "Month", icon: CalendarRange },
  { id: "year", label: "Year", icon: CalendarRange },
  { id: "goals", label: "Goals", icon: Goal },
  { id: "ai-planning", label: "AI Planning", icon: Sparkles },
  { id: "reviews", label: "Reviews", icon: NotepadText },
  { id: "journal", label: "Journal", icon: PenLine },
  { id: "team", label: "Team", icon: Users },
  { id: "insights", label: "Insights", icon: Brain },
  { id: "analytics", label: "Analytics", icon: ChartNoAxesColumnIncreasing },
];

export const SECONDARY_NAV_ITEMS: { id: TabId; label: string; icon: LucideIcon }[] = [
  { id: "settings", label: "Settings", icon: Settings },
];

export const THEME_TOGGLE_ICON = Moon;

export const TAB_TITLES: Record<TabId, { title: string; subtitle?: string }> = {
  dashboard: { title: "Dashboard" },
  calendar: { title: "Calendar" },
  today: { title: "Today" },
  month: { title: "Month" },
  year: { title: "Year" },
  goals: { title: "Goals" },
  "ai-planning": { title: "AI Planning" },
  reviews: { title: "Reviews" },
  journal: { title: "Journal" },
  team: { title: "Team" },
  insights: { title: "Insights" },
  analytics: { title: "Analytics" },
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

export const DEFAULT_TEAM_WORKSPACE: TeamWorkspace = {
  id: "local-team",
  name: "Momentum Workspace",
  kind: "startup",
  members: [],
  projects: [],
  activity: [],
};
