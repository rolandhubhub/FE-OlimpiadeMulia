export default function BukuLoading() {
  return (
    <div className="space-y-8" aria-busy="true" aria-live="polite">
      <div className="space-y-3">
        <div className="h-3 w-14 animate-pulse bg-garis" />
        <div className="h-10 w-64 animate-pulse bg-garis" />
      </div>

      <div className="h-[52px] w-full animate-pulse bg-garis" />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="border border-garis bg-putih p-4">
            <div className="h-52 animate-pulse bg-gading" />
            <div className="mt-4 h-4 w-16 animate-pulse bg-garis" />
            <div className="mt-4 h-4 w-4/5 animate-pulse bg-garis" />
            <div className="mt-3 h-4 w-24 animate-pulse bg-gading" />
            <div className="mt-4 h-11 w-full animate-pulse bg-garis" />
          </div>
        ))}
      </div>

      <span className="sr-only">Memuat koleksi buku…</span>
    </div>
  );
}
