"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, User } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import type { AuthUser } from "@/types/auth";

type AccountMenuProps = {
  user: AuthUser;
};

/**
 * Dropdown akun di Navbar (mengikuti menu akun design/user-html/profil.html).
 * "use client" karena butuh state buka/tutup dan event document (klik luar + Esc).
 */
export function AccountMenu({ user }: AccountMenuProps) {
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const displayName = user.name.trim().split(/\s+/)[0] || "Akun";

  async function handleLogout() {
    setOpen(false);
    setPending(true);
    try {
      await logout();
    } finally {
      setPending(false);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((previous) => !previous)}
        className="inline-flex h-11 items-center gap-2 border border-plum bg-plum px-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-putih transition-colors hover:bg-magenta"
      >
        <User size={16} />
        <span className="max-w-[7rem] truncate">{displayName}</span>
        <ChevronDown
          size={14}
          aria-hidden="true"
          className={open ? "rotate-180 transition-transform" : "transition-transform"}
        />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+8px)] z-50 flex min-w-[180px] flex-col border border-garis bg-putih shadow-[0_10px_30px_rgba(43,18,69,0.12)]"
        >
          <Link
            role="menuitem"
            href="/profil"
            onClick={() => setOpen(false)}
            className="border-b border-garis px-4 py-3 text-sm font-semibold text-plum transition-colors hover:bg-gading"
          >
            Profil Saya
          </Link>
          {/* Logout: POST /logout (bila gagal, token lokal tetap dihapus). */}
          <button
            role="menuitem"
            type="button"
            onClick={() => void handleLogout()}
            disabled={pending}
            className="px-4 py-3 text-left text-sm font-semibold text-plum transition-colors hover:bg-gading disabled:cursor-not-allowed disabled:text-teks-sekunder"
          >
            {pending ? "Keluar..." : "Keluar"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
