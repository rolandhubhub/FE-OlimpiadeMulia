"use client";

import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/format";

type QrisPanelProps = {
  amount: number;
  eventTitle: string;
  /** DEV ONLY: pura-pura pembayaran berhasil. Nanti diganti callback Midtrans Snap. */
  onSimulateSuccess: () => void;
};

/**
 * Layar QRIS sementara (statis) dari view-qris di design/user-html/event.html.
 *
 * TODO(API): AGENTS.md meminta pembayaran memakai Midtrans Snap
 * (`window.snap.pay`), jadi panel ini hanya untuk mencoba alur UI dan
 * TIDAK menampilkan QR asli. Ganti seluruh isi komponen saat Snap terpasang.
 */
export function QrisPanel({ amount, eventTitle, onSimulateSuccess }: QrisPanelProps) {
  return (
    <section className="mx-auto w-full max-w-xl border border-garis bg-putih p-6 text-center">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-magenta">QRIS</p>
      <h2 className="mt-2 font-display text-3xl leading-tight text-plum">Scan untuk membayar</h2>
      {/* TODO(API): sisa waktu diambil dari `expired_at` respons Midtrans. */}
      <p className="mt-1 text-xs text-teks-sekunder">Selesaikan pembayaran dalam 1:59:48</p>

      <div className="mx-auto mt-6 w-48 border border-garis bg-putih p-3">
        <span className="sr-only">Kode QRIS contoh</span>
        <svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true">
          <rect width="100" height="100" fill="#ffffff" />
          <path
            d="M0,0 h30 v30 h-30 z M40,0 h20 v10 h-20 z M70,0 h30 v30 h-30 z M0,40 h10 v20 h-10 z M30,40 h40 v10 h-40 z M80,40 h20 v30 h-20 z M0,70 h30 v30 h-30 z M40,80 h30 v20 h-30 z M80,80 h20 v20 h-20 z"
            fill="#2b1245"
          />
          <rect x="5" y="5" width="20" height="20" fill="none" stroke="#ffffff" strokeWidth="2" />
          <rect x="75" y="5" width="20" height="20" fill="none" stroke="#ffffff" strokeWidth="2" />
          <rect x="5" y="75" width="20" height="20" fill="none" stroke="#ffffff" strokeWidth="2" />
        </svg>
      </div>

      <p className="mt-5 font-display text-3xl text-magenta">{formatRupiah(amount)}</p>
      <p className="mt-1 text-xs text-teks-sekunder">{eventTitle}</p>

      {/* DEV ONLY: tombol simulasi, tidak memanggil API pembayaran apa pun. */}
      <Button variant="cta" className="mx-auto mt-6 w-full max-w-[300px]" onClick={onSimulateSuccess}>
        Simulasi Bayar Selesai
      </Button>
    </section>
  );
}
