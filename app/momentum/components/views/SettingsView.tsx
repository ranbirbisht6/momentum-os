"use client";

import { useEffect, useRef, useState } from "react";
import type { MomentumActions } from "../../hooks/useMomentumStore";
import { useToast } from "../../hooks/useToast";
import { DISPLAY_NAME_KEY } from "../../constants";
import { resolveUserName } from "../../lib/user";
import { PageContainer } from "../design/PageContainer";
import { Surface } from "../design/Surface";
import { PrimaryButton } from "../ui/inputs";

export function SettingsView({ actions }: { actions: MomentumActions }) {
  const { exportData, importData, store, hydrated, setDisplayName } = actions;
  const toast = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [importText, setImportText] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    if (!hydrated) return;
    setName(resolveUserName(store) ?? "");
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

  return (
    <PageContainer className="max-w-lg space-y-6">
      <Surface>
        <p className="text-sm font-medium text-zinc-200">Display name</p>
        <p className="mt-1 text-xs text-zinc-500">
          Optional. When set, your greeting becomes &quot;Good evening, Name.&quot;
        </p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="mt-3 h-10 w-full rounded-lg border border-white/[0.06] bg-transparent px-3 text-sm outline-none focus:border-violet-500/20"
        />
        <div className="mt-3">
          <PrimaryButton onClick={saveName}>Save</PrimaryButton>
        </div>
      </Surface>

      <Surface>
        <p className="text-sm font-medium text-zinc-200">Export data</p>
        <p className="mt-1 text-xs text-zinc-500">Download a JSON backup.</p>
        <div className="mt-4">
          <PrimaryButton onClick={handleExport}>Export JSON</PrimaryButton>
        </div>
      </Surface>

      <Surface>
        <p className="text-sm font-medium text-zinc-200">Import data</p>
        <textarea
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
          rows={4}
          placeholder="Paste backup JSON…"
          className="mt-3 w-full resize-y rounded-lg border border-white/[0.06] bg-transparent px-3 py-2 text-sm outline-none focus:border-violet-500/20"
        />
        <input ref={fileRef} type="file" accept="application/json" className="mt-3 block text-xs text-zinc-500" />
        <div className="mt-4">
          <PrimaryButton onClick={handleImport}>Import</PrimaryButton>
        </div>
      </Surface>
    </PageContainer>
  );
}
