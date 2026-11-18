"use client";

import { useMemo, useState } from "react";
import type { AdminTableColumn } from "@/types/admin";

interface DataTableProps<Row extends object> {
  data: Row[];
  columns: AdminTableColumn<Row>[];
  getRowKey: (row: Row) => string | number;
  pageSize?: number;
  filterLabel?: string;
}

function getSearchableText(value: unknown): string {
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (Array.isArray(value)) return value.map(getSearchableText).join(" ");
  if (value && typeof value === "object") {
    return Object.values(value).map(getSearchableText).join(" ");
  }
  return "";
}

export default function DataTable<Row extends object>({
  data,
  columns,
  getRowKey,
  pageSize = 10,
  filterLabel = "Cari data",
}: DataTableProps<Row>) {
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const safePageSize = Math.max(1, Math.floor(pageSize));

  const filteredData = useMemo(() => {
    const query = filter.trim().toLocaleLowerCase("id");
    if (!query) return data;

    return data.filter((row) =>
      getSearchableText(row).toLocaleLowerCase("id").includes(query),
    );
  }, [data, filter]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / safePageSize));
  const currentPage = Math.min(page, totalPages);
  const pageData = filteredData.slice(
    (currentPage - 1) * safePageSize,
    currentPage * safePageSize,
  );

  return (
    <section className="data-table" aria-label="Tabel data">
      <div className="data-table__toolbar">
        <input
          className="data-table__filter"
          type="search"
          aria-label={filterLabel}
          placeholder={filterLabel}
          value={filter}
          onChange={(event) => {
            setFilter(event.target.value);
            setPage(1);
          }}
        />
      </div>
      <div className="data-table__scroll">
        <table>
          <colgroup>
            {columns.map((column) => (
              <col
                key={column.key}
                style={column.width ? { width: column.width } : undefined}
              />
            ))}
          </colgroup>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key} scope="col">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageData.length ? (
              pageData.map((row) => (
                <tr key={getRowKey(row)}>
                  {columns.map((column) => (
                    <td key={column.key}>{column.render(row)}</td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td className="data-table__empty" colSpan={columns.length}>
                  Data tidak ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <footer className="data-table__footer">
        <span>
          {filteredData.length} data, Halaman {currentPage}/{totalPages}
        </span>
        <div className="data-table__pagination" aria-label="Paginasi tabel">
          <button
            type="button"
            aria-label="Halaman sebelumnya"
            disabled={currentPage <= 1}
            onClick={() => setPage(currentPage - 1)}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Halaman berikutnya"
            disabled={currentPage >= totalPages}
            onClick={() => setPage(currentPage + 1)}
          >
            ›
          </button>
        </div>
      </footer>
    </section>
  );
}
