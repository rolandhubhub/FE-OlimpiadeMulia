import { request, type RequestOptions } from "./http";

/**
 * Permintaan ke endpoint yang butuh login (admin/user).
 * Token Bearer diambil otomatis dari token.ts, jadi komponen tidak perlu
 * menyentuh localStorage sendiri.
 */
export function clientRequest<T>(path: string, options: Omit<RequestOptions, "auth"> = {}): Promise<T> {
  return request<T>(path, { ...options, auth: true });
}

export function clientGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  return clientRequest<T>(path, { signal });
}

export function clientPost<T>(path: string, body?: unknown): Promise<T> {
  return clientRequest<T>(path, { method: "POST", body });
}

export function clientPatch<T>(path: string, body?: unknown): Promise<T> {
  return clientRequest<T>(path, { method: "PATCH", body });
}

export function clientPut<T>(path: string, body?: unknown): Promise<T> {
  return clientRequest<T>(path, { method: "PUT", body });
}

export function clientDelete<T>(path: string): Promise<T> {
  return clientRequest<T>(path, { method: "DELETE" });
}
