import type { NominationItem } from "@/types/nominations";

// TODO(API): ganti dengan respons GET /juara. Gambar memakai aset lokal sementara.
export const nominations: NominationItem[] = [
  {
    id: "jso-2025",
    title: "Daftar Juara JSO Tahun 2025",
    image: "/images/images-11.jpg",
  },
  {
    id: "kmsi-2025",
    title: "Daftar Juara KMSI Tahun 2025",
    image: "/images/images-14.jpg",
  },
  {
    id: "imc-2025",
    title: "Daftar Juara IMC Tahun 2025",
    image: "/images/images-12.jpg",
  },
];
