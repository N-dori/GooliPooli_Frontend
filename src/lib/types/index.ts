import { z } from 'zod';

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------
export const UserRole = z.enum(['admin', 'project_manager', 'worker']);
export const AuthProvider = z.enum(['password', 'google']);
export const ProjectStatus = z.enum(['active', 'paused', 'archived', 'done']);
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
// Project (single global app instance — not a scope)
// ---------------------------------------------------------------------------
export const ProjectSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).max(120),
  description: z.string().nullable(),
  status: ProjectStatus,
  createdBy: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const UpdateProjectSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  description: z.string().max(2000).nullable().optional(),
  status: ProjectStatus.optional(),
});

// ---------------------------------------------------------------------------
// Client
// ---------------------------------------------------------------------------
export const ClientSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(200),
  address: z.string().min(1),
  phone: z.string().nullable(),
  note: z.string().nullable(),
  gateCode: z.string().nullable(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  recurringSchedule: z.record(z.unknown()).nullable(),
  visitsPerMonth: z.number().int().nullable(),
  isOneTime: z.boolean(),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateClientSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  address: z.string().min(1, 'Address is required'),
  phone: z.string().optional().nullable(),
  note: z.string().optional().nullable(),
  gateCode: z.string().optional().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  recurringSchedule: z.record(z.unknown()).optional().nullable(),
  visitsPerMonth: z.number().int().optional().nullable(),
  isOneTime: z.boolean().optional(),
});

export const UpdateClientSchema = CreateClientSchema.partial().extend({
  isActive: z.boolean().optional(),
});

// ---------------------------------------------------------------------------
// Visit
// ---------------------------------------------------------------------------
export const VisitSchema = z.object({
  id: z.string().uuid(),
  clientId: z.string().uuid(),
  workerId: z.string().uuid().nullable(),
  scheduledDate: z.string(),
  status: VisitStatus,
  workerNotes: z.string().nullable(),
  managerNotes: z.string().nullable(),
  completedAt: z.string().nullable().optional(),
  gpsValidated: z.boolean(),
  gpsLatitude: z.number().nullable(),
  gpsLongitude: z.number().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const VisitWithDetailsSchema = VisitSchema.extend({
  client: ClientSchema.optional(),
  worker: PublicUserSchema.optional(),
});

export const CreateVisitSchema = z.object({
  clientId: z.string().uuid(),
  workerId: z.string().uuid().optional().nullable(),
  scheduledDate: z.string(),
});

export const UpdateVisitSchema = z.object({
  workerId: z.string().uuid().optional().nullable(),
  scheduledDate: z.string().optional(),
  status: VisitStatus.optional(),
  workerNotes: z.string().optional().nullable(),
  managerNotes: z.string().optional().nullable(),
  completedAt: z.string().optional().nullable(),
});

// ---------------------------------------------------------------------------
// User Management
// ---------------------------------------------------------------------------
export const CreateUserSchema = z.object({
  username: z.string().min(2).max(64),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  role: UserRole,
});

export const UpdateUserSchema = z.object({
  username: z.string().min(2).max(64).optional(),
  role: UserRole.optional(),
  avatarUrl: z.string().url().optional().nullable(),
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
export type VisitStatus = z.infer<typeof VisitStatus>;
export type NotificationType = z.infer<typeof NotificationType>;

export type User = z.infer<typeof UserSchema>;
export type PublicUser = z.infer<typeof PublicUserSchema>;

export type LoginInput = z.infer<typeof LoginSchema>;
export type SignupInput = z.infer<typeof SignupSchema>;
export type AuthTokens = z.infer<typeof AuthTokensSchema>;
export type AuthSession = z.infer<typeof AuthSessionSchema>;

export type Project = z.infer<typeof ProjectSchema>;
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;

export type Client = z.infer<typeof ClientSchema>;
export type CreateClientInput = z.infer<typeof CreateClientSchema>;
export type UpdateClientInput = z.infer<typeof UpdateClientSchema>;

export type Visit = z.infer<typeof VisitSchema>;
export type VisitWithDetails = z.infer<typeof VisitWithDetailsSchema>;
export type CreateVisitInput = z.infer<typeof CreateVisitSchema>;
export type UpdateVisitInput = z.infer<typeof UpdateVisitSchema>;

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;

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

