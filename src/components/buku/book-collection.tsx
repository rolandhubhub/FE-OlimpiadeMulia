"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Search } from "lucide-react";
import { BookCard } from "@/components/buku/book-card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { fieldControlClassName } from "@/components/ui/field";
import type { BookSummary } from "@/types/books";

type BookCollectionProps = {
  books: BookSummary[];
  /** Isi awal dari `?q=` supaya tautan pencarian bisa dibagikan. */
  initialQuery?: string;
};

/**
 * Daftar buku + pencarian sederhana di sisi klien (filter langsung saat mengetik).
 * `?q=` dipakai sebagai nilai awal; URL diperbarui saat form dicari.
 * "use client" karena menyimpan kata kunci dan mengubah URL.
 */
export function BookCollection({ books, initialQuery = "" }: BookCollectionProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery);

  const keyword = query.trim().toLowerCase();

  const results = keyword
    ? books.filter((book) =>
        [book.judul, book.penulis, book.pelajaran].some((value) =>
          value.toLowerCase().includes(keyword),
        ),
      )
    : books;

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const value = query.trim();
    const next = new URLSearchParams();

    if (value) next.set("q", value);

    const target = next.toString();
    router.replace(target ? `${pathname}?${target}` : pathname, { scroll: false });
  }

  function resetSearch() {
    setQuery("");
    router.replace(pathname, { scroll: false });
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSearch} role="search" className="flex flex-wrap gap-3">
        <label htmlFor="buku-q" className="sr-only">
          Cari buku
        </label>
        <input
          id="buku-q"
          name="q"
          type="search"
          value={query}
          onChange={(changeEvent) => setQuery(changeEvent.target.value)}
          placeholder="Cari judul, penulis, atau pelajaran…"
          className={fieldControlClassName(false, "h-[52px] flex-1 min-w-[220px]")}
        />
        <Button type="submit" variant="secondary" icon={<Search size={16} />}>
          Cari
        </Button>
      </form>

      <p className="text-xs text-teks-sekunder">
        {keyword
          ? `Menampilkan ${results.length} dari ${books.length} buku untuk "${query.trim()}".`
          : `Menampilkan ${books.length} buku.`}
      </p>

      {results.length === 0 ? (
        <EmptyState
          title="Buku tidak ditemukan"
          description={`Tidak ada buku yang cocok dengan "${query.trim()}". Coba kata kunci lain.`}
          action={
            <Button variant="secondary" onClick={resetSearch}>
              Hapus Pencarian
            </Button>
          }
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {results.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}
