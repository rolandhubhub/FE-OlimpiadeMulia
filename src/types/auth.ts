export interface LoginValues {
  email: string;
  password: string;
}

export interface RegisterValues {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export type AuthFieldErrors<T> = Partial<Record<keyof T, string>>;

/** Sesuai respons GET /me dan POST /login. */
export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  role: "user" | "admin";
}
