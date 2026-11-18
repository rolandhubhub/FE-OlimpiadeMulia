const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRequired(value: string, label: string): string | null {
  return value.trim().length > 0 ? null : `${label} wajib diisi.`;
}

export function validateEmail(value: string): string | null {
  if (!value.trim()) return "Email wajib diisi.";
  return EMAIL_PATTERN.test(value.trim()) ? null : "Format email tidak valid.";
}

export function validatePassword(value: string, minimum = 8): string | null {
  if (!value) return "Kata sandi wajib diisi.";
  return value.length >= minimum ? null : `Kata sandi minimal ${minimum} karakter.`;
}

export function validatePasswordConfirmation(
  value: string,
  password: string,
): string | null {
  if (!value) return "Konfirmasi kata sandi wajib diisi.";
  return value === password ? null : "Konfirmasi kata sandi tidak sama.";
}

export function validatePhone(value: string): string | null {
  if (!value.trim()) return null;
  return /^628\d{7,11}$/.test(value.trim())
    ? null
    : "Nomor HP harus diawali 628 dan terdiri dari 10–14 digit.";
}
