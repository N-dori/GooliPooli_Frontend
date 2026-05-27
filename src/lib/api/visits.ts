'use client';

import type { CreateVisitInput, Paginated, UpdateVisitInput, VisitWithDetails } from '@/lib/types';
import { api } from './client';

export const visitsApi = {
  list: (params: {
    dateFrom?: string;
    dateTo?: string;
    workerId?: string;
  }) => {
    const qs = new URLSearchParams();
    if (params.dateFrom) qs.set('dateFrom', params.dateFrom);
    if (params.dateTo) qs.set('dateTo', params.dateTo);
    if (params.workerId) qs.set('workerId', params.workerId);
    return api.get<Paginated<VisitWithDetails>>(`/visits?${qs.toString()}`);
  },
  get: (id: string) => api.get<VisitWithDetails>(`/visits/${id}`),
  create: (input: CreateVisitInput) => api.post<VisitWithDetails>('/visits', input),
  update: (id: string, input: UpdateVisitInput) =>
    api.patch<VisitWithDetails>(`/visits/${id}`, input),
  remove: (id: string) => api.delete<void>(`/visits/${id}`),
};
