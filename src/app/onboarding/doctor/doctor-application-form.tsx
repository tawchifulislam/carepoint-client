'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormField } from '@/components/form-field';
import { FormSelect } from '@/components/form-select';
import { FormTextarea } from '@/components/form-textarea';
import { apiFetch } from '@/lib/api';
import { PRIMARY_BUTTON } from '@/lib/button-styles';
import { canonicalSpecialty, SPECIALTIES } from '@/lib/specialties';
import { useMe } from '@/lib/use-me';
import {
  doctorApplicationSchema,
  type DoctorApplicationInput,
} from '@/lib/validators/doctor.schema';
import type { ClinicSummary } from '@/types/clinic';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const BIO_LIMIT = 1000;

export function DoctorApplicationForm() {
  const router = useRouter();
  const { refresh } = useMe();
  const [clinics, setClinics] = useState<ClinicSummary[] | null>(null);
  const [clinicsFailed, setClinicsFailed] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<DoctorApplicationInput>({
    resolver: zodResolver(doctorApplicationSchema),
    defaultValues: {
      clinicId: '',
      specialty: '',
      consultationFee: '',
      bio: '',
    },
  });

  const bioLength = (watch('bio') ?? '').length;

  const loadClinics = useCallback(async () => {
    setClinicsFailed(false);

    try {
      const response = await fetch(`${API_URL}/api/clinics`);

      if (!response.ok) {
        throw new Error('Request failed');
      }

      setClinics(await response.json());
    } catch {
      setClinicsFailed(true);
    }
  }, []);

  useEffect(() => {
    loadClinics();
  }, [loadClinics]);

  async function onSubmit(values: DoctorApplicationInput) {
    setServerError(null);

    try {
      const response = await apiFetch('/api/doctors', {
        method: 'POST',
        body: JSON.stringify({
          clinicId: values.clinicId,
          specialty: canonicalSpecialty(values.specialty),
          consultationFee: Number(values.consultationFee),
          bio: values.bio?.trim() || undefined,
        }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setServerError(
          typeof data.error === 'string'
            ? data.error
            : 'Could not submit your application. Please try again.',
        );
        return;
      }

      await refresh();
      router.push('/onboarding/pending');
    } catch {
      setServerError('Something went wrong. Please try again.');
    }
  }

  if (clinicsFailed) {
    return (
      <div className="rounded-xl border border-border bg-surface p-8 text-center shadow-card">
        <p className="font-semibold text-ink">Could not load clinics</p>
        <p className="mt-1 text-sm text-ink-muted">
          Check your connection and try again.
        </p>
        <button onClick={loadClinics} className={`${PRIMARY_BUTTON} mt-5`}>
          Try again
        </button>
      </div>
    );
  }

  if (clinics !== null && clinics.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-8 text-center">
        <p className="font-semibold text-ink">
          No clinics are accepting doctors yet
        </p>
        <p className="mt-1 text-sm text-ink-muted">
          Clinics appear here once they have been approved.
        </p>
        <Link
          href="/for-clinics"
          className="mt-4 inline-block text-sm font-semibold text-primary hover:underline"
        >
          Learn about registering a clinic
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-5 rounded-xl border border-border bg-surface p-6 shadow-card sm:p-8"
    >
      <FormSelect
        label="Clinic"
        disabled={clinics === null}
        error={errors.clinicId?.message}
        {...register('clinicId')}
      >
        <option value="">
          {clinics === null ? 'Loading clinics...' : 'Select a clinic'}
        </option>
        {clinics?.map(clinic => (
          <option key={clinic.id} value={clinic.id}>
            {clinic.name} &middot; {clinic.address}
          </option>
        ))}
      </FormSelect>

      <FormField
        label="Specialty"
        list="specialty-options"
        autoComplete="off"
        placeholder="Cardiology"
        error={errors.specialty?.message}
        {...register('specialty')}
      />
      <datalist id="specialty-options">
        {SPECIALTIES.map(specialty => (
          <option key={specialty} value={specialty} />
        ))}
      </datalist>

      <FormField
        label="Consultation fee"
        inputMode="decimal"
        placeholder="45"
        autoComplete="off"
        trailing={
          <span className="px-2 font-mono text-xs text-ink-muted">USD</span>
        }
        error={errors.consultationFee?.message}
        {...register('consultationFee')}
      />

      <FormTextarea
        label="Short bio"
        optional
        rows={4}
        placeholder="Your experience and areas of focus"
        hint={`${bioLength}/${BIO_LIMIT}`}
        error={errors.bio?.message}
        {...register('bio')}
      />

      {serverError && (
        <p
          role="alert"
          className="rounded-md border border-red bg-red-tint px-4 py-3 text-sm text-red"
        >
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting || clinics === null}
        className={`${PRIMARY_BUTTON} w-full`}
      >
        {isSubmitting ? 'Submitting...' : 'Submit application'}
      </button>
    </form>
  );
}
