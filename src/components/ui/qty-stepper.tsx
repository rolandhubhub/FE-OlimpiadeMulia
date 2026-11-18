"use client";

import { Minus, Plus } from "lucide-react";

type QtyStepperProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  /** Untuk aria-label grup, mis. "Jumlah buku". */
  label?: string;
};

/**
 * Pengatur jumlah (- 1 +) seperti .qty-control di design/user-html/buku-keranjang.html.
 * "use client" karena memanggil onChange (state milik halaman pemanggil).
 */
export function QtyStepper({
  value,
  onChange,
  min = 1,
  max,
  disabled = false,
  label = "Jumlah",
}: QtyStepperProps) {
  const canDecrease = !disabled && value > min;
  const canIncrease = !disabled && (max === undefined || value < max);

  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex w-fit items-center border border-garis bg-putih"
    >
      <button
        type="button"
        aria-label={`Kurangi ${label.toLowerCase()}`}
        onClick={() => onChange(Math.max(value - 1, min))}
        disabled={!canDecrease}
        className="flex h-9 w-9 items-center justify-center text-plum transition-colors hover:bg-gading disabled:cursor-not-allowed disabled:text-teks-sekunder/40 disabled:hover:bg-transparent"
      >
        <Minus size={14} aria-hidden="true" />
      </button>

      <span className="grid h-9 w-10 place-items-center text-sm font-semibold tabular-nums text-plum">
        {value}
      </span>

      <button
        type="button"
        aria-label={`Tambah ${label.toLowerCase()}`}
        onClick={() => onChange(max === undefined ? value + 1 : Math.min(value + 1, max))}
        disabled={!canIncrease}
        className="flex h-9 w-9 items-center justify-center text-plum transition-colors hover:bg-gading disabled:cursor-not-allowed disabled:text-teks-sekunder/40 disabled:hover:bg-transparent"
      >
        <Plus size={14} aria-hidden="true" />
      </button>
    </div>
  );
}
