import { AboutSection } from "@/components/landing/about-section";
import { BookSection } from "@/components/landing/book-section";
import { EventSection } from "@/components/landing/event-section";
import { FacilitySection } from "@/components/landing/facility-section";
import { HeroSection } from "@/components/landing/hero-section";
import { NominationSection } from "@/components/landing/nomination-section";
import { OlympiadBanner } from "@/components/landing/olympiad-banner";
import { PartnerSection } from "@/components/landing/partner-section";
import { StatsSection } from "@/components/landing/stats-section";

export default function HomePage() {
  return (
    <div className="space-y-16 pb-8 md:space-y-24">
      <HeroSection />
      <EventSection />
      <BookSection />
      <NominationSection />
      <FacilitySection />
      <OlympiadBanner />
      <AboutSection />
      <StatsSection />
      <PartnerSection />
    </div>
  );
}
