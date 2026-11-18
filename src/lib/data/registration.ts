import { DUMMY_REGISTRATION_KODE, registrations } from "@/data/registrations";
import type { EventSummary } from "@/types/events";
import type { PaymentMethod, Registration, RegistrationFormValues } from "@/types/registrations";

/**
 * Lapisan data pendaftaran event.
 *
 * Masih dummy. TODO(API): ganti isi fungsi ini dengan pemanggilan
 * `src/lib/api/pendaftaran.ts` (POST daftar & GET detail pendaftaran)
 * saat Tahap 3 dimulai. Sengaja `async` agar halaman tidak perlu diubah.
 */
export async function getRegistrationByKode(kode: string): Promise<Registration | null> {
  const normalized = kode.trim().toLowerCase();
  return registrations.find((item) => item.kode.toLowerCase() === normalized) ?? null;
}

/**
 * Menyusun objek pendaftaran dari formulir + event supaya kartu bukti
 * pembayaran bisa ditampilkan tanpa backend.
 *
 * TODO(API): nilai ini nanti berasal dari respons API, termasuk `kode` pendaftaran.
 */
export function buildRegistration(
  event: EventSummary,
  values: RegistrationFormValues,
  metodeBayar: PaymentMethod,
): Registration {
  return {
    kode: DUMMY_REGISTRATION_KODE,
    event_judul: event.judul,
    event_slug: event.slug,
    tanggal_event: event.tanggal_event,
    lokasi: event.lokasi,
    nama_peserta: values.nama.trim(),
    jenjang: values.jenjang,
    asal_sekolah: values.sekolah.trim(),
    pelajaran: values.pelajaran,
    nama_ortu: values.namaOrtu.trim(),
    whatsapp: values.whatsapp,
    total_bayar: event.harga,
    metode_bayar: metodeBayar,
  };
}
