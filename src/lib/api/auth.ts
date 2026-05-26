'use client';

import type { AuthSession, LoginInput, PublicUser, SignupInput } from '@/lib/types';
import { api } from './client';

export const authApi = {
  login: (input: LoginInput) => api.post<AuthSession>('/auth/login', input, { auth: false }),
  signup: (input: SignupInput) => api.post<AuthSession>('/auth/signup', input, { auth: false }),
  me: () => api.get<PublicUser>('/auth/me'),
  googleStart: () => `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1'}/auth/google`,
};
