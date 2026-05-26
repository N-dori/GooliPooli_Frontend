import { z } from 'zod';

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------
export const UserRole = z.enum(['admin', 'project_manager', 'worker']);
export const AuthProvider = z.enum(['password', 'google']);
export const ProjectStatus = z.enum(['active', 'paused', 'archived', 'done']);
export const ProjectMemberRole = z.enum(['owner', 'member']);
export const VisitStatus = z.enum([
  'scheduled',
  'in_progress',
  'completed',
  'missed',
  'cancelled',
]);
export const NotificationType = z.enum([
  'visit_completed',
  'visit_missed',
  'visit_assigned',
  'visit_reassigned',
  'project_created',
  'schedule_changed',
]);

// ---------------------------------------------------------------------------
// User
// ---------------------------------------------------------------------------
export const UserSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(2).max(64),
  email: z.string().email(),
  role: UserRole,
  authProvider: AuthProvider,
  authProviderId: z.string().nullable(),
  avatarUrl: z.string().url().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const PublicUserSchema = UserSchema.omit({ authProviderId: true });

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------
export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export const SignupSchema = z.object({
  username: z.string().min(2).max(64),
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export const AuthTokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export const AuthSessionSchema = z.object({
  user: PublicUserSchema,
  tokens: AuthTokensSchema,
});

// ---------------------------------------------------------------------------
// Project
// ---------------------------------------------------------------------------
export const ProjectSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).max(120),
  code: z
    .string()
    .length(6)
    .regex(/^[A-Z0-9]{6}$/),
  description: z.string().nullable(),
  status: ProjectStatus,
  createdBy: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateProjectSchema = z.object({
  name: z.string().min(2).max(120),
  description: z.string().max(2000).nullable().optional(),
});

export const UpdateProjectSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  description: z.string().max(2000).nullable().optional(),
  status: ProjectStatus.optional(),
});

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------
export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});

// ---------------------------------------------------------------------------
// Notification
// ---------------------------------------------------------------------------
export const NotificationSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  type: NotificationType,
  title: z.string().max(200),
  message: z.string().max(2000),
  read: z.boolean(),
  createdAt: z.string().datetime(),
});

// ---------------------------------------------------------------------------
// Types (all at the bottom)
// ---------------------------------------------------------------------------
export type UserRole = z.infer<typeof UserRole>;
export type AuthProvider = z.infer<typeof AuthProvider>;
export type ProjectStatus = z.infer<typeof ProjectStatus>;
export type ProjectMemberRole = z.infer<typeof ProjectMemberRole>;
export type VisitStatus = z.infer<typeof VisitStatus>;
export type NotificationType = z.infer<typeof NotificationType>;

export type User = z.infer<typeof UserSchema>;
export type PublicUser = z.infer<typeof PublicUserSchema>;

export type LoginInput = z.infer<typeof LoginSchema>;
export type SignupInput = z.infer<typeof SignupSchema>;
export type AuthTokens = z.infer<typeof AuthTokensSchema>;
export type AuthSession = z.infer<typeof AuthSessionSchema>;

export type Project = z.infer<typeof ProjectSchema>;
export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;

export type Notification = z.infer<typeof NotificationSchema>;

export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}
