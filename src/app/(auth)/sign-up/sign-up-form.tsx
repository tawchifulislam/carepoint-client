'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormField } from '@/components/form-field';
import { GoogleAuthSection } from '@/components/google-auth-section';
import { PasswordField } from '@/components/password-field';
import { authClient } from '@/lib/auth-client';
import { signInHref } from '@/lib/auth-redirect';
import { useMe } from '@/lib/use-me';
import { signUpSchema, type SignUpInput } from '@/lib/validators/auth.schema';

export function SignUpForm({ next }: { next: string }) {
  const router = useRouter();
  const { me, loading, refresh } = useMe();
  const [serverError, setServerError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpInput>({ resolver: zodResolver(signUpSchema) });

  useEffect(() => {
    if (!loading && me) {
      router.replace(next);
    }
  }, [loading, me, next, router]);

  async function onSubmit(values: SignUpInput) {
    setServerError(null);

    const { error } = await authClient.signUp.email(values);

    if (error) {
      setServerError(
        error.message ?? 'Could not create your account. Please try again.',
      );
      return;
    }

    const account = await refresh();

    if (!account) {
      setServerError(
        'Your account was created, but we could not sign you in. Please sign in.',
      );
      return;
    }

    setDone(true);
  }

  const busy = isSubmitting || done;

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-ink">
        Create your account
      </h1>
      <p className="mt-2 text-sm text-ink-muted">
        Book appointments and keep every visit in one place.
      </p>

      <div className="mt-8">
        <GoogleAuthSection next={next} />

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-5"
        >
          <FormField
            label="Full name"
            autoComplete="name"
            placeholder="Your name"
            error={errors.name?.message}
            {...register('name')}
          />

          <FormField
            label="Email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <PasswordField
            label="Password"
            autoComplete="new-password"
            hint="Use at least 8 characters."
            error={errors.password?.message}
            {...register('password')}
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
            disabled={busy}
            className="w-full rounded-md bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover active:scale-[0.99] disabled:opacity-60"
          >
            {busy ? 'Creating account...' : 'Create account'}
          </button>
        </form>
      </div>

      <p className="mt-8 text-sm text-ink-muted">
        Already have an account?{' '}
        <Link
          href={signInHref(next)}
          className="font-semibold text-primary hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
