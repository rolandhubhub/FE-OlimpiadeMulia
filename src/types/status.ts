export type EventStatus = "draft" | "buka" | "tutup" | "selesai";

export type RegistrationStatus = "menunggu_bayar" | "lunas" | "batal" | "kadaluarsa";

export type OrderStatus =
  | "menunggu_bayar"
  | "dibayar"
  | "dikirim"
  | "selesai"
  | "batal"
  | "kadaluarsa";

export type StatusKind = "event" | "pendaftaran" | "pesanan";

export type StatusTone = "neutral" | "info" | "success" | "warning" | "danger";

export type StatusMeta = {
  label: string;
  tone: StatusTone;
};
