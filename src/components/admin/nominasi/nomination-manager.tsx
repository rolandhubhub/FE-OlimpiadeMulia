"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import FormField from "@/components/admin/form-field";
import Modal from "@/components/admin/modal";
import PageHeader from "@/components/admin/page-header";
import ResultDialog from "@/components/admin/result-dialog";
import Thumb from "@/components/admin/thumb";
import { initialAdminNominations } from "@/data/admin/nominasi";
import { validateFields } from "@/lib/admin/validate";
import type {
  AdminNomination,
  AdminNominationEvent,
  AdminResultStatus,
  AdminValidationErrors,
} from "@/types/admin";

type EventFilter = AdminNominationEvent | "";

interface NominationFormValues {
  name: string;
  event: EventFilter;
  documentUrl: string;
}

interface NominationResult {
  status: AdminResultStatus;
  title: string;
  message: string;
}

const emptyForm: NominationFormValues = {
  name: "",
  event: "",
  documentUrl: "",
};

const pageSize = 5;

function validateDocumentUrl(value: string): string | null {
  if (!value.trim()) return null;

  try {
    const url = new URL(value.trim());
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return "Link dokumen harus menggunakan alamat http atau https.";
    }
    return null;
  } catch {
    return "Masukkan URL dokumen yang valid.";
  }
}

export default function NominationManager() {
  const [nominations, setNominations] = useState(initialAdminNominations);
  const [eventFilter, setEventFilter] = useState<EventFilter>("");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [form, setForm] = useState<NominationFormValues>(emptyForm);
  const [errors, setErrors] = useState<AdminValidationErrors>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [pendingDelete, setPendingDelete] = useState<AdminNomination | null>(null);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [pendingImageName, setPendingImageName] = useState("");
  const [result, setResult] = useState<NominationResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const ownedObjectUrls = useRef(new Set<string>());

  useEffect(
    () => () => {
      ownedObjectUrls.current.forEach((url) => URL.revokeObjectURL(url));
      ownedObjectUrls.current.clear();
    },
    [],
  );

  const filteredNominations = nominations.filter(
    (nomination) => !eventFilter || nomination.event === eventFilter,
  );
  const totalPages = Math.max(1, Math.ceil(filteredNominations.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageNominations = filteredNominations.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  function revokeOwnedUrl(url: string | null) {
    if (!url || !ownedObjectUrls.current.has(url)) return;
    URL.revokeObjectURL(url);
    ownedObjectUrls.current.delete(url);
  }

  function closeForm() {
    revokeOwnedUrl(pendingImage);
    setPendingImage(null);
    setPendingImageName("");
    setFormOpen(false);
    setErrors({});
  }

  function openAddForm() {
    setEditingId(null);
    setForm({ ...emptyForm });
    setPendingImage(null);
    setPendingImageName("");
    setErrors({});
    if (fileInputRef.current) fileInputRef.current.value = "";
    setFormOpen(true);
  }

  function openEditForm(nomination: AdminNomination) {
    setEditingId(nomination.id);
    setForm({
      name: nomination.name,
      event: nomination.event,
      documentUrl: nomination.documentUrl,
    });
    setPendingImage(null);
    setPendingImageName("");
    setErrors({});
    if (fileInputRef.current) fileInputRef.current.value = "";
    setFormOpen(true);
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    revokeOwnedUrl(pendingImage);
    const url = URL.createObjectURL(file);
    ownedObjectUrls.current.add(url);
    setPendingImage(url);
    setPendingImageName(file.name);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateFields({
      name: { value: form.name, label: "Nama Nominasi", required: true },
      event: { value: form.event, label: "Event", required: true },
    });
    const urlError = validateDocumentUrl(form.documentUrl);
    if (urlError) nextErrors.documentUrl = urlError;
    const existing = nominations.find((nomination) => nomination.id === editingId);

    if (editingId === null && !pendingImage) {
      nextErrors.image = "Gambar wajib diunggah.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const updatedNomination: AdminNomination = {
      id: editingId ?? Date.now(),
      name: form.name.trim(),
      event: form.event as AdminNominationEvent,
      documentUrl: form.documentUrl.trim(),
      image: pendingImage ?? existing?.image ?? null,
    };

    setNominations((currentNominations) =>
      editingId === null
        ? [...currentNominations, updatedNomination]
        : currentNominations.map((item) =>
            item.id === editingId ? updatedNomination : item,
          ),
    );
    if (pendingImage && existing?.image?.startsWith("blob:")) {
      revokeOwnedUrl(existing.image);
    }
    setPendingImage(null);
    setPendingImageName("");
    setFormOpen(false);
    setPage(1);
    setResult({
      status: "success",
      title:
        editingId === null
          ? "Data Nominasi Berhasil Ditambahkan"
          : "Data Nominasi Berhasil Diperbarui",
      message:
        editingId === null
          ? "Nominasi baru sudah tersimpan."
          : "Perubahan nominasi sudah tersimpan.",
    });
  }

  function askDelete(nomination: AdminNomination) {
    setPendingDelete(nomination);
    setDeleteOpen(true);
  }

  function confirmDelete() {
    if (!pendingDelete) return;

    setNominations((currentNominations) =>
      currentNominations.filter((item) => item.id !== pendingDelete.id),
    );
    if (pendingDelete.image?.startsWith("blob:")) revokeOwnedUrl(pendingDelete.image);
    setDeleteOpen(false);
    setResult({
      status: "success",
      title: "Data Nominasi Berhasil Dihapus",
      message: `Nominasi "${pendingDelete.name}" sudah dihapus.`,
    });
    setPendingDelete(null);
  }

  const editedNomination = nominations.find((item) => item.id === editingId);
  const previewImage = pendingImage ?? editedNomination?.image ?? null;

  return (
    <>
      <PageHeader
        title="Kelola Nominasi"
        eyebrow="Kelola Nominasi"
        description="Tambah, Edit, Hapus Nominasi"
      />

      <section className="nomination-page" aria-label="Daftar nominasi dan sertifikat">
        <div className="nomination-toolbar">
          <label className="nomination-event-filter">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="4" y="4" width="16" height="16" rx="2" />
              <path d="M8 8h8M8 12h5" />
            </svg>
            <span className="sr-only">Filter berdasarkan event</span>
            <select
              aria-label="Filter berdasarkan event"
              value={eventFilter}
              onChange={(event) => {
                setEventFilter(event.target.value as EventFilter);
                setPage(1);
              }}
            >
              <option value="">Cari Nama event</option>
              <option value="KMSI">KMSI</option>
              <option value="JSO">JSO</option>
              <option value="IMC">IMC</option>
            </select>
          </label>
          <div className="nomination-tabs">
            <Link
              className="nomination-button nomination-button--warn"
              href="/admin/nominasi/juara"
            >
              JUARA
            </Link>
            <Link
              className="nomination-button nomination-button--primary"
              href="/admin/nominasi/sertifikat"
            >
              SERTI
            </Link>
          </div>
          <button
            className="nomination-button nomination-button--primary"
            type="button"
            onClick={openAddForm}
          >
            + TAMBAH NOMINASI
          </button>
        </div>

        <div className="nomination-table-scroll">
          <table className="nomination-table">
            <colgroup>
              <col style={{ width: "6%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "30%" }} />
              <col style={{ width: "28%" }} />
              <col style={{ width: "24%" }} />
            </colgroup>
            <thead>
              <tr>
                <th scope="col">No</th>
                <th scope="col">Gambar</th>
                <th scope="col">Nama Nominasi</th>
                <th scope="col">Link Dokumen</th>
                <th scope="col">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pageNominations.length ? (
                pageNominations.map((nomination, index) => (
                  <tr key={nomination.id}>
                    <td>{(currentPage - 1) * pageSize + index + 1}.</td>
                    <td>
                      <Thumb
                        src={nomination.image}
                        alt={`${nomination.name} foto nominasi`}
                        className="nomination-image"
                      />
                    </td>
                    <td>{nomination.name}</td>
                    <td>
                      {nomination.documentUrl ? (
                        <a
                          className="nomination-document-link"
                          href={nomination.documentUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {nomination.documentUrl}
                        </a>
                      ) : (
                        <span className="nomination-document-empty">Belum ada dokumen</span>
                      )}
                    </td>
                    <td>
                      <div className="nomination-actions">
                        <button
                          className="nomination-button nomination-button--edit"
                          type="button"
                          aria-label={`Edit ${nomination.name}`}
                          onClick={() => openEditForm(nomination)}
                        >
                          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="m4 16.5-.8 4.3 4.3-.8L20 7.5 16.5 4z" />
                            <path d="m14.8 5.7 3.5 3.5" />
                          </svg>
                          Edit
                        </button>
                        <button
                          className="nomination-button nomination-button--delete"
                          type="button"
                          aria-label={`Hapus ${nomination.name}`}
                          onClick={() => askDelete(nomination)}
                        >
                          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3" />
                          </svg>
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="nomination-table__empty" colSpan={5}>
                    Tidak ada data.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <footer className="nomination-table__footer">
          <span>
            {filteredNominations.length} data, Halaman {currentPage}/{totalPages}
          </span>
          <div className="nomination-pagination" aria-label="Paginasi nominasi">
            <button
              type="button"
              aria-label="Halaman sebelumnya"
              disabled={currentPage <= 1}
              onClick={() => setPage(currentPage - 1)}
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Halaman berikutnya"
              disabled={currentPage >= totalPages}
              onClick={() => setPage(currentPage + 1)}
            >
              ›
            </button>
          </div>
        </footer>
      </section>

      <Modal
        open={formOpen}
        title={editingId === null ? "Tambah Nominasi" : "Edit Nominasi"}
        onClose={closeForm}
      >
        <form className="nomination-form" onSubmit={handleSubmit} noValidate>
          <div className="nomination-form__grid">
            <div className="nomination-form__full">
              <FormField id="nomination-name" label="Nama Nominasi" required error={errors.name}>
                <input
                  className="form-field__control"
                  id="nomination-name"
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  placeholder="Nama Nominasi"
                  required
                />
              </FormField>
            </div>
            <div className="nomination-form__full">
              <FormField id="nomination-event" label="Event" required error={errors.event}>
                <select
                  className="form-field__control"
                  id="nomination-event"
                  value={form.event}
                  onChange={(event) =>
                    setForm({ ...form, event: event.target.value as EventFilter })
                  }
                  required
                >
                  <option value="">Pilih Event</option>
                  <option value="KMSI">KMSI</option>
                  <option value="JSO">JSO</option>
                  <option value="IMC">IMC</option>
                </select>
              </FormField>
            </div>
            <div className="nomination-form__full">
              <FormField
                id="nomination-document"
                label="Link Dokumen"
                error={errors.documentUrl}
                hint="Masukkan URL lengkap, misalnya https://drive.google.com/..."
              >
                <input
                  className="form-field__control"
                  id="nomination-document"
                  type="url"
                  value={form.documentUrl}
                  onChange={(event) => setForm({ ...form, documentUrl: event.target.value })}
                  placeholder="https://drive.google.com/..."
                />
              </FormField>
            </div>
            <div className="nomination-form__full">
              <FormField
                id="nomination-image"
                label="Gambar"
                required={editingId === null}
                error={errors.image}
                hint={editingId !== null ? "Pilih file baru untuk mengganti gambar." : undefined}
              >
                <input
                  ref={fileInputRef}
                  className="form-field__control nomination-form__file"
                  id="nomination-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required={editingId === null}
                />
              </FormField>
              <div className="nomination-form__preview">
                <Thumb
                  src={previewImage}
                  alt={previewImage ? "Pratinjau gambar nominasi" : "Placeholder gambar nominasi"}
                  className="nomination-image nomination-image--preview"
                />
                <span>
                  {pendingImage
                    ? pendingImageName
                    : previewImage
                      ? "Gambar saat ini"
                      : "Belum ada gambar"}
                </span>
              </div>
            </div>
          </div>
          <div className="nomination-form__actions">
            <button
              className="nomination-button nomination-button--outline"
              type="button"
              onClick={closeForm}
            >
              BATAL
            </button>
            <button className="nomination-button nomination-button--primary" type="submit">
              SIMPAN
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        open={deleteOpen}
        title="Hapus Nominasi?"
        onClose={() => {
          setDeleteOpen(false);
          setPendingDelete(null);
        }}
      >
        <p className="nomination-delete__message">
          {pendingDelete ? `"${pendingDelete.name}" akan dihapus permanen.` : ""}
        </p>
        <div className="nomination-form__actions">
          <button
            className="nomination-button nomination-button--outline"
            type="button"
            onClick={() => {
              setDeleteOpen(false);
              setPendingDelete(null);
            }}
          >
            BATAL
          </button>
          <button
            className="nomination-button nomination-button--delete"
            type="button"
            onClick={confirmDelete}
          >
            HAPUS
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
