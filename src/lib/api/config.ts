/**
 * Alamat dasar API Laravel.
 * Diatur lewat NEXT_PUBLIC_API_URL di .env.local (contoh: http://127.0.0.1:8000/api).
 * Garis miring di akhir dibuang supaya penggabungan path tidak menghasilkan "//".
 */
export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api"
).replace(/\/+$/, "");
