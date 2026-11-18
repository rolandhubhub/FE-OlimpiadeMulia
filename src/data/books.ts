import type { BookSummary } from "@/types/books";

// TODO(API): ganti dengan respons GET /buku. Semua nilai di bawah masih dummy.
// Harga seragam Rp 85.000 mengikuti design/user-html/buku-keranjang.html.
// cover_url sementara memakai aset di public/images.
const deskripsi =
  "Kumpulan teknik, pola soal, dan pembahasan bertahap dari soal olimpiade tingkat kota hingga nasional.";

export const books: BookSummary[] = [
  {
    id: 1,
    judul: "Buku Paten Olimpiade SD/MI IPS",
    slug: "ips",
    penulis: "Tim Pendidik Intan Mutia",
    deskripsi,
    harga: 85000,
    stok: 23,
    cover_url: "/images/images-1.jpg",
    is_active: true,
    // TODO(API): `pelajaran` belum ada di kontrak API.
    pelajaran: "IPS",
  },
  {
    id: 2,
    judul: "Buku Paten Olimpiade SD/MI IPA",
    slug: "ipa",
    penulis: "Tim Pendidik Intan Mutia",
    deskripsi,
    harga: 85000,
    stok: 18,
    cover_url: "/images/images-3.jpg",
    is_active: true,
    pelajaran: "IPA",
  },
  {
    id: 3,
    judul: "Buku Paten Olimpiade SD/MI Matematika",
    slug: "matematika",
    penulis: "Tim Pendidik Intan Mutia",
    deskripsi,
    harga: 85000,
    stok: 12,
    cover_url: "/images/images-7.jpg",
    is_active: true,
    pelajaran: "MATEMATIKA",
  },
  {
    id: 4,
    judul: "Buku Paten Olimpiade SD/MI Bahasa Inggris",
    slug: "bahasa-inggris",
    penulis: "Tim Pendidik Intan Mutia",
    deskripsi,
    harga: 85000,
    stok: 30,
    cover_url: "/images/images-10.jpg",
    is_active: true,
    pelajaran: "BAHASA INGGRIS",
  },
];
