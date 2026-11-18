import type { ReactNode } from "react";
import { CartProvider } from "@/components/buku/cart-provider";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteNavbar } from "@/components/layout/site-navbar";

/**
 * Cangkang halaman akun (profil, pendaftaran) — Navbar + Footer seperti situs publik.
 * CartProvider ikut dipasang karena Navbar menampilkan badge keranjang.
 */
export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <div className="min-h-screen bg-gading text-plum">
        <SiteNavbar />
        <main className="mx-auto w-full max-w-[1200px] px-4 py-8 md:px-6">{children}</main>
        <SiteFooter />
      </div>
    </CartProvider>
  );
}
