import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PaymentSuccess } from "@/components/payment/payment-success";
import { ReceiptCard } from "@/components/payment/receipt-card";
import { PageHeader } from "@/components/ui/page-header";
import { getRegistrationByKode } from "@/lib/data/registration";

type RegistrationReceiptPageProps = {
  params: Promise<{ kode: string }>;
};

// Rute dinamis (kode pendaftaran) + Navbar memakai usePathname(), jadi
// dirender blocking tanpa shell statis agar prerender tidak gagal di Next 16.
export const instant = false;

export async function generateMetadata({
  params,
}: RegistrationReceiptPageProps): Promise<Metadata> {
  const { kode } = await params;

  return {
    title: `Pendaftaran ${kode.toUpperCase()} - Yayasan Intan Mutia`,
    description: "Bukti pembayaran dan kartu peserta event Yayasan Intan Mutia.",
  };
}

export default async function RegistrationReceiptPage({
  params,
}: RegistrationReceiptPageProps) {
  const { kode } = await params;
  const registration = await getRegistrationByKode(kode);

  if (!registration) notFound();

  // TODO(API): halaman ini harus memakai sesi (hanya pemilik pendaftaran yang
  // boleh melihat). Tambahkan penjagaan RequireAuth setelah AuthProvider siap.

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Pendaftaran"
        title="Bukti Pendaftaran"
        description={`Nomor pendaftaran ${registration.kode}. Simpan halaman ini sebagai bukti pembayaran.`}
        backHref="/"
      />

      <PaymentSuccess />
      <ReceiptCard registration={registration} />
    </div>
  );
}
