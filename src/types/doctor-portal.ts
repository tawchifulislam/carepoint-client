import type { AppointmentStatus } from './appointment';

export interface AvailabilityRule {
  id: string;
  weekday: number;
  startTime: string;
  endTime: string;
  slotDurationMin: number;
  bufferMin: number;
}

export interface LeaveDay {
  id: string;
  date: string;
}

export interface DoctorAppointment {
  id: string;
  slotStart: string;
  slotEnd: string;
  status: AppointmentStatus;
  patient: { name: string };
}
