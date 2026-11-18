import type { AdminEvent, AdminEventStatus } from "@/types/admin";
import type { Paginated } from "@/types/api";
import { clientDelete, clientGet, clientPost } from "./client";

export interface AdminEventListParams {
  page?: number;
  status?: AdminEventStatus | "";
}

/** GET /admin/events — semua event + peserta_lunas, filter ?status=, 15 per halaman. */
export function getAdminEvents(
  params: AdminEventListParams,
  signal?: AbortSignal,
): Promise<Paginated<AdminEvent>> {
  const query = new URLSearchParams();
  if (params.page && params.page > 1) query.set("page", String(params.page));
  if (params.status) query.set("status", params.status);

  const search = query.toString();
  return clientGet<Paginated<AdminEvent>>(`/admin/events${search ? `?${search}` : ""}`, signal);
}

/** POST /admin/events — multipart/form-data (poster opsional). */
export function createAdminEvent(payload: FormData): Promise<AdminEvent> {
  return clientPost<AdminEvent>("/admin/events", payload);
}

/**
 * Ambil semua event (semua status) untuk mengisi dropdown pemilih event.
 * Endpoint dipaginasi 15 per halaman, jadi halaman berikutnya diambil berurutan.
 */
export async function getAllAdminEvents(signal?: AbortSignal): Promise<AdminEvent[]> {
  const first = await getAdminEvents({ page: 1 }, signal);
  const events = [...first.data];

  for (let page = 2; page <= first.last_page; page += 1) {
    const next = await getAdminEvents({ page }, signal);
    events.push(...next.data);
  }

  return events;
}

/** Update event: POST /admin/events/{id} dengan field _method=PUT. */
export function updateAdminEvent(id: number, payload: FormData): Promise<AdminEvent> {
  payload.set("_method", "PUT");
  return clientPost<AdminEvent>(`/admin/events/${id}`, payload);
}

/** DELETE /admin/events/{id} — 422 bila event sudah punya pendaftar. */
export function deleteAdminEvent(id: number): Promise<void> {
  return clientDelete<void>(`/admin/events/${id}`);
}
