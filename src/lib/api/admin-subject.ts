import type { AdminSubject } from "@/types/admin";
import { clientDelete, clientGet, clientPost, clientPut } from "./client";

/**
 * GET /admin/events/{event}/subjects — daftar mata pelajaran event
 * beserta jumlah peserta lunas. Respons berupa array (tanpa paginasi).
 */
export function getAdminEventSubjects(
  eventId: number,
  signal?: AbortSignal,
): Promise<AdminSubject[]> {
  return clientGet<AdminSubject[]>(`/admin/events/${eventId}/subjects`, signal);
}

/** POST /admin/events/{event}/subjects — nama unik per event. */
export function createAdminSubject(eventId: number, nama: string): Promise<AdminSubject> {
  return clientPost<AdminSubject>(`/admin/events/${eventId}/subjects`, { nama });
}

/** PUT /admin/subjects/{subject} — ubah nama mata pelajaran. */
export function updateAdminSubject(subjectId: number, nama: string): Promise<AdminSubject> {
  return clientPut<AdminSubject>(`/admin/subjects/${subjectId}`, { nama });
}

/** DELETE /admin/subjects/{subject} — 422 jika mapel sudah punya pendaftar. */
export function deleteAdminSubject(subjectId: number): Promise<void> {
  return clientDelete<void>(`/admin/subjects/${subjectId}`);
}
