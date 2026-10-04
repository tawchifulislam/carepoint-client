'use client';

import { z } from 'zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Container } from '@/components/container';
import { ProtectedRoute } from '@/components/protected-route';
import { apiFetch } from '@/lib/api';
import {
  createDoctorSchema,
  type CreateDoctorInput,
} from '@/lib/validators/doctor.schema';

type DoctorFormValues = z.input<typeof createDoctorSchema>;

interface Clinic {
  id: string;
  name: string;
}

function DoctorApplyForm() {
  const router = useRouter();
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DoctorFormValues>({ resolver: zodResolver(createDoctorSchema) });

  useEffect(() => {
    async function loadClinics() {
      const response = await apiFetch('/api/clinics');
      setClinics(await response.json());
    }
    loadClinics();
  }, []);

  async function onSubmit(values: DoctorFormValues) {
    setServerError(null);

    const response = await apiFetch('/api/doctors', {
      method: 'POST',
      body: JSON.stringify(values),
    });
    const data = await response.json();

    if (!response.ok) {
      setServerError(data.error ?? 'Could not submit your application.');
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
        <label className="text-sm font-medium text-ink">Clinic</label>
        <select
          {...register('clinicId')}
          className="mt-1 w-full rounded-sm border border-border bg-surface px-3 py-2 text-sm text-ink"
        >
          <option value="">Select a clinic</option>
          {clinics.map(clinic => (
            <option key={clinic.id} value={clinic.id}>
              {clinic.name}
            </option>
          ))}
        </select>
        {errors.clinicId && (
          <p className="mt-1 text-sm text-red">Please select a clinic</p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium text-ink">Specialty</label>
        <input
          {...register('specialty')}
          className="mt-1 w-full rounded-sm border border-border bg-surface px-3 py-2 text-sm text-ink"
        />
        {errors.specialty && (
          <p className="mt-1 text-sm text-red">{errors.specialty.message}</p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium text-ink">
          Consultation fee (USD)
        </label>
        <input
          type="number"
          step="0.01"
          {...register('consultationFee', { valueAsNumber: true })}
          className="mt-1 w-full rounded-sm border border-border bg-surface px-3 py-2 text-sm text-ink"
        />
        {errors.consultationFee && (
          <p className="mt-1 text-sm text-red">
            {errors.consultationFee.message}
          </p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium text-ink">Bio (optional)</label>
        <textarea
          {...register('bio')}
          rows={4}
          className="mt-1 w-full rounded-sm border border-border bg-surface px-3 py-2 text-sm text-ink"
        />
        {errors.bio && (
          <p className="mt-1 text-sm text-red">{errors.bio.message}</p>
        )}
      </div>

      {serverError && <p className="text-sm text-red">{serverError}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-sm bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
      >
        {isSubmitting ? 'Submitting...' : 'Apply as a doctor'}
      </button>
    </form>
  );
}

export default function DoctorOnboardingPage() {
  return (
    <Container className="py-12">
      <ProtectedRoute>
        <h1 className="font-display text-2xl font-semibold text-ink">
          Apply as a doctor
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Your clinic admin will review and approve your application.
        </p>
        <DoctorApplyForm />
      </ProtectedRoute>
    </Container>
  );
}
