import type { AdminBook } from "@/types/admin";
import type { Paginated } from "@/types/api";
import { clientDelete, clientGet, clientPost } from "./client";

export interface AdminBookListParams {
  page?: number;
  /** Pencarian judul/penulis. */
  q?: string;
}

/** GET /admin/books — semua buku termasuk nonaktif, filter ?q=, 15 per halaman. */
export function getAdminBooks(
  params: AdminBookListParams,
  signal?: AbortSignal,
): Promise<Paginated<AdminBook>> {
  const query = new URLSearchParams();
  if (params.page && params.page > 1) query.set("page", String(params.page));
  if (params.q) query.set("q", params.q);

  const search = query.toString();
  return clientGet<Paginated<AdminBook>>(`/admin/books${search ? `?${search}` : ""}`, signal);
}

/** POST /admin/books — multipart/form-data (cover opsional). */
export function createAdminBook(payload: FormData): Promise<AdminBook> {
  return clientPost<AdminBook>("/admin/books", payload);
}

/** Update buku: POST /admin/books/{id} dengan field _method=PUT. */
export function updateAdminBook(id: number, payload: FormData): Promise<AdminBook> {
  payload.set("_method", "PUT");
  return clientPost<AdminBook>(`/admin/books/${id}`, payload);
}

/** DELETE /admin/books/{id} — soft delete, buku juga dihapus dari keranjang. */
export function deleteAdminBook(id: number): Promise<void> {
  return clientDelete<void>(`/admin/books/${id}`);
}
