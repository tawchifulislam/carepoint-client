import type { Metadata } from 'next';
import { Container } from '@/components/container';
import { ProtectedRoute } from '@/components/protected-route';
import { AppointmentStatus } from './appointment-status';

export const metadata: Metadata = {
  title: 'Your appointment | CarePoint',
  robots: { index: false },
};

export default async function AppointmentPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ status?: string }>;
}) {
  const { id } = await params;
  const { status } = await searchParams;

  return (
    <Container className="py-14">
      <ProtectedRoute>
        <AppointmentStatus appointmentId={id} justPaid={status === 'success'} />
      </ProtectedRoute>
    </Container>
  );
}
