'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import { Toaster } from 'sonner';
import { APIProvider } from '@vis.gl/react-google-maps';
import { LocaleProvider } from '@/lib/i18n/LocaleContext';
import { ThemeProvider } from '@/lib/theme/ThemeContext';
import { ApiError } from '@/lib/api/client';

const MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            refetchOnWindowFocus: false,
            // Don't retry client errors (4xx) — retrying a 404 just doubles the noise.
            // Only retry transient failures (5xx / network errors).
            retry: (failureCount, error) => {
              if (error instanceof ApiError && error.status >= 400 && error.status < 500) return false;
              return failureCount < 1;
            },
          },
        },
      }),
  );

  return (
    <APIProvider apiKey={MAPS_KEY}>
      <QueryClientProvider client={client}>
        <LocaleProvider>
          <ThemeProvider>
            {children}
            <Toaster richColors position="top-center" />
            {process.env.NODE_ENV !== 'production' && <ReactQueryDevtools initialIsOpen={false} />}
          </ThemeProvider>
        </LocaleProvider>
      </QueryClientProvider>
    </APIProvider>
  );
}
