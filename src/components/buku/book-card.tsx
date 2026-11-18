"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/components/buku/cart-provider";
import { Chip } from "@/components/ui/chip";
import { formatRupiah } from "@/lib/format";
import type { BookSummary } from "@/types/books";

type BookCardProps = {
  book: BookSummary;
};

/**
 * Kartu buku untuk Beranda dan /buku.
 * "use client" karena tombol ikon keranjang menambah item via CartProvider.
 */
export function BookCard({ book }: BookCardProps) {
  const { addItem } = useCart();
  const [pesan, setPesan] = useState("");

  function handleAddToCart() {
    addItem(book, 1);
    setPesan(`${book.judul} ditambahkan ke keranjang.`);
    window.setTimeout(() => setPesan(""), 2000);
  }

  const habis = book.stok <= 0;

  return (
    <article className="flex h-full flex-col bg-putih p-4 shadow-[0_0_0_1px_rgba(43,18,69,0.06)]">
      <div className="flex h-52 items-center justify-center overflow-hidden bg-[#f9f5f7]">
        {book.cover_url ? (
          <Image
            src={book.cover_url}
            alt={book.judul}
            width={220}
            height={260}
            className="h-52 w-full object-cover"
          />
        ) : (
          <span className="px-4 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-teks-sekunder">
            Cover belum tersedia
          </span>
        )}
      </div>

      <div className="mt-4">
        {/* TODO(API): chip kategori memakai field dummy `pelajaran`. */}
        <Chip variant="category">{book.pelajaran}</Chip>
      </div>

      <h3 className="mt-4 text-sm font-normal leading-6 text-plum">{book.judul}</h3>
      <p className="mt-3 text-sm font-semibold text-magenta">{formatRupiah(book.harga)}</p>

      <div className="mt-auto pt-4">
        <div className="flex gap-3">
          <Link
            href={`/buku/${book.slug}`}
            className="inline-flex flex-1 items-center justify-center border border-plum bg-putih px-3 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-plum transition-colors hover:bg-gading"
          >
            Beli Buku
          </Link>
          <button
            type="button"
            aria-label={`Tambah ${book.judul} ke keranjang`}
            onClick={handleAddToCart}
            disabled={habis}
            className="flex h-11 w-11 shrink-0 items-center justify-center border border-plum bg-putih text-plum transition-colors hover:bg-gading disabled:cursor-not-allowed disabled:border-garis disabled:text-teks-sekunder/40"
          >
            <ShoppingCart size={18} aria-hidden="true" />
          </button>
        </div>

        <p aria-live="polite" className="sr-only">
          {pesan}
        </p>
      </div>
    </article>
  );
}
