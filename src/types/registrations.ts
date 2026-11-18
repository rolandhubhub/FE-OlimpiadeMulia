/** Jenjang peserta pada formulir pendaftaran event. */
export type Jenjang = "TK" | "SD" | "SMP";

/** Metode pembayaran pada layar dummy (nanti digantikan Midtrans Snap). */
export type PaymentMethod = "qris" | "va";

/** Nilai formulir pendaftaran. Nama field mengikuti input di desain. */
export type RegistrationFormValues = {
  nama: string;
  jenjang: Jenjang;
  sekolah: string;
  pelajaran: string;
  namaOrtu: string;
  whatsapp: string;
};

/**
 * Satu pendaftaran event (peserta + pembayaran).
 * TODO(API): sesuaikan nama field dengan docs/api-spec.md saat spec tersedia.
 */
export type Registration = {
  /** Nomor pendaftaran, contoh "REG-2026-00040". */
  kode: string;
  event_judul: string;
  event_slug: string;
  /** Tanggal ISO 8601. */
  tanggal_event: string;
  lokasi: string;
  nama_peserta: string;
  jenjang: Jenjang;
  asal_sekolah: string;
  /** TODO(API): mata pelajaran belum ada di kontrak API. */
  pelajaran: string;
  nama_ortu: string;
  /** Format 628xxxxxxxxx. */
  whatsapp: string;
  total_bayar: number;
  metode_bayar: PaymentMethod;
};
