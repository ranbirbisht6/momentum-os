export function createId() {
  return crypto.randomUUID();
}

export function toDateKey(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function toMonthKey(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export function parseDateKey(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function parseMonthKey(key: string) {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m - 1, 1);
}

export function formatDateLabel(key: string) {
  return parseDateKey(key).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatMonthLabel(key: string) {
  return parseMonthKey(key).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
}

export function progressPercent(completed: number, total: number) {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

export function shiftDate(key: string, days: number) {
  const d = parseDateKey(key);
  d.setDate(d.getDate() + days);
  return toDateKey(d);
}

export function shiftMonth(key: string, months: number) {
  const d = parseMonthKey(key);
  d.setMonth(d.getMonth() + months);
  return toMonthKey(d);
}

export {
  aggregateProgress,
  filterCategories,
  flattenAnnualSubtasks,
  flattenDailySubtasks,
  flattenMonthlySubtasks,
  nextOrder,
  pickTodayFocus,
  PRIORITY_WEIGHT,
  sortByOrder,
  subtaskProgress,
} from "./utils/categories";
