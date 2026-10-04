import { Container } from '@/components/container';
import { ProtectedRoute } from '@/components/protected-route';
import { ReschedulePicker } from './reschedule-picker';

export default async function ReschedulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Container className="py-12">
      <ProtectedRoute>
        <h1 className="font-display text-2xl font-semibold text-ink">
          Reschedule appointment
        </h1>
        <div className="mt-6">
          <ReschedulePicker appointmentId={id} />
        </div>
      </ProtectedRoute>
    </Container>
  );
}
