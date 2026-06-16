"use client";

import { Moon, PanelLeft, PanelLeftClose, Sun, X } from "lucide-react";
import { PRIMARY_NAV_ITEMS, SECONDARY_NAV_ITEMS } from "../../constants";
import type { TabId } from "../../types";

export function Sidebar({
  activeTab,
  onNavigate,
  collapsed,
  mobileOpen,
  darkMode,
  onCloseMobile,
  onToggleCollapse,
  onToggleDarkMode,
}: {
  activeTab: TabId;
  onNavigate: (tab: TabId) => void;
  collapsed: boolean;
  mobileOpen: boolean;
  darkMode: boolean;
  onCloseMobile: () => void;
  onToggleCollapse: () => void;
  onToggleDarkMode: () => void;
}) {
  const renderNavItem = (item: (typeof PRIMARY_NAV_ITEMS)[number]) => {
    const active = activeTab === item.id;
    const Icon = item.icon;
    return (
      <button
        key={item.id}
        type="button"
        onClick={() => {
          onNavigate(item.id);
          onCloseMobile();
        }}
        title={collapsed ? item.label : undefined}
        className={`flex h-10 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium transition ${
          active
            ? "bg-[var(--accent-soft)] text-[var(--accent-strong)]"
            : "muted-text hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"
        } ${collapsed ? "justify-center px-2" : ""}`}
      >
        <Icon className="h-4 w-4 shrink-0" strokeWidth={1.8} />
        {!collapsed && <span>{item.label}</span>}
      </button>
    );
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-stone-950/35 transition-opacity duration-300 lg:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onCloseMobile}
        aria-hidden={!mobileOpen}
      />

      <aside
        className={`surface fixed top-0 left-0 z-50 flex h-full flex-col border-r transition-all duration-300 ease-out lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${collapsed ? "w-[4.75rem]" : "w-64"}`}
      >
        <div
          className={`flex h-16 items-center border-b px-3 ${
            collapsed ? "justify-center" : "justify-between"
          }`}
          style={{ borderColor: "var(--border)" }}
        >
          {!collapsed && (
            <div>
              <span className="text-sm font-semibold tracking-tight text-[var(--text)]">
                Momentum
              </span>
              <p className="mt-0.5 text-[0.68rem] uppercase tracking-[0.18em] soft-text">
                OS
              </p>
            </div>
          )}
          <button
            type="button"
            onClick={onCloseMobile}
            className="rounded-md p-2 muted-text hover:text-[var(--text)] lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden rounded-md p-2 muted-text transition hover:bg-[var(--surface-soft)] hover:text-[var(--text)] lg:block"
            aria-label={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed ? (
              <PanelLeft className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-3" aria-label="Main">
          {PRIMARY_NAV_ITEMS.map(renderNavItem)}
        </nav>

        <nav className="space-y-1 border-t p-3" aria-label="Workspace" style={{ borderColor: "var(--border)" }}>
          {SECONDARY_NAV_ITEMS.map(renderNavItem)}
          <button
            type="button"
            onClick={onToggleDarkMode}
            title={collapsed ? "Dark mode" : undefined}
            className={`flex h-10 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium muted-text transition hover:bg-[var(--surface-soft)] hover:text-[var(--text)] ${
              collapsed ? "justify-center px-2" : ""
            }`}
            aria-pressed={darkMode}
          >
            {darkMode ? (
              <Sun className="h-4 w-4 shrink-0" strokeWidth={1.8} />
            ) : (
              <Moon className="h-4 w-4 shrink-0" strokeWidth={1.8} />
            )}
            {!collapsed && <span>Dark Mode</span>}
          </button>
        </nav>
      </aside>
    </>
  );
}
