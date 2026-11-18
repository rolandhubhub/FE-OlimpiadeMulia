import { getStatusMeta, statusToneClassName } from "@/lib/status";
import type { StatusKind } from "@/types/status";

type StatusChipProps = {
  /** Menentukan kamus label: event, pendaftaran, atau pesanan. */
  kind: StatusKind;
  /** Nilai status apa adanya dari data/API, mis. "menunggu_bayar". */
  status: string;
  className?: string;
};

export function StatusChip({ kind, status, className = "" }: StatusChipProps) {
  const meta = getStatusMeta(kind, status);

  return (
    <span
      className={`inline-flex items-center justify-center border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${statusToneClassName[meta.tone]} ${className}`}
    >
      {meta.label}
    </span>
  );
}
