'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Container } from '@/components/container';
import { RequireRole } from '@/components/require-role';

const TABS = [
  { href: '/clinic-admin', label: 'Overview' },
  { href: '/clinic-admin/doctors', label: 'Doctors' },
];

export default function ClinicAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <RequireRole role="CLINIC_ADMIN">
      <Container className="py-12">
        <h1 className="font-display text-2xl font-semibold text-ink">
          Clinic admin
        </h1>

        <div className="mt-6 flex gap-2 border-b border-border">
          {TABS.map(tab => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`border-b-2 px-4 py-2 text-sm font-medium ${
                pathname === tab.href
                  ? 'border-primary text-primary'
                  : 'border-transparent text-ink-muted hover:text-ink'
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        <div className="mt-6">{children}</div>
      </Container>
    </RequireRole>
  );
}
