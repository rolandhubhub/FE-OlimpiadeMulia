import type { Metadata } from "next";
import { AuthHero } from "@/components/auth/auth-hero";
import LoginForm from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login | Yayasan Intan Mutia",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-putih">
      <AuthHero
        eyebrow="SELAMAT DATANG KEMBALI"
        headline={
          <>
            Bersama tumbuh,
            <br />
            berani berprestasi.
          </>
        }
      />
      <LoginForm />
    </div>
  );
}
