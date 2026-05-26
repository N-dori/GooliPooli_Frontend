import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Providers } from '@/lib/providers/Providers';

export const metadata: Metadata = {
  title: 'Goolipooli',
  description: 'Pool cleaning operations management',
  manifest: '/manifest.json',
  applicationName: 'Goolipooli',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'Golipooli' },
};

export const viewport: Viewport = {
  themeColor: '#0ea5e9',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
