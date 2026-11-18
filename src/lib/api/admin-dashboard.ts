import type { AdminDashboardSummary } from "@/types/admin";
import { clientGet } from "./client";

/** GET /admin/dashboard — ringkasan angka untuk halaman dashboard admin. */
export function getAdminDashboard(signal?: AbortSignal): Promise<AdminDashboardSummary> {
  return clientGet<AdminDashboardSummary>("/admin/dashboard", signal);
}
