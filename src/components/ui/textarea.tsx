import type { TextareaHTMLAttributes } from "react";
import { Field, fieldControlClassName, fieldDescribedBy } from "@/components/ui/field";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  id: string;
  label: string;
  error?: string;
  hint?: string;
};

export function Textarea({
  id,
  label,
  error,
  hint,
  required = false,
  rows = 4,
  className = "",
  ...props
}: TextareaProps) {
  return (
    <Field id={id} label={label} error={error} hint={hint} required={required}>
      <textarea
        id={id}
        rows={rows}
        required={required}
        aria-describedby={fieldDescribedBy(id, error, hint)}
        aria-invalid={error ? true : undefined}
        className={fieldControlClassName(
          Boolean(error),
          `min-h-[120px] resize-y py-3 ${className}`,
        )}
        {...props}
      />
    </Field>
  );
}
