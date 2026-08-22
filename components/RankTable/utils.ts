// last_played_at(ISO date-time) 표시용 포맷 — "YYYY.MM.DD".
export function formatPlayedDate(iso: string | null | undefined) {
  if (!iso) return "-";
  const date = new Date(iso);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}
