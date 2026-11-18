import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "cta" | "destructive";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  icon?: ReactNode;
};

const baseClassName =
  "inline-flex items-center justify-center gap-2 rounded-none px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] transition-colors duration-200 disabled:cursor-not-allowed";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-plum text-putih hover:bg-magenta focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jingga disabled:bg-garis disabled:text-[#8e7c90]",
  secondary: "border border-plum bg-putih text-plum hover:bg-gading focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jingga disabled:border-garis disabled:text-[#8e7c90]",
  cta: "bg-jingga text-plum hover:bg-[#d67d1d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-plum disabled:bg-garis disabled:text-[#8e7c90]",
  destructive: "bg-error text-putih hover:bg-[#9c2b26] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-error disabled:bg-garis disabled:text-[#8e7c90]",
};

/** Kelas tombol yang sama, dipakai juga saat tombol perlu berupa <Link>. */
export function buttonClassName(variant: ButtonVariant = "primary", className = ""): string {
  return `${baseClassName} ${variants[variant]} ${className}`;
}

export function Button({
  variant = "primary",
  icon,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button className={buttonClassName(variant, className)} {...props}>
      {icon ? <span aria-hidden="true">{icon}</span> : null}
      {children}
    </button>
  );
}
