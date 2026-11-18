import type { ReactNode } from "react";
import type { EventStatus, OrderStatus } from "@/types/status";

export interface AdminNavItem {
  href: string;
  label: string;
}

export type AdminResultStatus = "success" | "error";

export interface AdminTableColumn<Row> {
  key: string;
  header: string;
  /**
   * Lebar kolom dalam persen (mis. "20%"). Dipakai `<colgroup>` supaya lebar
   * kolom tetap sama di semua tabel dan tidak bergeser saat browser di-zoom.
   */
  width?: string;
  render: (row: Row, index?: number) => ReactNode;
}

export interface AdminValidationField {
  value: unknown;
  label: string;
  required?: boolean;
  email?: boolean;
}

export type AdminValidationErrors = Record<string, string>;

export interface DashboardStat {
  label: string;
  value: string;
  description: string;
}

export interface DashboardChartItem {
  label: string;
  value: number;
  color: string;
}

export interface DashboardChart {
  title: string;
  items: DashboardChartItem[];
}

/** Respons GET /admin/dashboard (docs/openapi.yaml). */
export interface AdminDashboardSummary {
  total_user: number;
  total_event: number;
  pendaftar_lunas: number;
  pesanan_perlu_dikirim: number;
  pendapatan_event: number;
  pendapatan_buku: number;
}

/** Status event mengikuti API: draft | buka | tutup | selesai. */
export type AdminEventStatus = EventStatus;

/** Bentuk data GET /admin/events (field mengikuti docs/api-spec.md). */
export interface AdminEvent {
  id: number;
  judul: string;
  slug: string;
  deskripsi: string;
  harga: number;
  pendaftaran_mulai: string;
  pendaftaran_selesai: string;
  tanggal_event: string;
  lokasi: string;
  status: AdminEventStatus;
  poster_url: string | null;
  peserta_lunas: number;
  /** Relasi mapel yang ikut dikirim GET /admin/events. */
  subjects?: AdminSubject[];
}

export type AdminParticipantStatus = "Confirmed" | "Menunggu Bayar" | "Cancelled";

/** Status pendaftaran sesuai API (docs/api-spec.md). */
export type AdminRegistrationStatus = "menunggu_bayar" | "lunas" | "batal" | "kadaluarsa";

/**
 * Peserta dari GET /admin/events/{id}/registrations (selalu milik satu event).
 * Field mengikuti data pendaftaran: kode, peserta, jenjang, kontak, status.
 */
export interface AdminParticipant {
  id: number;
  kode: string;
  nama_lengkap: string;
  asal_sekolah: string;
  jenjang: string;
  no_whatsapp: string;
  status: AdminRegistrationStatus;
  /** Mapel yang dipilih saat mendaftar (relasi `subject` dari API). */
  subject_id?: number | null;
  subject?: AdminSubject | null;
}

/**
 * Buku dari GET /admin/books. Field mengikuti docs/api-spec.md:
 * judul, penulis, deskripsi, harga, stok, cover (URL), dan is_active.
 */
export interface AdminBook {
  id: number;
  judul: string;
  penulis: string;
  deskripsi: string;
  harga: number;
  stok: number;
  cover_url: string | null;
  is_active: boolean;
}

export type AdminNominationEvent = "KMSI" | "JSO" | "IMC";

export interface AdminNomination {
  id: number;
  name: string;
  event: AdminNominationEvent;
  documentUrl: string;
  image: string | null;
}

export type AdminJuaraSubject = "Matematika" | "Sains" | "Bahasa Inggris";
export type AdminJuaraJenjang = "TK" | "SD" | "SMP" | "SMA";

export interface AdminJuaraParticipant {
  id: number;
  registrationNumber: string;
  name: string;
  school: string;
  level: AdminJuaraJenjang;
  event: AdminNominationEvent;
  subject: AdminJuaraSubject;
  status: AdminParticipantStatus;
  score: number | null;
}

export type AdminCertificateStatus = "Belum dibuat" | "Sudah dibuat";

export interface AdminCertificateTemplate {
  fileName: string;
  previewUrl: string;
}

export interface AdminCertificateRecord {
  participantId: number;
  event: AdminNominationEvent;
  status: AdminCertificateStatus;
  createdAt: string | null;
}

/** Status pesanan sesuai API (docs/api-spec.md). */
export type AdminOrderStatus = OrderStatus;

/** Mata pelajaran milik satu event (GET /admin/events/{event}/subjects). */
export interface AdminSubject {
  id: number;
  event_id: number;
  nama: string;
  /** Jumlah peserta lunas di mapel ini; hanya dikirim endpoint admin. */
  peserta_lunas?: number;
}

/**
 * Pesanan dari GET /admin/orders (schema `Order` di API).
 * List memakai `kode`/`penerima` untuk filter ?q= dan `total_harga` untuk total.
 */
export interface AdminOrder {
  id: number;
  kode: string;
  penerima: string;
  no_hp: string;
  total_harga: number;
  status: AdminOrderStatus;
}

export type AdminUserRole = "Admin" | "User";
export type AdminUserStatus = "Active";

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: AdminUserRole;
  status: AdminUserStatus;
  joined: string;
}

export type AdminTransactionStatus = "Pending" | "Paid" | "Cancelled";
export type AdminTransactionMethod = "Virtual Account" | "Qris";
export type AdminTransactionType = "Buku" | "Event";

export interface AdminTransaction {
  id: number;
  reference: string;
  customerName: string;
  transactionDate: string;
  type: AdminTransactionType;
  amount: number;
  method: AdminTransactionMethod;
  paymentDeadline: string;
  paymentDeadlineTimestamp: number;
  status: AdminTransactionStatus;
}
