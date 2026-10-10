import type { Metadata } from 'next';
import { Container } from '@/components/container';
import { ProtectedRoute } from '@/components/protected-route';
import { ReschedulePicker } from './reschedule-picker';

export const metadata: Metadata = {
  title: 'Reschedule appointment | CarePoint',
  robots: { index: false },
};

export default async function ReschedulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Container className="py-14">
      <ProtectedRoute>
        <ReschedulePicker appointmentId={id} />
      </ProtectedRoute>
    </Container>
  );
}
