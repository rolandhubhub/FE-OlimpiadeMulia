import type { EventSummary } from "@/types/events";

// TODO(API): ganti dengan respons GET /event. Semua nilai di bawah masih dummy.
// poster_url sementara memakai aset logo yang sudah ada di public/.
export const events: EventSummary[] = [
  {
    id: 1,
    judul: "Kompetisi Matematika, Sains & Inggris Tingkat Nasional",
    slug: "kmsi",
    deskripsi:
      "Kompetisi Matematika, Sains, dan Inggris (KMSI) merupakan ajang kompetisi akademis berjenjang oleh Yayasan Pendidikan Intan Mutia untuk menguji kemampuan pelajar di tiga bidang studi utama: Matematika, Sains (IPA), dan Bahasa Inggris. Babak penyisihan dilaksanakan daring, sedangkan final dilaksanakan luring.",
    harga: 150000,
    pendaftaran_mulai: "2026-11-13T00:00:00+07:00",
    pendaftaran_selesai: "2027-01-22T23:59:59+07:00",
    tanggal_event: "2027-02-21T08:00:00+07:00",
    lokasi: "Universitas Ma Chung",
    status: "buka",
    poster_url: "/logo/logo-kmsi.png",
    bisa_daftar: true,
  },
  {
    id: 2,
    judul: "Jenius Science Olympiad (JSO)",
    slug: "jso",
    deskripsi:
      "Jenius Science Olympiad (JSO) adalah ajang olimpiade nasional berjenjang untuk pelajar TK, SD, hingga SMP sederajat. Materi uji mencakup Matematika, Sains, Bahasa Inggris, serta Ilmu Pengetahuan Sosial (IPS).",
    harga: 125000,
    pendaftaran_mulai: "2027-03-01T00:00:00+07:00",
    pendaftaran_selesai: "2027-04-10T23:59:59+07:00",
    tanggal_event: "2027-05-16T08:00:00+07:00",
    lokasi: "Universitas Brawijaya",
    status: "buka",
    poster_url: "/logo/logo-jso.png",
    bisa_daftar: false,
  },
  {
    id: 3,
    judul: "Intan Mutia Competition (IMC)",
    slug: "imc",
    deskripsi:
      "Intan Mutia Competition (IMC) adalah program kompetisi tingkat regional dalam format satu kali babak. Ajang ini menjadi wadah evaluasi berkala bagi siswa untuk mengukur potensi dan pencapaian akademis secara langsung dan efisien.",
    harga: 100000,
    pendaftaran_mulai: "2026-08-01T00:00:00+07:00",
    pendaftaran_selesai: "2026-10-24T23:59:59+07:00",
    tanggal_event: "2026-10-25T08:00:00+07:00",
    lokasi: "Universitas Ma Chung",
    status: "tutup",
    poster_url: "/logo/logo-imc.png",
    bisa_daftar: false,
  },
];
