const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const tanggalFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function formatRupiah(value: number): string {
  return rupiahFormatter.format(value);
}

/** Tanggal ISO dari API -> "16 November 2026". */
export function formatTanggal(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "-";
  return tanggalFormatter.format(date);
}

/** Dua tanggal ISO -> "13 November 2026 - 22 Januari 2027". */
export function formatRentangTanggal(mulai: string | Date, selesai: string | Date): string {
  const awal = formatTanggal(mulai);
  const akhir = formatTanggal(selesai);
  return awal === akhir ? awal : `${awal} - ${akhir}`;
}

/** "0812-3456-7890", "+62 812 3456 7890" -> "6281234567890". */
export function formatNomorWhatsApp(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("62")) return digits;
  return `62${digits.replace(/^0+/, "")}`;
}
