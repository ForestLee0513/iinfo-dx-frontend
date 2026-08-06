// ISO date-time("2026-01-01T13:05:00Z")을 "2026.01.01 13:05" 형태로 로컬 시각에 맞춰 포맷한다.
export function formatSnapshotDate(iso: string) {
  const date = new Date(iso);
  const pad = (value: number) => String(value).padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}.${month}.${day} ${hours}:${minutes}`;
}
