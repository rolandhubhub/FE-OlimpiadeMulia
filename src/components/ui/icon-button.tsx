import type { ButtonHTMLAttributes, ReactNode } from "react";

export type IconButtonVariant = "outline" | "plum";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: IconButtonVariant;
  icon: ReactNode;
  label?: string;
};

const variants: Record<IconButtonVariant, string> = {
  outline: "border border-plum bg-putih text-plum hover:bg-gading focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jingga",
  plum: "bg-plum text-putih hover:bg-magenta focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jingga",
};

export function IconButton({
  variant = "outline",
  icon,
  label,
  className = "",
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label ?? "Icon button"}
      className={`inline-flex h-11 w-11 items-center justify-center rounded-none transition-colors duration-200 ${variants[variant]} ${className}`}
      {...props}
    >
      {icon}
    </button>
  );
}
