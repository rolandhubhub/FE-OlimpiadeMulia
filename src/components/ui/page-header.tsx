import type { ReactNode } from "react";
import { BackButton } from "@/components/ui/back-button";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  /** Tampilkan tombol "Kembali" ke halaman ini. */
  backHref?: string;
  className?: string;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
  backHref,
  className = "",
}: PageHeaderProps) {
  return (
    <header className={`flex flex-wrap items-end justify-between gap-4 ${className}`}>
      <div className="min-w-0">
        {backHref ? <BackButton href={backHref} className="mb-4" /> : null}
        {eyebrow ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-magenta">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-2 font-display text-4xl leading-tight text-plum md:text-5xl">{title}</h1>
        {description ? (
          <p className="mt-3 max-w-2xl text-base text-teks-sekunder">{description}</p>
        ) : null}
      </div>

      {action ? <div className="flex shrink-0 flex-wrap items-center gap-3">{action}</div> : null}
    </header>
  );
}
