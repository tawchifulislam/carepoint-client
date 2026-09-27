'use client';

import { createAuthClient } from 'better-auth/react';
import { jwtClient } from 'better-auth/client/plugins';

function readStoredSessionToken() {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('bearer_token') ?? '';
}

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  plugins: [jwtClient()],
  fetchOptions: {
    auth: {
      type: 'Bearer',
      token: readStoredSessionToken,
    },
    onSuccess: ctx => {
      const sessionToken = ctx.response.headers.get('set-auth-token');
      if (sessionToken) {
        localStorage.setItem('bearer_token', sessionToken);
      }
    },
  },
});

export const { useSession, signIn, signUp, signOut } = authClient;
