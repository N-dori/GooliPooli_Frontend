'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { UserIndex } from '@/components/users/UserIndex';
import { useAuthStore } from '@/lib/stores/authStore';

export default function UsersPage() {
  const router = useRouter();
  const role = useAuthStore((s) => s.user?.role);

  useEffect(() => {
    if (role && role !== 'admin') {
      router.replace('/diary');
    }
  }, [role, router]);

  if (role !== 'admin') return null;
  return <UserIndex />;
}
