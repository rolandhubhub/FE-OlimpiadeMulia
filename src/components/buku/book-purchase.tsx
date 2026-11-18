"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/components/buku/cart-provider";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { QtyStepper } from "@/components/ui/qty-stepper";
import type { BookSummary } from "@/types/books";

type BookPurchaseProps = {
  book: BookSummary;
};

/**
 * Pengatur jumlah + tombol beli di detail buku.
 * "use client" karena menyimpan jumlah dan menambah item ke CartProvider.
 * Jumlah dibatasi `stok` (juga dijaga di CartProvider).
 */
export function BookPurchase({ book }: BookPurchaseProps) {
  const { addItem } = useCart();
  const [jumlah, setJumlah] = useState(1);
  const [pesan, setPesan] = useState("");

  const habis = book.stok <= 0;

  function handleAdd(count: number) {
    addItem(book, count);
    setPesan(`${count} buku ditambahkan ke keranjang.`);
    window.setTimeout(() => setPesan(""), 2500);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <QtyStepper
          value={jumlah}
          onChange={setJumlah}
          max={Math.max(book.stok, 1)}
          disabled={habis}
          label="Jumlah buku"
        />

        <Button variant="secondary" onClick={() => handleAdd(jumlah)} disabled={habis}>
          Beli Buku
        </Button>

        <IconButton
          icon={<ShoppingCart size={18} aria-hidden="true" />}
          label={`Tambah ${book.judul} ke keranjang`}
          onClick={() => handleAdd(1)}
          disabled={habis}
          className="disabled:cursor-not-allowed disabled:border-garis disabled:text-teks-sekunder/40"
        />
      </div>

      <p aria-live="polite" className="min-h-5 text-xs text-sukses">
        {pesan}
      </p>

      {habis ? <p className="text-xs text-error">Stok habis.</p> : null}
    </div>
  );
}
