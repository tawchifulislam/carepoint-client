export interface Slot {
  start: string;
  end: string;
}

export interface DaySlots {
  date: string;
  slots: Slot[];
}
