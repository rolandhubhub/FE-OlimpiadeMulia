"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import Badge, { type BadgeVariant } from "@/components/admin/badge";
import PageHeader from "@/components/admin/page-header";
import { getAllAdminEvents } from "@/lib/api/admin-event";
import { getAdminEventParticipants } from "@/lib/api/admin-participant";
import { getErrorMessage, isApiError } from "@/lib/api/errors";
import { getStatusMeta } from "@/lib/status";
import type { AdminEvent, AdminParticipant, AdminRegistrationStatus } from "@/types/admin";

// "use client" karena butuh state filter/paginasi, event handler, dan
// memanggil API berotentikasi dari browser.

const COLUMN_COUNT = 5;
const LOGIN_REDIRECT = "/login?redirect=%2Fadmin%2Fpeserta";

const statusOptions: Array<{ value: AdminRegistrationStatus; label: string }> = [
  { value: "menunggu_bayar", label: "Menunggu Bayar" },
  { value: "lunas", label: "Confirmed" },
  { value: "batal", label: "Cancelled (Batal)" },
  { value: "kadaluarsa", label: "Cancelled (Kadaluarsa)" },
];

function getStatusVariant(status: AdminRegistrationStatus): BadgeVariant {
  if (status === "lunas") return "ok";
  if (status === "menunggu_bayar") return "warn";
  if (status === "batal") return "bad";
  return "mute";
}

function StateRow({ children }: { children: ReactNode }) {
  return (
    <tr>
      <td className="participant-empty" colSpan={COLUMN_COUNT}>
        {children}
      </td>
    </tr>
  );
}

interface ErrorStateProps {
  message: string;
  unauthorized: boolean;
  onRetry: () => void;
}

function ErrorState({ message, unauthorized, onRetry }: ErrorStateProps) {
  return (
    <div className="participant-state">
      <p>{message}</p>
      <div className="participant-state-actions">
        {unauthorized ? (
          <Link className="event-button event-button--primary" href={LOGIN_REDIRECT}>
            LOGIN
          </Link>
        ) : null}
        <button className="event-button event-button--outline" type="button" onClick={onRetry}>
          COBA LAGI
        </button>
      </div>
    </div>
  );
}

export default function ParticipantList() {
  // Daftar event untuk dropdown (API tidak punya daftar peserta global).
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState<string | null>(null);
  const [eventsUnauthorized, setEventsUnauthorized] = useState(false);
  const [eventsReloadKey, setEventsReloadKey] = useState(0);

  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<AdminRegistrationStatus | "">("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [participants, setParticipants] = useState<AdminParticipant[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [unauthorized, setUnauthorized] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const searchInitialized = useRef(false);

  // Ambil semua event sekali untuk mengisi dropdown, lalu pilih event pertama.
  useEffect(() => {
    const controller = new AbortController();

    getAllAdminEvents(controller.signal)
      .then((data) => {
        setEvents(data);
        setEventsError(null);
        setEventsUnauthorized(false);
        setSelectedEventId((current) => current ?? data[0]?.id ?? null);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setEvents([]);
        setSelectedEventId(null);
        if (isApiError(error) && error.isUnauthorized) {
          setEventsUnauthorized(true);
          setEventsError("Sesi kamu sudah berakhir. Silakan login kembali untuk melihat peserta.");
          return;
        }
        setEventsError(getErrorMessage(error));
      })
      .finally(() => {
        if (!controller.signal.aborted) setEventsLoading(false);
      });

    return () => controller.abort();
  }, [eventsReloadKey]);

  // Pencarian pakai ?q= di server; tunggu 400 ms setelah berhenti mengetik.
  // Timer membuat setState terjadi asinkron (bukan langsung di body effect).
  useEffect(() => {
    if (!searchInitialized.current) {
      searchInitialized.current = true;
      return;
    }

    const timer = setTimeout(() => {
      setSearchQuery(searchInput.trim());
      setPage(1);
      setLoading(true);
      setLoadError(null);
      setUnauthorized(false);
      setReloadKey((current) => current + 1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Ambil peserta setiap event/filter/halaman berubah.
  useEffect(() => {
    if (selectedEventId === null) return;

    const controller = new AbortController();

    getAdminEventParticipants(
      selectedEventId,
      {
        page,
        status: statusFilter,
        subject_id: subjectFilter ? Number(subjectFilter) : "",
        q: searchQuery,
      },
      controller.signal,
    )
      .then((response) => {
        setParticipants(response.data);
        setTotal(response.total);
        setLastPage(Math.max(1, response.last_page));
        setPerPage(response.per_page || 20);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setParticipants([]);
        setTotal(0);
        setLastPage(1);
        if (isApiError(error) && error.isUnauthorized) {
          setUnauthorized(true);
          setLoadError("Sesi kamu sudah berakhir. Silakan login kembali untuk melihat peserta.");
          return;
        }
        setLoadError(getErrorMessage(error));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [selectedEventId, page, statusFilter, subjectFilter, searchQuery, reloadKey]);

  function beginReload() {
    setLoading(true);
    setLoadError(null);
    setUnauthorized(false);
  }

  function retryEvents() {
    setEventsLoading(true);
    setEventsError(null);
    setEventsUnauthorized(false);
    setEventsReloadKey((current) => current + 1);
  }

  function retryParticipants() {
    beginReload();
    setReloadKey((current) => current + 1);
  }

  function goToPage(nextPage: number) {
    beginReload();
    setPage(nextPage);
  }

  function handleEventChange(value: string) {
    beginReload();
    setSelectedEventId(value ? Number(value) : null);
    // Mapel selalu milik satu event, jadi filter mapel direset saat event berganti.
    setSubjectFilter("");
    setPage(1);
  }

  function handleSubjectChange(value: string) {
    beginReload();
    setSubjectFilter(value);
    setPage(1);
  }

  function handleStatusChange(value: AdminRegistrationStatus | "") {
    beginReload();
    setStatusFilter(value);
    setPage(1);
  }

  // Mapel diambil dari relasi subjects pada event terpilih (tanpa request tambahan).
  const subjectOptions =
    events.find((event) => event.id === selectedEventId)?.subjects ?? [];

  const footerText =
    eventsLoading || (selectedEventId !== null && loading)
      ? "Memuat..."
      : `${total} data, Halaman ${page}/${lastPage}`;

  return (
    <>
      <PageHeader title="Kelola Peserta" description="Konfirmasi dan kelola pendaftar" />

      <section className="participant-page" aria-label="Daftar peserta">
        <div className="participant-filters">
          <label className="sr-only" htmlFor="participant-search">
            Cari nama, sekolah, atau kode pendaftaran
          </label>
          <input
            id="participant-search"
            className="participant-filter participant-filter--search"
            type="search"
            placeholder="Cari Nama/sekolah/kode"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            disabled={eventsLoading}
          />

          <label className="sr-only" htmlFor="participant-event">
            Pilih event
          </label>
          <select
            id="participant-event"
            className="participant-filter participant-filter--event"
            value={selectedEventId ?? ""}
            onChange={(event) => handleEventChange(event.target.value)}
            disabled={eventsLoading || events.length === 0}
          >
            <option value="">{events.length > 0 ? "Pilih Event" : "Belum ada event"}</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.judul}
              </option>
            ))}
          </select>

          <label className="sr-only" htmlFor="participant-subject">
            Filter mata pelajaran
          </label>
          <select
            id="participant-subject"
            className="participant-filter participant-filter--subject"
            value={subjectFilter}
            onChange={(event) => handleSubjectChange(event.target.value)}
            disabled={eventsLoading || subjectOptions.length === 0}
          >
            <option value="">Semua Mapel</option>
            {subjectOptions.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.nama}
              </option>
            ))}
          </select>

          <label className="sr-only" htmlFor="participant-status">
            Filter status
          </label>
          <select
            id="participant-status"
            className="participant-filter participant-filter--status"
            value={statusFilter}
            onChange={(event) =>
              handleStatusChange(event.target.value as AdminRegistrationStatus | "")
            }
            disabled={eventsLoading}
          >
            <option value="">Semua Status</option>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="participant-table-scroll">
          <table className="participant-table" aria-busy={loading || eventsLoading}>
            <colgroup>
              <col style={{ width: "6%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "34%" }} />
              <col style={{ width: "22%" }} />
              <col style={{ width: "18%" }} />
            </colgroup>
            <thead>
              <tr>
                <th scope="col">No</th>
                <th scope="col">No. Registrasi</th>
                <th scope="col">Peserta</th>
                <th scope="col">Kontak</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {eventsLoading ? (
                <StateRow>Memuat daftar event...</StateRow>
              ) : eventsError ? (
                <StateRow>
                  <ErrorState
                    message={eventsError}
                    unauthorized={eventsUnauthorized}
                    onRetry={retryEvents}
                  />
                </StateRow>
              ) : events.length === 0 ? (
                <StateRow>
                  Belum ada event. Tambahkan event terlebih dahulu di halaman Event.
                </StateRow>
              ) : selectedEventId === null ? (
                <StateRow>Pilih event untuk melihat peserta.</StateRow>
              ) : loading ? (
                <StateRow>Memuat data...</StateRow>
              ) : loadError ? (
                <StateRow>
                  <ErrorState message={loadError} unauthorized={unauthorized} onRetry={retryParticipants} />
                </StateRow>
              ) : participants.length === 0 ? (
                <StateRow>
                  {searchQuery || statusFilter || subjectFilter
                    ? "Tidak ada peserta yang cocok dengan filter."
                    : "Event ini belum memiliki pendaftar."}
                </StateRow>
              ) : (
                participants.map((participant, index) => (
                  <tr key={participant.id}>
                    <td>{(page - 1) * perPage + index + 1}.</td>
                    <td>
                      <div className="participant-registration">{participant.kode}</div>
                    </td>
                    <td>
                      <div className="participant-name">{participant.nama_lengkap}</div>
                      <div className="participant-secondary">
                        {participant.asal_sekolah} • {participant.jenjang}
                      </div>
                      {participant.subject?.nama ? (
                        <div className="participant-secondary">
                          Mapel: {participant.subject.nama}
                        </div>
                      ) : null}
                    </td>
                    <td>
                      {participant.no_whatsapp ? (
                        <a
                          className="participant-contact"
                          href={`https://wa.me/${participant.no_whatsapp}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {participant.no_whatsapp}
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      <Badge variant={getStatusVariant(participant.status)}>
                        {getStatusMeta("pendaftaran", participant.status).label}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <footer className="participant-table__footer">
          <span>{footerText}</span>
          <div className="event-table__pagination" aria-label="Paginasi peserta">
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
    </>
  );
}
