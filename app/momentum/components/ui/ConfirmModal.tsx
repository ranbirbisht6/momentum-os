"use client";

import { Modal } from "./Modal";
import { PrimaryButton } from "./inputs";

export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Delete",
  onConfirm,
  onClose,
  danger = true,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
  danger?: boolean;
}) {
  return (
    <Modal open={open} title={title} onClose={onClose}>
      <p className="text-sm leading-relaxed text-zinc-400">{message}</p>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={onClose}
          className="min-h-11 flex-1 rounded-xl border border-white/10 text-sm text-zinc-400 hover:text-zinc-200"
        >
          Cancel
        </button>
        <PrimaryButton
          type="button"
          onClick={() => {
            onConfirm();
            onClose();
          }}
          gradient={
            danger ? "from-red-600 to-red-700" : "from-violet-600 to-fuchsia-600"
          }
        >
          {confirmLabel}
        </PrimaryButton>
      </div>
    </Modal>
  );
}
