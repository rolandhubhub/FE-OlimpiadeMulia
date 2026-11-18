/**
 * Error dari API. `status` berisi kode HTTP (0 bila server tidak bisa dihubungi),
 * `errors` berisi pesan validasi per field dari respons 422 Laravel.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly errors: Record<string, string[]>;

  constructor(status: number, message: string, errors: Record<string, string[]> = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }

  /** Ambil pesan pertama tiap field, siap dipakai di bawah input formulir. */
  get fieldErrors(): Record<string, string> {
    return Object.fromEntries(
      Object.entries(this.errors).map(([field, messages]) => [
        field,
        messages[0] ?? "Nilai tidak valid.",
      ]),
    );
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function getErrorMessage(
  error: unknown,
  fallback = "Terjadi kesalahan. Silakan coba lagi.",
): string {
  if (isApiError(error)) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
