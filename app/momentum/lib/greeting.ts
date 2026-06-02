export function greetingForHour(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

/** Only append name when explicitly provided (e.g. auth or saved settings). */
export function formatGreeting(userName?: string | null) {
  const base = `${greetingForHour(new Date().getHours())}.`;
  const trimmed = userName?.trim();
  if (!trimmed) return base;
  return `${greetingForHour(new Date().getHours())}, ${trimmed}.`;
}
