'use client';

import { authClient } from '@/lib/auth-client';

export function GoogleSignInButton() {
  return (
    <button
      type="button"
      onClick={() =>
        authClient.signIn.social({ provider: 'google', callbackURL: '/' })
      }
      className="w-full rounded border px-3 py-2 text-sm font-medium hover:bg-gray-50"
    >
      Continue with Google
    </button>
  );
}
