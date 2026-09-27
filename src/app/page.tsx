'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/protected-route';
import { useSession, signOut } from '@/lib/auth-client';
import { apiFetch } from '@/lib/api';

function HomeContent() {
  const { data: session } = useSession();
  const [result, setResult] = useState<string | null>(null);

  async function testApiCall() {
    const response = await apiFetch('/api/clinics', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test Clinic', address: '123 Test St' }),
    });

    const data = await response.json();
    setResult(JSON.stringify(data, null, 2));
  }

  return (
    <div className="mx-auto mt-16 max-w-md space-y-4">
      <h1 className="text-xl font-semibold">Welcome, {session?.user.name}</h1>
      <p className="text-sm text-gray-500">{session?.user.email}</p>

      <button
        onClick={testApiCall}
        className="rounded bg-black px-3 py-2 text-white"
      >
        Test API call
      </button>

      <button onClick={() => signOut()} className="rounded border px-3 py-2">
        Sign out
      </button>

      {result && (
        <pre className="whitespace-pre-wrap rounded bg-gray-100 p-3 text-xs">
          {result}
        </pre>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <ProtectedRoute>
      <HomeContent />
    </ProtectedRoute>
  );
}
