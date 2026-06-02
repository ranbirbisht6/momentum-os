import { DISPLAY_NAME_KEY } from "../constants";
import type { MomentumStore } from "../types";

/** Returns a display name only when the user has saved one — never hardcoded. */
export function resolveUserName(store: MomentumStore): string | null {
  if (store.displayName?.trim()) return store.displayName.trim();
  if (typeof window === "undefined") return null;
  const saved = localStorage.getItem(DISPLAY_NAME_KEY);
  return saved?.trim() || null;
}
