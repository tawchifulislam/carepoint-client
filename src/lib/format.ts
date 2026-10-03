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
