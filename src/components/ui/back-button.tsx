"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

type BackButtonProps = {
  /** Kalau diisi, tombol menjadi tautan biasa ke halaman tersebut. */
  href?: string;
  label?: string;
  className?: string;
};

/**
 * Tombol "Kembali". Tanpa href memakai riwayat browser (router.back()).
 * "use client" karena butuh useRouter saat href tidak diberikan.
 */
export function BackButton({ href, label = "Kembali", className = "" }: BackButtonProps) {
  const router = useRouter();
  const baseClass = `inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-teks-sekunder transition-colors hover:text-plum focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jingga ${className}`;

  if (href) {
    return (
      <Link href={href} className={baseClass}>
        <ArrowLeft size={14} aria-hidden="true" />
        {label}
      </Link>
    );
  }

  return (
    <button type="button" onClick={() => router.back()} className={baseClass}>
      <ArrowLeft size={14} aria-hidden="true" />
      {label}
    </button>
  );
}
