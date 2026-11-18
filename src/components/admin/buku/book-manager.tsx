"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import Badge from "@/components/admin/badge";
import FormField from "@/components/admin/form-field";
import Modal from "@/components/admin/modal";
import PageHeader from "@/components/admin/page-header";
import ResultDialog from "@/components/admin/result-dialog";
import Thumb from "@/components/admin/thumb";
import { validateFields } from "@/lib/admin/validate";
import {
  createAdminBook,
  deleteAdminBook,
  getAdminBooks,
  updateAdminBook,
} from "@/lib/api/admin-book";
import { getErrorMessage, isApiError } from "@/lib/api/errors";
import { formatRupiah } from "@/lib/format";
import type { AdminBook, AdminResultStatus, AdminValidationErrors } from "@/types/admin";

// "use client" karena halaman ini butuh state (pencarian, paginasi, form),
// event handler, dan memanggil API berotentikasi dari browser.

/** Nilai form memakai nama field API supaya error 422 bisa langsung dipetakan. */
interface BookFormValues {
  judul: string;
  penulis: string;
  deskripsi: string;
  harga: string;
  stok: string;
  is_active: boolean;
}

interface BookResult {
  status: AdminResultStatus;
  title: string;
  message: string;
}

const emptyForm: BookFormValues = {
  judul: "",
  penulis: "",
  deskripsi: "",
  harga: "",
  stok: "",
  is_active: false,
};

const COLUMN_COUNT = 9;
const LOGIN_REDIRECT = "/login?redirect=%2Fadmin%2Fbuku";

export default function BookManager() {
  const [books, setBooks] = useState<AdminBook[]>([]);
  const [queryInput, setQueryInput] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [unauthorized, setUnauthorized] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [form, setForm] = useState<BookFormValues>(emptyForm);
  const [errors, setErrors] = useState<AdminValidationErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [pendingDelete, setPendingDelete] = useState<AdminBook | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [pendingCover, setPendingCover] = useState<string | null>(null);
  const [pendingCoverName, setPendingCoverName] = useState("");
  const [result, setResult] = useState<BookResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const ownedObjectUrls = useRef(new Set<string>());

  useEffect(
    () => () => {
      ownedObjectUrls.current.forEach((url) => URL.revokeObjectURL(url));
      ownedObjectUrls.current.clear();
    },
    [],
  );

  // Ambil daftar buku dari API setiap halaman/pencarian berubah.
  // Status loading diatur oleh aksi pengguna agar effect tidak setState sinkron.
  useEffect(() => {
    const controller = new AbortController();

    getAdminBooks({ page, q: query }, controller.signal)
      .then((response) => {
        setBooks(response.data);
        setTotal(response.total);
        setLastPage(Math.max(1, response.last_page));
        setPerPage(response.per_page || 15);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setBooks([]);
        setTotal(0);
        setLastPage(1);
        if (isApiError(error) && error.isUnauthorized) {
          setUnauthorized(true);
          setLoadError("Sesi kamu sudah berakhir. Silakan login kembali untuk melihat data buku.");
          return;
        }
        setLoadError(getErrorMessage(error));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [page, query, reloadKey]);

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

  function revokeOwnedUrl(url: string | null) {
    if (!url || !ownedObjectUrls.current.has(url)) return;
    URL.revokeObjectURL(url);
    ownedObjectUrls.current.delete(url);
  }

  function resetCoverState() {
    setCoverFile(null);
    setPendingCoverName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function closeForm() {
    revokeOwnedUrl(pendingCover);
    setPendingCover(null);
    resetCoverState();
    setFormOpen(false);
    setErrors({});
    setFormError(null);
  }

  function openAddForm() {
    setEditingId(null);
    setForm({ ...emptyForm });
    setPendingCover(null);
    resetCoverState();
    setErrors({});
    setFormError(null);
    setFormOpen(true);
  }

  function openEditForm(book: AdminBook) {
    setEditingId(book.id);
    setForm({
      judul: book.judul,
      penulis: book.penulis,
      deskripsi: book.deskripsi,
      harga: String(book.harga),
      stok: String(book.stok),
      is_active: book.is_active,
    });
    setPendingCover(null);
    resetCoverState();
    setErrors({});
    setFormError(null);
    setFormOpen(true);
  }

  function handleCoverChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    revokeOwnedUrl(pendingCover);

    if (!file) {
      setCoverFile(null);
      setPendingCover(null);
      setPendingCoverName("");
      return;
    }

    const url = URL.createObjectURL(file);
    ownedObjectUrls.current.add(url);
    setCoverFile(file);
    setPendingCover(url);
    setPendingCoverName(file.name);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;

    const validationErrors = validateFields({
      judul: { value: form.judul, label: "Judul", required: true },
      penulis: { value: form.penulis, label: "Penulis", required: true },
      deskripsi: { value: form.deskripsi, label: "Deskripsi", required: true },
      harga: { value: form.harga, label: "Harga", required: true },
      stok: { value: form.stok, label: "Stok", required: true },
    });

    if (form.stok && (!Number.isInteger(Number(form.stok)) || Number(form.stok) < 0)) {
      validationErrors.stok = "Stok harus berupa bilangan bulat minimal 0.";
    }
    if (form.harga && (!Number.isInteger(Number(form.harga)) || Number(form.harga) < 0)) {
      validationErrors.harga = "Harga harus berupa bilangan bulat minimal 0.";
    }

    setErrors(validationErrors);
    setFormError(null);
    if (Object.keys(validationErrors).length > 0) return;

    const payload = new FormData();
    payload.set("judul", form.judul.trim());
    payload.set("penulis", form.penulis.trim());
    payload.set("deskripsi", form.deskripsi.trim());
    payload.set("harga", form.harga);
    payload.set("stok", form.stok);
    payload.set("is_active", form.is_active ? "1" : "0");
    if (coverFile) payload.set("cover", coverFile);

    const isEditing = editingId !== null;
    setSaving(true);

    try {
      if (isEditing) {
        await updateAdminBook(editingId, payload);
      } else {
        await createAdminBook(payload);
      }

      closeForm();
      beginReload();
      if (!isEditing) setPage(1);
      setReloadKey((current) => current + 1);
      setResult({
        status: "success",
        title: isEditing ? "Data Buku Berhasil Diperbarui" : "Data Buku Berhasil Ditambahkan",
        message: isEditing ? "Perubahan buku sudah tersimpan." : "Buku baru sudah tersimpan.",
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

  function askDelete(book: AdminBook) {
    setPendingDelete(book);
    setDeleteError(null);
    setDeleteOpen(true);
  }

  function closeDeleteModal() {
    setDeleteOpen(false);
    setPendingDelete(null);
    setDeleteError(null);
  }

  async function confirmDelete() {
    if (!pendingDelete || deleting) return;

    const deletedBook = pendingDelete;
    setDeleting(true);
    setDeleteError(null);

    try {
      await deleteAdminBook(deletedBook.id);
      const lastItemOnPage = books.length === 1 && page > 1;

      closeDeleteModal();
      beginReload();
      if (lastItemOnPage) setPage(page - 1);
      setReloadKey((current) => current + 1);
      setResult({
        status: "success",
        title: "Data Buku Berhasil Dihapus",
        message: `Buku "${deletedBook.judul}" sudah dihapus.`,
      });
    } catch (error) {
      if (isApiError(error) && error.isUnauthorized) {
        setDeleteError("Sesi kamu sudah berakhir. Silakan login kembali.");
      } else {
        setDeleteError(getErrorMessage(error));
      }
    } finally {
      setDeleting(false);
    }
  }

  const editedBook = books.find((book) => book.id === editingId);
  const previewCover = pendingCover ?? editedBook?.cover_url ?? null;
  const footerText = loading ? "Memuat..." : `${total} data, Halaman ${page}/${lastPage}`;

  return (
    <>
      <PageHeader title="Kelola Buku" description="Tambah, Edit dan Kelola semua buku" />

      <section className="book-page" aria-label="Daftar buku">
        <form
          className="book-toolbar"
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            beginReload();
            setQuery(queryInput.trim());
            setPage(1);
          }}
        >
          <label className="book-search">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="6" />
              <path d="m16 16 5 5" />
            </svg>
            <input
              type="search"
              aria-label="Cari judul atau penulis buku"
              placeholder="Cari judul/penulis"
              value={queryInput}
              onChange={(event) => setQueryInput(event.target.value)}
            />
          </label>
          <button className="book-button book-button--primary" type="submit">
            CARI
          </button>
          <button className="book-button book-button--primary" type="button" onClick={openAddForm}>
            + TAMBAH BUKU
          </button>
        </form>

        <div className="book-table-scroll">
          <table className="book-table" aria-busy={loading}>
            <colgroup>
              <col style={{ width: "5%" }} />
              <col style={{ width: "9%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "6%" }} />
              <col style={{ width: "9%" }} />
              <col style={{ width: "9%" }} />
              <col style={{ width: "16%" }} />
              <col style={{ width: "14%" }} />
            </colgroup>
            <thead>
              <tr>
                <th scope="col">No</th>
                <th scope="col">Gambar</th>
                <th scope="col">Penulis</th>
                <th scope="col">Judul</th>
                <th scope="col">Stok</th>
                <th scope="col">Harga</th>
                <th scope="col">Status</th>
                <th scope="col">Deskripsi</th>
                <th scope="col">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="book-table__empty" colSpan={COLUMN_COUNT}>
                    Memuat data...
                  </td>
                </tr>
              ) : loadError ? (
                <tr>
                  <td className="book-table__empty" colSpan={COLUMN_COUNT}>
                    <div className="book-state">
                      <p>{loadError}</p>
                      <div className="book-state-actions">
                        {unauthorized ? (
                          <Link className="book-button book-button--primary" href={LOGIN_REDIRECT}>
                            LOGIN
                          </Link>
                        ) : null}
                        <button className="book-button book-button--outline" type="button" onClick={retry}>
                          COBA LAGI
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : books.length === 0 ? (
                <tr>
                  <td className="book-table__empty" colSpan={COLUMN_COUNT}>
                    {query ? "Tidak ada buku yang cocok dengan pencarian." : "Tidak ada data."}
                  </td>
                </tr>
              ) : (
                books.map((book, index) => (
                  <tr key={book.id}>
                    <td>{(page - 1) * perPage + index + 1}.</td>
                    <td>
                      <Thumb
                        src={book.cover_url}
                        alt={`Sampul buku ${book.judul}`}
                        className="book-cover"
                      />
                    </td>
                    <td>{book.penulis}</td>
                    <td className="book-table__title">{book.judul}</td>
                    <td>{book.stok}</td>
                    <td>{formatRupiah(book.harga)}</td>
                    <td>
                      <Badge variant={book.is_active ? "ok" : "mute"}>
                        {book.is_active ? "AKTIF" : "NONAKTIF"}
                      </Badge>
                    </td>
                    <td className="book-table__description">{book.deskripsi}</td>
                    <td>
                      <div className="book-table__actions">
                        <button
                          className="book-button book-button--edit"
                          type="button"
                          aria-label={`Edit ${book.judul}`}
                          onClick={() => openEditForm(book)}
                        >
                          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="m4 16.5-.8 4.3 4.3-.8L20 7.5 16.5 4z" />
                            <path d="m14.8 5.7 3.5 3.5" />
                          </svg>
                          Edit
                        </button>
                        <button
                          className="book-button book-button--delete"
                          type="button"
                          aria-label={`Hapus ${book.judul}`}
                          onClick={() => askDelete(book)}
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
        <footer className="book-table__footer">
          <span>{footerText}</span>
          <div className="book-table__pagination" aria-label="Paginasi buku">
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
        open={formOpen}
        title={editingId === null ? "Tambah Buku" : "Edit Buku"}
        onClose={closeForm}
      >
        <form className="book-form" onSubmit={handleSubmit} noValidate>
          <div className="book-form__grid">
            <div className="book-form__full">
              <FormField id="book-title" label="Judul" required error={errors.judul}>
                <input
                  className="form-field__control"
                  id="book-title"
                  value={form.judul}
                  onChange={(event) => setForm({ ...form, judul: event.target.value })}
                  placeholder="Judul buku"
                  required
                />
              </FormField>
            </div>
            <FormField id="book-author" label="Penulis" required error={errors.penulis}>
              <input
                className="form-field__control"
                id="book-author"
                value={form.penulis}
                onChange={(event) => setForm({ ...form, penulis: event.target.value })}
                placeholder="Nama penulis"
                required
              />
            </FormField>
            <FormField id="book-price" label="Harga" required error={errors.harga}>
              <input
                className="form-field__control"
                id="book-price"
                type="number"
                min="0"
                step="1"
                value={form.harga}
                onChange={(event) => setForm({ ...form, harga: event.target.value })}
                placeholder="Masukkan harga"
                required
              />
            </FormField>
            <FormField id="book-stock" label="Stok" required error={errors.stok}>
              <input
                className="form-field__control"
                id="book-stock"
                type="number"
                min="0"
                step="1"
                value={form.stok}
                onChange={(event) => setForm({ ...form, stok: event.target.value })}
                placeholder="Masukkan stok"
                required
              />
            </FormField>
            <label className="book-form__visibility" htmlFor="book-active">
              <input
                id="book-active"
                type="checkbox"
                checked={form.is_active}
                onChange={(event) => setForm({ ...form, is_active: event.target.checked })}
              />
              Tampilan di toko
            </label>
            <div className="book-form__full">
              <FormField id="book-description" label="Deskripsi" required error={errors.deskripsi}>
                <textarea
                  className="form-field__control book-form__textarea"
                  id="book-description"
                  value={form.deskripsi}
                  onChange={(event) => setForm({ ...form, deskripsi: event.target.value })}
                  placeholder="Deskripsi buku"
                  required
                />
              </FormField>
            </div>
            <div className="book-form__full">
              <FormField
                id="book-cover"
                label="Gambar Buku"
                error={errors.cover}
                hint={
                  editingId === null
                    ? "Opsional, JPG/PNG maksimal 2 MB."
                    : "Pilih file baru untuk mengganti cover."
                }
              >
                <input
                  ref={fileInputRef}
                  className="form-field__control book-form__file"
                  id="book-cover"
                  type="file"
                  accept="image/*"
                  onChange={handleCoverChange}
                />
              </FormField>
              <div className="book-form__preview">
                <Thumb
                  src={previewCover}
                  alt={previewCover ? "Pratinjau cover buku" : "Placeholder cover buku"}
                  className="book-cover book-cover--preview"
                />
                <span>
                  {pendingCover
                    ? pendingCoverName
                    : previewCover
                      ? "Cover saat ini"
                      : "Belum ada cover"}
                </span>
              </div>
            </div>
          </div>
          {formError ? (
            <p className="book-form__error" role="alert">
              {formError}
            </p>
          ) : null}
          <div className="book-form__actions">
            <button
              className="book-button book-button--outline"
              type="button"
              onClick={closeForm}
              disabled={saving}
            >
              BATAL
            </button>
            <button className="book-button book-button--primary" type="submit" disabled={saving}>
              {saving ? "MENYIMPAN..." : "SIMPAN"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={deleteOpen} title="Hapus Buku?" onClose={closeDeleteModal}>
        <p className="book-delete__message">
          {pendingDelete ? `"${pendingDelete.judul}" akan dihapus.` : ""}
        </p>
        {deleteError ? (
          <p className="book-delete__error" role="alert">
            {deleteError}
          </p>
        ) : null}
        <div className="book-form__actions">
          <button
            className="book-button book-button--outline"
            type="button"
            onClick={closeDeleteModal}
            disabled={deleting}
          >
            BATAL
          </button>
          <button
            className="book-button book-button--delete"
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
