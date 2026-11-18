"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, fieldControlClassName } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import { formatRupiah } from "@/lib/format";

type VaPanelProps = {
  amount: number;
  eventTitle: string;
  /** DEV ONLY: pura-pura pembayaran berhasil. Nanti diganti callback Midtrans Snap. */
  onSimulateSuccess: () => void;
};

// TODO(API): nomor VA asli datang dari respons Midtrans, bukan konstanta ini.
const DUMMY_VA_NUMBER = "1234 5678 3456";

/**
 * Layar Virtual Account sementara (statis) dari view-va di desain.
 * "use client" karena tombol salin memakai navigator.clipboard.
 *
 * TODO(API): ganti dengan Midtrans Snap; layar VA buatan sendiri tidak dipakai
 * di produksi (lihat AGENTS.md bagian Pembayaran).
 */
export function VaPanel({ amount, eventTitle, onSimulateSuccess }: VaPanelProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(DUMMY_VA_NUMBER.replace(/\s/g, ""));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="mx-auto w-full max-w-xl border border-garis bg-putih p-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-magenta">
        Virtual Account
      </p>
      <h2 className="mt-2 font-display text-3xl leading-tight text-plum">
        Selesaikan pembayaran
      </h2>
      {/* TODO(API): sisa waktu diambil dari `expired_at` respons Midtrans. */}
      <p className="mt-1 text-xs text-teks-sekunder">Selesaikan pembayaran dalam 1:59:48</p>

      <div className="mt-6 space-y-5">
        <Select id="va-bank" label="Pilih Bank" defaultValue="bca-mandiri-bri">
          <option value="bca-mandiri-bri">Bank BCA / Mandiri / BRI</option>
        </Select>

        <Field id="va-number" label="Nomor Virtual Account">
          <div className="flex gap-2">
            <input
              id="va-number"
              type="text"
              readOnly
              value={DUMMY_VA_NUMBER}
              className={fieldControlClassName(false, "h-[52px] tracking-[0.08em]")}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => void handleCopy()}
              className="shrink-0"
            >
              {copied ? "Tersalin" : "Salin"}
            </Button>
          </div>
        </Field>

        <div>
          <span className="block text-xs text-teks-sekunder">Total Pembayaran</span>
          <p className="mt-1 font-display text-3xl text-magenta">{formatRupiah(amount)}</p>
          <p className="mt-1 text-xs text-teks-sekunder">{eventTitle}</p>
        </div>
      </div>

      {/* DEV ONLY: tombol simulasi, tidak memanggil API pembayaran apa pun. */}
      <Button variant="cta" className="mt-6 w-full" onClick={onSimulateSuccess}>
        Simulasi Bayar Selesai
      </Button>
    </section>
  );
}
