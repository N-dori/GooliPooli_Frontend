'use client';

import type { LoginInput, SignupInput } from '@/lib/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/stores/authStore';

export function useLogin() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  return useMutation({
    mutationFn: (input: LoginInput) => authApi.login(input),
    onSuccess: (session) => {
      setSession(session.user, session.tokens);
      toast.success('Welcome back');
      router.push('/diary');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useSignup() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  return useMutation({
    mutationFn: (input: SignupInput) => authApi.signup(input),
    onSuccess: (session) => {
      setSession(session.user, session.tokens);
      toast.success('Account created');
      router.push('/diary');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useLogout() {
  const router = useRouter();
  const clear = useAuthStore((s) => s.clear);
  return () => {
    clear();
    router.push('/login');
  };
}

export function useMe() {
  const tokens = useAuthStore((s) => s.tokens);
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => authApi.me(),
    enabled: Boolean(tokens?.accessToken),
  });
}
