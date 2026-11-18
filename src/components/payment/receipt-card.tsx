import { Info } from "lucide-react";
import { formatRupiah, formatTanggal } from "@/lib/format";
import type { Registration } from "@/types/registrations";

type ReceiptCardProps = {
  registration: Registration;
  className?: string;
};

function ReceiptRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-2 border-b border-garis py-2.5 last:border-b-0">
      <span className="text-xs text-teks-sekunder">{label}</span>
      <strong className="text-right text-xs font-semibold text-plum">{value}</strong>
    </div>
  );
}

/** Kartu bukti pembayaran / kartu peserta dari view-receipt di desain. */
export function ReceiptCard({ registration, className = "" }: ReceiptCardProps) {
  const tahun = new Date(registration.tanggal_event).getFullYear();

  return (
    <article className={`mx-auto w-full max-w-2xl border border-garis bg-putih p-6 ${className}`}>
      <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-plum">Intan Mutia</h2>
      <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-magenta">
        Bukti Pembayaran Resmi
      </p>

      <div className="mt-5 border border-dashed border-garis bg-gading p-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-magenta">
          Kartu Peserta . {registration.event_slug.toUpperCase()} {tahun}
        </p>
        <p className="mt-2 font-display text-2xl leading-tight text-plum">{registration.kode}</p>
        <p className="mt-2 text-sm font-semibold text-plum">{registration.nama_peserta}</p>
        <p className="mt-0.5 text-xs text-teks-sekunder">{registration.pelajaran}</p>

        <p className="mt-3 text-xs leading-5 text-teks-sekunder">
          {registration.event_judul}
          <br />
          {formatTanggal(registration.tanggal_event)} | {registration.lokasi}
        </p>
      </div>

      <div className="mt-4">
        <ReceiptRow label="Nama Lengkap Peserta" value={registration.nama_peserta} />
        <ReceiptRow label="Asal Sekolah" value={registration.asal_sekolah} />
        <ReceiptRow label="Nama Orang Tua / Wali" value={registration.nama_ortu} />
        <ReceiptRow label="Jenjang" value={registration.jenjang} />
        {/* TODO(API): mata pelajaran belum ada di kontrak API. */}
        <ReceiptRow label="Pelajaran" value={registration.pelajaran} />
        <ReceiptRow label="WhatsApp Orang Tua/ Wali" value={registration.whatsapp} />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-garis pt-4">
        <span className="text-sm text-plum">Total dibayar</span>
        <strong className="font-display text-2xl text-magenta">
          {formatRupiah(registration.total_bayar)}
        </strong>
      </div>

      <p className="mt-6 flex items-start gap-2 bg-violet/10 px-3 py-3 text-xs leading-5 text-plum">
        <Info size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
        Bukti pembayaran otomatis tersimpan di profil, klik profil untuk melihat
      </p>
    </article>
  );
}
