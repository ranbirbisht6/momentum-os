"use client";

import { useEffect, useState } from "react";
import { TAB_TITLES, THEME_KEY } from "./constants";
import { ToastProvider } from "./hooks/useToast";
import { useMomentumStore } from "./hooks/useMomentumStore";
import type { TabId } from "./types";
import { toDateKey, toMonthKey } from "./utils";
import { AppShell } from "./components/layout/AppShell";
import { DashboardView } from "./components/views/DashboardView";
import { InsightsView } from "./components/views/InsightsView";
import { MonthView } from "./components/views/MonthView";
import { SettingsView } from "./components/views/SettingsView";
import { TodayView } from "./components/views/TodayView";
import { YearView } from "./components/views/YearView";

function MomentumContent() {
  const actions = useMomentumStore();
  const { todayKey, currentMonthKey, currentYear } = actions;

  const [tab, setTab] = useState<TabId>("dashboard");
  const [selectedDate, setSelectedDate] = useState(() => toDateKey(new Date()));
  const [selectedMonth, setSelectedMonth] = useState(() =>
    toMonthKey(new Date()),
  );
  const [selectedYear, setSelectedYear] = useState(() =>
    new Date().getFullYear(),
  );
  const [darkMode, setDarkMode] = useState(
    () => typeof window !== "undefined" && localStorage.getItem(THEME_KEY) === "dark",
  );

  useEffect(() => {
    document.documentElement.classList.toggle("theme-dark", darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((current) => {
      const next = !current;
      localStorage.setItem(THEME_KEY, next ? "dark" : "light");
      return next;
    });
  };

  return (
    <div className={`app-bg min-h-screen ${darkMode ? "theme-dark" : "theme-light"}`}>
      <AppShell
        activeTab={tab}
        onNavigate={setTab}
        title={TAB_TITLES[tab].title}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      >
        {tab === "dashboard" && <DashboardView actions={actions} />}
        {tab === "today" && (
          <TodayView
            actions={actions}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            todayKey={todayKey}
          />
        )}
        {tab === "month" && (
          <MonthView
            actions={actions}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            currentMonthKey={currentMonthKey}
          />
        )}
        {tab === "year" && (
          <YearView
            actions={actions}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            currentYear={currentYear}
          />
        )}
        {tab === "insights" && <InsightsView actions={actions} />}
        {tab === "analytics" && <InsightsView actions={actions} analyticsOnly />}
        {tab === "settings" && <SettingsView actions={actions} />}
      </AppShell>
    </div>
  );
}

export default function MomentumApp() {
  return (
    <ToastProvider>
      <MomentumContent />
    </ToastProvider>
  );
}
