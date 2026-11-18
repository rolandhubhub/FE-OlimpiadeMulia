import type { ReactNode } from "react";

export type BadgeVariant = "ok" | "warn" | "bad" | "mute";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
}

export default function Badge({ children, variant = "mute" }: BadgeProps) {
  return <span className={`badge badge--${variant}`}>{children}</span>;
}
