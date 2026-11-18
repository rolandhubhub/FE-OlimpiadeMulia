import type { InputHTMLAttributes, ReactNode } from "react";
import { Field, fieldControlClassName, fieldDescribedBy } from "@/components/ui/field";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  endAdornment?: ReactNode;
};

export function Input({
  id,
  label,
  error,
  hint,
  endAdornment,
  required = false,
  className = "",
  ...props
}: InputProps) {
  return (
    <Field id={id} label={label} error={error} hint={hint} required={required}>
      <div className="relative">
        <input
          id={id}
          required={required}
          aria-describedby={fieldDescribedBy(id, error, hint)}
          aria-invalid={error ? true : undefined}
          className={fieldControlClassName(
            Boolean(error),
            `h-[52px] ${endAdornment ? "pr-12" : ""} ${className}`,
          )}
          {...props}
        />
        {endAdornment ? (
          <div className="absolute inset-y-0 right-1 flex items-center">{endAdornment}</div>
        ) : null}
      </div>
    </Field>
  );
}
