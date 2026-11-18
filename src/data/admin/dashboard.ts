import type { DashboardChart } from "@/types/admin";

// Angka kartu statistik sekarang dari GET /admin/dashboard (lihat
// components/admin/dashboard/dashboard-content.tsx).
// TODO(API): grafik belum punya endpoint, jadi masih data dummy.
export const dashboardCharts: DashboardChart[] = [
  {
    title: "Grafik Jumlah Peserta per event",
    items: [
      { label: "KMSI", value: 211, color: "#9c1457" },
      { label: "JSO", value: 134, color: "#4a2c82" },
      { label: "IMC", value: 51, color: "#f98a02" },
    ],
  },
  {
    title: "Grafik Pembelian Buku",
    items: [
      { label: "Buku Paten Olimpiade IPS", value: 142, color: "#9c1457" },
      { label: "Buku Paten Olimpiade IPA", value: 118, color: "#4a2c82" },
      { label: "Buku Paten Olimpiade Matematika", value: 96, color: "#f98a02" },
      { label: "Paten Olimpiade Bahasa Inggris", value: 171, color: "#1f7a4d" },
    ],
  },
];
