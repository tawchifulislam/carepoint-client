import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Container } from '@/components/container';
import { ProtectedRoute } from '@/components/protected-route';
import { AppointmentList } from './appointment-list';

export default function DashboardPage() {
  return (
    <Container className="py-14">
      <ProtectedRoute>
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-ink md:text-4xl">
              Your appointments
            </h1>
            <p className="mt-2 text-ink-muted">
              Manage upcoming visits and review past ones.
            </p>
          </div>
          <Link
            href="/doctors"
            className="hidden shrink-0 items-center gap-2 rounded-sm border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-primary sm:inline-flex"
          >
            <Plus className="h-4 w-4" />
            Book another
          </Link>
        </div>

        <AppointmentList />
      </ProtectedRoute>
    </Container>
  );
}
