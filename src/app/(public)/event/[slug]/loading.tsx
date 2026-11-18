export default function EventDetailLoading() {
  return (
    <div className="space-y-4" aria-busy="true" aria-live="polite">
      <div className="h-3 w-20 animate-pulse bg-garis" />
      <div className="h-3 w-32 animate-pulse bg-garis" />

      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="h-64 animate-pulse border border-garis bg-putih" />
          <div className="mt-6 h-4 w-24 animate-pulse bg-garis" />
          <div className="mt-3 h-9 w-4/5 animate-pulse bg-garis" />
          <div className="mt-4 space-y-2">
            <div className="h-3 w-full animate-pulse bg-gading" />
            <div className="h-3 w-full animate-pulse bg-gading" />
            <div className="h-3 w-2/3 animate-pulse bg-gading" />
          </div>
          <div className="mt-8 space-y-3">
            <div className="h-4 w-20 animate-pulse bg-garis" />
            <div className="h-10 w-full animate-pulse bg-gading" />
            <div className="h-10 w-full animate-pulse bg-gading" />
          </div>
        </div>

        <div className="h-fit border border-garis bg-putih p-6">
          <div className="h-3 w-24 animate-pulse bg-garis" />
          <div className="mt-2 h-8 w-36 animate-pulse bg-garis" />
          <div className="mt-6 space-y-3">
            <div className="h-11 w-full animate-pulse bg-gading" />
            <div className="h-11 w-full animate-pulse bg-gading" />
            <div className="h-11 w-full animate-pulse bg-gading" />
          </div>
          <div className="mt-6 h-11 w-full animate-pulse bg-garis" />
        </div>
      </div>

      <span className="sr-only">Memuat detail event…</span>
    </div>
  );
}
