import Image from "next/image";

type EventPosterProps = {
  src: string | null;
  alt: string;
  width: number;
  height: number;
  className?: string;
  imageClassName?: string;
};

/**
 * Poster event dengan placeholder saat `poster_url` kosong.
 * TODO(API): kalau poster sudah berasal dari host Laravel, daftarkan host-nya
 * di `next.config.ts` (images.remotePatterns) dan tambahkan `sizes` bila perlu.
 */
export function EventPoster({
  src,
  alt,
  width,
  height,
  className = "",
  imageClassName = "",
}: EventPosterProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`h-auto w-auto object-contain ${imageClassName}`}
        />
      ) : (
        <span className="border border-dashed border-garis px-4 py-6 text-[10px] font-semibold uppercase tracking-[0.12em] text-teks-sekunder">
          Poster belum tersedia
        </span>
      )}
    </div>
  );
}
