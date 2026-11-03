import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Container } from '@/components/container';
import { PageHeader } from '@/components/page-header';
import { ProtectedRoute } from '@/components/protected-route';
import { SECONDARY_LINK } from '@/lib/button-styles';
import { AppointmentList } from './appointment-list';

export default function DashboardPage() {
  return (
    <Container className="py-10 md:py-14">
      <ProtectedRoute>
        <PageHeader
          eyebrow="YOUR DASHBOARD"
          title="Your appointments"
          description="Manage upcoming visits and review past ones."
          actions={
            <Link href="/doctors" className={SECONDARY_LINK}>
              <Plus className="h-4 w-4" />
              Book another
            </Link>
          }
        />

        <AppointmentList />
      </ProtectedRoute>
    </Container>
  );
}
