"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardView from "@/components/admin/dashboard/dashboard-view";
import PageHeader from "@/components/admin/page-header";
import { dashboardCharts } from "@/data/admin/dashboard";
import { getAdminDashboard } from "@/lib/api/admin-dashboard";
import { getErrorMessage, isApiError } from "@/lib/api/errors";
import { formatRupiah } from "@/lib/format";
import type { AdminDashboardSummary, DashboardStat } from "@/types/admin";

// "use client" karena ringkasan diambil dari API berotentikasi (Bearer token
// dari localStorage), jadi harus jalan di browser.

const LOGIN_REDIRECT = "/login?redirect=%2Fadmin%2Fdashboard";

/** Enam angka dari GET /admin/dashboard -> kartu DashboardStat. */
function buildStats(summary: AdminDashboardSummary): DashboardStat[] {
  return [
    {
      label: "Total Pengguna",
      value: String(summary.total_user),
      description: "Akun terdaftar",
    },
    {
      label: "Total Event",
      value: String(summary.total_event),
      description: "Event yang dikelola",
    },
    {
      label: "Pendaftar Lunas",
      value: String(summary.pendaftar_lunas),
      description: "Pendaftaran terkonfirmasi",
    },
    {
      label: "Pesanan Perlu Dikirim",
      value: String(summary.pesanan_perlu_dikirim),
      description: "Sudah dibayar, belum dikirim",
    },
    {
      label: "Pendapatan Event",
      value: formatRupiah(summary.pendapatan_event),
      description: "Dari pendaftaran event",
    },
    {
      label: "Pendapatan Buku",
      value: formatRupiah(summary.pendapatan_buku),
      description: "Dari penjualan buku",
    },
  ];
}

export default function DashboardContent() {
  const [summary, setSummary] = useState<AdminDashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unauthorized, setUnauthorized] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    getAdminDashboard(controller.signal)
      .then((result) => {
        setSummary(result);
        setError(null);
        setUnauthorized(false);
      })
      .catch((cause: unknown) => {
        if (controller.signal.aborted) return;
        setSummary(null);
        setUnauthorized(isApiError(cause) && cause.status === 401);
        setError(getErrorMessage(cause, "Gagal memuat ringkasan dashboard."));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [reloadKey]);

  // Retry mengubah state di event handler (bukan di body effect) lalu memicu fetch ulang.
  function handleRetry() {
    setLoading(true);
    setError(null);
    setUnauthorized(false);
    setReloadKey((key) => key + 1);
  }

  if (loading) {
    return (
      <>
        <PageHeader eyebrow="Ringkasan" title="Dashboard" />
        <div className="dashboard-state" role="status" aria-live="polite">
          <p>Memuat ringkasan...</p>
        </div>
      </>
    );
  }

  if (error || !summary) {
    const message = unauthorized
      ? "Sesi kamu sudah berakhir. Silakan login ulang."
      : (error ?? "Ringkasan dashboard tidak tersedia.");

    return (
      <>
        <PageHeader eyebrow="Ringkasan" title="Dashboard" />
        <div className="dashboard-state dashboard-state--error" role="alert">
          <p>{message}</p>
          <div className="dashboard-state-actions">
            {unauthorized ? (
              <Link className="event-button event-button--primary" href={LOGIN_REDIRECT}>
                LOGIN
              </Link>
            ) : null}
            <button
              className="event-button event-button--outline"
              type="button"
              onClick={handleRetry}
            >
              COBA LAGI
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader eyebrow="Ringkasan" title="Dashboard" />
      <DashboardView stats={buildStats(summary)} charts={dashboardCharts} />
    </>
  );
}
