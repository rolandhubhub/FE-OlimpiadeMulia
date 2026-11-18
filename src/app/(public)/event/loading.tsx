export default function EventLoading() {
  return (
    <div className="space-y-10" aria-busy="true" aria-live="polite">
      <div className="space-y-3">
        <div className="h-3 w-16 animate-pulse bg-garis" />
        <div className="h-10 w-64 animate-pulse bg-garis" />
        <div className="h-4 w-full max-w-lg animate-pulse bg-garis" />
      </div>

      <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="border border-garis bg-putih p-5">
            <div className="h-24 animate-pulse bg-gading" />
            <div className="mt-5 h-4 w-4/5 animate-pulse bg-garis" />
            <div className="mt-5 space-y-3">
              <div className="h-3 w-full animate-pulse bg-gading" />
              <div className="h-3 w-full animate-pulse bg-gading" />
              <div className="h-3 w-2/3 animate-pulse bg-gading" />
            </div>
            <div className="mt-6 h-10 w-full animate-pulse bg-garis" />
          </div>
        ))}
      </div>

      <span className="sr-only">Memuat daftar event…</span>
    </div>
  );
}
