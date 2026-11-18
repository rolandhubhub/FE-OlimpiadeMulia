import type { AuthUser, LoginValues } from "@/types/auth";
import { clientRequest } from "./client";
import { request } from "./http";

export interface LoginResponse {
  user: AuthUser;
  token: string;
}

interface MeResponse {
  user: AuthUser;
}

/** POST /login — endpoint publik, token belum ada. */
export function login(values: LoginValues): Promise<LoginResponse> {
  return request<LoginResponse>("/login", { method: "POST", body: values });
}

/** GET /me — butuh token; respons dibungkus { user }. */
export async function getCurrentUser(): Promise<AuthUser> {
  const response = await clientRequest<MeResponse>("/me");
  return response.user;
}

/** POST /logout — menghapus token yang sedang dipakai di server. */
export function logout(): Promise<void> {
  return clientRequest<void>("/logout", { method: "POST" });
}
