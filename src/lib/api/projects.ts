'use client';

import type { CreateProjectInput, Paginated, Project, UpdateProjectInput } from '@/lib/types';
import { api } from './client';

export const projectsApi = {
  list: (page = 1, pageSize = 20) =>
    api.get<Paginated<Project>>(`/projects?page=${page}&pageSize=${pageSize}`),
  get: (id: string) => api.get<Project>(`/projects/${id}`),
  create: (input: CreateProjectInput) => api.post<Project>('/projects', input),
  update: (id: string, input: UpdateProjectInput) => api.patch<Project>(`/projects/${id}`, input),
  remove: (id: string) => api.delete<void>(`/projects/${id}`),
};
