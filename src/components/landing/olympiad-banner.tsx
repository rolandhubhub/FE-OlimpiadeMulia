import Image from "next/image";
import Link from "next/link";

export function OlympiadBanner() {
  return (
    <section className="border border-garis bg-putih px-4 py-6 md:px-8 md:py-10">
      <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
        <Image src="/maskot/maskot-cewe.png" alt="Maskot perempuan Yayasan Intan Mutia" width={120} height={180} />

        <div className="flex-1 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-magenta">
            Saatnya Tunjukkan Potensimu Di
          </p>
          <h2 className="mt-3 font-display text-5xl text-plum md:text-[88px] md:leading-[0.9]">
            OLIMPIADE
          </h2>
          <p className="mt-2 text-2xl font-semibold text-magenta">YAYASAN INTAN MUTIA</p>
          <p className="mx-auto mt-4 max-w-lg text-sm text-teks-sekunder">
            Raih pengalaman berharga, asah kemampuan, dan buktikan bahwa kamu bisa!
          </p>
          <Link
            href="/event"
            className="mt-6 inline-flex items-center justify-center bg-plum px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-putih transition-colors hover:bg-magenta"
          >
            Daftarkan dirimu sekarang !!
          </Link>
        </div>

        <Image src="/maskot/maskot-cowo.png" alt="Maskot laki-laki Yayasan Intan Mutia" width={120} height={180} />
      </div>
    </section>
  );
}
