import type { Metadata } from 'next';
import { Container } from '@/components/container';
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
    <RequireRole role="DOCTOR">
      <Container className="py-14">
        <h1 className="text-3xl font-bold tracking-tight text-ink md:text-4xl">
          Doctor portal
        </h1>
        <p className="mt-2 text-ink-muted">
          Manage your schedule, availability, and time off.
        </p>

        <div className="mt-8">
          <TabNav label="Doctor portal" tabs={TABS} />
        </div>

        <div className="mt-8">{children}</div>
      </Container>
    </RequireRole>
  );
}
