import type {
  AboutStatItem,
  AboutValueItem,
  GalleryPhoto,
  PartnerItem,
  StatItem,
} from "@/types/about";

// Dipakai kartu statistik singkat di Beranda.
export const stats: StatItem[] = [
  { label: "Tahun berdiri", value: "2022" },
  { label: "Telah dilaksanakan di", value: "17 Provinsi" },
  { label: "Telah dilaksanakan di", value: "112 Rayon" },
  { label: "Total Peserta", value: "29.953+" },
];

export const partners: PartnerItem[] = [
  { id: "kmsi", name: "KMSI", logo: "/logo/logo-kmsi.png", href: "/" },
  { id: "kemendikdasmen", name: "Kemendikdasmen", logo: "/logo/logo-intan-mulia-border.png", href: "/" },
  { id: "imc", name: "Intan Mutia Competition", logo: "/logo/logo-imc.png", href: "/" },
  { id: "jso", name: "JSO", logo: "/logo/logo-jso.png", href: "/" },
];

// --- Konten halaman /tentang-kami (teks disalin persis dari design/25) ---

export const aboutStats: AboutStatItem[] = [
  { label: "Tahun berdiri", value: "2022" },
  { label: "Telah dilaksanakan di", value: "17", unit: "Provinsi" },
  { label: "Telah dilaksanakan di", value: "112", unit: "Rayon" },
  { label: "Total Peserta", value: "29.953+" },
];

export const vision =
  "Yayasan Pendidikan Intan Mutia akan menjadi Lembaga Pelaksana Olimpiade Pendidikan untuk Memajukan Prestasi Pendidikan Anak-Anak Indonesia. Baik Kancah Nasional maupun Internasional.";

export const missions: string[] = [
  "Meningkatkan ilmu pengetahuan bagi para pelajar, mengembangkan semangat dalam bidang akademis yang positif dikalangan pelajar, serta mengembangkan rasa keberanian dan rasa percaya diri bagi para peserta.",
  "Memberikan kesempatan bagi anak didik yang kurang mampu agar bisa ikut berkompetisi di jalur pendidikan.",
  "Menjalin tali silaturahmi dan kekeluargaan antar pelajar.",
];

export const aboutValues: AboutValueItem[] = [
  {
    number: "01",
    title: "Integritas",
    description:
      "Penilaian dan pengumuman juara dilakukan terbuka dan dapat dipertanggungjawabkan.",
  },
  {
    number: "02",
    title: "Kualitas",
    description: "Soal dan buku disusun serta ditelaah oleh pendidik berpengalaman.",
  },
  {
    number: "03",
    title: "Inklusif",
    description: "Biaya terjangkau dan pendaftaran mudah untuk semua jenjang.",
  },
];

export const achievements: string[] = [
  "Kerja sama dengan beberapa kabupaten/kota",
  "Soal dan buku disusun serta ditelaah oleh pendidik berpengalaman.",
  "Biaya terjangkau dan pendaftaran mudah untuk semua jenjang.",
];

// TODO(ASET): file sumber di design/user-html/tentang-kami.html adalah
// public/aset/IMG_6612.JPG dst., tetapi folder public/aset dan keenam file itu
// belum ada di repo. Salin ke public/images dengan nama di komentar tiap foto,
// lalu ganti `src: null` menjadi `src: "/images/<nama file>"`.
export const gallery: GalleryPhoto[] = [
  // IMG_6612.JPG -> /images/momen-bersama-1.jpg
  { id: "momen-1", alt: "Galeri Intan Mutia 1", src: null },
  // IMG_1851.JPG -> /images/momen-bersama-2.jpg
  { id: "momen-2", alt: "Galeri Intan Mutia 2", src: null },
  // IMG_1833.JPG -> /images/momen-bersama-3.jpg
  { id: "momen-3", alt: "Galeri Intan Mutia 3", src: null },
  // IMG_6578.JPG -> /images/momen-bersama-4.jpg
  { id: "momen-4", alt: "Galeri Intan Mutia 4", src: null },
  // IMG_6591.JPG -> /images/momen-bersama-5.jpg
  { id: "momen-5", alt: "Galeri Intan Mutia 5", src: null },
  // IMG_6615.JPG -> /images/momen-bersama-6.jpg
  { id: "momen-6", alt: "Galeri Intan Mutia 6", src: null },
];
