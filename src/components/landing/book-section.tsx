import { BookCard } from "@/components/buku/book-card";
import { SectionHeader } from "@/components/ui/section-header";
import { getBooks } from "@/lib/data/buku";

export async function BookSection() {
  const books = await getBooks();

  return (
    <section className="space-y-8">
      <SectionHeader label="BUKU" title="Koleksi Pilihan" actionText="SEMUA BUKU" actionHref="/buku" />

      <div className="grid gap-5 md:grid-cols-4">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </section>
  );
}
