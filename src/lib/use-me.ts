'use client';

import { createContext, useContext } from 'react';

export interface MeResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  image: string | null;
  doctor: { id: string; approvalStatus: string } | null;
  adminOfClinic: { id: string; approvalStatus: string } | null;
}

export interface AuthContextValue {
  me: MeResponse | null;
  loading: boolean;
  refresh: () => Promise<MeResponse | null>;
  signOutUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useMe(): AuthContextValue {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error('useMe must be used inside AuthProvider');
  }

  return value;
}
