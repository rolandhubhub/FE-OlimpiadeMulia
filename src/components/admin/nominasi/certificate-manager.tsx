"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import FormField from "@/components/admin/form-field";
import Modal from "@/components/admin/modal";
import PageHeader from "@/components/admin/page-header";
import ResultDialog from "@/components/admin/result-dialog";
import { initialAdminJuaraParticipants } from "@/data/admin/juara";
import { initialCertificateRecords } from "@/data/admin/sertifikat";
import { BATAS_PERINGKAT_SERTIFIKAT } from "@/lib/admin/constants";
import { computeRanks } from "@/lib/admin/ranking";
import type {
  AdminCertificateRecord,
  AdminCertificateTemplate,
  AdminJuaraParticipant,
  AdminNominationEvent,
  AdminResultStatus,
} from "@/types/admin";

interface CertificateResult {
  status: AdminResultStatus;
  title: string;
  message: string;
}

interface PendingTemplate {
  file: File;
  previewUrl: string;
}

const events: AdminNominationEvent[] = ["KMSI", "JSO", "IMC"];
const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default function CertificateManager() {
  const [selectedEvent, setSelectedEvent] = useState<AdminNominationEvent | "">("");
  const [templates, setTemplates] = useState<
    Partial<Record<AdminNominationEvent, AdminCertificateTemplate>>
  >({});
  const [records, setRecords] = useState<Record<number, AdminCertificateRecord>>(() =>
    initialCertificateRecords.reduce<Record<number, AdminCertificateRecord>>(
      (map, record) => {
        map[record.participantId] = record;
        return map;
      },
      {},
    ),
  );
  const [uploadOpen, setUploadOpen] = useState(false);
  const [pendingTemplate, setPendingTemplate] = useState<PendingTemplate | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [deleteTemplateOpen, setDeleteTemplateOpen] = useState(false);
  const [regenerateTarget, setRegenerateTarget] = useState<AdminJuaraParticipant | null>(null);
  const [result, setResult] = useState<CertificateResult | null>(null);
  const ownedUrls = useRef(new Set<string>());

  useEffect(
    () => () => {
      ownedUrls.current.forEach((url) => URL.revokeObjectURL(url));
      ownedUrls.current.clear();
    },
    [],
  );

  const activeTemplate = selectedEvent ? templates[selectedEvent] : undefined;

  const recipients = useMemo(() => {
    if (!selectedEvent) return [];

    const eligible = initialAdminJuaraParticipants.filter(
      (participant) =>
        participant.event === selectedEvent && participant.status === "Confirmed",
    );
    const ranks = computeRanks(
      eligible.map((participant) => ({ id: participant.id, score: participant.score })),
    );

    return eligible
      .flatMap((participant) => {
        const rank = ranks.get(participant.id);
        if (rank === undefined || rank > BATAS_PERINGKAT_SERTIFIKAT) return [];
        return [{ participant, rank }];
      })
      .sort(
        (left, right) => left.rank - right.rank || left.participant.id - right.participant.id,
      );
  }, [selectedEvent]);

  const pendingRecipients = recipients.filter(
    (item) => records[item.participant.id]?.status !== "Sudah dibuat",
  );
  const createdCount = recipients.length - pendingRecipients.length;

  function revokeOwnedUrl(url: string | null | undefined) {
    if (!url || !ownedUrls.current.has(url)) return;
    URL.revokeObjectURL(url);
    ownedUrls.current.delete(url);
  }

  function handleEventChange(event: ChangeEvent<HTMLSelectElement>) {
    revokeOwnedUrl(pendingTemplate?.previewUrl);
    setPendingTemplate(null);
    setUploadError("");
    setUploadOpen(false);
    setDeleteTemplateOpen(false);
    setRegenerateTarget(null);
    setResult(null);
    setSelectedEvent(event.target.value as AdminNominationEvent | "");
  }

  function openUpload() {
    setUploadError("");
    setPendingTemplate(null);
    setUploadOpen(true);
  }

  function closeUpload() {
    revokeOwnedUrl(pendingTemplate?.previewUrl);
    setPendingTemplate(null);
    setUploadError("");
    setUploadOpen(false);
  }

  function handleTemplateFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    const isAllowedImage =
      file.type === "image/png" ||
      file.type === "image/jpeg" ||
      fileName.endsWith(".png") ||
      fileName.endsWith(".jpg") ||
      fileName.endsWith(".jpeg");

    if (!isAllowedImage) {
      event.target.value = "";
      revokeOwnedUrl(pendingTemplate?.previewUrl);
      setPendingTemplate(null);
      setUploadError("File harus berupa gambar PNG atau JPG.");
      return;
    }

    revokeOwnedUrl(pendingTemplate?.previewUrl);
    const previewUrl = URL.createObjectURL(file);
    ownedUrls.current.add(previewUrl);
    setPendingTemplate({ file, previewUrl });
    setUploadError("");
  }

  function handleTemplateSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!pendingTemplate || !selectedEvent) return;

    revokeOwnedUrl(templates[selectedEvent]?.previewUrl);
    setTemplates((current) => ({
      ...current,
      [selectedEvent]: {
        fileName: pendingTemplate.file.name,
        previewUrl: pendingTemplate.previewUrl,
      },
    }));
    setPendingTemplate(null);
    setUploadOpen(false);
    setUploadError("");
    setResult({
      status: "success",
      title: "Template Berhasil Disimpan",
      message: `Template sertifikat ${selectedEvent} sudah disimpan.`,
    });
  }

  function confirmDeleteTemplate() {
    if (!selectedEvent) return;

    revokeOwnedUrl(templates[selectedEvent]?.previewUrl);
    setTemplates((current) => {
      const next = { ...current };
      delete next[selectedEvent];
      return next;
    });
    setDeleteTemplateOpen(false);
    setResult({
      status: "success",
      title: "Template Berhasil Dihapus",
      message: `Template sertifikat ${selectedEvent} sudah dihapus.`,
    });
  }

  function markCreated(
    participantIds: number[],
    eventName: AdminNominationEvent,
    createdAt: string,
  ) {
    setRecords((current) => {
      const next = { ...current };
      participantIds.forEach((participantId) => {
        next[participantId] = {
          participantId,
          event: eventName,
          status: "Sudah dibuat",
          createdAt,
        };
      });
      return next;
    });
  }

  function generateOne(participant: AdminJuaraParticipant) {
    if (!selectedEvent || !activeTemplate) {
      setResult({
        status: "error",
        title: "Sertifikat Gagal Dibuat",
        message: "Unggah template sertifikat terlebih dahulu.",
      });
      return;
    }

    // TODO(api): minta backend membuat file sertifikat. Sekarang hanya simulasi state.
    markCreated([participant.id], selectedEvent, dateFormatter.format(new Date()));
    setResult({
      status: "success",
      title: "Sertifikat Berhasil Dibuat",
      message: `Sertifikat untuk ${participant.name} sudah dibuat.`,
    });
  }

  function handleGenerateAll() {
    if (!selectedEvent || !activeTemplate) {
      setResult({
        status: "error",
        title: "Sertifikat Gagal Dibuat",
        message: "Unggah template sertifikat terlebih dahulu.",
      });
      return;
    }

    if (pendingRecipients.length === 0) {
      setResult({
        status: "error",
        title: "Sertifikat Gagal Dibuat",
        message: "Semua penerima sudah memiliki sertifikat.",
      });
      return;
    }

    // TODO(api): kirim permintaan generate massal ke backend.
    markCreated(
      pendingRecipients.map((item) => item.participant.id),
      selectedEvent,
      dateFormatter.format(new Date()),
    );
    setResult({
      status: "success",
      title: "Sertifikat Berhasil Dibuat",
      message: `${pendingRecipients.length} sertifikat berhasil dibuat.`,
    });
  }

  function confirmRegenerate() {
    if (!regenerateTarget) return;

    if (!selectedEvent || !activeTemplate) {
      setRegenerateTarget(null);
      setResult({
        status: "error",
        title: "Sertifikat Gagal Dibuat Ulang",
        message: "Unggah template sertifikat terlebih dahulu.",
      });
      return;
    }

    // TODO(api): minta backend membuat ulang file sertifikat peserta ini.
    markCreated(
      [regenerateTarget.id],
      selectedEvent,
      dateFormatter.format(new Date()),
    );
    setResult({
      status: "success",
      title: "Sertifikat Berhasil Dibuat Ulang",
      message: `Sertifikat untuk ${regenerateTarget.name} sudah diperbarui.`,
    });
    setRegenerateTarget(null);
  }

  return (
    <>
      <Link className="sertifikat-back" href="/admin/nominasi">
        ‹ Kembali ke Nominasi
      </Link>
      <PageHeader
        title="Kelola Sertifikat"
        eyebrow="Kelola Nominasi"
        description={
          selectedEvent
            ? `Sertifikat juara ${selectedEvent}`
            : "Pilih event untuk mengelola template dan sertifikat juara."
        }
      />

      <div className="nomination-toolbar">
        <div className="nomination-event-filter">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <path d="M8 8h8M8 12h5" />
          </svg>
          <select aria-label="Pilih event" value={selectedEvent} onChange={handleEventChange}>
            <option value="">Pilih event</option>
            {events.map((event) => (
              <option key={event} value={event}>
                {event}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!selectedEvent ? (
        <p className="sertifikat-empty">
          Pilih event terlebih dahulu untuk mengelola template dan sertifikat.
        </p>
      ) : (
        <>
          <section className="sertifikat-card" aria-label="Template sertifikat">
            <p className="sertifikat-card__label">Sertifikat Juara</p>
            <p className="sertifikat-card__hint">
              Template gambar PNG atau JPG. Nama peserta disisipkan otomatis saat sertifikat
              dibuat.
            </p>
            <div className="sertifikat-template">
              <span className="sertifikat-card__label">Template</span>
              <span className="sertifikat-template__name">
                {activeTemplate?.fileName ?? "Belum ada template"}
              </span>
              {activeTemplate ? (
                <div className="sertifikat-template__preview">
                  {/* eslint-disable-next-line @next/next/no-img-element -- pratinjau memakai blob URL dari file lokal */}
                  <img
                    className="sertifikat-template__image"
                    src={activeTemplate.previewUrl}
                    alt={`Pratinjau template sertifikat ${selectedEvent}`}
                  />
                </div>
              ) : null}
            </div>
            <div className="sertifikat-card__actions">
              <button
                className="nomination-button nomination-button--outline"
                type="button"
                onClick={openUpload}
              >
                {activeTemplate ? "GANTI TEMPLATE" : "UNGGAH TEMPLATE"}
              </button>
              {activeTemplate ? (
                <button
                  className="nomination-button nomination-button--delete"
                  type="button"
                  onClick={() => setDeleteTemplateOpen(true)}
                >
                  HAPUS TEMPLATE
                </button>
              ) : null}
            </div>
          </section>

          {!activeTemplate ? (
            <p className="sertifikat-warning" role="status">
              Template sertifikat belum tersedia. Unggah template terlebih dahulu agar tombol
              Generate aktif.
            </p>
          ) : null}

          <section aria-label="Daftar penerima sertifikat">
            <div className="sertifikat-toolbar">
              <div>
                <h2 className="sertifikat-section-title">Penerima Sertifikat</h2>
                <p className="sertifikat-section-sub">
                  {recipients.length} peserta peringkat 1–{BATAS_PERINGKAT_SERTIFIKAT} ·{" "}
                  {createdCount} sudah dibuat
                </p>
              </div>
              <button
                className="nomination-button nomination-button--primary"
                type="button"
                onClick={handleGenerateAll}
                disabled={!activeTemplate || pendingRecipients.length === 0}
              >
                GENERATE SEMUA
              </button>
            </div>

            <div className="nomination-table-scroll">
              <table className="nomination-table" aria-label="Daftar penerima sertifikat">
                <colgroup>
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "38%" }} />
                  <col style={{ width: "12%" }} />
                  <col style={{ width: "22%" }} />
                  <col style={{ width: "18%" }} />
                </colgroup>
                <thead>
                  <tr>
                    <th scope="col">Peringkat</th>
                    <th scope="col">Peserta</th>
                    <th scope="col">Nilai</th>
                    <th scope="col">Status sertifikat</th>
                    <th scope="col">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {recipients.length ? (
                    recipients.map(({ participant, rank }) => {
                      const record = records[participant.id];
                      const isCreated = record?.status === "Sudah dibuat";

                      return (
                        <tr key={participant.id}>
                          <td>{rank}</td>
                          <td>
                            <span className="sertifikat-peserta__name">{participant.name}</span>
                            <span className="sertifikat-peserta__meta">
                              {participant.school} · {participant.level} · {participant.subject}
                            </span>
                          </td>
                          <td>{participant.score ?? "—"}</td>
                          <td>
                            <span className={`badge badge--${isCreated ? "ok" : "mute"}`}>
                              {isCreated ? "Sudah dibuat" : "Belum dibuat"}
                            </span>
                            {record?.createdAt ? (
                              <span className="sertifikat-created">
                                Dibuat {record.createdAt}
                              </span>
                            ) : null}
                          </td>
                          <td>
                            <div className="sertifikat-actions">
                              <button
                                className={`nomination-button ${
                                  isCreated
                                    ? "nomination-button--outline"
                                    : "nomination-button--primary"
                                }`}
                                type="button"
                                disabled={!activeTemplate}
                                onClick={() =>
                                  isCreated
                                    ? setRegenerateTarget(participant)
                                    : generateOne(participant)
                                }
                              >
                                {isCreated ? "Generate ulang" : "Generate"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td className="nomination-table__empty" colSpan={5}>
                        Belum ada peserta berperingkat untuk event ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      <Modal
        open={uploadOpen}
        title={activeTemplate ? "Ganti Template Sertifikat" : "Unggah Template Sertifikat"}
        onClose={closeUpload}
      >
        <form className="sertifikat-form" onSubmit={handleTemplateSave} noValidate>
          <FormField
            id="sertifikat-template-file"
            label="Template"
            required
            error={uploadError}
            hint="Format PNG atau JPG."
          >
            <input
              className="form-field__control sertifikat-file"
              id="sertifikat-template-file"
              type="file"
              accept="image/png,image/jpeg"
              onChange={handleTemplateFileChange}
              required
            />
          </FormField>

          {pendingTemplate ? (
            <div className="sertifikat-preview">
              {/* eslint-disable-next-line @next/next/no-img-element -- pratinjau memakai blob URL dari file lokal */}
              <img
                src={pendingTemplate.previewUrl}
                alt="Pratinjau template sertifikat"
              />
              <span>{pendingTemplate.file.name}</span>
            </div>
          ) : null}

          <div className="nomination-form__actions">
            <button
              className="nomination-button nomination-button--outline"
              type="button"
              onClick={closeUpload}
            >
              BATAL
            </button>
            <button
              className="nomination-button nomination-button--primary"
              type="submit"
              disabled={!pendingTemplate}
            >
              SIMPAN
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        open={deleteTemplateOpen}
        title="Hapus Template Sertifikat?"
        onClose={() => setDeleteTemplateOpen(false)}
      >
        <p className="sertifikat-delete__message">
          Template untuk {selectedEvent} akan dihapus. Sertifikat yang sudah dibuat tetap
          tersimpan.
        </p>
        <div className="nomination-form__actions">
          <button
            className="nomination-button nomination-button--outline"
            type="button"
            onClick={() => setDeleteTemplateOpen(false)}
          >
            BATAL
          </button>
          <button
            className="nomination-button nomination-button--delete"
            type="button"
            onClick={confirmDeleteTemplate}
          >
            HAPUS
          </button>
        </div>
      </Modal>

      <Modal
        open={regenerateTarget !== null}
        title="Generate Ulang Sertifikat?"
        onClose={() => setRegenerateTarget(null)}
      >
        <p className="sertifikat-delete__message">
          {regenerateTarget
            ? `Sertifikat untuk "${regenerateTarget.name}" sudah pernah dibuat. Generate ulang akan memperbarui tanggal pembuatannya.`
            : ""}
        </p>
        <div className="nomination-form__actions">
          <button
            className="nomination-button nomination-button--outline"
            type="button"
            onClick={() => setRegenerateTarget(null)}
          >
            BATAL
          </button>
          <button
            className="nomination-button nomination-button--primary"
            type="button"
            onClick={confirmRegenerate}
          >
            GENERATE ULANG
          </button>
        </div>
      </Modal>

      {result ? (
        <ResultDialog
          open
          status={result.status}
          title={result.title}
          message={result.message}
          onClose={() => setResult(null)}
        />
      ) : null}
    </>
  );
}
