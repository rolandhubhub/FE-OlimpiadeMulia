import type { AdminCertificateRecord } from "@/types/admin";

// Sebagian sertifikat sudah dibuat supaya status "Sudah dibuat" dan tombol
// "Generate ulang" langsung terlihat. Sisanya masih "Belum dibuat".
export const initialCertificateRecords: AdminCertificateRecord[] = [
  {
    participantId: 1,
    event: "KMSI",
    status: "Sudah dibuat",
    createdAt: "12 November 2026",
  },
  {
    participantId: 2,
    event: "KMSI",
    status: "Sudah dibuat",
    createdAt: "13 November 2026",
  },
  {
    participantId: 35,
    event: "KMSI",
    status: "Sudah dibuat",
    createdAt: "14 November 2026",
  },
  {
    participantId: 45,
    event: "JSO",
    status: "Sudah dibuat",
    createdAt: "13 November 2026",
  },
  {
    participantId: 46,
    event: "JSO",
    status: "Sudah dibuat",
    createdAt: "14 November 2026",
  },
  {
    participantId: 53,
    event: "IMC",
    status: "Sudah dibuat",
    createdAt: "14 November 2026",
  },
];
