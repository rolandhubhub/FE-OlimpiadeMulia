const TOKEN_KEY = "auth_token";

/**
 * Satu-satunya tempat membaca/menulis token Bearer.
 * Token disimpan di localStorage dan hanya boleh diakses di browser,
 * jadi semua fungsi aman dipanggil saat render di server (mengembalikan null).
 */
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // localStorage penuh atau diblokir: login tetap jalan untuk sesi ini.
  }
}

export function clearToken(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Abaikan: tidak ada yang bisa dilakukan bila localStorage diblokir.
  }
}
