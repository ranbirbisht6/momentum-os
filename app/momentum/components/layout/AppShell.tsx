"use client";

import { useState, type ReactNode } from "react";
import { Menu } from "lucide-react";
import type { TabId } from "../../types";
import { Sidebar } from "./Sidebar";

export function AppShell({
  activeTab,
  onNavigate,
  title,
  children,
}: {
  activeTab: TabId;
  onNavigate: (tab: TabId) => void;
  title: string;
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
        onCloseMobile={() => setMobileOpen(false)}
        onToggleCollapse={() => setCollapsed((c) => !c)}
      />

      <div
        className={`flex min-w-0 flex-1 flex-col transition-[padding] duration-300 ${
          collapsed ? "lg:pl-[4.25rem]" : "lg:pl-56"
        }`}
      >
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-white/[0.06] bg-[#09090b]/90 px-4 backdrop-blur-md sm:px-8">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-zinc-500 hover:bg-white/5 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold tracking-tight text-zinc-100">
            {title}
          </h1>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
