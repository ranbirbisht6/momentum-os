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
      <p className="text-sm leading-relaxed muted-text">{message}</p>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={onClose}
          className="min-h-11 flex-1 rounded-lg border border-[var(--border)] text-sm muted-text transition hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"
        >
          Cancel
        </button>
        <PrimaryButton
          type="button"
          onClick={() => {
            onConfirm();
            onClose();
          }}
          tone={danger ? "danger" : "primary"}
        >
          {confirmLabel}
        </PrimaryButton>
      </div>
    </Modal>
  );
}
