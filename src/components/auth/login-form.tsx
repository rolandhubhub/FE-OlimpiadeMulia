"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError, getErrorMessage } from "@/lib/api/errors";
import { validateEmail, validateRequired } from "@/lib/auth/validation";
import type { AuthFieldErrors, LoginValues } from "@/types/auth";

const loginFields: Array<keyof LoginValues> = ["email", "password"];

/** Ambil tujuan ?redirect=... hanya bila berupa path internal (hindari open redirect). */
function readRedirectTarget(): string | null {
  if (typeof window === "undefined") return null;
  const value = new URLSearchParams(window.location.search).get("redirect");
  if (!value || !value.startsWith("/") || value.startsWith("//")) return null;
  return value;
}

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [values, setValues] = useState<LoginValues>({ email: "", password: "" });
  const [errors, setErrors] = useState<AuthFieldErrors<LoginValues>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function updateField<Field extends keyof LoginValues>(
    field: Field,
    value: LoginValues[Field],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  async function onSubmit(payload: LoginValues) {
    setPending(true);
    setFormError(null);

    try {
      const user = await login(payload);
      const redirect = readRedirectTarget();
      const target = redirect ?? (user.role === "admin" ? "/admin/dashboard" : "/profil");
      router.replace(target);
    } catch (error) {
      if (error instanceof ApiError && error.status === 422) {
        const fieldErrors = error.fieldErrors;
        const nextErrors: AuthFieldErrors<LoginValues> = {};
        if (fieldErrors.email) nextErrors.email = fieldErrors.email;
        if (fieldErrors.password) nextErrors.password = fieldErrors.password;
        setErrors(nextErrors);
        // Menurut spec, login gagal membalas 422 { message: "Invalid credentials" }.
        setFormError(
          Object.keys(nextErrors).length > 0
            ? "Periksa kembali email dan kata sandi."
            : "Email atau kata sandi salah.",
        );
      } else {
        setFormError(getErrorMessage(error));
      }
    } finally {
      setPending(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: AuthFieldErrors<LoginValues> = {};
    const emailError = validateEmail(values.email);
    if (emailError) nextErrors.email = emailError;
    const passwordError = validateRequired(values.password, "Kata sandi");
    if (passwordError) nextErrors.password = passwordError;

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      const firstInvalid = loginFields.find((field) => nextErrors[field]);
      if (firstInvalid) document.getElementById(`login-${firstInvalid}`)?.focus();
      return;
    }

    setErrors({});
    void onSubmit({ email: values.email.trim(), password: values.password });
  }

  return (
    <section
      aria-labelledby="login-title"
      className="flex flex-1 items-center justify-center px-5 py-12 sm:px-8"
    >
      <div className="w-full max-w-[440px]">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-magenta">
          Login
        </p>
        <h1
          id="login-title"
          className="mt-1 font-display text-4xl font-semibold leading-tight text-plum md:text-5xl"
        >
          Login Ke Akun
        </h1>

        <form noValidate onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
          <Input
            id="login-email"
            label="Email"
            type="email"
            name="email"
            value={values.email}
            onChange={(event) => updateField("email", event.target.value)}
            error={errors.email}
            placeholder="Masukkan alamat email"
            autoComplete="email"
          />

          <PasswordInput
            id="login-password"
            label="Kata Sandi"
            value={values.password}
            onChange={(value) => updateField("password", value)}
            error={errors.password}
            placeholder="Masukkan kata sandi"
            autoComplete="current-password"
          />

          {formError ? (
            <p role="alert" className="text-sm font-semibold text-error">
              {formError}
            </p>
          ) : null}

          <Button type="submit" className="mt-1 h-14 w-full" disabled={pending}>
            {pending ? "Memproses..." : "Masuk"}
          </Button>
        </form>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-sm">
          <p className="text-teks-sekunder">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="font-semibold text-magenta transition-colors hover:text-plum focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jingga"
            >
              Daftar Sekarang
            </Link>
          </p>
          {/* TODO(API): aktifkan tautan ini setelah endpoint lupa password tersedia. */}
          <span
            aria-disabled="true"
            title="Fitur lupa password belum tersedia"
            className="cursor-not-allowed select-none text-teks-sekunder/60"
          >
            Lupa password?
          </span>
        </div>
      </div>
    </section>
  );
}
