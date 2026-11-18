"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { books } from "@/data/books";
import type { BookSummary } from "@/types/books";

export type CartItem = {
  book: BookSummary;
  jumlah: number;
};

type CartContextValue = {
  items: CartItem[];
  /** Total jumlah semua buku (dipakai badge ikon keranjang). */
  totalItems: number;
  subtotal: number;
  addItem: (book: BookSummary, jumlah?: number) => void;
  setJumlah: (bookId: number, jumlah: number) => void;
  removeItem: (bookId: number) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

// DEV ONLY: dua item awal supaya badge Navbar dan isi keranjang bisa langsung
// dicoba tanpa klik. Hapus inisialisasi ini saat keranjang tersambung ke API.
const initialItems: CartItem[] = [
  { book: books[0], jumlah: 1 },
  { book: books[1], jumlah: 1 },
];

type CartProviderProps = {
  children: ReactNode;
};

/**
 * State keranjang di memori (tanpa localStorage, hilang saat halaman dimuat
 * ulang). "use client" karena menyimpan state yang dipakai banyak komponen.
 * Jumlah selalu dibatasi stok buku.
 */
export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>(initialItems);

  const addItem = useCallback((book: BookSummary, jumlah = 1) => {
    if (!book.is_active || book.stok <= 0 || jumlah <= 0) return;

    setItems((current) => {
      const existing = current.find((item) => item.book.id === book.id);

      if (!existing) {
        return [...current, { book, jumlah: Math.min(jumlah, book.stok) }];
      }

      return current.map((item) =>
        item.book.id === book.id
          ? { ...item, jumlah: Math.min(item.jumlah + jumlah, book.stok) }
          : item,
      );
    });
  }, []);

  const setJumlah = useCallback((bookId: number, jumlah: number) => {
    setItems((current) =>
      current.map((item) =>
        item.book.id === bookId
          ? { ...item, jumlah: Math.min(Math.max(jumlah, 1), item.book.stok) }
          : item,
      ),
    );
  }, []);

  const removeItem = useCallback((bookId: number) => {
    setItems((current) => current.filter((item) => item.book.id !== bookId));
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const totalItems = items.reduce((total, item) => total + item.jumlah, 0);
    const subtotal = items.reduce((total, item) => total + item.jumlah * item.book.harga, 0);

    return { items, totalItems, subtotal, addItem, setJumlah, removeItem };
  }, [items, addItem, setJumlah, removeItem]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart harus dipakai di dalam <CartProvider>.");
  }

  return context;
}
