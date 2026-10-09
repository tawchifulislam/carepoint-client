import type { Metadata } from 'next';
import { Container } from '@/components/container';
import { ProtectedRoute } from '@/components/protected-route';

export const metadata: Metadata = { robots: { index: false } };

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container className="py-14">
      <ProtectedRoute>
        <div className="mx-auto w-full max-w-xl">{children}</div>
      </ProtectedRoute>
    </Container>
  );
}
