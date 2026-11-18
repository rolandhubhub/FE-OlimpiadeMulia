"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import FormField from "@/components/admin/form-field";
import Modal from "@/components/admin/modal";
import PageHeader from "@/components/admin/page-header";
import ResultDialog from "@/components/admin/result-dialog";
import { initialAdminJuaraParticipants } from "@/data/admin/juara";
import { BATAS_PERINGKAT_SERTIFIKAT } from "@/lib/admin/constants";
import { computeRanks } from "@/lib/admin/ranking";
import type {
  AdminJuaraJenjang,
  AdminJuaraSubject,
  AdminNominationEvent,
  AdminResultStatus,
} from "@/types/admin";

interface JuaraSelection {
  event: AdminNominationEvent;
  subject: AdminJuaraSubject;
  level: AdminJuaraJenjang;
}

interface JuaraResult {
  status: AdminResultStatus;
  title: string;
  message: string;
}

const events: AdminNominationEvent[] = ["KMSI", "JSO", "IMC"];
const subjects: AdminJuaraSubject[] = ["Matematika", "Sains", "Bahasa Inggris"];
const levels: AdminJuaraJenjang[] = ["TK", "SD", "SMP", "SMA"];

function isValidScore(value: string): boolean {
  if (!value.trim()) return false;
  const score = Number(value);
  return Number.isFinite(score) && score >= 0 && score <= 100;
}

export default function JuaraScoreManager() {
  const [selection, setSelection] = useState<JuaraSelection | null>(null);
  const [selectionOpen, setSelectionOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [draftEvent, setDraftEvent] = useState<AdminNominationEvent | "">("");
  const [draftSubject, setDraftSubject] = useState<AdminJuaraSubject | "">("");
  const [draftLevel, setDraftLevel] = useState<AdminJuaraJenjang | "">("");
  const [selectionError, setSelectionError] = useState("");
  const [invalidIds, setInvalidIds] = useState<number[]>([]);
  const [result, setResult] = useState<JuaraResult | null>(null);
  const [scores, setScores] = useState<Record<number, string>>(() =>
    initialAdminJuaraParticipants.reduce<Record<number, string>>((values, participant) => {
      values[participant.id] = participant.score === null ? "" : String(participant.score);
      return values;
    }, {}),
  );

  const participants = useMemo(() => {
    if (!selection) return [];

    return initialAdminJuaraParticipants.filter(
      (participant) =>
        participant.event === selection.event &&
        participant.subject === selection.subject &&
        participant.level === selection.level &&
        participant.status === "Confirmed",
    );
  }, [selection]);

  const ranks = useMemo(() => {
    const entries = participants.map((participant) => {
      const rawScore = scores[participant.id] ?? "";
      return {
        id: participant.id,
        score: isValidScore(rawScore) ? Number(rawScore) : null,
      };
    });

    return computeRanks(entries);
  }, [participants, scores]);

  function openSelection() {
    setDraftEvent(selection?.event ?? "");
    setDraftSubject(selection?.subject ?? "");
    setDraftLevel(selection?.level ?? "");
    setSelectionError("");
    setStep(1);
    setSelectionOpen(true);
  }

  function closeSelection() {
    setSelectionOpen(false);
    setSelectionError("");
  }

  function handleSelectionNext() {
    if (step === 1) {
      if (!draftEvent) {
        setSelectionError("Event wajib dipilih.");
        return;
      }
      setSelectionError("");
      setStep(2);
      return;
    }

    if (step === 2) {
      if (!draftSubject) {
        setSelectionError("Pelajaran wajib dipilih.");
        return;
      }
      setSelectionError("");
      setStep(3);
      return;
    }

    if (!draftLevel) {
      setSelectionError("Jenjang wajib dipilih.");
      return;
    }
    if (!draftEvent || !draftSubject) return;

    setSelection({ event: draftEvent, subject: draftSubject, level: draftLevel });
    setSelectionError("");
    setInvalidIds([]);
    setSelectionOpen(false);
  }

  function handleSelectionBack() {
    if (step === 1) {
      closeSelection();
      return;
    }

    setSelectionError("");
    setStep(step === 3 ? 2 : 1);
  }

  function handleScoreChange(id: number, value: string) {
    setScores((current) => ({ ...current, [id]: value }));
    setInvalidIds((current) => {
      const withoutCurrent = current.filter((item) => item !== id);
      if (!value.trim() || isValidScore(value)) return withoutCurrent;
      return [...withoutCurrent, id];
    });
  }

  function handleSave() {
    if (!selection) return;

    const invalid = participants.filter((participant) => {
      const rawScore = (scores[participant.id] ?? "").trim();
      return rawScore !== "" && !isValidScore(rawScore);
    });

    if (invalid.length > 0) {
      setInvalidIds(invalid.map((participant) => participant.id));
      setResult({
        status: "error",
        title: "Nilai Gagal Disimpan",
        message: "Periksa nilai yang ditandai. Nilai harus berupa angka 0 sampai 100.",
      });
      return;
    }

    const filled = participants.filter(
      (participant) => (scores[participant.id] ?? "").trim() !== "",
    ).length;

    if (filled === 0) {
      setResult({
        status: "error",
        title: "Nilai Gagal Disimpan",
        message: "Isi minimal satu nilai peserta sebelum menyimpan.",
      });
      return;
    }

    // TODO(api): kirim nilai ke endpoint Laravel. Saat ini nilai hanya hidup di state halaman ini.
    setResult({
      status: "success",
      title: "Nilai Berhasil Disimpan",
      message: `${filled} nilai peserta ${selection.event} · ${selection.subject} · ${selection.level} sudah tersimpan.`,
    });
  }

  const stepTitle =
    step === 1 ? "Pilih Event" : step === 2 ? "Pilih Pelajaran" : "Pilih Jenjang";
  const stepSubtitle =
    step === 1
      ? "Pilih event untuk menginput nilai pada setiap event"
      : step === 2
        ? draftEvent
        : `${draftEvent} · ${draftSubject}`;

  return (
    <>
      <Link className="juara-back" href="/admin/nominasi">
        ‹ Kembali ke Nominasi
      </Link>
      <PageHeader
        title="Input Nilai Juara"
        eyebrow="Kelola Nominasi"
        description={
          selection
            ? `${selection.event} · ${selection.subject} · ${selection.level}`
            : "Pilih event, pelajaran, dan jenjang untuk mulai menginput nilai."
        }
        action={
          <button
            className="nomination-button nomination-button--primary"
            type="button"
            onClick={openSelection}
          >
            PILIH EVENT
          </button>
        }
      />

      {selection ? (
        <section className="juara-page" aria-label="Daftar nilai peserta">
          <div className="nomination-table-scroll">
            <table className="nomination-table" aria-label="Daftar nilai peserta">
              <colgroup>
                <col style={{ width: "5%" }} />
                <col style={{ width: "18%" }} />
                <col style={{ width: "37%" }} />
                <col style={{ width: "18%" }} />
                <col style={{ width: "22%" }} />
              </colgroup>
              <thead>
                <tr>
                  <th scope="col">No</th>
                  <th scope="col">No. Registrasi</th>
                  <th scope="col">Peserta</th>
                  <th scope="col">Nilai</th>
                  <th scope="col">Peringkat</th>
                </tr>
              </thead>
              <tbody>
                {participants.length ? (
                  participants.map((participant, index) => {
                    const rank = ranks.get(participant.id);

                    return (
                      <tr key={participant.id}>
                        <td>{index + 1}.</td>
                        <td>{participant.registrationNumber}</td>
                        <td>
                          <span className="juara-peserta__name">{participant.name}</span>
                          <span className="juara-peserta__meta">
                            {participant.school} · {participant.level}
                          </span>
                        </td>
                        <td>
                          <input
                            className={`juara-score-input${
                              invalidIds.includes(participant.id)
                                ? " juara-score-input--invalid"
                                : ""
                            }`}
                            type="number"
                            min={0}
                            max={100}
                            step={1}
                            inputMode="numeric"
                            placeholder="0-100"
                            aria-label={`Nilai ${participant.name}`}
                            aria-invalid={invalidIds.includes(participant.id)}
                            value={scores[participant.id] ?? ""}
                            onChange={(event) =>
                              handleScoreChange(participant.id, event.target.value)
                            }
                          />
                        </td>
                        <td>
                          {rank ? (
                            <>
                              <span className="juara-rank">{rank}</span>
                              {rank <= BATAS_PERINGKAT_SERTIFIKAT ? (
                                <span className="badge badge--ok">Layak sertifikat</span>
                              ) : null}
                            </>
                          ) : (
                            <span className="juara-rank-empty">Belum berperingkat</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td className="nomination-table__empty" colSpan={5}>
                      Tidak ada peserta Confirmed untuk pilihan ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="juara-save">
            <button
              className="nomination-button nomination-button--primary"
              type="button"
              onClick={handleSave}
            >
              SIMPAN NILAI
            </button>
          </div>
        </section>
      ) : (
        <p className="juara-empty">
          Belum ada pilihan. Klik &quot;PILIH EVENT&quot; untuk menampilkan peserta.
        </p>
      )}

      <Modal open={selectionOpen} title={stepTitle} onClose={closeSelection}>
        <form
          className="juara-flow"
          onSubmit={(event) => {
            event.preventDefault();
            handleSelectionNext();
          }}
          noValidate
        >
          <p className="juara-flow__subtitle">{stepSubtitle}</p>

          {step === 1 ? (
            <FormField id="juara-event" label="Event" required error={selectionError}>
              <select
                className="form-field__control"
                id="juara-event"
                value={draftEvent}
                onChange={(event) => {
                  setDraftEvent(event.target.value as AdminNominationEvent | "");
                  setSelectionError("");
                }}
                required
              >
                <option value="">Pilih event</option>
                {events.map((event) => (
                  <option key={event} value={event}>
                    {event}
                  </option>
                ))}
              </select>
            </FormField>
          ) : null}

          {step === 2 ? (
            <FormField id="juara-subject" label="Pelajaran" required error={selectionError}>
              <select
                className="form-field__control"
                id="juara-subject"
                value={draftSubject}
                onChange={(event) => {
                  setDraftSubject(event.target.value as AdminJuaraSubject | "");
                  setSelectionError("");
                }}
                required
              >
                <option value="">Pilih pelajaran</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </FormField>
          ) : null}

          {step === 3 ? (
            <FormField id="juara-level" label="Jenjang" required error={selectionError}>
              <select
                className="form-field__control"
                id="juara-level"
                value={draftLevel}
                onChange={(event) => {
                  setDraftLevel(event.target.value as AdminJuaraJenjang | "");
                  setSelectionError("");
                }}
                required
              >
                <option value="">Pilih jenjang</option>
                {levels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </FormField>
          ) : null}

          <div className="nomination-form__actions">
            <button
              className="nomination-button nomination-button--outline"
              type="button"
              onClick={handleSelectionBack}
            >
              {step === 1 ? "BATAL" : "KEMBALI"}
            </button>
            <button className="nomination-button nomination-button--primary" type="submit">
              {step === 3 ? "INPUT" : "LANJUT"}
            </button>
          </div>
        </form>
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
