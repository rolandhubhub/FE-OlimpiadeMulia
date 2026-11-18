import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import { EventBadge } from "@/components/event/event-badge";
import { EventPoster } from "@/components/event/event-poster";
import { buttonClassName } from "@/components/ui/button";
import { DUMMY_KUOTA } from "@/lib/data/event";
import { formatRentangTanggal, formatTanggal } from "@/lib/format";
import type { EventSummary } from "@/types/events";

type EventCardProps = {
  event: EventSummary;
  /**
   * "compact" = kartu ringkas untuk Beranda (tampilan lama, tanpa perubahan).
   * "full"    = kartu halaman /event sesuai design/user-html/event.html (view-list).
   */
  variant?: "compact" | "full";
};

export function EventCard({ event, variant = "compact" }: EventCardProps) {
  if (variant === "compact") {
    return (
      <Link
        href={`/event/${event.slug}`}
        className="flex h-full flex-col border border-garis bg-putih p-5 transition-colors hover:bg-gading"
      >
        <EventPoster
          src={event.poster_url}
          alt={event.judul}
          width={170}
          height={90}
          className="mb-5 h-28"
          imageClassName="max-h-[90px]"
        />

        <h3 className="text-sm font-bold leading-6 text-plum">{event.judul}</h3>
        <p className="mt-3 flex-1 text-sm leading-6 text-teks-sekunder text-justify">
          {event.deskripsi}
        </p>
      </Link>
    );
  }

  return (
    <article className="relative flex h-full flex-col border border-garis bg-putih transition-colors hover:bg-gading">
      <EventBadge event={event} className="absolute right-0 top-0 z-10" />

      <EventPoster
        src={event.poster_url}
        alt={event.judul}
        width={220}
        height={110}
        className="h-36 border-b border-garis px-6 pb-4 pt-6"
        imageClassName="max-h-[85px] max-w-[80%]"
      />

      <div className="flex flex-1 flex-col p-5">
        <h2 className="text-sm font-bold leading-6 text-plum">
          <Link href={`/event/${event.slug}`} className="transition-colors hover:text-magenta">
            {event.judul}
          </Link>
        </h2>

        <ul className="mt-4 flex flex-col gap-2.5">
          <li className="flex items-start justify-between gap-3">
            <span className="flex items-center gap-1.5 text-xs text-teks-sekunder">
              <CalendarDays size={14} aria-hidden="true" />
              Pendaftaran
            </span>
            <span className="text-right text-xs font-medium text-plum">
              {formatRentangTanggal(event.pendaftaran_mulai, event.pendaftaran_selesai)}
            </span>
          </li>

          <li className="flex items-start justify-between gap-3">
            <span className="flex items-center gap-1.5 text-xs text-teks-sekunder">
              <CalendarDays size={14} aria-hidden="true" />
              Pelaksanaan
            </span>
            <span className="text-right text-xs font-medium text-plum">
              {formatTanggal(event.tanggal_event)}
            </span>
          </li>

          <li className="flex items-start justify-between gap-3">
            <span className="flex items-center gap-1.5 text-xs text-teks-sekunder">
              <MapPin size={14} aria-hidden="true" />
              Lokasi
            </span>
            <span className="text-right text-xs font-medium text-plum">{event.lokasi}</span>
          </li>
        </ul>

        <div className="mt-auto pt-4">
          <div className="flex items-center justify-between border-t border-garis pt-3 text-xs text-teks-sekunder">
            {/* TODO(API): `kuota` belum ada di respons API. */}
            <span>Kuota</span>
            <strong className="font-semibold text-plum">{DUMMY_KUOTA} Peserta</strong>
          </div>

          <Link
            href={`/event/${event.slug}`}
            className={buttonClassName("primary", "mt-4 w-full")}
          >
            Selengkapnya
          </Link>
        </div>
      </div>
    </article>
  );
}
