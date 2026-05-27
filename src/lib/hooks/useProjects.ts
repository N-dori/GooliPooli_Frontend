'use client';

import type { UpdateProjectInput } from '@/lib/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { projectsApi } from '@/lib/api/projects';

export const projectKeys = {
  all: ['projects'] as const,
  list: () => [...projectKeys.all, 'list'] as const,
  detail: (id: string) => [...projectKeys.all, 'detail', id] as const,
};

/** Fetch the single global app project (first/only entry). */
export function useAppProject() {
  return useQuery({
    queryKey: projectKeys.list(),
    queryFn: () => projectsApi.list(1, 1),
    select: (data) => data.items[0],
  });
}

export function useUpdateProject(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateProjectInput) => projectsApi.update(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: projectKeys.all });
      toast.success('Saved');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
