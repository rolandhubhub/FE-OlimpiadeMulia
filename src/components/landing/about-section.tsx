import Link from "next/link";

export function AboutSection() {
  return (
    <section className="space-y-8">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mx-auto h-px w-16 bg-magenta" />
        <h2 className="mt-4 font-display text-4xl text-plum md:text-5xl">Tentang Kami</h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-teks-sekunder">
          Mengenal lebih dekat YAYASAN INTAN MUTIA sebagai wadah pendidikan dan kompetisi untuk
          mendukung potensi serta prestasi generasi muda Indonesia.
        </p>
      </div>

      <div className="-mx-4 bg-[#f3ebf2] px-4 py-8 md:-mx-6 md:px-6 md:py-10">
        <div className="relative mx-auto max-w-[1200px]">
          <div className="flex justify-end">
            <Link
              href="/tentang-kami"
              className="inline-flex items-center border border-plum px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-plum transition-colors hover:bg-putih"
            >
              Selengkapnya
            </Link>
          </div>

          <div className="mt-6 max-w-[52rem]">
            <p className="text-base font-normal text-magenta">Tentang Kami</p>
            <h3 className="mt-3 max-w-md font-display text-5xl leading-[0.95] text-plum md:text-[56px]">
              Bersama tumbuh, berani berprestasi.
            </h3>
            <p className="mt-5 max-w-2xl text-base leading-8 text-teks-sekunder">
              Yayasan Intan Mutia lahir dari keyakinan sederhana: setiap anak punya potensi yang
              layak diberi panggung. Kami menghadirkan kompetisi yang adil, buku yang mendidik,
              dan apresiasi yang tulus bagi para juara.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
