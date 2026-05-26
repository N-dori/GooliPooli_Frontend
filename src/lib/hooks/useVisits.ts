'use client';

import type { CreateVisitInput, UpdateVisitInput } from '@/lib/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { visitsApi } from '@/lib/api/visits';

export const visitKeys = {
  all: ['visits'] as const,
  list: (params: object) => [...visitKeys.all, 'list', params] as const,
  detail: (id: string) => [...visitKeys.all, 'detail', id] as const,
};

/** Fetch all visits for a full calendar month */
export function useVisitsByMonth(year: number, month: number) {
  // month is 1-indexed
  const dateFrom = `${year}-${String(month).padStart(2, '0')}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const dateTo = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
  return useQuery({
    queryKey: visitKeys.list({ dateFrom, dateTo }),
    queryFn: () => visitsApi.list({ dateFrom, dateTo }),
  });
}

/** Fetch visits for a single date (for the map page) */
export function useVisitsByDate(date: string) {
  return useQuery({
    queryKey: visitKeys.list({ dateFrom: date, dateTo: date }),
    queryFn: () => visitsApi.list({ dateFrom: date, dateTo: date }),
    enabled: Boolean(date),
  });
}

export function useVisit(id: string | undefined) {
  return useQuery({
    queryKey: id ? visitKeys.detail(id) : ['visits', 'detail', 'noop'],
    queryFn: () => visitsApi.get(id!),
    enabled: Boolean(id),
  });
}

export function useCreateVisit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateVisitInput) => visitsApi.create(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: visitKeys.all });
      toast.success('Visit created');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateVisit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateVisitInput }) =>
      visitsApi.update(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: visitKeys.all });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteVisit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => visitsApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: visitKeys.all });
      toast.success('Visit deleted');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
