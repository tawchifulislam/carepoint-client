import { ProtectedRoute } from '@/components/protected-route';
import { Container } from '@/components/container';
import { AppointmentStatus } from './appointment-status';

export default async function AppointmentStatusPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Container>
      <ProtectedRoute>
        <AppointmentStatus appointmentId={id} />
      </ProtectedRoute>
    </Container>
  );
}
