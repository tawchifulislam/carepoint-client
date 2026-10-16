import type { Metadata } from 'next';
import { Container } from '@/components/container';
import { RequireRole } from '@/components/require-role';
import { TabNav } from '@/components/tab-nav';

export const metadata: Metadata = {
  title: 'Platform admin | CarePoint',
  robots: { index: false },
};

const TABS = [
  { href: '/super-admin', label: 'Overview', exact: true },
  { href: '/super-admin/clinics', label: 'Clinics' },
  { href: '/super-admin/doctors', label: 'Doctors' },
];

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireRole role="SUPER_ADMIN">
      <Container className="py-14">
        <h1 className="text-3xl font-bold tracking-tight text-ink md:text-4xl">
          Platform admin
        </h1>
        <p className="mt-2 text-ink-muted">
          Review applications and keep an eye on the platform.
        </p>

        <div className="mt-8">
          <TabNav label="Platform admin" tabs={TABS} />
        </div>

        <div className="mt-8">{children}</div>
      </Container>
    </RequireRole>
  );
}
