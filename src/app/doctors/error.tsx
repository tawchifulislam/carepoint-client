'use client';

import Link from 'next/link';
import { Container } from '@/components/container';

export default function DoctorsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Container className="py-16 text-center">
      <h1 className="font-display text-xl font-semibold text-ink">
        Could not load doctors
      </h1>
      <p className="mt-2 text-sm text-ink-muted">
        Something went wrong while searching. Please try again.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <button
          onClick={reset}
          className="rounded-sm bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-sm border border-border px-4 py-2 text-sm font-medium text-ink hover:bg-paper"
        >
          Back home
        </Link>
      </div>
    </Container>
  );
}
