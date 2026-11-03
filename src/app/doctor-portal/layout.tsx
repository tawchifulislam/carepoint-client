import type { Metadata } from 'next';
import { Container } from '@/components/container';
import { PageHeader } from '@/components/page-header';
import { RequireRole } from '@/components/require-role';
import { TabNav } from '@/components/tab-nav';

export const metadata: Metadata = {
  title: 'Doctor portal | CarePoint',
  robots: { index: false },
};

const TABS = [
  { href: '/doctor-portal/appointments', label: 'Appointments' },
  { href: '/doctor-portal/availability', label: 'Availability' },
  { href: '/doctor-portal/leave-days', label: 'Leave days' },
];

export default function DoctorPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireRole requiredRole="DOCTOR">
      <Container className="py-10 md:py-14">
        <PageHeader
          eyebrow="YOUR WORKSPACE"
          title="Doctor portal"
          description="Manage your schedule, availability, and time off."
        />

        <div className="mt-7">
          <TabNav label="Doctor portal" tabs={TABS} />
        </div>

        <div className="mt-8">{children}</div>
      </Container>
    </RequireRole>
  );
}
