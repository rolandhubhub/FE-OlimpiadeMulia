"use client";

import { useEffect, useMemo, useState } from "react";
import PageHeader from "@/components/admin/page-header";
import ReadOnlyTable from "@/components/admin/read-only-table";
import { adminTransactions } from "@/data/admin/transaksi";
import type {
  AdminTableColumn,
  AdminTransaction,
  AdminTransactionMethod,
  AdminTransactionStatus,
} from "@/types/admin";

function formatRemainingTime(deadline: number, now: number): string {
  const remainingSeconds = Math.max(0, Math.floor((deadline - now) / 1000));
  const hours = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;

  return [hours, minutes, seconds]
    .map((part) => String(part).padStart(2, "0"))
    .join(":");
}

function TransactionStatus({
  transaction,
  now,
}: {
  transaction: AdminTransaction;
  now: number | null;
}) {
  const statusClass = transaction.status.toLowerCase();

  return (
    <div className="transaction-status">
      <span className={`transaction-status__box transaction-status__box--${statusClass}`}>
        {transaction.status}
      </span>
      {transaction.status === "Pending" ? (
        <span className="transaction-status__countdown" aria-live="off">
          Sisa waktu{" "}
          {now === null
            ? "--:--:--"
            : formatRemainingTime(transaction.paymentDeadlineTimestamp, now)}
        </span>
      ) : null}
    </div>
  );
}

export default function TransactionList() {
  const [statusFilter, setStatusFilter] = useState<AdminTransactionStatus | "">("");
  const [methodFilter, setMethodFilter] = useState<AdminTransactionMethod | "">("");
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(Date.now()), 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  const filteredTransactions = useMemo(
    () =>
      adminTransactions.filter(
        (transaction) =>
          (!statusFilter || transaction.status === statusFilter) &&
          (!methodFilter || transaction.method === methodFilter),
      ),
    [methodFilter, statusFilter],
  );

  const columns: AdminTableColumn<AdminTransaction>[] = [
    {
      key: "number",
      header: "No",
      width: "5%",
      render: (_transaction, index = 0) => `${index + 1}.`,
    },
    {
      key: "reference",
      header: "No. Registrasi",
      width: "22%",
      render: (transaction) => (
        <>
          <span className="transaction-list__reference">{transaction.reference}</span>
          <span className="transaction-list__secondary">
            {transaction.customerName} · {transaction.transactionDate}
          </span>
        </>
      ),
    },
    {
      key: "type",
      header: "Jenis",
      width: "12%",
      render: (transaction) => transaction.type,
    },
    {
      key: "amount",
      header: "Nominal",
      width: "15%",
      render: (transaction) => `Rp ${transaction.amount.toLocaleString("id-ID")}`,
    },
    {
      key: "method",
      header: "Metode",
      width: "13%",
      render: (transaction) => transaction.method,
    },
    {
      key: "deadline",
      header: "Batas Bayar",
      width: "15%",
      render: (transaction) => transaction.paymentDeadline,
    },
    {
      key: "status",
      header: "Status",
      width: "18%",
      render: (transaction) => <TransactionStatus transaction={transaction} now={now} />,
    },
  ];

  return (
    <>
      <PageHeader title="Transaksi" eyebrow="Transaksi" description="Verifikasi Pembayaran" />
      <div className="transaction-page">
        <div className="admin-filter-bar">
          <label className="sr-only" htmlFor="transaction-status-filter">
            Filter status transaksi
          </label>
          <select
            id="transaction-status-filter"
            className="admin-filter"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as AdminTransactionStatus | "")
            }
          >
            <option value="">Semua status</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <label className="sr-only" htmlFor="transaction-method-filter">
            Filter metode pembayaran
          </label>
          <select
            id="transaction-method-filter"
            className="admin-filter"
            value={methodFilter}
            onChange={(event) =>
              setMethodFilter(event.target.value as AdminTransactionMethod | "")
            }
          >
            <option value="">Semua metode</option>
            <option value="Virtual Account">Virtual Account</option>
            <option value="Qris">Qris</option>
          </select>
        </div>
        <ReadOnlyTable
          key={`${statusFilter}|${methodFilter}`}
          data={filteredTransactions}
          columns={columns}
          getRowKey={(transaction) => transaction.id}
          label="Daftar transaksi"
          pageSize={10}
        />
      </div>
    </>
  );
}
