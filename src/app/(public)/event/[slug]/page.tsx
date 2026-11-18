import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { EventBadge } from "@/components/event/event-badge";
import { EventPoster } from "@/components/event/event-poster";
import { BackButton } from "@/components/ui/back-button";
import { Button, buttonClassName } from "@/components/ui/button";
import { DUMMY_BENEFIT, DUMMY_KUOTA, getEventBySlug } from "@/lib/data/event";
import { formatRentangTanggal, formatRupiah, formatTanggal } from "@/lib/format";

type EventDetailPageProps = {
  params: Promise<{ slug: string }>;
};

// Halaman ini memakai slug dinamis + tanggal hari ini. `instant = false`
// membuat rute ini blocking (menunggu data siap) sehingga Navbar yang memakai
// usePathname() tidak dipaksa ikut di-prerender sebagai shell statis.
export const instant = false;

export async function generateMetadata({ params }: EventDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return { title: "Event tidak ditemukan - Yayasan Intan Mutia" };
  }

  return {
    title: `${event.judul} - Yayasan Intan Mutia`,
    description: event.deskripsi,
  };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  // Badge memakai tanggal hari ini, jadi render saat diminta (bukan saat build).
  await connection();

  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) notFound();

  return (
    <div className="space-y-4">
      <BackButton href="/event" />

      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-teks-sekunder">
        Event / {event.slug.toUpperCase()}
      </p>

      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <EventPoster
            src={event.poster_url}
            alt={event.judul}
            width={520}
            height={260}
            className="border border-garis bg-putih px-6 py-10"
            imageClassName="max-h-[240px] max-w-full"
          />

          <div className="mt-6">
            <EventBadge event={event} />
            <h1 className="mt-3 font-display text-3xl leading-tight text-plum md:text-4xl">
              {event.judul}
            </h1>
          </div>

          <p className="mt-4 text-sm leading-7 text-teks-sekunder">{event.deskripsi}</p>

          <h2 className="mt-8 text-lg font-semibold text-plum">Jadwal</h2>
          <dl className="mt-3 divide-y divide-garis border-y border-garis text-sm">
            <div className="flex items-center justify-between gap-4 py-3">
              <dt className="text-teks-sekunder">Pendaftaran</dt>
              <dd className="text-right font-semibold text-plum">
                {formatRentangTanggal(event.pendaftaran_mulai, event.pendaftaran_selesai)}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4 py-3">
              <dt className="text-teks-sekunder">Pelaksanaan</dt>
              <dd className="text-right font-semibold text-plum">
                {formatTanggal(event.tanggal_event)}
              </dd>
            </div>
          </dl>
        </div>

        <aside className="h-fit border border-garis bg-putih p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-magenta">
            Pendaftaran
          </p>
          <p className="mt-1 font-display text-3xl text-plum">{formatRupiah(event.harga)}</p>

          <dl className="mt-5 divide-y divide-garis border-t border-garis text-sm">
            <div className="flex justify-between gap-4 py-3">
              <dt className="text-teks-sekunder">Benefit</dt>
              {/* TODO(API): `benefit` belum ada di respons API. */}
              <dd className="text-right font-semibold text-plum">{DUMMY_BENEFIT}</dd>
            </div>
            <div className="flex justify-between gap-4 py-3">
              <dt className="text-teks-sekunder">Lokasi</dt>
              <dd className="text-right font-semibold text-plum">{event.lokasi}</dd>
            </div>
            <div className="flex justify-between gap-4 py-3">
              <dt className="text-teks-sekunder">Kuota</dt>
              {/* TODO(API): `kuota` belum ada di respons API. */}
              <dd className="text-right font-semibold text-plum">{DUMMY_KUOTA} Peserta</dd>
            </div>
          </dl>

          {event.bisa_daftar ? (
            <Link
              href={`/event/${event.slug}/daftar`}
              className={buttonClassName("cta", "mt-6 w-full")}
            >
              Daftar Event
            </Link>
          ) : (
            <>
              <Button variant="cta" className="mt-6 w-full" disabled>
                Daftar Event
              </Button>
              <p className="mt-3 text-xs leading-5 text-teks-sekunder">
                Pendaftaran event ini belum dibuka atau sudah ditutup.
              </p>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
