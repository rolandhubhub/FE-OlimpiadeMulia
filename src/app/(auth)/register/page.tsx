import type { Metadata } from "next";
import { AuthHero } from "@/components/auth/auth-hero";
import RegisterForm from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Daftar Akun | Yayasan Intan Mutia",
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen bg-putih">
      <AuthHero eyebrow="SELAMAT DATANG" headline="Mulai Langkah Juaramu." />
      <RegisterForm />
    </div>
  );
}
