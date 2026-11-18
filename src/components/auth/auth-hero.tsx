import type { ReactNode } from "react";

interface AuthHeroProps {
  eyebrow: string;
  headline: ReactNode;
}

export function AuthHero({ eyebrow, headline }: AuthHeroProps) {
  return (
    <aside
      aria-label={eyebrow}
      className="relative hidden shrink-0 overflow-hidden bg-plum md:flex md:w-[52.5%]"
    >
      {/*
        TODO(aset): screenshot memakai foto latar yang belum ada di public/.
        Setelah file fotonya ditambahkan, ganti lapisan gradien ini dengan next/image.
      */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-br from-plum via-violet/50 to-plum"
      />
      <div
        aria-hidden="true"
        className="absolute -left-24 top-1/4 h-80 w-80 rounded-full border border-jingga/25"
      />
      <div
        aria-hidden="true"
        className="absolute -right-24 -bottom-40 h-[26rem] w-[26rem] rounded-full bg-violet/40 blur-3xl"
      />

      <div className="relative z-10 flex w-full flex-col justify-center py-16 pl-[9.5%] pr-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-jingga">
          {eyebrow}
        </p>
        <p className="mt-3 max-w-[95%] font-display text-[clamp(2.25rem,4.6vw,3rem)] font-semibold leading-[1.1] text-putih">
          {headline}
        </p>
      </div>
    </aside>
  );
}
