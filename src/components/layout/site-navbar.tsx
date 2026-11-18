"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingCart, User, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { AccountMenu } from "@/components/layout/account-menu";
import { useCart } from "@/components/buku/cart-provider";
import { navItems } from "@/data/navigation";

export function SiteNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { totalItems } = useCart();
  // Sesi dibaca dari AuthProvider; render pertama masih "loading" (user null),
  // jadi tampilan awal sama dengan HTML server.
  const { user } = useAuth();

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  return (
    <header className="border-b border-garis bg-putih/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-4 py-4 md:px-6">
        <div className="hidden md:block md:w-24" />

        <nav className="hidden items-center justify-center gap-8 md:flex md:flex-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={
                isActive(item.href)
                  ? "relative text-sm font-semibold text-plum after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-full after:bg-jingga"
                  : "text-sm font-medium text-teks-sekunder transition-colors hover:text-plum"
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <Link
            href="/keranjang"
            aria-label="Keranjang"
            className="relative flex h-11 w-11 items-center justify-center border border-garis bg-putih text-plum transition-colors hover:bg-gading"
          >
            <ShoppingCart size={18} />
            {totalItems > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-magenta px-1 text-[9px] font-semibold text-putih">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            ) : null}
          </Link>

          {user ? (
            <AccountMenu user={user} />
          ) : (
            <Link
              href="/login"
              className="hidden items-center gap-2 border border-plum px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-plum transition-colors hover:bg-gading md:inline-flex"
            >
              <User size={16} />
              Login
            </Link>
          )}

          <button
            type="button"
            aria-label="Buka menu"
            aria-expanded={mobileOpen}
            className="inline-flex h-11 w-11 items-center justify-center border border-plum text-plum md:hidden"
            onClick={() => setMobileOpen((previous) => !previous)}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-garis bg-putih md:hidden">
          <nav className="mx-auto flex max-w-[1200px] flex-col gap-2 px-4 py-4">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={
                  isActive(item.href)
                    ? "px-2 py-2 text-sm font-semibold text-plum"
                    : "px-2 py-2 text-sm font-medium text-teks-sekunder"
                }
              >
                {item.label}
              </Link>
            ))}
            {user ? null : (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="mt-2 inline-flex items-center gap-2 border border-plum px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-plum"
              >
                <User size={16} />
                Login
              </Link>
            )}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
