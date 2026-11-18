export default function BukuDetailLoading() {
  return (
    <div className="space-y-4" aria-busy="true" aria-live="polite">
      <div className="h-3 w-20 animate-pulse bg-garis" />
      <div className="h-3 w-48 animate-pulse bg-garis" />

      <div className="grid gap-8 border border-garis bg-putih p-6 md:grid-cols-[320px_1fr] md:p-10">
        <div className="h-[320px] animate-pulse bg-gading" />
        <div className="space-y-3">
          <div className="h-5 w-20 animate-pulse bg-garis" />
          <div className="h-9 w-4/5 animate-pulse bg-garis" />
          <div className="h-3 w-24 animate-pulse bg-gading" />
          <div className="h-8 w-32 animate-pulse bg-garis" />
          <div className="h-3 w-full animate-pulse bg-gading" />
          <div className="h-3 w-full animate-pulse bg-gading" />
          <div className="h-3 w-2/3 animate-pulse bg-gading" />
          <div className="h-10 w-64 animate-pulse bg-garis" />
        </div>
      </div>

      <span className="sr-only">Memuat detail buku…</span>
    </div>
  );
}
