import type { EventSummary } from "@/types/events";
import type {
  EventStatus,
  OrderStatus,
  RegistrationStatus,
  StatusKind,
  StatusMeta,
  StatusTone,
} from "@/types/status";

/** Kelas Tailwind untuk tiap tone status, dipakai StatusChip dan badge event. */
export const statusToneClassName: Record<StatusTone, string> = {
  neutral: "border-garis bg-gading text-teks-sekunder",
  info: "border-violet/30 bg-violet/10 text-violet",
  success: "border-sukses/30 bg-sukses/10 text-sukses",
  warning: "border-jingga/40 bg-jingga/15 text-plum",
  danger: "border-error/30 bg-error/10 text-error",
};

// Label status mengikuti AGENTS.md bagian "Pemetaan status".
export const eventStatusMap: Record<EventStatus, StatusMeta> = {
  draft: { label: "Draft", tone: "neutral" },
  buka: { label: "Buka", tone: "success" },
  tutup: { label: "Tutup", tone: "warning" },
  selesai: { label: "Selesai", tone: "info" },
};

export const registrationStatusMap: Record<RegistrationStatus, StatusMeta> = {
  menunggu_bayar: { label: "Menunggu Bayar", tone: "warning" },
  lunas: { label: "Confirmed", tone: "success" },
  batal: { label: "Cancelled", tone: "danger" },
  kadaluarsa: { label: "Cancelled", tone: "neutral" },
};

export const orderStatusMap: Record<OrderStatus, StatusMeta> = {
  menunggu_bayar: { label: "Menunggu Bayar", tone: "warning" },
  dibayar: { label: "Dibayar", tone: "info" },
  dikirim: { label: "Dikirim", tone: "info" },
  selesai: { label: "Completed", tone: "success" },
  batal: { label: "Cancelled", tone: "danger" },
  kadaluarsa: { label: "Kadaluarsa", tone: "neutral" },
};

const statusByKind: Record<StatusKind, Record<string, StatusMeta>> = {
  event: eventStatusMap,
  pendaftaran: registrationStatusMap,
  pesanan: orderStatusMap,
};

/**
 * Ambil label + warna untuk sebuah status.
 * Status yang belum dipetakan tetap ditampilkan apa adanya (tone netral),
 * supaya nilai baru dari API tidak membuat tampilan rusak.
 */
export function getStatusMeta(kind: StatusKind, status: string): StatusMeta {
  return statusByKind[kind][status] ?? { label: status, tone: "neutral" };
}

function toTime(value: string): number {
  return new Date(value).getTime();
}

/**
 * Label badge event diturunkan dari status + tanggal pendaftaran.
 * Contoh: status "buka" tetapi pendaftaran baru mulai bulan depan -> "Segera Dibuka".
 * `now` bisa diisi saat menulis test supaya hasilnya tidak bergantung jam sistem.
 */
export function getEventLabel(
  event: Pick<EventSummary, "status" | "pendaftaran_mulai" | "pendaftaran_selesai">,
  now: Date = new Date(),
): StatusMeta {
  if (event.status === "draft") return { label: "Segera Dibuka", tone: "neutral" };
  if (event.status === "selesai") return { label: "Selesai", tone: "neutral" };
  if (event.status === "tutup") return { label: "Pendaftaran Ditutup", tone: "warning" };

  const start = toTime(event.pendaftaran_mulai);
  const end = toTime(event.pendaftaran_selesai);

  // Tanggal tidak valid: jangan sampai tampil "Berlangsung" palsu.
  if (Number.isNaN(start) || Number.isNaN(end)) {
    return { label: "Segera Dibuka", tone: "neutral" };
  }

  if (now.getTime() < start) return { label: "Segera Dibuka", tone: "neutral" };
  if (now.getTime() > end) return { label: "Pendaftaran Ditutup", tone: "warning" };

  return { label: "Berlangsung", tone: "info" };
}
