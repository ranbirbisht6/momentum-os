"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { MomentumActions } from "../../hooks/useMomentumStore";
import { useToast } from "../../hooks/useToast";
import { DISPLAY_NAME_KEY } from "../../constants";
import { resolveUserName } from "../../lib/user";
import { getSupabaseBrowserClient } from "../../../lib/supabase/client";
import { PageContainer } from "../design/PageContainer";
import { Surface } from "../design/Surface";
import { PrimaryButton } from "../ui/inputs";

export function SettingsView({ actions }: { actions: MomentumActions }) {
  const { exportData, importData, store, hydrated, setDisplayName } = actions;
  const toast = useToast();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [importText, setImportText] = useState("");
  const [name, setName] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    const id = window.setTimeout(() => setName(resolveUserName(store) ?? ""), 0);
    return () => window.clearTimeout(id);
  }, [hydrated, store]);

  const saveName = () => {
    const trimmed = name.trim();
    setDisplayName(trimmed);
    if (trimmed) localStorage.setItem(DISPLAY_NAME_KEY, trimmed);
    else localStorage.removeItem(DISPLAY_NAME_KEY);
    toast.success(trimmed ? "Name saved" : "Name cleared");
  };

  const handleExport = () => {
    const blob = new Blob([exportData()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `momentum-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported");
  };

  const handleImport = () => {
    const run = (text: string) => {
      if (importData(text)) {
        toast.success("Imported");
        setImportText("");
      } else toast.error("Invalid JSON");
    };
    if (fileRef.current?.files?.[0]) {
      const reader = new FileReader();
      reader.onload = () => run(String(reader.result ?? ""));
      reader.readAsText(fileRef.current.files[0]);
      return;
    }
    if (importText.trim()) run(importText.trim());
    else toast.error("Paste JSON or choose a file");
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      setLoggingOut(false);
      toast.error(error.message);
      return;
    }
    toast.success("Logged out");
    router.replace("/login");
    router.refresh();
  };

  return (
    <PageContainer className="max-w-lg space-y-6">
      <Surface>
        <p className="text-sm font-semibold text-[var(--text)]">Account</p>
        <p className="mt-1 text-xs muted-text">
          Sign out of this Momentum OS session on this device.
        </p>
        <div className="mt-4">
          <PrimaryButton onClick={handleLogout} disabled={loggingOut} tone="danger">
            {loggingOut ? "Logging out..." : "Logout"}
          </PrimaryButton>
        </div>
      </Surface>

      <Surface>
        <p className="text-sm font-semibold text-[var(--text)]">Display name</p>
        <p className="mt-1 text-xs muted-text">
          Optional. When set, your greeting becomes &quot;Good evening, Name.&quot;
        </p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="mt-3 h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--text)] outline-none placeholder:text-[var(--muted-soft)] focus:border-[var(--accent)]"
        />
        <div className="mt-3">
          <PrimaryButton onClick={saveName}>Save</PrimaryButton>
        </div>
      </Surface>

      <Surface>
        <p className="text-sm font-semibold text-[var(--text)]">Export data</p>
        <p className="mt-1 text-xs muted-text">Download a JSON backup.</p>
        <div className="mt-4">
          <PrimaryButton onClick={handleExport}>Export JSON</PrimaryButton>
        </div>
      </Surface>

      <Surface>
        <p className="text-sm font-semibold text-[var(--text)]">Import data</p>
        <textarea
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
          rows={4}
          placeholder="Paste backup JSON..."
          className="mt-3 w-full resize-y rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] outline-none placeholder:text-[var(--muted-soft)] focus:border-[var(--accent)]"
        />
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          className="mt-3 block text-xs muted-text"
        />
        <div className="mt-4">
          <PrimaryButton onClick={handleImport}>Import</PrimaryButton>
        </div>
      </Surface>
    </PageContainer>
  );
}
