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
