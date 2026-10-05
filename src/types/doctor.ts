export interface PendingDoctor {
  id: string;
  specialty: string;
  consultationFee: number;
  user: { name: string; email: string };
  clinic: { id: string; name: string };
}
