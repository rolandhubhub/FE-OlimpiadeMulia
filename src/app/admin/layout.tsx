import type { ReactNode } from "react";
import { Baloo_2, Lora, Poppins } from "next/font/google";
import AdminSidebar from "@/components/layout/admin-sidebar";
import "./admin.css";

const lora = Lora({
  variable: "--font-admin-lora",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const baloo = Baloo_2({
  variable: "--font-admin-baloo",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const poppins = Poppins({
  variable: "--font-admin-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`admin ${lora.variable} ${baloo.variable} ${poppins.variable}`}>
      <div className="layout">
        <AdminSidebar />
        <main className="admin-main">{children}</main>
      </div>
    </div>
  );
}
