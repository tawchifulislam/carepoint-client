'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormField } from '@/components/form-field';
import { apiFetch } from '@/lib/api';
import { PRIMARY_BUTTON } from '@/lib/button-styles';
import { useMe } from '@/lib/use-me';
import { createClinicSchema, type CreateClinicInput } from '@/lib/validators/clinic.schema';

export function ClinicApplicationForm() {
  const router = useRouter();
  const { refresh } = useMe();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateClinicInput>({ resolver: zodResolver(createClinicSchema) });

  async function onSubmit(values: CreateClinicInput) {
    setServerError(null);

    try {
      const response = await apiFetch('/api/clinics', {
        method: 'POST',
        body: JSON.stringify(values),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setServerError(
          typeof data.error === 'string' ? data.error : 'Could not submit your clinic. Please try again.',
        );
        return;
      }

      await refresh();
      router.push('/onboarding/pending');
    } catch {
      setServerError('Something went wrong. Please try again.');
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-5 rounded-xl border border-border bg-surface p-6 shadow-card sm:p-8"
    >
      <FormField
        label="Clinic name"
        autoComplete="organization"
        placeholder="Riverside Clinic"
        error={errors.name?.message}
        {...register('name')}
      />

      <FormField
        label="Address"
        autoComplete="street-address"
        placeholder="Street, area, city"
        hint="Patients see this on your doctors' profiles."
        error={errors.address?.message}
        {...register('address')}
      />

      {serverError && (
        <p role="alert" className="rounded-md border border-red bg-red-tint px-4 py-3 text-sm text-red">
          {serverError}
        </p>
      )}

      <button type="submit" disabled={isSubmitting} className={`${PRIMARY_BUTTON} w-full`}>
        {isSubmitting ? 'Submitting...' : 'Submit for review'}
      </button>
    </form>
  );
}