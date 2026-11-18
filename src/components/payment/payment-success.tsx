import { CheckCircle2 } from "lucide-react";

type PaymentSuccessProps = {
  className?: string;
};

/** Kotak "Pembayaran Berhasil" di atas kartu bukti pembayaran. */
export function PaymentSuccess({ className = "" }: PaymentSuccessProps) {
  return (
    <div
      role="status"
      className={`flex items-start gap-3 border border-sukses/30 bg-sukses/10 px-4 py-3 text-sukses ${className}`}
    >
      <CheckCircle2 size={20} aria-hidden="true" className="mt-0.5 shrink-0" />
      <div>
        <p className="text-sm font-semibold">Pembayaran Berhasil</p>
        <p className="mt-1 text-xs leading-5 text-teks-sekunder">
          Pembayaran kamu sudah resmi, simpan kartu bukti pembayaran ini sebagai bukti
        </p>
      </div>
    </div>
  );
}
