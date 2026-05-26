'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { toast } from 'sonner';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/stores/authStore';

function OAuthCallbackInner() {
  const router = useRouter();
  const params = useSearchParams();
  const setSession = useAuthStore((s) => s.setSession);
  const setTokens = useAuthStore((s) => s.setTokens);

  useEffect(() => {
    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');
    if (!accessToken || !refreshToken) {
      toast.error('OAuth failed');
      router.replace('/login');
      return;
    }
    setTokens({ accessToken, refreshToken });
    authApi
      .me()
      .then((user) => {
        setSession(user, { accessToken, refreshToken });
        router.replace('/dashboard');
      })
      .catch(() => {
        toast.error('Could not load profile');
        router.replace('/login');
      });
  }, [params, router, setSession, setTokens]);

  return (
    <main className="flex min-h-screen items-center justify-center text-muted-foreground">
      Signing you in…
    </main>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center text-muted-foreground">
          Loading…
        </main>
      }
    >
      <OAuthCallbackInner />
    </Suspense>
  );
}
