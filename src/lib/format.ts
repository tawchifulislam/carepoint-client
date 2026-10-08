const CLINIC_TIMEZONE = 'Asia/Dhaka';

export function formatSlotTime(iso: string): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: CLINIC_TIMEZONE,
  }).format(new Date(iso));
}

export function formatDayLabel(dateKey: string): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${dateKey}T00:00:00Z`));
}

export function chipDateLabel(
  dateKey: string,
  todayKey: string,
): { top: string; bottom: string } {
  const day = new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${dateKey}T00:00:00Z`));

  if (dateKey === todayKey) {
    return { top: 'Today', bottom: day };
  }

  const weekday = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    timeZone: 'UTC',
  }).format(new Date(`${dateKey}T00:00:00Z`));

  return { top: weekday, bottom: day };
}

export function getDhakaHour(iso: string): number {
  const hourStr = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    hour12: false,
    timeZone: CLINIC_TIMEZONE,
  }).format(new Date(iso));

  return parseInt(hourStr, 10) % 24;
}

function dhakaDateKey(date: Date): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: CLINIC_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

export function formatNextAvailable(
  iso: string,
  now: Date = new Date(),
): string {
  const slot = new Date(iso);
  const slotKey = dhakaDateKey(slot);
  const time = formatSlotTime(iso);

  if (slotKey === dhakaDateKey(now)) {
    return `Today, ${time}`;
  }

  if (slotKey === dhakaDateKey(new Date(now.getTime() + 24 * 60 * 60 * 1000))) {
    return `Tomorrow, ${time}`;
  }

  const day = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: CLINIC_TIMEZONE,
  }).format(slot);

  return `${day}, ${time}`;
}
