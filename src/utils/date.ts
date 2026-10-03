const DAY_MS = 24 * 60 * 60 * 1000;

/** `Date` → `YYYY-MM-DD` in local time. */
export function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** `YYYY-MM-DD` → `YYYYMMDD` (NYT format). */
export function toCompactDate(isoDate: string): string {
  return isoDate.replaceAll('-', '');
}

export function daysAgo(days: number, now = new Date()): string {
  return toIsoDate(new Date(now.getTime() - days * DAY_MS));
}

/** Inclusive date-range check on an ISO timestamp. Missing bounds are open. */
export function isWithinRange(timestamp: string, from?: string, to?: string): boolean {
  const day = toIsoDate(new Date(timestamp));
  if (from && day < from) return false;
  if (to && day > to) return false;
  return true;
}

const relativeFormatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
const absoluteFormatter = new Intl.DateTimeFormat('en', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

/** "5 min ago", "yesterday", "Mar 4, 2026". */
export function formatRelative(timestamp: string, now = Date.now()): string {
  const date = new Date(timestamp);
  const diffSeconds = Math.round((date.getTime() - now) / 1000);
  const abs = Math.abs(diffSeconds);

  if (abs < 60) return 'just now';
  if (abs < 3600) return relativeFormatter.format(Math.round(diffSeconds / 60), 'minute');
  if (abs < 86_400) return relativeFormatter.format(Math.round(diffSeconds / 3600), 'hour');
  if (abs < 7 * 86_400) return relativeFormatter.format(Math.round(diffSeconds / 86_400), 'day');
  return absoluteFormatter.format(date);
}

export function formatLongDate(date = new Date()): string {
  return new Intl.DateTimeFormat('en', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function formatShortDate(isoDate: string): string {
  // Parse as local midnight so the label doesn't shift a day in negative UTC offsets.
  const [y, m, d] = isoDate.split('-').map(Number);
  return absoluteFormatter.format(new Date(y!, m! - 1, d!));
}
