import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { BookPurchase } from "@/components/buku/book-purchase";
import { BackButton } from "@/components/ui/back-button";
import { Chip } from "@/components/ui/chip";
import { getBookBySlug } from "@/lib/data/buku";
import { formatRupiah } from "@/lib/format";

type BukuDetailPageProps = {
  params: Promise<{ slug: string }>;
};

// Rute dinamis + Navbar memakai usePathname(), jadi dirender blocking tanpa
// shell statis agar prerender tidak gagal di Next 16.
export const instant = false;

export async function generateMetadata({ params }: BukuDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const book = await getBookBySlug(slug);

  if (!book) {
    return { title: "Buku tidak ditemukan - Yayasan Intan Mutia" };
  }

  return {
    title: `${book.judul} - Yayasan Intan Mutia`,
    description: book.deskripsi,
  };
}

export default async function BukuDetailPage({ params }: BukuDetailPageProps) {
  const { slug } = await params;
  const book = await getBookBySlug(slug);

  if (!book) notFound();

  return (
    <div className="space-y-4">
      <BackButton href="/buku" />
      <p className="text-xs text-teks-sekunder">Buku persiapan untuk kompetisi</p>

      <div className="grid gap-8 border border-garis bg-putih p-6 md:grid-cols-[320px_1fr] md:p-10">
        <div className="flex items-start justify-center">
          {book.cover_url ? (
            <Image
              src={book.cover_url}
              alt={book.judul}
              width={320}
              height={400}
              className="h-auto max-h-[400px] w-auto object-contain shadow-[0_4px_8px_rgba(0,0,0,0.1)]"
            />
          ) : (
            <span className="flex h-[320px] w-full items-center justify-center border border-dashed border-garis px-4 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-teks-sekunder">
              Cover belum tersedia
            </span>
          )}
        </div>

        <div>
          {/* TODO(API): chip kategori memakai field dummy `pelajaran`. */}
          <Chip variant="category">{book.pelajaran}</Chip>

          <h1 className="mt-4 font-display text-3xl leading-tight text-plum md:text-4xl">
            {book.judul}
          </h1>

          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.08em] text-teks-sekunder">
            Stok : {book.stok}
          </p>

          <p className="mt-3 font-display text-3xl text-magenta">{formatRupiah(book.harga)}</p>

          <p className="mt-4 text-sm leading-7 text-teks-sekunder">{book.deskripsi}</p>
          <p className="mt-3 text-xs text-teks-sekunder">Penulis: {book.penulis}</p>

          <div className="mt-6">
            <BookPurchase book={book} />
          </div>
        </div>
      </div>
    </div>
  );
}
