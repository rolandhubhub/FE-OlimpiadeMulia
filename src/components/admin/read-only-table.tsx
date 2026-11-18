"use client";

import { useState } from "react";
import type { AdminTableColumn } from "@/types/admin";

interface ReadOnlyTableProps<Row extends object> {
  data: Row[];
  columns: AdminTableColumn<Row>[];
  getRowKey: (row: Row) => string | number;
  label: string;
  pageSize?: number;
}

export default function ReadOnlyTable<Row extends object>({
  data,
  columns,
  getRowKey,
  label,
  pageSize = 5,
}: ReadOnlyTableProps<Row>) {
  const [page, setPage] = useState(1);
  const safePageSize = Math.max(1, Math.floor(pageSize));
  const totalPages = Math.max(1, Math.ceil(data.length / safePageSize));
  const currentPage = Math.min(page, totalPages);
  const pageData = data.slice((currentPage - 1) * safePageSize, currentPage * safePageSize);

  return (
    <section className="read-only-table" aria-label={label}>
      <div className="read-only-table__scroll">
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
              pageData.map((row, index) => (
                <tr key={getRowKey(row)}>
                  {columns.map((column) => (
                    <td key={column.key}>
                      {column.render(row, (currentPage - 1) * safePageSize + index)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td className="read-only-table__empty" colSpan={columns.length}>
                  Tidak ada data.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <footer className="read-only-table__footer">
        <span>
          {data.length} data, Halaman {currentPage}/{totalPages}
        </span>
        <div className="read-only-table__pagination" aria-label="Paginasi tabel">
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
