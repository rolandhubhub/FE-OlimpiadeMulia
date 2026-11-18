import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone, Smartphone } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-garis bg-putih">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-12 md:grid-cols-[1.2fr_1fr_1fr] md:px-6">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <Image src="/logo/logo-intan-mulia.png" alt="Logo Yayasan Intan Mutia" width={52} height={52} />
            <span className="text-sm font-semibold uppercase tracking-[0.12em] text-plum">
              Yayasan Intan Mutia
            </span>
          </div>
          <p className="max-w-md text-sm leading-7 text-teks-sekunder">
            Yayasan Intan Mutia menjadi wadah pengembangan siswa berprestasi melalui olimpiade,
            kompetisi, dan buku latihan yang membangun karakter serta kemampuan akademik.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-plum">
            Customer Service
          </h3>
          <ul className="space-y-3 text-sm text-teks-sekunder">
            <li className="flex items-center gap-2"><Phone size={16} className="text-magenta" /> 0821-7722-9922</li>
            <li className="flex items-center gap-2"><Smartphone size={16} className="text-magenta" /> 0812-3456-7890</li>
            <li className="flex items-center gap-2"><Mail size={16} className="text-magenta" /> info@intanmutia.org</li>
            <li className="flex items-center gap-2"><MapPin size={16} className="text-magenta" /> Bandung, Indonesia</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-plum">
            Social Media
          </h3>
          <div className="flex flex-wrap gap-3 text-sm text-teks-sekunder">
            {[
              { label: "Instagram", href: "/" },
              { label: "YouTube", href: "/" },
              { label: "TikTok", href: "/" },
              { label: "Email", href: "/" },
            ].map((item) => (
              <Link key={item.label} href={item.href} className="transition-colors hover:text-plum">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-plum py-3 text-center text-xs text-putih">© 2025 Yayasan Intan Mutia</div>
    </footer>
  );
}
