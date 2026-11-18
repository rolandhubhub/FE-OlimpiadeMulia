"use client";

import type { AdminResultStatus } from "@/types/admin";
import Modal from "./modal";

interface ResultDialogProps {
  open: boolean;
  status: AdminResultStatus;
  title: string;
  message: string;
  onClose: () => void;
  actionLabel?: string;
}

export default function ResultDialog({
  open,
  status,
  title,
  message,
  onClose,
  actionLabel = "Tutup",
}: ResultDialogProps) {
  return (
    <Modal open={open} title="Hasil" onClose={onClose}>
      <div className={`result-dialog${status === "error" ? " result-dialog--error" : ""}`}>
        <span className="result-dialog__icon" aria-hidden="true">
          {status === "success" ? "✓" : "!"}
        </span>
        <h3 className="result-dialog__title">{title}</h3>
        <p className="result-dialog__message">{message}</p>
        <button type="button" onClick={onClose}>
          {actionLabel}
        </button>
      </div>
    </Modal>
  );
}
