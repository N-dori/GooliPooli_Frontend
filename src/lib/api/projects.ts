'use client';

import type { Paginated, Project, UpdateProjectInput } from '@/lib/types';
import { api } from './client';

export const projectsApi = {
  list: (page = 1, pageSize = 20) =>
    api.get<Paginated<Project>>(`/projects?page=${page}&pageSize=${pageSize}`),
  get: (id: string) => api.get<Project>(`/projects/${id}`),
  update: (id: string, input: UpdateProjectInput) => api.patch<Project>(`/projects/${id}`, input),
};
