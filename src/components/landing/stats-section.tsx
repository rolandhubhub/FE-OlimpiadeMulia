import { stats } from "@/data/about";

export function StatsSection() {
  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label + stat.value} className="h-full border border-garis bg-putih p-6 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-magenta">
              {stat.label}
            </p>
            <p className="mt-4 font-display text-4xl text-plum md:text-5xl">{stat.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
