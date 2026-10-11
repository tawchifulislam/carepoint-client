export const WEEKDAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
export const SHORT_WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function toMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return (hours ?? 0) * 60 + (minutes ?? 0);
}

export function formatClock(time: string): string {
  const total = toMinutes(time);
  const hour24 = Math.floor(total / 60) % 24;
  const minute = total % 60;
  const suffix = hour24 >= 12 ? 'PM' : 'AM';
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;

  return `${hour12}:${String(minute).padStart(2, '0')} ${suffix}`;
}

export function countSlots(
  startTime: string,
  endTime: string,
  slotMin: number,
  bufferMin: number,
): number {
  const windowMin = toMinutes(endTime) - toMinutes(startTime);

  if (windowMin < slotMin || slotMin <= 0) {
    return 0;
  }

  return Math.floor((windowMin - slotMin) / (slotMin + bufferMin)) + 1;
}
