import type { Metadata } from 'next';
import { Container } from '@/components/container';
import { PageHeader } from '@/components/page-header';
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
    <RequireRole requiredRole="CLINIC_ADMIN">
      <Container className="py-10 md:py-14">
        <PageHeader
          eyebrow="YOUR CLINIC"
          title="Clinic admin"
          description="Track bookings and manage the doctors at your clinic."
        />

        <div className="mt-7">
          <TabNav label="Clinic admin" tabs={TABS} />
        </div>

        <div className="mt-8">{children}</div>
      </Container>
    </RequireRole>
  );
}
