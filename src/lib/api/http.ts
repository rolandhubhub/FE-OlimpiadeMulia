import { API_BASE_URL } from "./config";
import { ApiError } from "./errors";
import { clearToken, getToken } from "./token";

/** Nama event browser yang dikirim saat token ditolak (401), didengar AuthProvider. */
export const UNAUTHORIZED_EVENT = "auth:unauthorized";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RequestOptions {
  method?: HttpMethod;
  /** Object biasa dikirim sebagai JSON; FormData dikirim apa adanya (multipart). */
  body?: unknown;
  /** true = sertakan header Authorization: Bearer <token>. */
  auth?: boolean;
  signal?: AbortSignal;
}

const fallbackMessage: Record<number, string> = {
  401: "Sesi kamu sudah berakhir. Silakan login kembali.",
  403: "Kamu tidak punya akses ke data ini.",
  404: "Data tidak ditemukan.",
  409: "Data bentrok dengan data lain.",
  422: "Data yang dikirim belum valid.",
  500: "Server sedang bermasalah. Silakan coba lagi.",
};

function readErrorMessage(status: number, data: unknown): string {
  if (data && typeof data === "object" && "message" in data) {
    const message = (data as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) return message;
  }
  return fallbackMessage[status] ?? "Permintaan ke server gagal.";
}

function readValidationErrors(data: unknown): Record<string, string[]> {
  if (!data || typeof data !== "object" || !("errors" in data)) return {};
  const errors = (data as { errors?: unknown }).errors;
  if (!errors || typeof errors !== "object") return {};

  return Object.fromEntries(
    Object.entries(errors).flatMap(([field, messages]) => {
      if (!Array.isArray(messages)) return [];
      const texts = messages.filter((item): item is string => typeof item === "string");
      return texts.length ? [[field, texts]] : [];
    }),
  );
}

function notifyUnauthorized(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
}

/**
 * Permintaan HTTP ke API. Dipakai langsung oleh endpoint publik/auth.ts,
 * sedangkan endpoint berotentikasi memakai helper di client.ts.
 */
export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, auth = false, signal } = options;

  const headers: Record<string, string> = { Accept: "application/json" };
  const token = auth ? getToken() : null;
  if (token) headers.Authorization = `Bearer ${token}`;

  let payload: BodyInit | undefined;
  if (body instanceof FormData) {
    // Jangan set Content-Type manual: browser menambahkan boundary multipart.
    payload = body;
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: payload,
      signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new ApiError(
      0,
      "Tidak dapat terhubung ke server. Periksa koneksi atau pastikan backend berjalan.",
    );
  }

  if (response.status === 204) return undefined as T;

  const text = await response.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    if (response.status === 401 && auth) {
      clearToken();
      notifyUnauthorized();
    }
    throw new ApiError(response.status, readErrorMessage(response.status, data), readValidationErrors(data));
  }

  return data as T;
}
