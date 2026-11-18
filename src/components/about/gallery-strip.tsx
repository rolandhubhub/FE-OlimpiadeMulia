import Image from "next/image";
import type { GalleryPhoto } from "@/types/about";

type GalleryStripProps = {
  photos: GalleryPhoto[];
};

/**
 * Galeri gulir horizontal (scroll-snap) seperti design/user-html/tentang-kami.html.
 * Foto yang file-nya belum tersedia ditandai `src: null` di `src/data/about.ts`
 * dan ditampilkan sebagai placeholder, bukan gambar rusak.
 */
export function GalleryStrip({ photos }: GalleryStripProps) {
  return (
    <ul className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 md:-mx-6 md:px-6">
      {photos.map((photo) => (
        <li key={photo.id} className="w-[260px] shrink-0 snap-start">
          {photo.src ? (
            <Image
              src={photo.src}
              alt={photo.alt}
              width={260}
              height={380}
              className="h-[380px] w-[260px] border border-garis object-cover"
            />
          ) : (
            <div className="flex h-[380px] w-[260px] flex-col items-center justify-center gap-2 border border-dashed border-garis bg-putih px-5 text-center">
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-magenta">
                Foto belum tersedia
              </span>
              <span className="text-xs leading-5 text-teks-sekunder">{photo.alt}</span>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
