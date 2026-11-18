import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RegistrationFlow } from "@/components/event/registration-flow";
import { buttonClassName } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { getEventBySlug } from "@/lib/data/event";

type EventRegistrationPageProps = {
  params: Promise<{ slug: string }>;
};

// Rute dinamis + Navbar memakai usePathname(), jadi dirender blocking tanpa
// shell statis agar prerender tidak gagal di Next 16.
export const instant = false;

export async function generateMetadata({
  params,
}: EventRegistrationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return { title: "Event tidak ditemukan - Yayasan Intan Mutia" };
  }

  return {
    title: `Daftar ${event.judul} - Yayasan Intan Mutia`,
    description: `Formulir pendaftaran ${event.judul}.`,
  };
}

export default async function EventRegistrationPage({ params }: EventRegistrationPageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) notFound();

  // Tombol di detail event memang nonaktif saat bisa_daftar = false,
  // tetapi URL tetap bisa dibuka langsung, jadi dijaga juga di sini.
  if (!event.bisa_daftar) {
    return (
      <EmptyState
        title="Pendaftaran belum dibuka"
        description="Pendaftaran event ini belum dibuka atau sudah ditutup. Silakan kembali ke halaman event."
        action={
          <Link href={`/event/${event.slug}`} className={buttonClassName("secondary")}>
            Kembali ke Detail Event
          </Link>
        }
      />
    );
  }

  // TODO(API): halaman ini wajib login. Bungkus dengan <RequireAuth> setelah
  // AuthProvider tersedia di Tahap 3 (sekarang alur masih tanpa sesi).
  return <RegistrationFlow event={event} />;
}
