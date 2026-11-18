"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getCurrentUser, login as loginRequest, logout as logoutRequest } from "@/lib/api/auth";
import { UNAUTHORIZED_EVENT } from "@/lib/api/http";
import { clearToken, getToken, setToken } from "@/lib/api/token";
import type { AuthUser, LoginValues } from "@/types/auth";

/**
 * "use client" karena sesi hanya bisa dibaca di browser (token di localStorage)
 * dan Navbar/form butuh state. Status awal dihitung dari ada/tidaknya token;
 * bila token ada, status "loading" sampai GET /me selesai.
 */
export type AuthStatus = "loading" | "guest" | "authed";

interface AuthContextValue {
  user: AuthUser | null;
  status: AuthStatus;
  login: (values: LoginValues) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>(() =>
    getToken() ? "loading" : "guest",
  );

  // Cek token yang sudah ada saat aplikasi pertama dibuka.
  // setState hanya dipanggil setelah request selesai (bukan sinkron di effect).
  useEffect(() => {
    if (!getToken()) return;

    let cancelled = false;

    getCurrentUser()
      .then((currentUser) => {
        if (cancelled) return;
        setUser(currentUser);
        setStatus("authed");
      })
      .catch(() => {
        if (cancelled) return;
        clearToken();
        setUser(null);
        setStatus("guest");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Setiap kali ada request berotentikasi yang dibalas 401, http.ts mengirim
  // event ini. Sesi di aplikasi ikut direset tanpa perlu reload halaman.
  useEffect(() => {
    function handleUnauthorized() {
      setUser(null);
      setStatus("guest");
    }

    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
  }, []);

  const refresh = useCallback(async () => {
    if (!getToken()) {
      setUser(null);
      setStatus("guest");
      return;
    }

    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setStatus("authed");
    } catch {
      clearToken();
      setUser(null);
      setStatus("guest");
    }
  }, []);

  const login = useCallback(async (values: LoginValues) => {
    const response = await loginRequest(values);
    setToken(response.token);
    setUser(response.user);
    setStatus("authed");
    return response.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } catch {
      // Request logout boleh gagal (mis. token sudah tidak valid);
      // token lokal tetap dihapus di bawah.
    } finally {
      clearToken();
      setUser(null);
      setStatus("guest");
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, status, login, logout, refresh }),
    [user, status, login, logout, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth harus dipakai di dalam <AuthProvider>.");
  }
  return context;
}
