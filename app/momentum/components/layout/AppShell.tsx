"use client";

import { useState, type ReactNode } from "react";
import { Menu } from "lucide-react";
import type { TabId } from "../../types";
import { Sidebar } from "./Sidebar";

export function AppShell({
  activeTab,
  onNavigate,
  title,
  darkMode,
  onToggleDarkMode,
  children,
}: {
  activeTab: TabId;
  onNavigate: (tab: TabId) => void;
  title: string;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  children: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar
        activeTab={activeTab}
        onNavigate={onNavigate}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        darkMode={darkMode}
        onCloseMobile={() => setMobileOpen(false)}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        onToggleDarkMode={onToggleDarkMode}
      />

      <div
        className={`flex min-w-0 flex-1 flex-col transition-[padding] duration-300 ${
          collapsed ? "lg:pl-[4.75rem]" : "lg:pl-64"
        }`}
      >
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b px-4 backdrop-blur-md sm:px-8 lg:h-[4.75rem]" style={{ borderColor: "var(--border)", background: "color-mix(in srgb, var(--bg) 86%, transparent)" }}>
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="rounded-xl p-2 muted-text transition hover:bg-[var(--surface-soft)] lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-semibold tracking-tight text-[var(--text)]">
            {title}
          </h1>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-10 xl:px-12">{children}</main>
      </div>
    </div>
  );
}
