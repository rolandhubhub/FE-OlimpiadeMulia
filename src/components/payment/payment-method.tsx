"use client";

import { CreditCard, QrCode } from "lucide-react";
import type { PaymentMethod } from "@/types/registrations";

type PaymentMethodPickerProps = {
  value: PaymentMethod;
  onChange: (value: PaymentMethod) => void;
  /** Nama grup radio, unik per form. */
  name?: string;
  className?: string;
};

const options: Array<{
  value: PaymentMethod;
  title: string;
  description: string;
  icon: typeof QrCode;
}> = [
  {
    value: "qris",
    title: "QRIS",
    description: "Scan dengan e-wallet atau m-banking apa pun",
    icon: QrCode,
  },
  {
    value: "va",
    title: "Virtual Account",
    description: "Lakukan pembayaran melalui Virtual Account",
    icon: CreditCard,
  },
];

/** Dua pilihan metode pembayaran (kartu radio) seperti view-payment di desain. */
export function PaymentMethodPicker({
  value,
  onChange,
  name = "payment-method",
  className = "",
}: PaymentMethodPickerProps) {
  return (
    <fieldset className={className}>
      <legend className="sr-only">Metode pembayaran</legend>

      <div className="flex flex-col gap-3">
        {options.map((option) => {
          const checked = option.value === value;
          const Icon = option.icon;

          return (
            <label
              key={option.value}
              className={`flex cursor-pointer items-start gap-3 border p-4 transition-colors ${
                checked ? "border-magenta bg-gading" : "border-garis bg-putih hover:bg-gading/60"
              }`}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={checked}
                onChange={() => onChange(option.value)}
                className="mt-1 h-4 w-4 shrink-0 accent-magenta"
              />

              <span className="min-w-0">
                <span className="flex items-center gap-2 text-sm font-semibold text-plum">
                  <Icon size={16} aria-hidden="true" />
                  {option.title}
                </span>
                <span className="mt-1 block text-xs leading-5 text-teks-sekunder">
                  {option.description}
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
