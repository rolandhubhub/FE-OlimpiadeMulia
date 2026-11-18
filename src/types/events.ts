import type { EventStatus } from "@/types/status";

// TODO(API): sesuaikan dengan docs/api-spec.md saat spec tersedia.
// Nama field mengikuti kontrak API event: judul, harga, pendaftaran_mulai, dst.
export type EventSummary = {
  id: number;
  judul: string;
  slug: string;
  deskripsi: string;
  /** Harga pendaftaran dalam rupiah, 0 = gratis. */
  harga: number;
  /** Tanggal ISO 8601, contoh "2026-11-13T00:00:00+07:00". */
  pendaftaran_mulai: string;
  pendaftaran_selesai: string;
  tanggal_event: string;
  lokasi: string;
  status: EventStatus;
  /** URL poster dari host Laravel; null bila belum ada. */
  poster_url: string | null;
  /** Apakah pendaftaran sedang dibuka menurut API. */
  bisa_daftar: boolean;
};
