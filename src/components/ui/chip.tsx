import type { HTMLAttributes, ReactNode } from "react";

export type ChipVariant = "category" | "status";

export type ChipProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: ChipVariant;
  children: ReactNode;
};

const variants: Record<ChipVariant, string> = {
  category: "bg-violet px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-putih",
  status: "rounded-full border border-garis bg-putih px-3 py-1 text-xs font-semibold",
};

export function Chip({ variant = "category", className = "", children, ...props }: ChipProps) {
  return (
    <span className={`inline-flex items-center justify-center ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
}
