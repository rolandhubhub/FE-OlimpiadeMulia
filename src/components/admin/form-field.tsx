import { cloneElement, type ReactElement } from "react";

interface FormControlProps {
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
}

interface FormFieldProps {
  id: string;
  label: string;
  children: ReactElement<FormControlProps>;
  hint?: string;
  error?: string;
  required?: boolean;
}

export default function FormField({
  id,
  label,
  children,
  hint,
  error,
  required = false,
}: FormFieldProps) {
  const describedBy = [
    children.props["aria-describedby"],
    hint ? `${id}-hint` : "",
    error ? `${id}-error` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="form-field">
      <label className="form-field__label" htmlFor={id}>
        {label}
        {required ? " *" : ""}
      </label>
      {cloneElement(children, {
        "aria-describedby": describedBy || undefined,
        "aria-invalid": error ? true : undefined,
      })}
      {hint ? (
        <p className="form-field__hint" id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p className="form-field__error" id={`${id}-error`} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
