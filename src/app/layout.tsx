import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { AuthProvider } from "@/components/auth/auth-provider";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Yayasan Intan Mutia",
  description: "Landing page komunitas dan kompetisi Yayasan Intan Mutia.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" className={`${cormorant.variable} ${manrope.variable}`}>
      <body className="min-h-screen bg-gading text-plum antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
