'use client';

import type { Client, CreateClientInput, Paginated, UpdateClientInput } from '@/lib/types';
import { api } from './client';

export const clientsApi = {
  list: (params?: { search?: string; page?: number; pageSize?: number }) => {
    const qs = new URLSearchParams();
    if (params?.search) qs.set('search', params.search);
    if (params?.page) qs.set('page', String(params.page));
    if (params?.pageSize) qs.set('pageSize', String(params.pageSize));
    const query = qs.toString();
    return api.get<Paginated<Client>>(`/clients${query ? `?${query}` : ''}`);
  },

  get: (id: string) => api.get<Client>(`/clients/${id}`),
  create: (data: CreateClientInput) => api.post<Client>(`/clients`, data),
  update: (id: string, input: UpdateClientInput) => api.patch<Client>(`/clients/${id}`, input),
  remove: (id: string) => api.delete<void>(`/clients/${id}`),
};
