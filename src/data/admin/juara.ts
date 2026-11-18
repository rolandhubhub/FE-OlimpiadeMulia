import type {
  AdminJuaraJenjang,
  AdminJuaraParticipant,
  AdminJuaraSubject,
  AdminNominationEvent,
} from "@/types/admin";

interface JuaraGroup {
  event: AdminNominationEvent;
  subject: AdminJuaraSubject;
  level: AdminJuaraJenjang;
  count: number;
  startId: number;
  startRegistration: number;
  scored: number;
}

const firstNames = [
  "Aisyah",
  "Bagas",
  "Citra",
  "Daffa",
  "Eka",
  "Fikri",
  "Zahra",
  "Dimas",
  "Aulia",
  "Rizky",
  "Nabila",
  "Salsabila",
  "Bima",
  "Intan",
  "Yusuf",
  "Nadia",
  "Farhan",
  "Laila",
  "Raffi",
  "Kirana",
];

const lastNames = [
  "Putri",
  "Pratama",
  "Nabila",
  "Rahman",
  "Sari",
  "Ramadhan",
  "Maulana",
  "Prasetyo",
  "Ramadhani",
  "Hidayat",
  "Permata",
  "Wijaya",
  "Santoso",
  "Kusuma",
  "Anggraini",
  "Saputra",
  "Halim",
];

const schools: Record<AdminJuaraJenjang, string[]> = {
  TK: ["TK Pertiwi 1 Surabaya", "TK Al-Hikmah Bandung", "TK Tunas Harapan Semarang"],
  SD: [
    "SDN 1 Yogyakarta",
    "SDN 5 Jakarta",
    "SD Muhammadiyah 2 Malang",
    "SD Kartika Surabaya",
  ],
  SMP: [
    "SMPN 5 Surabaya",
    "SMPN 1 Malang",
    "SMPN 2 Kediri",
    "SMP Al-Azhar Jakarta",
  ],
  SMA: ["SMAN 1 Surabaya", "SMAN 3 Bandung", "SMA Muhammadiyah 1 Semarang"],
};

const groups: JuaraGroup[] = [
  // KMSI dibuat 34 peserta pada satu kombinasi supaya batas 30 peringkat terlihat.
  {
    event: "KMSI",
    subject: "Sains",
    level: "SD",
    count: 34,
    startId: 1,
    startRegistration: 40,
    scored: 32,
  },
  {
    event: "KMSI",
    subject: "Matematika",
    level: "SMP",
    count: 6,
    startId: 35,
    startRegistration: 74,
    scored: 4,
  },
  {
    event: "KMSI",
    subject: "Bahasa Inggris",
    level: "TK",
    count: 4,
    startId: 41,
    startRegistration: 80,
    scored: 3,
  },
  {
    event: "JSO",
    subject: "Matematika",
    level: "SMP",
    count: 4,
    startId: 45,
    startRegistration: 84,
    scored: 3,
  },
  {
    event: "JSO",
    subject: "Sains",
    level: "SMA",
    count: 4,
    startId: 49,
    startRegistration: 88,
    scored: 2,
  },
  {
    event: "IMC",
    subject: "Bahasa Inggris",
    level: "SD",
    count: 4,
    startId: 53,
    startRegistration: 92,
    scored: 3,
  },
  {
    event: "IMC",
    subject: "Matematika",
    level: "SMP",
    count: 4,
    startId: 57,
    startRegistration: 96,
    scored: 2,
  },
];

function scoreFor(index: number, scoredCount: number): number | null {
  if (index >= scoredCount) return null;

  // Nilai menurun dengan satu nilai kembar di awal agar peringkat 1, 2, 2, 4 terlihat.
  return index === 2 ? 98 : 100 - index * 2;
}

function buildGroup(group: JuaraGroup): AdminJuaraParticipant[] {
  const levelSchools = schools[group.level];

  return Array.from({ length: group.count }, (_value, index) => {
    const id = group.startId + index;
    const firstName = firstNames[(group.startId + index) % firstNames.length];
    const lastName = lastNames[(group.startId + index * 7) % lastNames.length];

    return {
      id,
      registrationNumber: `REG-2026-${String(group.startRegistration + index).padStart(6, "0")}`,
      name: `${firstName} ${lastName}`,
      school: levelSchools[(group.startId + index) % levelSchools.length],
      level: group.level,
      event: group.event,
      subject: group.subject,
      status: "Confirmed",
      score: scoreFor(index, group.scored),
    };
  });
}

export const initialAdminJuaraParticipants: AdminJuaraParticipant[] = groups.flatMap(buildGroup);
