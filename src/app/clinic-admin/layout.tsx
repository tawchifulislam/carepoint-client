import type { Metadata } from 'next';
import { Container } from '@/components/container';
import { RequireRole } from '@/components/require-role';
import { TabNav } from '@/components/tab-nav';

export const metadata: Metadata = {
  title: 'Clinic admin | CarePoint',
  robots: { index: false },
};

const TABS = [
  { href: '/clinic-admin', label: 'Overview', exact: true },
  { href: '/clinic-admin/doctors', label: 'Doctors' },
];

export default function ClinicAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireRole role="CLINIC_ADMIN">
      <Container className="py-14">
        <h1 className="text-3xl font-bold tracking-tight text-ink md:text-4xl">
          Clinic admin
        </h1>
        <p className="mt-2 text-ink-muted">
          Track bookings and manage the doctors at your clinic.
        </p>

        <div className="mt-8">
          <TabNav label="Clinic admin" tabs={TABS} />
        </div>

        <div className="mt-8">{children}</div>
      </Container>
    </RequireRole>
  );
}
