import { books } from "@/data/books";
import type { BookSummary } from "@/types/books";

/**
 * Lapisan data buku untuk halaman publik.
 *
 * Masih dummy. TODO(API): ganti isi kedua fungsi ini dengan pemanggilan
 * `src/lib/api/buku.ts` (GET /buku dan GET /buku/{slug}) saat Tahap 3 dimulai.
 * Sengaja `async` supaya halaman tidak perlu diubah ketika sumbernya berganti.
 */
export async function getBooks(): Promise<BookSummary[]> {
  return books.filter((book) => book.is_active);
}

export async function getBookBySlug(slug: string): Promise<BookSummary | null> {
  return books.find((book) => book.slug === slug && book.is_active) ?? null;
}
