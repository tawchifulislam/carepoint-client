'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Container } from '@/components/container';
import { ProtectedRoute } from '@/components/protected-route';
import { apiFetch } from '@/lib/api';
import {
  createClinicSchema,
  type CreateClinicInput,
} from '@/lib/validators/clinic.schema';

function ClinicApplyForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateClinicInput>({ resolver: zodResolver(createClinicSchema) });

  async function onSubmit(values: CreateClinicInput) {
    setServerError(null);

    const response = await apiFetch('/api/clinics', {
      method: 'POST',
      body: JSON.stringify(values),
    });
    const data = await response.json();

    if (!response.ok) {
      setServerError(data.error ?? 'Could not submit your clinic.');
      return;
    }

    router.push('/onboarding/pending');
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto mt-8 max-w-md space-y-4"
    >
      <div>
        <label className="text-sm font-medium text-ink">Clinic name</label>
        <input
          {...register('name')}
          className="mt-1 w-full rounded-sm border border-border bg-surface px-3 py-2 text-sm text-ink"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium text-ink">Address</label>
        <input
          {...register('address')}
          className="mt-1 w-full rounded-sm border border-border bg-surface px-3 py-2 text-sm text-ink"
        />
        {errors.address && (
          <p className="mt-1 text-sm text-red">{errors.address.message}</p>
        )}
      </div>

      {serverError && <p className="text-sm text-red">{serverError}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-sm bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
      >
        {isSubmitting ? 'Submitting...' : 'Register clinic'}
      </button>
    </form>
  );
}

export default function ClinicOnboardingPage() {
  return (
    <Container className="py-12">
      <ProtectedRoute>
        <h1 className="font-display text-2xl font-semibold text-ink">
          Register your clinic
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          A CarePoint team member will review your submission before it goes
          live.
        </p>
        <ClinicApplyForm />
      </ProtectedRoute>
    </Container>
  );
}
