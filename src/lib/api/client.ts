'use client';

import { useAuthStore } from '@/lib/stores/authStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

interface ApiErrorPayload {
  error?: { code: string; message: string; details?: unknown };
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  auth?: boolean;
}

async function refreshTokens(): Promise<boolean> {
  const { tokens, setTokens, clear } = useAuthStore.getState();
  if (!tokens?.refreshToken) return false;
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: tokens.refreshToken }),
    });
    if (!res.ok) {
      clear();
      return false;
    }
    const json = (await res.json()) as { data: { accessToken: string; refreshToken: string } };
    setTokens(json.data);
    return true;
  } catch {
    clear();
    return false;
  }
}

async function rawFetch<T>(path: string, opts: RequestOptions, retried = false): Promise<T> {
  const headers = new Headers(opts.headers as HeadersInit | undefined);
  if (opts.body !== undefined) headers.set('Content-Type', 'application/json');
  if (opts.auth !== false) {
    const token = useAuthStore.getState().tokens?.accessToken;
    if (token) headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...opts,
    headers,
    body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
  });

  if (res.status === 401 && !retried && opts.auth !== false) {
    const ok = await refreshTokens();
    if (ok) return rawFetch<T>(path, opts, true);
  }

  if (res.status === 204) return undefined as T;

  const json = (await res.json().catch((err) => ({ error: { code: 'unknown', message: 'Failed to parse response' } }))) as ApiErrorPayload & { data?: T };
  if (!res.ok) {
    throw new ApiError(
      res?.status,
      json.error?.code ?? 'unknown',
      json.error?.message ?? res.statusText,
      json.error?.details,
    );
  }
  return json?.data as T;
}

export const api = {
  get: <T>(path: string, opts: Omit<RequestOptions, 'body' | 'method'> = {}) =>
    rawFetch<T>(path, { ...opts, method: 'GET' }),
  post: <T>(path: string, body?: unknown, opts: Omit<RequestOptions, 'body' | 'method'> = {}) =>
    rawFetch<T>(path, { ...opts, method: 'POST', body }),
  patch: <T>(path: string, body?: unknown, opts: Omit<RequestOptions, 'body' | 'method'> = {}) =>
    rawFetch<T>(path, { ...opts, method: 'PATCH', body }),
  delete: <T>(path: string, opts: Omit<RequestOptions, 'body' | 'method'> = {}) =>
    rawFetch<T>(path, { ...opts, method: 'DELETE' }),
};
