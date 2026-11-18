import { SectionHeader } from "@/components/ui/section-header";
import { facilities } from "@/data/facilities";
import { FacilityCard } from "@/components/landing/facility-card";

export function FacilitySection() {
  return (
    <section className="space-y-8">
      <SectionHeader
        label="Fasilitas Yayasan"
        centered
        title="Fasilitas Yayasan"
        intro="Yayasan Intan Mutia menyediakan berbagai fasilitas pendukung untuk memastikan kegiatan berjalan optimal."
      />

      <div className="grid gap-4 md:grid-cols-4">
        {facilities.map((item) => (
          <FacilityCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
