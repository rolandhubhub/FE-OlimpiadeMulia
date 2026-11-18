import { getEventLabel, statusToneClassName } from "@/lib/status";
import type { EventSummary } from "@/types/events";

type EventBadgeProps = {
  event: EventSummary;
  className?: string;
};

/** Badge "SEGERA DIBUKA" / "BERLANGSUNG" dari status + tanggal pendaftaran. */
export function EventBadge({ event, className = "" }: EventBadgeProps) {
  const meta = getEventLabel(event);

  return (
    <span
      className={`inline-flex items-center justify-center border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] ${statusToneClassName[meta.tone]} ${className}`}
    >
      {meta.label}
    </span>
  );
}
