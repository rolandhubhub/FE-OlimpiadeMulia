"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import Badge, { type BadgeVariant } from "@/components/admin/badge";
import Modal from "@/components/admin/modal";
import PageHeader from "@/components/admin/page-header";
import ResultDialog from "@/components/admin/result-dialog";
import { getAdminOrders, shipAdminOrder } from "@/lib/api/admin-order";
import { getErrorMessage, isApiError } from "@/lib/api/errors";
import { formatRupiah } from "@/lib/format";
import { getStatusMeta } from "@/lib/status";
import type { AdminOrder, AdminOrderStatus, AdminResultStatus } from "@/types/admin";

// "use client" karena halaman ini butuh state (pencarian, filter, paginasi,
// dialog kirim), event handler, dan memanggil API berotentikasi dari browser.

const COLUMN_COUNT = 6;
const LOGIN_REDIRECT = "/login?redirect=%2Fadmin%2Fpesanan";

const statusOptions: Array<{ value: AdminOrderStatus; label: string }> = [
  { value: "menunggu_bayar", label: "Menunggu Bayar" },
  { value: "dibayar", label: "Dibayar" },
  { value: "dikirim", label: "Dikirim" },
  { value: "selesai", label: "Completed" },
  { value: "batal", label: "Cancelled" },
  { value: "kadaluarsa", label: "Kadaluarsa" },
];

/** Warna badge admin diturunkan dari status API. */
function getStatusVariant(status: AdminOrderStatus): BadgeVariant {
  if (status === "selesai") return "ok";
  if (status === "menunggu_bayar") return "warn";
  if (status === "batal") return "bad";
  return "mute";
}

interface OrderResult {
  status: AdminResultStatus;
  title: string;
  message: string;
}

function StateCell({ children }: { children: ReactNode }) {
  return (
    <tr>
      <td className="read-only-table__empty" colSpan={COLUMN_COUNT}>
        {children}
      </td>
    </tr>
  );
}

interface ErrorStateProps {
  message: string;
  unauthorized: boolean;
  onRetry: () => void;
}

function ErrorState({ message, unauthorized, onRetry }: ErrorStateProps) {
  return (
    <div className="order-state">
      <p>{message}</p>
      <div className="order-state-actions">
        {unauthorized ? (
          <Link className="event-button event-button--primary" href={LOGIN_REDIRECT}>
            LOGIN
          </Link>
        ) : null}
        <button className="event-button event-button--outline" type="button" onClick={onRetry}>
          COBA LAGI
        </button>
      </div>
    </div>
  );
}

export default function OrderList() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<AdminOrderStatus | "">("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [unauthorized, setUnauthorized] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const [shipOpen, setShipOpen] = useState(false);
  const [pendingShip, setPendingShip] = useState<AdminOrder | null>(null);
  const [shipping, setShipping] = useState(false);
  const [shipError, setShipError] = useState<string | null>(null);
  const [result, setResult] = useState<OrderResult | null>(null);

  const searchInitialized = useRef(false);

  // Pencarian dikirim sebagai ?q= ke server; tunggu 400 ms setelah berhenti
  // mengetik. Timer membuat setState terjadi asinkron (bukan di body effect).
  useEffect(() => {
    if (!searchInitialized.current) {
      searchInitialized.current = true;
      return;
    }

    const timer = setTimeout(() => {
      setSearchQuery(searchInput.trim());
      setPage(1);
      setLoading(true);
      setLoadError(null);
      setUnauthorized(false);
      setReloadKey((current) => current + 1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Ambil daftar pesanan setiap filter/halaman berubah.
  useEffect(() => {
    const controller = new AbortController();

    getAdminOrders({ page, status: statusFilter, q: searchQuery }, controller.signal)
      .then((response) => {
        setOrders(response.data);
        setTotal(response.total);
        setLastPage(Math.max(1, response.last_page));
        setPerPage(response.per_page || 20);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setOrders([]);
        setTotal(0);
        setLastPage(1);
        if (isApiError(error) && error.isUnauthorized) {
          setUnauthorized(true);
          setLoadError("Sesi kamu sudah berakhir. Silakan login kembali untuk melihat pesanan.");
          return;
        }
        setLoadError(getErrorMessage(error));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [page, statusFilter, searchQuery, reloadKey]);

  function beginReload() {
    setLoading(true);
    setLoadError(null);
    setUnauthorized(false);
  }

  function retry() {
    beginReload();
    setReloadKey((current) => current + 1);
  }

  function goToPage(nextPage: number) {
    beginReload();
    setPage(nextPage);
  }

  function handleStatusChange(value: AdminOrderStatus | "") {
    beginReload();
    setStatusFilter(value);
    setPage(1);
  }

  function askShip(order: AdminOrder) {
    setPendingShip(order);
    setShipError(null);
    setShipOpen(true);
  }

  function closeShipModal() {
    setShipOpen(false);
    setPendingShip(null);
    setShipError(null);
  }

  async function confirmShip() {
    if (!pendingShip || shipping) return;

    const shippedOrder = pendingShip;
    setShipping(true);
    setShipError(null);

    try {
      await shipAdminOrder(shippedOrder.id);
      const lastItemOnPage = orders.length === 1 && page > 1;

      closeShipModal();
      beginReload();
      if (lastItemOnPage) setPage(page - 1);
      setReloadKey((current) => current + 1);
      setResult({
        status: "success",
        title: "Pesanan Berhasil Dikirim",
        message: `Pesanan "${shippedOrder.kode}" sekarang berstatus Dikirim.`,
      });
    } catch (error) {
      if (isApiError(error) && error.isUnauthorized) {
        setShipError("Sesi kamu sudah berakhir. Silakan login kembali.");
      } else {
        setShipError(getErrorMessage(error));
      }
    } finally {
      setShipping(false);
    }
  }

  const footerText = loading ? "Memuat..." : `${total} data, Halaman ${page}/${lastPage}`;

  return (
    <>
      <PageHeader
        title="Kelola Pesanan"
        eyebrow="Kelola Pesanan"
        description="Kelola Toko Buku"
      />
      <div className="admin-readonly-page">
        <div className="admin-filter-bar">
          <label className="sr-only" htmlFor="order-search">
            Cari kode pesanan atau nama penerima
          </label>
          <input
            id="order-search"
            className="admin-filter admin-filter--search"
            type="search"
            placeholder="Cari kode/penerima"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />
          <label className="sr-only" htmlFor="order-status">
            Filter status pesanan
          </label>
          <select
            id="order-status"
            className="admin-filter admin-filter--status"
            value={statusFilter}
            onChange={(event) => handleStatusChange(event.target.value as AdminOrderStatus | "")}
          >
            <option value="">Semua Status</option>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <section className="read-only-table" aria-label="Daftar pesanan">
          <div className="read-only-table__scroll">
            <table aria-busy={loading}>
              <colgroup>
                <col style={{ width: "6%" }} />
                <col style={{ width: "25%" }} />
                <col style={{ width: "25%" }} />
                <col style={{ width: "16%" }} />
                <col style={{ width: "15%" }} />
                <col style={{ width: "13%" }} />
              </colgroup>
              <thead>
                <tr>
                  <th scope="col">No</th>
                  <th scope="col">No. Pesanan</th>
                  <th scope="col">Penerima</th>
                  <th scope="col">Total</th>
                  <th scope="col">Status</th>
                  <th scope="col">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <StateCell>Memuat data...</StateCell>
                ) : loadError ? (
                  <StateCell>
                    <ErrorState message={loadError} unauthorized={unauthorized} onRetry={retry} />
                  </StateCell>
                ) : orders.length === 0 ? (
                  <StateCell>
                    {searchQuery || statusFilter
                      ? "Tidak ada pesanan yang cocok dengan filter."
                      : "Belum ada pesanan."}
                  </StateCell>
                ) : (
                  orders.map((order, index) => (
                    <tr key={order.id}>
                      <td>{(page - 1) * perPage + index + 1}.</td>
                      <td>
                        <span className="order-list__primary">{order.kode}</span>
                      </td>
                      <td>
                        <span className="order-list__primary">{order.penerima || "-"}</span>
                        <span className="order-list__secondary">{order.no_hp || "-"}</span>
                      </td>
                      <td>{formatRupiah(order.total_harga)}</td>
                      <td>
                        <Badge variant={getStatusVariant(order.status)}>
                          {getStatusMeta("pesanan", order.status).label}
                        </Badge>
                      </td>
                      <td>
                        {order.status === "dibayar" ? (
                          <button
                            className="event-button event-button--primary"
                            type="button"
                            aria-label={`Kirim pesanan ${order.kode}`}
                            onClick={() => askShip(order)}
                          >
                            KIRIM
                          </button>
                        ) : (
                          <span className="order-list__secondary">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <footer className="read-only-table__footer">
            <span>{footerText}</span>
            <div className="read-only-table__pagination" aria-label="Paginasi pesanan">
              <button
                type="button"
                aria-label="Halaman sebelumnya"
                disabled={loading || page <= 1}
                onClick={() => goToPage(page - 1)}
              >
                ‹
              </button>
              <button
                type="button"
                aria-label="Halaman berikutnya"
                disabled={loading || page >= lastPage}
                onClick={() => goToPage(page + 1)}
              >
                ›
              </button>
            </div>
          </footer>
        </section>
      </div>

      <Modal open={shipOpen} title="Kirim Pesanan?" onClose={closeShipModal}>
        <p className="order-dialog__message">
          {pendingShip ? `Pesanan "${pendingShip.kode}" akan ditandai sudah dikirim.` : ""}
        </p>
        <p className="order-dialog__hint">
          Pastikan paket sudah diserahkan ke kurir. Status hanya bisa diubah dari Dibayar.
        </p>
        {shipError ? (
          <p className="order-dialog__error" role="alert">
            {shipError}
          </p>
        ) : null}
        <div className="order-dialog__actions">
          <button
            className="event-button event-button--outline"
            type="button"
            onClick={closeShipModal}
            disabled={shipping}
          >
            BATAL
          </button>
          <button
            className="event-button event-button--primary"
            type="button"
            onClick={() => void confirmShip()}
            disabled={shipping}
          >
            {shipping ? "MENGIRIM..." : "KIRIM"}
          </button>
        </div>
      </Modal>

      {result ? (
        <ResultDialog
          open
          status={result.status}
          title={result.title}
          message={result.message}
          onClose={() => setResult(null)}
        />
      ) : null}
    </>
  );
}
