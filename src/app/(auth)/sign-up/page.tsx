import type { Metadata } from 'next';
import { safeNextPath } from '@/lib/auth-redirect';
import { SignUpForm } from './sign-up-form';

export const metadata: Metadata = { title: 'Create account | CarePoint' };

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return <SignUpForm next={safeNextPath(next)} />;
}
