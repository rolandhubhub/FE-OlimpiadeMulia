import Link from "next/link";
import { NominationCard } from "@/components/nominasi/nomination-card";
import { nominations } from "@/data/nominations";

export function NominationSection() {
  return (
    <section className="space-y-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-magenta">
            INFORMASI JUARA
          </p>
          <h2 className="mt-2 font-display text-4xl text-plum md:text-5xl">Nominasi</h2>
        </div>

        <Link
          href="/nominasi"
          className="inline-flex items-center border border-plum px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-plum transition-colors hover:bg-gading"
        >
          Semua Nominasi
        </Link>
      </div>

      <div className="border border-garis bg-putih p-4 md:p-5">
        <div className="grid gap-5 md:grid-cols-3">
          {nominations.map((item) => (
            <NominationCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
