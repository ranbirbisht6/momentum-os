"use client";

import { PanelLeftClose, PanelLeft, X } from "lucide-react";
import { NAV_ITEMS } from "../../constants";
import type { TabId } from "../../types";

export function Sidebar({
  activeTab,
  onNavigate,
  collapsed,
  mobileOpen,
  onCloseMobile,
  onToggleCollapse,
}: {
  activeTab: TabId;
  onNavigate: (tab: TabId) => void;
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onToggleCollapse: () => void;
}) {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 lg:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onCloseMobile}
        aria-hidden={!mobileOpen}
      />

      <aside
        className={`fixed top-0 left-0 z-50 flex h-full flex-col border-r border-white/[0.06] bg-[#09090b] transition-all duration-300 ease-out lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${collapsed ? "w-[4.25rem]" : "w-56"}`}
      >
        <div
          className={`flex h-14 items-center border-b border-white/[0.06] px-3 ${
            collapsed ? "justify-center" : "justify-between"
          }`}
        >
          {!collapsed && (
            <span className="text-sm font-semibold tracking-tight text-zinc-100">
              Momentum
            </span>
          )}
          <button
            type="button"
            onClick={onCloseMobile}
            className="rounded-md p-2 text-zinc-500 hover:text-zinc-300 lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden rounded-md p-2 text-zinc-500 hover:text-zinc-300 lg:block"
            aria-label={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed ? (
              <PanelLeft className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 p-2" aria-label="Main">
          {NAV_ITEMS.map((item) => {
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
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-white/[0.08] text-zinc-100"
                    : "text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-300"
                } ${collapsed ? "justify-center px-2" : ""}`}
              >
                <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
