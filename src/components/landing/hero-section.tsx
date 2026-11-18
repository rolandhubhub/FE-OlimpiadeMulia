import Link from "next/link";

export function HeroSection() {
  return (
    <section className="border border-garis bg-[#f3ebf2] px-6 py-10 md:px-10 md:py-14">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-magenta">
        Yayasan Intan Mutia
      </p>

      <div className="mt-6 max-w-2xl">
        <h1 className="font-display text-5xl leading-[0.9] text-plum md:text-[80px] md:leading-[0.9]">
          Bersama tumbuh, berani berprestasi.
        </h1>
      </div>

      <p className="mt-5 max-w-xl text-base text-teks-sekunder">
        Olimpiade dan kompetisi untuk siswa berprestasi, didukung buku latihan yang disusun para
        pendidik.
      </p>

      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          href="/event"
          className="inline-flex items-center justify-center bg-plum px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-putih transition-colors hover:bg-magenta"
        >
          Lihat Event Berlangsung
        </Link>
        <Link
          href="/buku"
          className="inline-flex items-center justify-center border border-plum bg-putih px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-plum transition-colors hover:bg-gading"
        >
          Jelajahi Buku
        </Link>
      </div>
    </section>
  );
}
