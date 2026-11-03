import type { Metadata } from 'next';
import { Container } from '@/components/container';
import { PageHeader } from '@/components/page-header';
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
    <RequireRole requiredRole="SUPER_ADMIN">
      <Container className="py-10 md:py-14">
        <PageHeader
          eyebrow="PLATFORM"
          title="Platform admin"
          description="Review applications and keep an eye on the platform."
        />

        <div className="mt-7">
          <TabNav label="Platform admin" tabs={TABS} />
        </div>

        <div className="mt-8">{children}</div>
      </Container>
    </RequireRole>
  );
}
