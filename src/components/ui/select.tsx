import type { ReactNode, SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { Field, fieldControlClassName, fieldDescribedBy } from "@/components/ui/field";

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  /** Opsi <option>. Placeholder opsional dirender lebih dulu. */
  children: ReactNode;
  placeholder?: string;
};

export function Select({
  id,
  label,
  error,
  hint,
  placeholder,
  required = false,
  className = "",
  children,
  ...props
}: SelectProps) {
  return (
    <Field id={id} label={label} error={error} hint={hint} required={required}>
      <div className="relative">
        <select
          id={id}
          required={required}
          aria-describedby={fieldDescribedBy(id, error, hint)}
          aria-invalid={error ? true : undefined}
          className={fieldControlClassName(
            Boolean(error),
            `h-[52px] appearance-none pr-10 ${className}`,
          )}
          {...props}
        >
          {placeholder ? (
            <option value="" disabled>
              {placeholder}
            </option>
          ) : null}
          {children}
        </select>
        <ChevronDown
          size={16}
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-teks-sekunder"
        />
      </div>
    </Field>
  );
}
