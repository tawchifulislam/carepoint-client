export type AppointmentStatus =
  | 'PENDING_PAYMENT'
  | 'BOOKED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW';

export interface PatientAppointment {
  id: string;
  status: AppointmentStatus;
  slotStart: string;
  slotEnd: string;
  doctor: {
    id: string;
    specialty: string;
    user: { name: string };
    clinic: { name: string; address: string };
  };
}
