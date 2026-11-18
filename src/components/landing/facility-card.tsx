import type { LucideIcon } from "lucide-react";
import { Brain, Building2, Camera, Sparkles, Target, Trophy, Video, Zap } from "lucide-react";
import type { FacilityItem } from "@/types/facilities";

const iconMap: Record<FacilityItem["icon"], LucideIcon> = {
  Building2,
  Brain,
  Sparkles,
  Trophy,
  Target,
  Zap,
  Video,
  Camera,
};

export function FacilityCard({ item }: { item: FacilityItem }) {
  const Icon = iconMap[item.icon];

  return (
    <article className="border border-garis bg-putih p-5">
      <div className="mb-4 flex h-10 w-10 items-center justify-center border border-garis bg-gading text-magenta">
        <Icon size={18} />
      </div>
      <h3 className="text-lg font-semibold text-plum">{item.title}</h3>
      <p className="mt-2 text-sm leading-6 text-teks-sekunder">{item.description}</p>
    </article>
  );
}
