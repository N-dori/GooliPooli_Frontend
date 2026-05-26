'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/stores/authStore';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const tokens = useAuthStore((s) => s.tokens);
  const [hydrated, setHydrated] = useState(false);

  // Zustand's persist middleware hydrates asynchronously after mount.
  // Before that, `tokens` is the initial `null` and we'd redirect every
  // refresh even when the user is logged in.
  useEffect(() => {
    setHydrated(useAuthStore.persist.hasHydrated());
    const unsub = useAuthStore.persist.onFinishHydration(() => setHydrated(true));
    return unsub;
  }, []);

  useEffect(() => {
    if (hydrated && !tokens?.accessToken) router.replace('/login');
  }, [hydrated, tokens, router]);

  if (!hydrated || !tokens?.accessToken) return null;
  return <>{children}</>;
}
