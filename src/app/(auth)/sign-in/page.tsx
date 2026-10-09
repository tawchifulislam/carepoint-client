import type { Metadata } from 'next';
import { safeNextPath } from '@/lib/auth-redirect';
import { SignInForm } from './sign-in-form';

export const metadata: Metadata = { title: 'Sign in | CarePoint' };

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return <SignInForm next={safeNextPath(next)} />;
}
