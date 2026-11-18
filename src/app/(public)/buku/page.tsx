import type { Metadata } from "next";
import { BookCollection } from "@/components/buku/book-collection";
import { PageHeader } from "@/components/ui/page-header";
import { getBooks } from "@/lib/data/buku";

type BukuPageProps = {
  searchParams: Promise<{ q?: string }>;
};

// Halaman membaca `?q=`, jadi dirender blocking (bukan shell statis) agar
// Navbar yang memakai usePathname() juga tidak gagal di-prerender.
export const instant = false;

export const metadata: Metadata = {
  title: "Buku - Yayasan Intan Mutia",
  description: "Koleksi buku persiapan olimpiade untuk siswa TK, SD, dan SMP.",
};

export default async function BukuPage({ searchParams }: BukuPageProps) {
  const [{ q }, books] = await Promise.all([searchParams, getBooks()]);

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Buku" title="Koleksi Buku" />

      {/* Pencarian difilter di browser; `q` hanya untuk isi awal & tautan. */}
      <BookCollection books={books} initialQuery={q ?? ""} />
    </div>
  );
}
