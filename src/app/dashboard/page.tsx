import { Container } from '@/components/container';
import { ProtectedRoute } from '@/components/protected-route';
import { AppointmentList } from './appointment-list';

export default function DashboardPage() {
  return (
    <Container className="py-12">
      <ProtectedRoute>
        <h1 className="font-display text-2xl font-semibold text-ink">
          Your appointments
        </h1>
        <AppointmentList />
      </ProtectedRoute>
    </Container>
  );
}
