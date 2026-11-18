"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowLeft } from "lucide-react";
import { PaymentMethodPicker } from "@/components/payment/payment-method";
import { PaymentSuccess } from "@/components/payment/payment-success";
import { QrisPanel } from "@/components/payment/qris-panel";
import { ReceiptCard } from "@/components/payment/receipt-card";
import { VaPanel } from "@/components/payment/va-panel";
import { Button, buttonClassName } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Stepper } from "@/components/ui/stepper";
import { buildRegistration } from "@/lib/data/registration";
import { formatNomorWhatsApp, formatRupiah } from "@/lib/format";
import type { EventSummary } from "@/types/events";
import type {
  Jenjang,
  PaymentMethod,
  Registration,
  RegistrationFormValues,
} from "@/types/registrations";

type Step = "form" | "confirm" | "method" | "qris" | "va" | "receipt";

type FieldErrors = Partial<Record<keyof RegistrationFormValues, string>>;

const STEP_LABELS = ["Isi Formulir", "Konfirmasi Data", "Pembayaran"];

const jenjangOptions: Jenjang[] = ["TK", "SD", "SMP"];

// TODO(API): `mata_pelajaran` belum ada di kontrak API event.
// Pilihan di bawah masih dummy, sama seperti desain.
const pelajaranOptions = ["Sains", "Matematika", "Bahasa Inggris"];

const initialValues: RegistrationFormValues = {
  nama: "",
  jenjang: "SMP",
  sekolah: "",
  pelajaran: "Sains",
  namaOrtu: "",
  whatsapp: "",
};

function ConfirmRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-2 border-b border-garis py-2.5 last:border-b-0">
      <span className="text-xs text-teks-sekunder">{label}</span>
      <strong className="text-right text-xs font-semibold text-plum">{value}</strong>
    </div>
  );
}

type RegistrationFlowProps = {
  event: EventSummary;
};

/**
 * Alur pendaftaran event bertahap (form -> konfirmasi -> pembayaran -> bukti).
 * "use client" karena menyimpan langkah & isian formulir di state dan butuh
 * window.scrollTo; sesuai AGENTS.md form adalah salah satu alasan memakai client.
 */
export function RegistrationFlow({ event }: RegistrationFlowProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("form");
  const [values, setValues] = useState<RegistrationFormValues>(initialValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [method, setMethod] = useState<PaymentMethod>("qris");
  const [registration, setRegistration] = useState<Registration | null>(null);

  const currentStep = step === "form" ? 1 : step === "confirm" ? 2 : 3;

  function updateField<Field extends keyof RegistrationFormValues>(
    field: Field,
    value: RegistrationFormValues[Field],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function goToStep(next: Step) {
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /** Sama seperti goBack() di design/user-html/event.html. */
  function handleBack() {
    if (step === "form") {
      router.push(`/event/${event.slug}`);
      return;
    }
    if (step === "confirm") {
      goToStep("form");
      return;
    }
    if (step === "method" || step === "qris" || step === "va") {
      goToStep("confirm");
    }
  }

  function handleSubmit(payload: FormEvent<HTMLFormElement>) {
    payload.preventDefault();

    const nextErrors: FieldErrors = {};

    if (!values.nama.trim()) nextErrors.nama = "Nama peserta wajib diisi.";
    if (!values.sekolah.trim()) nextErrors.sekolah = "Asal sekolah wajib diisi.";
    if (!values.namaOrtu.trim()) nextErrors.namaOrtu = "Nama orang tua/wali wajib diisi.";

    const whatsapp = formatNomorWhatsApp(values.whatsapp);
    if (!whatsapp) {
      nextErrors.whatsapp = "Nomor WhatsApp wajib diisi.";
    } else if (!/^628\d{7,12}$/.test(whatsapp)) {
      nextErrors.whatsapp = "Nomor WhatsApp harus format 628xxxxxxxxx (7-12 digit setelah 628).";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    // Simpan nomor dalam format 628 supaya seragam di konfirmasi & bukti.
    setValues((current) => ({ ...current, whatsapp }));
    // TODO(API): kirim formulir ke backend saat integrasi Tahap 3.
    goToStep("confirm");
  }

  function handlePaymentSuccess() {
    // DEV ONLY: simulasi pembayaran tanpa transaksi sungguhan.
    // TODO(API): ganti dengan window.snap.pay(snap_token, callbacks) lalu
    // ambil ulang status pendaftaran dari API (webhook Midtrans asinkron).
    setRegistration(buildRegistration(event, values, method));
    goToStep("receipt");
  }

  return (
    <div className="space-y-8">
      {step !== "receipt" ? (
        <div className="flex items-center gap-3">
          <IconButton icon={<ArrowLeft size={16} />} label="Kembali" onClick={handleBack} />
          <Stepper steps={STEP_LABELS} current={currentStep} className="flex-1" />
          <p aria-live="polite" className="sr-only">
            Langkah {currentStep} dari {STEP_LABELS.length}: {STEP_LABELS[currentStep - 1]}
          </p>
        </div>
      ) : null}

      {step === "form" ? (
        <section className="space-y-6">
          <header>
            <h1 className="font-display text-3xl leading-tight text-plum md:text-4xl">
              Formulir Pendaftaran
            </h1>
            <p className="mt-1 text-sm text-teks-sekunder">{event.judul}</p>
          </header>

          <div className="border border-garis bg-putih p-6">
            <form onSubmit={handleSubmit} noValidate>
              <div className="grid gap-5 md:grid-cols-2">
                <Input
                  id="reg-nama"
                  label="Nama Lengkap Peserta"
                  required
                  value={values.nama}
                  onChange={(changeEvent) => updateField("nama", changeEvent.target.value)}
                  placeholder="Masukkan nama lengkap peserta"
                  error={errors.nama}
                  autoComplete="name"
                />

                <Select
                  id="reg-jenjang"
                  label="Jenjang"
                  required
                  value={values.jenjang}
                  onChange={(changeEvent) =>
                    updateField("jenjang", changeEvent.target.value as Jenjang)
                  }
                  error={errors.jenjang}
                >
                  {jenjangOptions.map((jenjang) => (
                    <option key={jenjang} value={jenjang}>
                      {jenjang}
                    </option>
                  ))}
                </Select>

                <Input
                  id="reg-sekolah"
                  label="Asal Sekolah"
                  required
                  value={values.sekolah}
                  onChange={(changeEvent) => updateField("sekolah", changeEvent.target.value)}
                  placeholder="Nama Sekolah"
                  error={errors.sekolah}
                  autoComplete="organization"
                />

                {/* TODO(API): pilihan pelajaran masih dummy. */}
                <Select
                  id="reg-pelajaran"
                  label="Pelajaran"
                  required
                  value={values.pelajaran}
                  onChange={(changeEvent) => updateField("pelajaran", changeEvent.target.value)}
                  error={errors.pelajaran}
                >
                  {pelajaranOptions.map((pelajaran) => (
                    <option key={pelajaran} value={pelajaran}>
                      {pelajaran}
                    </option>
                  ))}
                </Select>

                <Input
                  id="reg-ortu"
                  label="Nama Orang Tua / Wali"
                  required
                  value={values.namaOrtu}
                  onChange={(changeEvent) => updateField("namaOrtu", changeEvent.target.value)}
                  placeholder="Masukkan Nama Orang Tua / Wali"
                  error={errors.namaOrtu}
                  autoComplete="name"
                />

                <Input
                  id="reg-wa"
                  label="WhatsApp Orang Tua/Wali"
                  required
                  type="tel"
                  inputMode="tel"
                  value={values.whatsapp}
                  onChange={(changeEvent) => updateField("whatsapp", changeEvent.target.value)}
                  placeholder="08xx xxxx xxxx"
                  hint="Format akhir 628xxxxxxxxx, contoh 628233457758."
                  error={errors.whatsapp}
                  autoComplete="tel"
                />
              </div>

              <Button type="submit" variant="cta" className="mt-6 w-full">
                Lanjut Konfirmasi Data
              </Button>
            </form>
          </div>
        </section>
      ) : null}

      {step === "confirm" ? (
        <section className="space-y-6">
          <header>
            <h1 className="font-display text-3xl leading-tight text-plum md:text-4xl">
              Konfirmasi Data
            </h1>
            <p className="mt-1 text-sm text-teks-sekunder">
              Pastikan semua data sudah benar sebelum melanjutkan.
            </p>
          </header>

          <div className="mx-auto w-full max-w-2xl border border-garis bg-putih p-6">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-plum">
              {event.judul}
            </p>

            <div className="mt-4">
              <ConfirmRow label="Nama Lengkap Peserta" value={values.nama} />
              <ConfirmRow label="Asal Sekolah" value={values.sekolah} />
              <ConfirmRow label="Nama Orang Tua / Wali" value={values.namaOrtu} />
              <ConfirmRow label="Jenjang" value={values.jenjang} />
              <ConfirmRow label="Pelajaran" value={values.pelajaran} />
              <ConfirmRow label="WhatsApp Orang Tua/Wali" value={values.whatsapp} />
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-garis pt-4">
              <span className="text-sm text-plum">Biaya Pendaftaran</span>
              <strong className="font-display text-2xl text-magenta">
                {formatRupiah(event.harga)}
              </strong>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-[1fr_2fr]">
              <Button variant="secondary" onClick={() => goToStep("form")}>
                Ubah Data
              </Button>
              <Button variant="cta" onClick={() => goToStep("method")}>
                Lanjutkan ke Pembayaran
              </Button>
            </div>
          </div>
        </section>
      ) : null}

      {step === "method" ? (
        <section className="mx-auto w-full max-w-xl space-y-6">
          <h1 className="font-display text-3xl leading-tight text-plum md:text-4xl">
            Metode Pembayaran
          </h1>

          <div className="border border-garis bg-putih p-6">
            <PaymentMethodPicker value={method} onChange={setMethod} />

            <Button
              variant="cta"
              className="mt-5 w-full"
              onClick={() => goToStep(method === "qris" ? "qris" : "va")}
            >
              Lanjutkan ke Pembayaran
            </Button>
          </div>
        </section>
      ) : null}

      {step === "qris" ? (
        <QrisPanel
          amount={event.harga}
          eventTitle={event.judul}
          onSimulateSuccess={handlePaymentSuccess}
        />
      ) : null}

      {step === "va" ? (
        <VaPanel
          amount={event.harga}
          eventTitle={event.judul}
          onSimulateSuccess={handlePaymentSuccess}
        />
      ) : null}

      {step === "receipt" && registration ? (
        <section className="space-y-6">
          <PaymentSuccess />
          <ReceiptCard registration={registration} />

          <div className="mx-auto flex w-full max-w-2xl flex-wrap gap-3">
            <Link
              href={`/pendaftaran/${registration.kode}`}
              className={buttonClassName("primary")}
            >
              Lihat Pendaftaran Saya
            </Link>
            <Link href={`/event/${event.slug}`} className={buttonClassName("secondary")}>
              Kembali ke Event
            </Link>
          </div>
        </section>
      ) : null}
    </div>
  );
}
