'use client';

import type {
  CreateProjectInput,
  Paginated,
  Project,
  ProjectMember,
  ProjectWithDetails,
  UpdateProjectInput,
} from '@/lib/types';
import { api } from './client';

export const projectsApi = {
  list: (page = 1, pageSize = 20) =>
    api.get<Paginated<Project>>(`/projects?page=${page}&pageSize=${pageSize}`),
  get: (id: string) => api.get<ProjectWithDetails>(`/projects/${id}`),
  create: (input: CreateProjectInput) => api.post<Project>('/projects', input),
  update: (id: string, input: UpdateProjectInput) => api.patch<Project>(`/projects/${id}`, input),
  remove: (id: string) => api.delete<void>(`/projects/${id}`),
  addMember: (projectId: string, member: ProjectMember) =>
    api.post<void>(`/projects/${projectId}/members`, member),
  removeMember: (projectId: string, userId: string) =>
    api.delete<void>(`/projects/${projectId}/members/${userId}`),
};
