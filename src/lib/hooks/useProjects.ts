'use client';

import type { CreateProjectInput, UpdateProjectInput } from '@/lib/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { projectsApi } from '@/lib/api/projects';

export const projectKeys = {
  all: ['projects'] as const,
  list: (page: number, size: number) => [...projectKeys.all, 'list', page, size] as const,
  detail: (id: string) => [...projectKeys.all, 'detail', id] as const,
};

export function useProjectList(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: projectKeys.list(page, pageSize),
    queryFn: () => projectsApi.list(page, pageSize),
  });
}

export function useProject(id: string | undefined) {
  return useQuery({
    queryKey: id ? projectKeys.detail(id) : ['projects', 'detail', 'noop'],
    queryFn: () => projectsApi.get(id!),
    enabled: Boolean(id),
  });
}

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateProjectInput) => projectsApi.create(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: projectKeys.all });
      toast.success('Project created');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateProject(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateProjectInput) => projectsApi.update(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: projectKeys.all });
      toast.success('Project updated');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
