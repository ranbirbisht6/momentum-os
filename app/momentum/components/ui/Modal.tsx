"use client";

import { useEffect, type ReactNode } from "react";

export function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal
        aria-labelledby="modal-title"
        className="relative w-full max-w-md animate-in fade-in zoom-in-95 rounded-2xl border border-white/10 bg-zinc-900/95 p-6 shadow-2xl backdrop-blur-xl duration-300"
      >
        <h3 id="modal-title" className="text-lg font-bold text-zinc-100">
          {title}
        </h3>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
