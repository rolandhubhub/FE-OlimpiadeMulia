import Image from "next/image";
import { SectionHeader } from "@/components/ui/section-header";
import { partners } from "@/data/about";

export function PartnerSection() {
  return (
    <section className="space-y-8">
      <SectionHeader
        label="Partner Kami"
        centered
        title="Partner Kami"
        intro="Yayasan Intan Mutia Bekerja Sama Dengan :"
      />

      <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
        {partners.map((partner) => (
          <div key={partner.id} className="flex min-h-[120px] items-center justify-center border border-garis bg-putih p-4">
            <Image src={partner.logo} alt={partner.name} width={160} height={80} className="max-h-[76px] w-auto object-contain" />
          </div>
        ))}
      </div>
    </section>
  );
}
