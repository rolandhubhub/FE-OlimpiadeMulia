import type { AdminValidationErrors, AdminValidationField } from "@/types/admin";

export function validateRequired(value: unknown, label: string): string | null {
  if (typeof value === "string" ? value.trim().length === 0 : value == null) {
    return `${label} wajib diisi.`;
  }
  return null;
}

export function validateEmail(value: unknown, label = "Email"): string | null {
  if (typeof value !== "string" || value.trim().length === 0) return null;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(value.trim()) ? null : `${label} tidak valid.`;
}

export function validateFields(
  fields: Record<string, AdminValidationField>,
): AdminValidationErrors {
  return Object.fromEntries(
    Object.entries(fields).flatMap(([name, field]) => {
      const requiredError = field.required ? validateRequired(field.value, field.label) : null;
      const error = requiredError ?? (field.email ? validateEmail(field.value, field.label) : null);
      return error ? [[name, error]] : [];
    }),
  );
}
