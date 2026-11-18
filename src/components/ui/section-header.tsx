import Link from "next/link";

type SectionHeaderProps = {
  label: string;
  title: string;
  actionText?: string;
  actionHref?: string;
  centered?: boolean;
  intro?: string;
};

export function SectionHeader({
  label,
  title,
  actionText,
  actionHref,
  centered = false,
  intro,
}: SectionHeaderProps) {
  return (
    <div className={centered ? "mx-auto max-w-3xl text-center" : "flex items-end justify-between gap-4"}>
      <div className={centered ? "mx-auto w-full" : "flex-1"}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-magenta">{label}</p>
        {centered ? (
          <>
            <div className="mx-auto my-4 h-px w-20 bg-magenta" />
            <h2 className="font-display text-4xl text-plum md:text-5xl">{title}</h2>
            {intro ? <p className="mx-auto mt-4 max-w-2xl text-base text-teks-sekunder">{intro}</p> : null}
          </>
        ) : (
          <h2 className="mt-2 font-display text-4xl text-plum md:text-5xl">{title}</h2>
        )}
      </div>

      {actionText && actionHref ? (
        <Link
          href={actionHref}
          className="inline-flex items-center border border-plum px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-plum transition-colors hover:bg-gading"
        >
          {actionText}
        </Link>
      ) : null}
    </div>
  );
}
