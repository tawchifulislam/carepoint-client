'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormField } from '@/components/form-field';
import { authClient } from '@/lib/auth-client';
import { PRIMARY_BUTTON } from '@/lib/button-styles';
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from '@/lib/validators/auth.schema';

const RESEND_COOLDOWN_SECONDS = 30;

export function ForgotPasswordForm() {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [resending, setResending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  useEffect(() => {
    if (cooldown <= 0) return;

    const id = setTimeout(() => setCooldown(value => value - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  async function requestLink(email: string): Promise<boolean> {
    setServerError(null);

    const { error } = await authClient.requestPasswordReset({
      email,
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setServerError(
        error.status === 429
          ? 'Too many attempts. Please wait a few minutes and try again.'
          : 'We could not send the email. Please try again.',
      );
      return false;
    }

    setSentTo(email);
    setCooldown(RESEND_COOLDOWN_SECONDS);
    return true;
  }

  async function onSubmit(values: ForgotPasswordInput) {
    await requestLink(values.email);
  }

  async function resend() {
    if (!sentTo) return;

    setResending(true);
    await requestLink(sentTo);
    setResending(false);
  }

  if (sentTo) {
    return (
      <div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-tint text-primary">
          <Mail className="h-6 w-6" />
        </div>

        <h1 className="mt-6 text-2xl font-bold tracking-tight text-ink">
          Check your inbox
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          If an account exists for{' '}
          <span className="font-medium text-ink">{sentTo}</span>, we sent a link
          to reset the password. It expires in 30 minutes.
        </p>
        <p className="mt-3 text-sm text-ink-muted">
          Nothing there? Check your spam folder.
        </p>

        {serverError && (
          <p
            role="alert"
            className="mt-5 rounded-md border border-red bg-red-tint px-4 py-3 text-sm text-red"
          >
            {serverError}
          </p>
        )}

        <button
          onClick={resend}
          disabled={cooldown > 0 || resending}
          className="mt-6 rounded-md border border-border bg-surface px-4 py-3 text-sm font-semibold text-ink transition-colors hover:border-primary disabled:opacity-60"
        >
          {resending
            ? 'Sending...'
            : cooldown > 0
              ? `Resend in ${cooldown}s`
              : 'Resend the email'}
        </button>

        <p className="mt-8 text-sm">
          <Link
            href="/sign-in"
            className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-ink">
        Forgot your password?
      </h1>
      <p className="mt-2 text-sm text-ink-muted">
        Enter your email and we will send you a link to choose a new one.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mt-8 space-y-5"
      >
        <FormField
          label="Email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email')}
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
          disabled={isSubmitting}
          className={`${PRIMARY_BUTTON} w-full`}
        >
          {isSubmitting ? 'Sending...' : 'Send reset link'}
        </button>
      </form>

      <p className="mt-8 text-sm">
        <Link
          href="/sign-in"
          className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
