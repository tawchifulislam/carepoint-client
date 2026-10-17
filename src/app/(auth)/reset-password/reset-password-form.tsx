'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LinkIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PasswordField } from '@/components/password-field';
import { authClient, SESSION_TOKEN_KEY } from '@/lib/auth-client';
import { PRIMARY_BUTTON } from '@/lib/button-styles';
import { useMe } from '@/lib/use-me';
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from '@/lib/validators/auth.schema';

function InvalidLink() {
  return (
    <div>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-tint text-amber">
        <LinkIcon className="h-6 w-6" />
      </div>

      <h1 className="mt-6 text-2xl font-bold tracking-tight text-ink">
        This link is not valid
      </h1>
      <p className="mt-2 text-sm text-ink-muted">
        Reset links work once and expire after 30 minutes. Request a new one to
        continue.
      </p>

      <Link href="/forgot-password" className={`${PRIMARY_BUTTON} mt-8`}>
        Request a new link
      </Link>
    </div>
  );
}

export function ResetPasswordForm({ token }: { token: string | null }) {
  const router = useRouter();
  const { refresh } = useMe();
  const [serverError, setServerError] = useState<string | null>(null);
  const [linkExpired, setLinkExpired] = useState(false);
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  async function onSubmit(values: ResetPasswordInput) {
    if (!token) return;

    setServerError(null);

    const { error } = await authClient.resetPassword({
      newPassword: values.password,
      token,
    });

    if (error) {
      if (error.status === 400 || error.status === 404) {
        setLinkExpired(true);
        return;
      }

      setServerError(
        error.message ?? 'Could not update your password. Please try again.',
      );
      return;
    }

    setDone(true);
    localStorage.removeItem(SESSION_TOKEN_KEY);
    await refresh();
    router.replace('/sign-in?reset=success');
  }

  if (!token || linkExpired) {
    return <InvalidLink />;
  }

  const busy = isSubmitting || done;

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-ink">
        Choose a new password
      </h1>
      <p className="mt-2 text-sm text-ink-muted">
        You will be signed out everywhere and asked to sign in again.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mt-8 space-y-5"
      >
        <PasswordField
          label="New password"
          autoComplete="new-password"
          hint="Use at least 8 characters."
          error={errors.password?.message}
          {...register('password')}
        />

        <PasswordField
          label="Confirm new password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
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
          className={`${PRIMARY_BUTTON} w-full`}
        >
          {busy ? 'Updating...' : 'Update password'}
        </button>
      </form>
    </div>
  );
}
