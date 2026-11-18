export interface RankingEntry {
  id: number;
  score: number | null;
}

/**
 * Memberi peringkat gaya kompetisi: nilai tertinggi = 1, nilai sama = peringkat
 * sama, lalu peringkat berikutnya melompat (1, 2, 2, 4).
 * Peserta tanpa nilai tidak dimasukkan ke hasil (belum berperingkat).
 */
export function computeRanks(entries: RankingEntry[]): Map<number, number> {
  const scored = entries
    .filter(
      (entry): entry is RankingEntry & { score: number } =>
        typeof entry.score === "number" && Number.isFinite(entry.score),
    )
    .sort((left, right) => right.score - left.score);

  const ranks = new Map<number, number>();
  let previousScore: number | null = null;
  let previousRank = 0;

  scored.forEach((entry, index) => {
    const rank = entry.score === previousScore ? previousRank : index + 1;
    ranks.set(entry.id, rank);
    previousScore = entry.score;
    previousRank = rank;
  });

  return ranks;
}
