import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { EventCard } from "@/components/event/event-card";
import { buttonClassName } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { getEvents } from "@/lib/data/event";

export const metadata: Metadata = {
  title: "Event - Yayasan Intan Mutia",
  description: "Pilih event yang ingin kamu ikuti lalu selesaikan pendaftaran.",
};

export default async function EventPage() {
  // Badge "Segera Dibuka"/"Berlangsung" dihitung dari tanggal hari ini,
  // jadi halaman ini harus dirender saat diminta (bukan dibekukan saat build).
  await connection();

  const events = await getEvents();

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Event"
        title="Sedang Berlangsung"
        description="Pilih event yang ingin kamu ikuti lalu selesaikan pendaftaran."
      />

      {events.length === 0 ? (
        <EmptyState
          title="Belum ada event"
          description="Saat ini belum ada event yang bisa diikuti. Silakan cek kembali nanti."
          action={
            <Link href="/" className={buttonClassName("secondary")}>
              Kembali ke Beranda
            </Link>
          }
        />
      ) : (
        <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} variant="full" />
          ))}
        </div>
      )}
    </div>
  );
}
