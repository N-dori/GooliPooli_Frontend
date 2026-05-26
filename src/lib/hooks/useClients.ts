'use client';

import type { CreateClientInput, UpdateClientInput } from '@/lib/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { clientsApi } from '@/lib/api/clients';

export const clientKeys = {
  all: ['clients'] as const,
  list: (params?: object) => [...clientKeys.all, 'list', params] as const,
  detail: (id: string) => [...clientKeys.all, 'detail', id] as const,
};

export function useClientList(params?: { projectId?: string; search?: string; page?: number }) {
  return useQuery({
    queryKey: clientKeys.list(params),
    queryFn: () => clientsApi.list(params),
  });
}

export function useClient(id: string | undefined) {
  return useQuery({
    queryKey: id ? clientKeys.detail(id) : ['clients', 'detail', 'noop'],
    queryFn: () => clientsApi.get(id!),
    enabled: Boolean(id),
  });
}

export function useCreateClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateClientInput) => clientsApi.create(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: clientKeys.all });
      toast.success('Client created');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateClient(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateClientInput) => clientsApi.update(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: clientKeys.all });
      toast.success('Client updated');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => clientsApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: clientKeys.all });
      toast.success('Client deleted');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
