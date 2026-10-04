import Link from 'next/link';
import { Clock } from 'lucide-react';
import { Container } from '@/components/container';
import { ProtectedRoute } from '@/components/protected-route';

export default function OnboardingPendingPage() {
  return (
    <Container className="py-16">
      <ProtectedRoute>
        <div className="flex flex-col items-center gap-3 text-center">
          <Clock className="h-10 w-10 text-amber" />
          <h1 className="font-display text-2xl font-semibold text-ink">
            Application under review
          </h1>
          <p className="max-w-sm text-sm text-ink-muted">
            We&apos;ll notify you once your submission has been approved.
          </p>
          <Link href="/" className="mt-2 text-sm text-primary hover:underline">
            Back to home
          </Link>
        </div>
      </ProtectedRoute>
    </Container>
  );
}
