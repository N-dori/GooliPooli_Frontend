'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/authStore';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const tokens = useAuthStore((s) => s.tokens);

  useEffect(() => {
    if (!tokens?.accessToken) router.replace('/login');
  }, [tokens, router]);

  if (!tokens?.accessToken) return null;
  return <>{children}</>;
}
