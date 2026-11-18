import type { AdminParticipant, AdminRegistrationStatus } from "@/types/admin";
import type { Paginated } from "@/types/api";
import { clientGet } from "./client";

export interface AdminParticipantListParams {
  page?: number;
  status?: AdminRegistrationStatus | "";
  /** Id mata pelajaran dari GET /admin/events/{event}/subjects. */
  subject_id?: number | "";
  /** Pencarian nama, sekolah, atau kode pendaftaran. */
  q?: string;
}

/**
 * GET /admin/events/{id}/registrations — peserta satu event.
 * Filter ?status=, ?subject_id=, ?q= (nama/sekolah/kode), 20 per halaman.
 */
export function getAdminEventParticipants(
  eventId: number,
  params: AdminParticipantListParams,
  signal?: AbortSignal,
): Promise<Paginated<AdminParticipant>> {
  const query = new URLSearchParams();
  if (params.page && params.page > 1) query.set("page", String(params.page));
  if (params.status) query.set("status", params.status);
  if (params.subject_id) query.set("subject_id", String(params.subject_id));
  if (params.q) query.set("q", params.q);

  const search = query.toString();
  return clientGet<Paginated<AdminParticipant>>(
    `/admin/events/${eventId}/registrations${search ? `?${search}` : ""}`,
    signal,
  );
}
