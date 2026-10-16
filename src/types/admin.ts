export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type DashboardRange = '7d' | '30d' | '90d' | 'all';

export interface ReviewClinic {
  id: string;
  name: string;
  address: string;
  approvalStatus: ApprovalStatus;
  createdAt: string;
  doctorCount: number;
  adminUser: { name: string; email: string };
}

export interface ReviewDoctor {
  id: string;
  specialty: string;
  consultationFee: number;
  approvalStatus: ApprovalStatus;
  createdAt: string;
  user: { name: string; email: string };
  clinic: { id: string; name: string };
}

export interface PlatformMetrics {
  approvedClinics: number;
  approvedDoctors: number;
  patients: number;
  totalBookings: number;
  totalRevenue: number;
  pendingClinics: number;
  pendingDoctors: number;
}

export interface DashboardPoint {
  date: string;
  revenue: number;
  bookings: number;
}

export interface DashboardDoctor {
  doctorId: string;
  doctorName: string;
  bookingCount: number;
  revenue: number;
}

export interface ClinicDashboard {
  clinicId: string;
  clinicName: string;
  address: string;
  range: DashboardRange;
  totals: {
    revenue: number;
    bookings: number;
    activeDoctors: number;
    pendingDoctors: number;
  };
  doctors: DashboardDoctor[];
  series: DashboardPoint[];
}
