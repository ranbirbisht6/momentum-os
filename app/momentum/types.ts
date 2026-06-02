export type Priority = "critical" | "high" | "medium" | "low";

export type Subtask = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
};

export type DailyCategory = {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  dateKey: string;
  subtasks: Subtask[];
  createdAt: number;
  order: number;
};

export type MonthlyCategory = {
  id: string;
  title: string;
  description: string;
  monthKey: string;
  subtasks: Subtask[];
  createdAt: number;
  order: number;
};

export type AnnualCategory = {
  id: string;
  title: string;
  description: string;
  year: number;
  subtasks: Subtask[];
  createdAt: number;
  order: number;
};

export type StreakMeta = {
  currentStreak: number;
  bestStreak: number;
  lastQualifiedDateKey: string | null;
  unlockedBadges: string[];
};

export type MomentumStore = {
  dailyCategories: DailyCategory[];
  monthlyCategories: MonthlyCategory[];
  annualCategories: AnnualCategory[];
  notes: string;
  streak: StreakMeta;
  displayName?: string;
};

export type CreateCategoryInput = {
  title: string;
  description?: string;
  subtaskTitles: string[];
  priority?: Priority;
};

export type TabId =
  | "dashboard"
  | "today"
  | "month"
  | "year"
  | "insights"
  | "settings";

export type ProgressSnapshot = {
  completed: number;
  total: number;
  percent: number;
  pending: number;
};

export type ChartPoint = {
  label: string;
  percent: number;
  completed: number;
  total: number;
};

export type TodayFocus = {
  categoryTitle: string;
  subtaskTitle: string;
  priority: Priority;
  percent: number;
};

export type AssistantInsight = {
  greeting: string;
  subtitle: string;
  tasksLeftToday: number;
  mostActiveCategory: string | null;
  suggestedNextAction: string | null;
  recommendations: string[];
};
