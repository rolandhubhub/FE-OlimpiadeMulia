import { events } from "@/data/events";
import type { EventSummary } from "@/types/events";

/**
 * Lapisan data event untuk halaman publik.
 *
 * Untuk sekarang datanya masih dummy dari `src/data/events.ts`.
 * TODO(API): ganti isi kedua fungsi ini dengan pemanggilan `src/lib/api/event.ts`
 * (GET /event dan GET /event/{slug}) saat Tahap 3 dimulai.
 *
 * Sengaja dibuat `async` sejak awal supaya halaman tidak perlu diubah
 * ketika sumber datanya berganti dari dummy ke API.
 */
export async function getEvents(): Promise<EventSummary[]> {
  return events;
}

export async function getEventBySlug(slug: string): Promise<EventSummary | null> {
  return events.find((event) => event.slug === slug) ?? null;
}

// TODO(API): `kuota` dan `benefit` belum ada di respons API.
// Nilai dummy ini dipakai halaman /event dan /event/[slug] sampai field tersedia.
export const DUMMY_KUOTA = 120;
export const DUMMY_BENEFIT = "Uang Juara, Trofi, dan Sertifikat";
