import type { Registration } from "@/types/registrations";

/**
 * Nomor pendaftaran dummy yang dipakai alur /event/[slug]/daftar dan
 * halaman /pendaftaran/[kode]. TODO(API): ganti dengan nomor dari respons API.
 */
export const DUMMY_REGISTRATION_KODE = "REG-2026-00040";

// TODO(API): ganti dengan respons GET /pendaftaran/{kode}.
// Nilai di bawah disalin dari view-receipt di design/user-html/event.html.
export const registrations: Registration[] = [
  {
    kode: DUMMY_REGISTRATION_KODE,
    event_judul: "Kompetisi Matematika, Sains & Inggris Tingkat Nasional",
    event_slug: "kmsi",
    tanggal_event: "2027-02-21T08:00:00+07:00",
    lokasi: "Universitas Ma Chung",
    nama_peserta: "Margaretha Nessa Ghaisani",
    jenjang: "SMP",
    asal_sekolah: "SMPN 1 Kasih Indah",
    pelajaran: "Sains",
    nama_ortu: "Antonio Gregorius",
    whatsapp: "628233457758",
    total_bayar: 150000,
    metode_bayar: "qris",
  },
];
