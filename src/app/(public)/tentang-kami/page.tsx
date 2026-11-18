import type { Metadata } from "next";
import { GalleryStrip } from "@/components/about/gallery-strip";
import {
  aboutStats,
  aboutValues,
  achievements,
  gallery,
  missions,
  vision,
} from "@/data/about";

export const metadata: Metadata = {
  title: "Tentang Kami - Yayasan Intan Mutia",
  description:
    "Bersama tumbuh, berani berprestasi. Mengenal visi, misi, nilai, dan prestasi Yayasan Intan Mutia.",
};

/** Judul bagian: label kecil di atas, lalu judul besar. Dipakai berulang di halaman ini. */
function SectionHeading({ label, title }: { label: string; title: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-magenta">{label}</p>
      <h2 className="mt-2 font-display text-3xl leading-tight text-plum md:text-4xl">{title}</h2>
    </div>
  );
}

export default function TentangKamiPage() {
  return (
    <div className="space-y-12 pb-4 md:space-y-16">
      <section className="border border-garis bg-garis/40 px-6 py-8 md:px-10 md:py-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-magenta">
          Tentang Kami
        </p>
        <h1 className="mt-3 font-display text-4xl leading-tight text-plum md:text-5xl">
          Bersama tumbuh, berani berprestasi.
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-teks-sekunder">
          Yayasan Intan Mutia lahir dari keyakinan sederhana: setiap anak punya potensi yang layak
          diberi panggung. Kami menghadirkan kompetisi yang adil, buku yang mendidik, dan apresiasi
          yang tulus bagi para juara.
        </p>
      </section>

      <section aria-label="Ringkasan angka" className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        {aboutStats.map((stat) => (
          <div key={stat.label + stat.value} className="border border-garis bg-putih px-5 py-6 text-center">
            <span className="block text-xs text-teks-sekunder">{stat.label}</span>
            <span className="mt-2 block font-display text-3xl text-magenta">{stat.value}</span>
            {stat.unit ? (
              <span className="mt-1 block text-xs text-teks-sekunder">{stat.unit}</span>
            ) : null}
          </div>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="border border-garis bg-putih p-6">
          <h2 className="font-display text-2xl text-plum">Visi</h2>
          <p className="mt-3 text-sm leading-7 text-teks-sekunder">{vision}</p>
        </div>

        <div className="border border-garis bg-putih p-6">
          <h2 className="font-display text-2xl text-plum">Misi</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-7 text-teks-sekunder">
            {missions.map((mission) => (
              <li key={mission}>{mission}</li>
            ))}
          </ol>
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeading label="Nilai Kami" title="Nilai yang kami pegang" />

        <div className="grid gap-4 md:grid-cols-3">
          {aboutValues.map((value) => (
            <div key={value.number} className="border border-garis bg-putih p-5">
              <p className="font-display text-3xl text-jingga">{value.number}</p>
              <h3 className="mt-2 text-base font-semibold text-plum">{value.title}</h3>
              <p className="mt-2 text-sm leading-7 text-teks-sekunder">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeading label="Prestasi" title="Prestasi dan kerja sama Yayasan Intan Mutia" />

        <div className="grid gap-4 md:grid-cols-3">
          {achievements.map((achievement) => (
            <div
              key={achievement}
              className="flex min-h-[160px] items-center justify-center bg-plum px-5 py-6 text-center"
            >
              <p className="text-sm leading-7 text-putih">{achievement}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeading label="Galeri" title="Momen bersama Yayasan Intan Mutia" />
        <GalleryStrip photos={gallery} />
      </section>
    </div>
  );
}
