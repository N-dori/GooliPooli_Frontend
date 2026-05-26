import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Auth state lives in localStorage (not cookies), so the middleware cannot
// read tokens server-side. Client-side <AuthGuard> handles the actual redirect.
// This matcher still prevents Next.js from statically optimising protected pages.
export function middleware(_req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|icons).*)',
  ],
};
