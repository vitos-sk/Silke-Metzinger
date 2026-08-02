const LONG_DATE = new Intl.DateTimeFormat("de-DE", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Europe/Zurich",
});

const SHORT_DATE = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "Europe/Zurich",
});

/** ISO-Datum ("2026-09-12") als "12. September 2026". */
export function formatEventDate(iso: string): string {
  const date = new Date(`${iso}T12:00:00Z`);
  if (Number.isNaN(date.getTime())) return iso;
  return LONG_DATE.format(date);
}

export function formatTimestamp(timestamp: number): string {
  return LONG_DATE.format(new Date(timestamp));
}

export function formatTimestampShort(timestamp: number): string {
  return SHORT_DATE.format(new Date(timestamp));
}

/** Wert für <input type="datetime-local"> in lokaler Zeit. */
export function toDateTimeLocalValue(timestamp: number): string {
  const date = new Date(timestamp);
  const offsetMs = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}
