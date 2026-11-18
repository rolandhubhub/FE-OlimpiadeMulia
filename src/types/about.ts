export type StatItem = {
  label: string;
  value: string;
};

export type PartnerItem = {
  id: string;
  name: string;
  logo: string;
  href: string;
};

/** Kartu statistik halaman Tentang Kami (unit tampil di baris sendiri). */
export type AboutStatItem = {
  label: string;
  value: string;
  unit?: string;
};

export type AboutValueItem = {
  number: string;
  title: string;
  description: string;
};

/** Foto galeri. `src` null berarti file belum tersedia -> tampil placeholder. */
export type GalleryPhoto = {
  id: string;
  alt: string;
  src: string | null;
};
