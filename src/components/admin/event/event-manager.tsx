"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import Badge, { type BadgeVariant } from "@/components/admin/badge";
import FormField from "@/components/admin/form-field";
import Modal from "@/components/admin/modal";
import PageHeader from "@/components/admin/page-header";
import ResultDialog from "@/components/admin/result-dialog";
import Thumb from "@/components/admin/thumb";
import { validateFields } from "@/lib/admin/validate";
import {
  createAdminEvent,
  deleteAdminEvent,
  getAdminEvents,
  updateAdminEvent,
} from "@/lib/api/admin-event";
import {
  createAdminSubject,
  deleteAdminSubject,
  getAdminEventSubjects,
  updateAdminSubject,
} from "@/lib/api/admin-subject";
import { getErrorMessage, isApiError } from "@/lib/api/errors";
import { formatRentangTanggal, formatRupiah, formatTanggal } from "@/lib/format";
import { eventStatusMap } from "@/lib/status";
import type {
  AdminEvent,
  AdminEventStatus,
  AdminResultStatus,
  AdminSubject,
  AdminValidationErrors,
} from "@/types/admin";

// "use client" karena halaman ini butuh state (filter, paginasi, form),
// event handler, dan memanggil API berotentikasi dari browser.

/** Nilai form memakai nama field API supaya error 422 bisa langsung dipetakan. */
interface EventFormValues {
  judul: string;
  deskripsi: string;
  lokasi: string;
  pendaftaran_mulai: string;
  pendaftaran_selesai: string;
  tanggal_event: string;
  harga: string;
  status: AdminEventStatus | "";
}

interface ResultMessage {
  status: AdminResultStatus;
  title: string;
  message: string;
}

const emptyForm: EventFormValues = {
  judul: "",
  deskripsi: "",
  lokasi: "",
  pendaftaran_mulai: "",
  pendaftaran_selesai: "",
  tanggal_event: "",
  harga: "",
  status: "",
};

const statusOptions: Array<{ value: AdminEventStatus; label: string }> = [
  { value: "draft", label: eventStatusMap.draft.label },
  { value: "buka", label: eventStatusMap.buka.label },
  { value: "tutup", label: eventStatusMap.tutup.label },
  { value: "selesai", label: eventStatusMap.selesai.label },
];

/** Tanggal ISO dari API ("2026-10-22T00:00:00.000000Z") -> nilai <input type="date">. */
function toDateInputValue(value: string): string {
  return /^\d{4}-\d{2}-\d{2}/.test(value) ? value.slice(0, 10) : "";
}

function statusVariant(status: AdminEventStatus): BadgeVariant {
  if (status === "buka") return "ok";
  if (status === "tutup") return "warn";
  return "mute";
}

/** Pesan error aksi mapel; 422 nama ditampilkan per field bila ada. */
function subjectErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    if (error.isUnauthorized) return "Sesi kamu sudah berakhir. Silakan login kembali.";
    if (error.status === 422) {
      const namaError = error.fieldErrors.nama?.[0];
      if (namaError) return namaError;
    }
  }
  return getErrorMessage(error);
}

export default function EventManager() {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState<AdminEventStatus | "">("");
  const [reloadKey, setReloadKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [unauthorized, setUnauthorized] = useState(false);

  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [form, setForm] = useState<EventFormValues>(emptyForm);
  const [errors, setErrors] = useState<AdminValidationErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [pendingDelete, setPendingDelete] = useState<AdminEvent | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [pendingImageUrl, setPendingImageUrl] = useState<string | null>(null);
  const [result, setResult] = useState<ResultMessage | null>(null);

  // State modal mata pelajaran: daftar dimuat saat modal dibuka.
  const [subjectEvent, setSubjectEvent] = useState<AdminEvent | null>(null);
  const [subjects, setSubjects] = useState<AdminSubject[]>([]);
  const [subjectsLoading, setSubjectsLoading] = useState(false);
  const [subjectsError, setSubjectsError] = useState<string | null>(null);
  const [subjectsUnauthorized, setSubjectsUnauthorized] = useState(false);
  const [subjectsReloadKey, setSubjectsReloadKey] = useState(0);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [editingSubjectId, setEditingSubjectId] = useState<number | null>(null);
  const [editingSubjectName, setEditingSubjectName] = useState("");
  const [confirmDeleteSubjectId, setConfirmDeleteSubjectId] = useState<number | null>(null);
  const [subjectSaving, setSubjectSaving] = useState(false);
  const [subjectActionError, setSubjectActionError] = useState<string | null>(null);

  const ownedObjectUrls = useRef(new Set<string>());
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(
    () => () => {
      ownedObjectUrls.current.forEach((url) => URL.revokeObjectURL(url));
      ownedObjectUrls.current.clear();
    },
    [],
  );

  // Ambil daftar dari API setiap halaman/filter berubah. AbortController
  // mencegah respons lama menimpa respons baru saat pengguna cepat ganti filter.
  // `loading` diatur oleh aksi pengguna (buka halaman/filter/coba lagi/simpan)
  // agar effect ini tidak memanggil setState secara sinkron.
  useEffect(() => {
    const controller = new AbortController();

    getAdminEvents({ page, status: statusFilter }, controller.signal)
      .then((response) => {
        setEvents(response.data);
        setTotal(response.total);
        setLastPage(Math.max(1, response.last_page));
        setPerPage(response.per_page || 15);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setEvents([]);
        setTotal(0);
        setLastPage(1);
        if (isApiError(error) && error.isUnauthorized) {
          setUnauthorized(true);
          setLoadError("Sesi kamu sudah berakhir. Silakan login kembali untuk melihat data event.");
          return;
        }
        setLoadError(getErrorMessage(error));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [page, statusFilter, reloadKey]);

  // Muat mapel event setiap modal mapel dibuka / daftar dimuat ulang.
  // `subjectsLoading` diatur oleh aksi pengguna (buka modal / coba lagi).
  useEffect(() => {
    if (!subjectEvent) return;

    const controller = new AbortController();

    getAdminEventSubjects(subjectEvent.id, controller.signal)
      .then((data) => {
        setSubjects(data);
        setSubjectsError(null);
        setSubjectsUnauthorized(false);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setSubjects([]);
        if (isApiError(error) && error.isUnauthorized) {
          setSubjectsUnauthorized(true);
          setSubjectsError("Sesi kamu sudah berakhir. Silakan login kembali.");
          return;
        }
        setSubjectsError(getErrorMessage(error));
      })
      .finally(() => {
        if (!controller.signal.aborted) setSubjectsLoading(false);
      });

    return () => controller.abort();
  }, [subjectEvent, subjectsReloadKey]);

  function beginReload() {
    setLoading(true);
    setLoadError(null);
    setUnauthorized(false);
  }

  function retry() {
    beginReload();
    setReloadKey((current) => current + 1);
  }

  function goToPage(nextPage: number) {
    beginReload();
    setPage(nextPage);
  }

  function releaseObjectUrl(url: string | null) {
    if (!url || !ownedObjectUrls.current.has(url)) return;
    URL.revokeObjectURL(url);
    ownedObjectUrls.current.delete(url);
  }

  function resetFormState() {
    setPosterFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function closeEventModal() {
    releaseObjectUrl(pendingImageUrl);
    setPendingImageUrl(null);
    resetFormState();
    setEventModalOpen(false);
    setErrors({});
    setFormError(null);
  }

  function openAddModal() {
    setEditingId(null);
    setForm({ ...emptyForm });
    setErrors({});
    setFormError(null);
    setPendingImageUrl(null);
    resetFormState();
    setEventModalOpen(true);
  }

  function openEditModal(event: AdminEvent) {
    setEditingId(event.id);
    setForm({
      judul: event.judul,
      deskripsi: event.deskripsi,
      lokasi: event.lokasi,
      pendaftaran_mulai: toDateInputValue(event.pendaftaran_mulai),
      pendaftaran_selesai: toDateInputValue(event.pendaftaran_selesai),
      tanggal_event: toDateInputValue(event.tanggal_event),
      harga: String(event.harga),
      status: event.status,
    });
    setErrors({});
    setFormError(null);
    setPendingImageUrl(null);
    resetFormState();
    setEventModalOpen(true);
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    releaseObjectUrl(pendingImageUrl);

    if (!file) {
      setPosterFile(null);
      setPendingImageUrl(null);
      return;
    }

    const url = URL.createObjectURL(file);
    ownedObjectUrls.current.add(url);
    setPosterFile(file);
    setPendingImageUrl(url);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;

    const nextErrors = validateFields({
      judul: { value: form.judul, label: "Nama Event", required: true },
      deskripsi: { value: form.deskripsi, label: "Deskripsi", required: true },
      lokasi: { value: form.lokasi, label: "Lokasi", required: true },
      pendaftaran_mulai: {
        value: form.pendaftaran_mulai,
        label: "Tanggal mulai pendaftaran",
        required: true,
      },
      pendaftaran_selesai: {
        value: form.pendaftaran_selesai,
        label: "Tanggal selesai pendaftaran",
        required: true,
      },
      tanggal_event: {
        value: form.tanggal_event,
        label: "Tanggal pelaksanaan",
        required: true,
      },
      harga: { value: form.harga, label: "Biaya Pendaftaran", required: true },
      status: { value: form.status, label: "Status", required: true },
    });

    if (form.pendaftaran_mulai && form.pendaftaran_selesai && form.pendaftaran_selesai < form.pendaftaran_mulai) {
      nextErrors.pendaftaran_selesai = "Tanggal selesai harus setelah tanggal mulai.";
    }
    if (form.pendaftaran_selesai && form.tanggal_event && form.tanggal_event < form.pendaftaran_selesai) {
      nextErrors.tanggal_event = "Pelaksanaan tidak boleh dimulai sebelum pendaftaran selesai.";
    }
    if (form.harga && (!Number.isInteger(Number(form.harga)) || Number(form.harga) < 0)) {
      nextErrors.harga = "Biaya harus berupa bilangan bulat minimal 0.";
    }

    setErrors(nextErrors);
    setFormError(null);
    if (Object.keys(nextErrors).length > 0) return;

    const payload = new FormData();
    payload.set("judul", form.judul.trim());
    payload.set("deskripsi", form.deskripsi.trim());
    payload.set("lokasi", form.lokasi.trim());
    payload.set("pendaftaran_mulai", form.pendaftaran_mulai);
    payload.set("pendaftaran_selesai", form.pendaftaran_selesai);
    payload.set("tanggal_event", form.tanggal_event);
    payload.set("harga", form.harga);
    payload.set("status", form.status);
    if (posterFile) payload.set("poster", posterFile);

    const isEditing = editingId !== null;
    setSaving(true);

    try {
      if (isEditing) {
        await updateAdminEvent(editingId, payload);
      } else {
        await createAdminEvent(payload);
      }

      closeEventModal();
      beginReload();
      if (!isEditing) setPage(1);
      setReloadKey((current) => current + 1);
      setResult({
        status: "success",
        title: isEditing ? "Data Event Berhasil Diperbarui" : "Data Event Berhasil Ditambahkan",
        message: isEditing ? "Perubahan event sudah tersimpan." : "Event baru sudah tersimpan.",
      });
    } catch (error) {
      if (isApiError(error) && error.status === 422) {
        const fieldErrors = error.fieldErrors;
        setErrors(fieldErrors);
        setFormError(
          Object.keys(fieldErrors).length > 0
            ? "Periksa kembali data yang ditandai."
            : error.message,
        );
      } else if (isApiError(error) && error.isUnauthorized) {
        setFormError("Sesi kamu sudah berakhir. Silakan login kembali.");
      } else {
        setFormError(getErrorMessage(error));
      }
    } finally {
      setSaving(false);
    }
  }

  function askDelete(event: AdminEvent) {
    setPendingDelete(event);
    setDeleteError(null);
    setDeleteModalOpen(true);
  }

  function closeDeleteModal() {
    setDeleteModalOpen(false);
    setPendingDelete(null);
    setDeleteError(null);
  }

  async function confirmDelete() {
    if (!pendingDelete || deleting) return;

    const deletedEvent = pendingDelete;
    setDeleting(true);
    setDeleteError(null);

    try {
      await deleteAdminEvent(deletedEvent.id);
      const lastItemOnPage = events.length === 1 && page > 1;

      closeDeleteModal();
      beginReload();
      if (lastItemOnPage) setPage(page - 1);
      setReloadKey((current) => current + 1);
      setResult({
        status: "success",
        title: "Data Event Berhasil Dihapus",
        message: `Event "${deletedEvent.judul}" sudah dihapus.`,
      });
    } catch (error) {
      if (isApiError(error) && error.status === 422) {
        // Contoh: event sudah punya pendaftar, backend menyarankan ubah status saja.
        setDeleteError(error.message);
      } else if (isApiError(error) && error.isUnauthorized) {
        setDeleteError("Sesi kamu sudah berakhir. Silakan login kembali.");
      } else {
        setDeleteError(getErrorMessage(error));
      }
    } finally {
      setDeleting(false);
    }
  }

  function openSubjectsModal(event: AdminEvent) {
    setSubjectEvent(event);
    setSubjects([]);
    setSubjectsLoading(true);
    setSubjectsError(null);
    setSubjectsUnauthorized(false);
    setNewSubjectName("");
    setEditingSubjectId(null);
    setEditingSubjectName("");
    setConfirmDeleteSubjectId(null);
    setSubjectSaving(false);
    setSubjectActionError(null);
  }

  function closeSubjectsModal() {
    setSubjectEvent(null);
    setSubjects([]);
    setNewSubjectName("");
    setEditingSubjectId(null);
    setEditingSubjectName("");
    setConfirmDeleteSubjectId(null);
    setSubjectActionError(null);
  }

  function reloadSubjects() {
    setSubjectsLoading(true);
    setSubjectsError(null);
    setSubjectsUnauthorized(false);
    setSubjectsReloadKey((current) => current + 1);
  }

  async function handleAddSubject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!subjectEvent || subjectSaving) return;

    const nama = newSubjectName.trim();
    if (!nama) {
      setSubjectActionError("Nama mata pelajaran wajib diisi.");
      return;
    }

    setSubjectSaving(true);
    setSubjectActionError(null);

    try {
      await createAdminSubject(subjectEvent.id, nama);
      setNewSubjectName("");
      reloadSubjects();
    } catch (error) {
      setSubjectActionError(subjectErrorMessage(error));
    } finally {
      setSubjectSaving(false);
    }
  }

  function startSubjectEdit(subject: AdminSubject) {
    setEditingSubjectId(subject.id);
    setEditingSubjectName(subject.nama);
    setConfirmDeleteSubjectId(null);
    setSubjectActionError(null);
  }

  function cancelSubjectEdit() {
    setEditingSubjectId(null);
    setEditingSubjectName("");
    setSubjectActionError(null);
  }

  async function saveSubjectEdit() {
    if (editingSubjectId === null || subjectSaving) return;

    const nama = editingSubjectName.trim();
    if (!nama) {
      setSubjectActionError("Nama mata pelajaran wajib diisi.");
      return;
    }

    setSubjectSaving(true);
    setSubjectActionError(null);

    try {
      await updateAdminSubject(editingSubjectId, nama);
      setEditingSubjectId(null);
      setEditingSubjectName("");
      reloadSubjects();
    } catch (error) {
      setSubjectActionError(subjectErrorMessage(error));
    } finally {
      setSubjectSaving(false);
    }
  }

  async function confirmDeleteSubject(subject: AdminSubject) {
    if (subjectSaving) return;

    setSubjectSaving(true);
    setSubjectActionError(null);

    try {
      await deleteAdminSubject(subject.id);
      setConfirmDeleteSubjectId(null);
      reloadSubjects();
    } catch (error) {
      // Contoh 422: mapel sudah punya pendaftar.
      setSubjectActionError(subjectErrorMessage(error));
    } finally {
      setSubjectSaving(false);
    }
  }

  const editingEvent =
    editingId === null ? null : events.find((item) => item.id === editingId) ?? null;
  const previewImage = pendingImageUrl ?? editingEvent?.poster_url ?? null;

  return (
    <>
      <PageHeader title="Kelola Event" description="Tambah, Edit dan Kelola semua event" />

      <section className="event-management" aria-label="Daftar event">
        <div className="event-toolbar">
          <label className="event-filter">
            <span className="event-filter__label" id="event-status-filter-label">
              Status
            </span>
            <select
              className="form-field__control event-filter__select"
              aria-labelledby="event-status-filter-label"
              value={statusFilter}
              onChange={(event) => {
                beginReload();
                setStatusFilter(event.target.value as AdminEventStatus | "");
                setPage(1);
              }}
            >
              <option value="">Semua Status</option>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <button className="event-button event-button--primary" type="button" onClick={openAddModal}>
            <span aria-hidden="true">+</span> TAMBAH EVENT
          </button>
        </div>

        <div className="event-table-scroll">
          <table className="event-table" aria-busy={loading}>
            <colgroup>
              <col style={{ width: "5%" }} />
              <col style={{ width: "8%" }} />
              <col style={{ width: "11%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "9%" }} />
              <col style={{ width: "8%" }} />
              <col style={{ width: "8%" }} />
              <col style={{ width: "9%" }} />
              <col style={{ width: "8%" }} />
              <col style={{ width: "22%" }} />
            </colgroup>
            <thead>
              <tr>
                <th scope="col">No</th>
                <th scope="col">Gambar</th>
                <th scope="col">Nama Event</th>
                <th scope="col">Pendaftaran</th>
                <th scope="col">Pelaksanaan</th>
                <th scope="col">Lokasi</th>
                <th scope="col">Peserta Lunas</th>
                <th scope="col">Biaya</th>
                <th scope="col">Status</th>
                <th scope="col">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="event-table__empty" colSpan={10}>
                    Memuat data...
                  </td>
                </tr>
              ) : loadError ? (
                <tr>
                  <td className="event-table__empty" colSpan={10}>
                    <div className="event-table__state">
                      <p>{loadError}</p>
                      <div className="event-table__state-actions">
                        {unauthorized ? (
                          <Link
                            className="event-button event-button--primary"
                            href="/login?redirect=%2Fadmin%2Fevent"
                          >
                            LOGIN
                          </Link>
                        ) : null}
                        <button
                          className="event-button event-button--outline"
                          type="button"
                          onClick={retry}
                        >
                          COBA LAGI
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : events.length === 0 ? (
                <tr>
                  <td className="event-table__empty" colSpan={10}>
                    {statusFilter
                      ? "Tidak ada event dengan status ini."
                      : "Tidak ada data."}
                  </td>
                </tr>
              ) : (
                events.map((event, index) => (
                  <tr key={event.id}>
                    <td>{(page - 1) * perPage + index + 1}.</td>
                    <td>
                      <Thumb
                        src={event.poster_url}
                        alt={`Poster ${event.judul}`}
                        className="event-table__image"
                      />
                    </td>
                    <td className="event-table__name">{event.judul}</td>
                    <td>
                      {formatRentangTanggal(event.pendaftaran_mulai, event.pendaftaran_selesai)}
                    </td>
                    <td>{formatTanggal(event.tanggal_event)}</td>
                    <td>{event.lokasi}</td>
                    <td>{event.peserta_lunas} peserta</td>
                    <td>{formatRupiah(event.harga)}</td>
                    <td>
                      <Badge variant={statusVariant(event.status)}>
                        {eventStatusMap[event.status].label}
                      </Badge>
                    </td>
                    <td>
                      <div className="event-table__actions">
                        <button
                          className="event-button event-button--edit"
                          type="button"
                          aria-label={`Edit ${event.judul}`}
                          onClick={() => openEditModal(event)}
                        >
                          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="m4 16.5-.8 4.3 4.3-.8L20 7.5 16.5 4z" />
                            <path d="m14.8 5.7 3.5 3.5" />
                          </svg>
                          Edit
                        </button>
                        <button
                          className="event-button event-button--outline"
                          type="button"
                          aria-label={`Kelola mata pelajaran ${event.judul}`}
                          onClick={() => openSubjectsModal(event)}
                        >
                          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M8 6h12M8 12h12M8 18h12" />
                            <path d="M4 6h.01M4 12h.01M4 18h.01" />
                          </svg>
                          Mapel
                        </button>
                        <button
                          className="event-button event-button--delete"
                          type="button"
                          aria-label={`Hapus ${event.judul}`}
                          onClick={() => askDelete(event)}
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
              )}
            </tbody>
          </table>
        </div>
        <footer className="event-table__footer">
          <span>
            {loading ? "Memuat..." : `${total} data, Halaman ${page}/${lastPage}`}
          </span>
          <div className="event-table__pagination" aria-label="Paginasi event">
            <button
              type="button"
              aria-label="Halaman sebelumnya"
              disabled={loading || page <= 1}
              onClick={() => goToPage(page - 1)}
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Halaman berikutnya"
              disabled={loading || page >= lastPage}
              onClick={() => goToPage(page + 1)}
            >
              ›
            </button>
          </div>
        </footer>
      </section>

      <Modal
        open={eventModalOpen}
        title={editingId === null ? "Tambah Event" : "Edit Event"}
        onClose={closeEventModal}
      >
        <form className="event-form" onSubmit={handleSubmit} noValidate>
          <div className="event-form__grid">
            <div className="event-form__full">
              <FormField id="event-name" label="Nama Event" required error={errors.judul}>
                <input
                  className="form-field__control"
                  id="event-name"
                  value={form.judul}
                  onChange={(event) => setForm({ ...form, judul: event.target.value })}
                  placeholder="Masukkan nama event"
                  required
                />
              </FormField>
            </div>
            <div className="event-form__full">
              <FormField id="event-description" label="Deskripsi" required error={errors.deskripsi}>
                <textarea
                  className="form-field__control"
                  id="event-description"
                  rows={4}
                  value={form.deskripsi}
                  onChange={(event) => setForm({ ...form, deskripsi: event.target.value })}
                  placeholder="Jelaskan event secara singkat"
                  required
                />
              </FormField>
            </div>
            <div className="event-form__full">
              <FormField id="event-location" label="Lokasi" required error={errors.lokasi}>
                <input
                  className="form-field__control"
                  id="event-location"
                  value={form.lokasi}
                  onChange={(event) => setForm({ ...form, lokasi: event.target.value })}
                  placeholder="Masukkan lokasi event"
                  required
                />
              </FormField>
            </div>
            <div className="event-form__full">
              <p className="event-form__group-label">Pendaftaran *</p>
            </div>
            <FormField
              id="registration-start"
              label="Tanggal mulai"
              required
              error={errors.pendaftaran_mulai}
            >
              <input
                className="form-field__control"
                id="registration-start"
                type="date"
                value={form.pendaftaran_mulai}
                onChange={(event) =>
                  setForm({ ...form, pendaftaran_mulai: event.target.value })
                }
                required
              />
            </FormField>
            <FormField
              id="registration-end"
              label="Tanggal selesai"
              required
              error={errors.pendaftaran_selesai}
            >
              <input
                className="form-field__control"
                id="registration-end"
                type="date"
                value={form.pendaftaran_selesai}
                onChange={(event) =>
                  setForm({ ...form, pendaftaran_selesai: event.target.value })
                }
                required
              />
            </FormField>
            <div className="event-form__full">
              <p className="event-form__group-label">Pelaksanaan &amp; Biaya *</p>
            </div>
            <FormField
              id="event-date"
              label="Tanggal pelaksanaan"
              required
              error={errors.tanggal_event}
            >
              <input
                className="form-field__control"
                id="event-date"
                type="date"
                value={form.tanggal_event}
                onChange={(event) => setForm({ ...form, tanggal_event: event.target.value })}
                required
              />
            </FormField>
            <FormField id="event-price" label="Biaya Pendaftaran" required error={errors.harga}>
              <input
                className="form-field__control"
                id="event-price"
                type="number"
                min="0"
                step="1"
                value={form.harga}
                onChange={(event) => setForm({ ...form, harga: event.target.value })}
                placeholder="Masukkan biaya"
                required
              />
            </FormField>
            <div className="event-form__full">
              <FormField id="event-status" label="Status" required error={errors.status}>
                <select
                  className="form-field__control"
                  id="event-status"
                  value={form.status}
                  onChange={(event) =>
                    setForm({ ...form, status: event.target.value as AdminEventStatus | "" })
                  }
                  required
                >
                  <option value="">Pilih status</option>
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>
            <div className="event-form__full">
              <FormField
                id="event-poster"
                label="Poster"
                hint="Opsional, gambar JPG/PNG maksimal 2 MB."
                error={errors.poster}
              >
                <input
                  ref={fileInputRef}
                  className="form-field__control event-form__file"
                  id="event-poster"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </FormField>
              {previewImage ? (
                <Thumb
                  src={previewImage}
                  alt="Pratinjau poster event"
                  className="event-form__preview"
                />
              ) : (
                <p className="event-form__image-placeholder">Belum ada poster event.</p>
              )}
            </div>
          </div>
          {formError ? (
            <p className="event-form__error" role="alert">
              {formError}
            </p>
          ) : null}
          <div className="event-form__actions">
            <button
              className="event-button event-button--outline"
              type="button"
              onClick={closeEventModal}
              disabled={saving}
            >
              BATAL
            </button>
            <button className="event-button event-button--primary" type="submit" disabled={saving}>
              {saving ? "MENYIMPAN..." : "SIMPAN"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={subjectEvent !== null} title="Mata Pelajaran" onClose={closeSubjectsModal}>
        <div className="subject-manager">
          <p className="subject-event">{subjectEvent?.judul}</p>

          <form className="subject-add" onSubmit={handleAddSubject} noValidate>
            <label className="sr-only" htmlFor="subject-name">
              Nama mata pelajaran baru
            </label>
            <input
              className="form-field__control"
              id="subject-name"
              maxLength={100}
              placeholder="Nama mata pelajaran baru"
              value={newSubjectName}
              onChange={(event) => setNewSubjectName(event.target.value)}
            />
            <button className="event-button event-button--primary" type="submit" disabled={subjectSaving}>
              {subjectSaving ? "MENYIMPAN..." : "TAMBAH"}
            </button>
          </form>

          {subjectActionError ? (
            <p className="subject-error" role="alert">
              {subjectActionError}
            </p>
          ) : null}

          {subjectsLoading ? (
            <p className="subject-empty">Memuat mata pelajaran...</p>
          ) : subjectsError ? (
            <div className="subject-empty">
              <p>{subjectsError}</p>
              <div className="subject-empty__actions">
                {subjectsUnauthorized ? (
                  <Link
                    className="event-button event-button--primary"
                    href="/login?redirect=%2Fadmin%2Fevent"
                  >
                    LOGIN
                  </Link>
                ) : null}
                <button
                  className="event-button event-button--outline"
                  type="button"
                  onClick={reloadSubjects}
                >
                  COBA LAGI
                </button>
              </div>
            </div>
          ) : subjects.length === 0 ? (
            <p className="subject-empty">Belum ada mata pelajaran untuk event ini.</p>
          ) : (
            <ul className="subject-list">
              {subjects.map((subject) => (
                <li className="subject-row" key={subject.id}>
                  {editingSubjectId === subject.id ? (
                    <div className="subject-row__edit">
                      <label className="sr-only" htmlFor={`subject-edit-${subject.id}`}>
                        Nama mata pelajaran
                      </label>
                      <input
                        className="form-field__control"
                        id={`subject-edit-${subject.id}`}
                        maxLength={100}
                        value={editingSubjectName}
                        onChange={(event) => setEditingSubjectName(event.target.value)}
                      />
                      <button
                        className="event-button event-button--primary"
                        type="button"
                        disabled={subjectSaving}
                        onClick={() => void saveSubjectEdit()}
                      >
                        SIMPAN
                      </button>
                      <button
                        className="event-button event-button--outline"
                        type="button"
                        disabled={subjectSaving}
                        onClick={cancelSubjectEdit}
                      >
                        BATAL
                      </button>
                    </div>
                  ) : confirmDeleteSubjectId === subject.id ? (
                    <div className="subject-row__confirm">
                      <span>Hapus &quot;{subject.nama}&quot;?</span>
                      <div className="subject-row__actions">
                        <button
                          className="event-button event-button--delete"
                          type="button"
                          disabled={subjectSaving}
                          onClick={() => void confirmDeleteSubject(subject)}
                        >
                          YA, HAPUS
                        </button>
                        <button
                          className="event-button event-button--outline"
                          type="button"
                          disabled={subjectSaving}
                          onClick={() => setConfirmDeleteSubjectId(null)}
                        >
                          BATAL
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <span className="subject-row__name">{subject.nama}</span>
                        <span className="subject-row__meta">
                          {subject.peserta_lunas ?? 0} peserta lunas
                        </span>
                      </div>
                      <div className="subject-row__actions">
                        <button
                          className="event-button event-button--edit"
                          type="button"
                          aria-label={`Ubah ${subject.nama}`}
                          onClick={() => startSubjectEdit(subject)}
                        >
                          Edit
                        </button>
                        <button
                          className="event-button event-button--delete"
                          type="button"
                          aria-label={`Hapus ${subject.nama}`}
                          onClick={() => {
                            setConfirmDeleteSubjectId(subject.id);
                            setSubjectActionError(null);
                          }}
                        >
                          Hapus
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Modal>

      <Modal open={deleteModalOpen} title="Hapus Event?" onClose={closeDeleteModal}>
        <p className="event-delete__message">
          {pendingDelete ? `"${pendingDelete.judul}" akan dihapus permanen.` : ""}
        </p>
        {deleteError ? (
          <p className="event-delete__error" role="alert">
            {deleteError}
          </p>
        ) : null}
        <div className="event-form__actions">
          <button
            className="event-button event-button--outline"
            type="button"
            onClick={closeDeleteModal}
            disabled={deleting}
          >
            BATAL
          </button>
          <button
            className="event-button event-button--delete"
            type="button"
            onClick={() => void confirmDelete()}
            disabled={deleting}
          >
            {deleting ? "MENGHAPUS..." : "HAPUS"}
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
