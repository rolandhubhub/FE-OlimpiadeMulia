"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import type { AdminNavItem } from "@/types/admin";

const navItems: (AdminNavItem & { icon: ReactNode })[] = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    icon: (
      <>
        <rect x="3" y="3" width="7" height="9" rx="1" />
        <rect x="14" y="3" width="7" height="5" rx="1" />
        <rect x="14" y="12" width="7" height="9" rx="1" />
        <rect x="3" y="16" width="7" height="5" rx="1" />
      </>
    ),
  },
  {
    href: "/admin/event",
    label: "Event",
    icon: (
      <>
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <path d="M8 2v4M16 2v4M3 10h18" />
      </>
    ),
  },
  {
    href: "/admin/peserta",
    label: "Peserta",
    icon: (
      <>
        <circle cx="12" cy="8" r="3.2" />
        <path d="M5 20c0-3.3 3.1-6 7-6s7 2.7 7 6" />
      </>
    ),
  },
  {
    href: "/admin/nominasi",
    label: "Juara & Sertifikat",
    icon: <path d="m12 2 2.6 6.6L21 9l-5 4.5L17.4 21 12 17.3 6.6 21 8 13.5 3 9l6.4-.4z" />,
  },
  {
    href: "/admin/buku",
    label: "Buku",
    icon: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="1" />
        <path d="M8 8h8M8 12h8M8 16h5" />
      </>
    ),
  },
  {
    href: "/admin/pesanan",
    label: "Pesanan",
    icon: (
      <>
        <path d="M6 7h12l-1 13H7z" />
        <path d="M9 7V5a3 3 0 0 1 6 0v2" />
      </>
    ),
  },
  {
    href: "/admin/transaksi",
    label: "Transaksi",
    icon: (
      <>
        <rect x="3" y="7" width="18" height="12" rx="2" />
        <path d="M7 7V5h10v2M8 12h8" />
      </>
    ),
  },
  {
    href: "/admin/pengguna",
    label: "Pengguna",
    icon: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
      </>
    ),
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="brand">
        <p className="brand__name">INTAN MUTIA</p>
        <p>PANEL ADMIN</p>
      </div>
      <nav aria-label="Navigasi admin">
        {navItems.map(({ href, label, icon }) => {
          const isActive =
            pathname === href ||
            (href !== "/admin/dashboard" && pathname.startsWith(`${href}/`));

          return (
            <Link
              key={href}
              className={`nav-item${isActive ? " active" : ""}`}
              href={href}
              aria-current={isActive ? "page" : undefined}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                {icon}
              </svg>
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
