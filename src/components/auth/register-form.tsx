"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  validateEmail,
  validatePassword,
  validatePasswordConfirmation,
  validatePhone,
  validateRequired,
} from "@/lib/auth/validation";
import type { AuthFieldErrors, RegisterValues } from "@/types/auth";

const MINIMUM_PASSWORD_LENGTH = 8;

export default function RegisterForm() {
  const [values, setValues] = useState<RegisterValues>({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<AuthFieldErrors<RegisterValues>>({});

  function updateField<Field extends keyof RegisterValues>(
    field: Field,
    value: RegisterValues[Field],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function onSubmit(payload: RegisterValues) {
    // TODO(API): kirim payload ke endpoint register Laravel (Sanctum) di sini.
    void payload;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: AuthFieldErrors<RegisterValues> = {};
    const fullNameError = validateRequired(values.fullName, "Nama lengkap");
    if (fullNameError) nextErrors.fullName = fullNameError;
    const emailError = validateEmail(values.email);
    if (emailError) nextErrors.email = emailError;
    const phoneError = validatePhone(values.phone);
    if (phoneError) nextErrors.phone = phoneError;
    const passwordError = validatePassword(values.password, MINIMUM_PASSWORD_LENGTH);
    if (passwordError) nextErrors.password = passwordError;
    const confirmError = validatePasswordConfirmation(
      values.confirmPassword,
      values.password,
    );
    if (confirmError) nextErrors.confirmPassword = confirmError;

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      const firstInvalid = nextErrors.fullName
        ? "register-name"
        : nextErrors.email
          ? "register-email"
          : nextErrors.phone
            ? "register-phone"
            : nextErrors.password
              ? "register-password"
              : "register-confirm-password";
      document.getElementById(firstInvalid)?.focus();
      return;
    }

    setErrors({});
    onSubmit({
      fullName: values.fullName.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      password: values.password,
      confirmPassword: values.confirmPassword,
    });
  }

  return (
    <section
      aria-labelledby="register-title"
      className="flex flex-1 items-center justify-center px-5 py-12 sm:px-8"
    >
      <div className="w-full max-w-[440px]">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-magenta">
          Daftar
        </p>
        <h1
          id="register-title"
          className="mt-1 font-display text-3xl font-semibold leading-tight text-plum"
        >
          Buat Akun
        </h1>

        <form noValidate onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <Input
            id="register-name"
            label="Nama Lengkap"
            name="fullName"
            value={values.fullName}
            onChange={(event) => updateField("fullName", event.target.value)}
            error={errors.fullName}
            placeholder="Masukkan nama lengkap"
            autoComplete="name"
          />

          <Input
            id="register-email"
            label="Email"
            type="email"
            name="email"
            value={values.email}
            onChange={(event) => updateField("email", event.target.value)}
            error={errors.email}
            placeholder="Masukkan alamat email"
            autoComplete="email"
          />

          <Input
            id="register-phone"
            label="Nomor HP"
            type="tel"
            inputMode="numeric"
            name="phone"
            value={values.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            error={errors.phone}
            hint="Opsional. Format: 628xxxxxxxxx."
            placeholder="628xxxxxxxxx"
            autoComplete="tel"
          />

          <PasswordInput
            id="register-password"
            label="Kata Sandi"
            value={values.password}
            onChange={(value) => updateField("password", value)}
            error={errors.password}
            hint="Minimal 8 karakter."
            placeholder="Masukkan kata sandi"
            autoComplete="new-password"
          />

          <PasswordInput
            id="register-confirm-password"
            label="Konfirmasi Kata Sandi"
            value={values.confirmPassword}
            onChange={(value) => updateField("confirmPassword", value)}
            error={errors.confirmPassword}
            placeholder="Ulangi kata sandi"
            autoComplete="new-password"
          />

          <Button type="submit" className="mt-1 h-14 w-full">
            Daftar
          </Button>
        </form>

        <p className="mt-4 text-sm text-teks-sekunder">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="font-semibold text-magenta transition-colors hover:text-plum focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jingga"
          >
            Masuk
          </Link>
        </p>
      </div>
    </section>
  );
}
