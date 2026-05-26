'use client';

import type { CreateUserInput, Paginated, PublicUser, UpdateUserInput } from '@/lib/types';
import { api } from './client';

export const usersApi = {
  list: (params?: { search?: string }) => {
    const qs = new URLSearchParams();
    if (params?.search) qs.set('search', params.search);
    const query = qs.toString();
    return api.get<Paginated<PublicUser>>(`/users${query ? `?${query}` : ''}`);
  },
  get: (id: string) => api.get<PublicUser>(`/users/${id}`),
  create: (input: CreateUserInput) => api.post<PublicUser>('/users', input),
  update: (id: string, input: UpdateUserInput) => api.patch<PublicUser>(`/users/${id}`, input),
  remove: (id: string) => api.delete<void>(`/users/${id}`),
};
