import type { AdminOrder, AdminOrderStatus } from "@/types/admin";
import type { Paginated } from "@/types/api";
import { clientGet, clientPatch } from "./client";

export interface AdminOrderListParams {
  page?: number;
  status?: AdminOrderStatus | "";
  /** Pencarian kode pesanan atau nama penerima. */
  q?: string;
}

/**
 * GET /admin/orders — semua pesanan, filter ?status= dan ?q= (kode/penerima),
 * 20 per halaman.
 */
export function getAdminOrders(
  params: AdminOrderListParams,
  signal?: AbortSignal,
): Promise<Paginated<AdminOrder>> {
  const query = new URLSearchParams();
  if (params.page && params.page > 1) query.set("page", String(params.page));
  if (params.status) query.set("status", params.status);
  if (params.q) query.set("q", params.q);

  const search = query.toString();
  return clientGet<Paginated<AdminOrder>>(`/admin/orders${search ? `?${search}` : ""}`, signal);
}

/**
 * PATCH /admin/orders/{id}/ship — ubah status dibayar -> dikirim.
 * Selain status dibayar, backend membalas 422 (pesan ditampilkan apa adanya).
 */
export function shipAdminOrder(id: number): Promise<AdminOrder> {
  return clientPatch<AdminOrder>(`/admin/orders/${id}/ship`);
}
