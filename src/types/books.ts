// TODO(API): sesuaikan nama field dengan docs/api-spec.md saat spec tersedia.
// Bentuk ini meniru data buku dari GET /buku (judul, penulis, harga, stok, dst).
export type BookCategory = "IPS" | "IPA" | "MATEMATIKA" | "BAHASA INGGRIS";

export type BookSummary = {
  id: number;
  judul: string;
  slug: string;
  penulis: string;
  deskripsi: string;
  /** Harga dalam rupiah, seragam 85.000 sesuai desain. */
  harga: number;
  stok: number;
  /** URL cover dari host Laravel; null bila belum ada -> tampil placeholder. */
  cover_url: string | null;
  is_active: boolean;
  /**
   * TODO(API): `pelajaran` (mata pelajaran) belum ada di kontrak API.
   * Chip kategori di kartu/detail memakai field dummy ini.
   */
  pelajaran: BookCategory;
};
