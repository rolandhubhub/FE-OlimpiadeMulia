import { EventCard } from "@/components/event/event-card";
import { SectionHeader } from "@/components/ui/section-header";
import { getEvents } from "@/lib/data/event";

export async function EventSection() {
  const events = await getEvents();

  return (
    <section className="space-y-8">
      <SectionHeader
        label="Event"
        title="Event Intan Mutia"
        actionText="Lihat Event Yang Akan Berlangsung"
        actionHref="/event"
      />

      <div className="grid gap-5 md:grid-cols-3">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}
