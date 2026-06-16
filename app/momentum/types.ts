export type Priority = "critical" | "high" | "medium" | "low";
export type TaskTag = "urgent" | "doc";
export type RecurrenceFrequency =
  | "none"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "custom";
export type ReminderOffset =
  | "none"
  | "15m"
  | "30m"
  | "1h"
  | "3h"
  | "1d"
  | "custom";
export type CalendarMode = "day" | "week" | "month" | "agenda";
export type ReviewType = "quick" | "detailed";
export type JournalType = "morning" | "reflection" | "brain-dump" | "notes";
export type WorkspaceKind = "company" | "startup" | "team" | "department";
export type TeamRole = "owner" | "admin" | "manager" | "member";

export type RecurrenceRule = {
  frequency: RecurrenceFrequency;
  customEveryDays?: number;
};

export type ReminderRule = {
  offset: ReminderOffset;
  customMinutes?: number;
};

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
  completed: boolean;
  tags: TaskTag[];
  recurrence: RecurrenceRule;
  reminder: ReminderRule;
  scheduledAt?: string;
  deadline?: string;
  assigneeId?: string;
  projectId?: string;
  dateKey: string;
  subtasks: Subtask[];
  createdAt: number;
  order: number;
  sourceRecurringId?: string;
};

export type MonthlyCategory = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  tags: TaskTag[];
  deadline?: string;
  monthKey: string;
  subtasks: Subtask[];
  createdAt: number;
  order: number;
};

export type AnnualCategory = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  tags: TaskTag[];
  deadline?: string;
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
  goals: Goal[];
  reviews: WeeklyReview[];
  journalEntries: JournalEntry[];
  teamWorkspace: TeamWorkspace;
  notes: string;
  streak: StreakMeta;
  displayName?: string;
};

export type CreateCategoryInput = {
  title: string;
  description?: string;
  subtaskTitles: string[];
  priority?: Priority;
  tags?: TaskTag[];
  recurrence?: RecurrenceRule;
  reminder?: ReminderRule;
  scheduledAt?: string;
  deadline?: string;
};

export type TabId =
  | "dashboard"
  | "calendar"
  | "today"
  | "month"
  | "year"
  | "goals"
  | "ai-planning"
  | "reviews"
  | "journal"
  | "team"
  | "insights"
  | "analytics"
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

export type GoalAction = {
  id: string;
  title: string;
  completed: boolean;
};

export type GoalTarget = {
  id: string;
  title: string;
  completed: boolean;
  actions: GoalAction[];
};

export type GoalMilestone = {
  id: string;
  title: string;
  completed: boolean;
  monthlyTargets: GoalTarget[];
  weeklyTargets: GoalTarget[];
  dailyActions: GoalAction[];
};

export type Goal = {
  id: string;
  title: string;
  description: string;
  category: string;
  milestones: GoalMilestone[];
  createdAt: number;
};

export type WeeklyReview = {
  id: string;
  type: ReviewType;
  weekKey: string;
  prompt: string;
  wins: string;
  losses: string;
  lessons: string;
  habits: string;
  productivity: string;
  focus: string;
  nextWeekPlan: string;
  createdAt: number;
};

export type JournalEntry = {
  id: string;
  type: JournalType;
  title: string;
  body: string;
  createdAt: number;
  updatedAt: number;
};

export type TeamMember = {
  id: string;
  name: string;
  role: TeamRole;
};

export type TeamProject = {
  id: string;
  title: string;
  deadline: string;
  progress: number;
};

export type TeamActivity = {
  id: string;
  message: string;
  createdAt: number;
};

export type TeamWorkspace = {
  id: string;
  name: string;
  kind: WorkspaceKind;
  members: TeamMember[];
  projects: TeamProject[];
  activity: TeamActivity[];
};
