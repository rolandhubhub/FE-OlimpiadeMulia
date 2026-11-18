import type { ReactNode } from "react";

export function fieldDescribedBy(
  id: string,
  error?: string,
  hint?: string,
): string | undefined {
  const describedBy = [hint ? `${id}-hint` : "", error ? `${id}-error` : ""]
    .filter(Boolean)
    .join(" ");

  return describedBy || undefined;
}

/** Gaya dasar kontrol form situs publik: kotak tajam, fokus jingga, error merah. */
export function fieldControlClassName(hasError: boolean, extra = ""): string {
  const border = hasError
    ? "border-error focus:border-error focus:ring-error/20"
    : "border-garis focus:border-jingga focus:ring-jingga/25";

  return `w-full rounded-none border bg-putih px-3 text-sm text-plum outline-none transition-colors placeholder:text-teks-sekunder/50 focus:ring-2 disabled:cursor-not-allowed disabled:border-garis disabled:bg-gading disabled:text-teks-sekunder/70 ${border} ${extra}`;
}

type FieldProps = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
};

/** Kerangka label + kontrol + pesan. Error menggantikan hint saat ada. */
export function Field({ id, label, error, hint, required = false, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[11px] font-semibold text-plum">
        {label}
        {required ? " *" : ""}
      </label>

      {children}

      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs text-error">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-teks-sekunder">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
