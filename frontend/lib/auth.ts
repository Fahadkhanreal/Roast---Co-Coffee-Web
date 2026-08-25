import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest, verifySession } from '@/lib/session';

/**
 * Middleware to verify admin session from secure cookie
 * Used to protect admin endpoints
 * Returns NextResponse error or null if authenticated
 */
export async function requireAuth(request: NextRequest): Promise<NextResponse | null> {
  try {
    const sessionId = getSessionFromRequest(request);

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Unauthorized - session cookie missing' },
        { status: 401 }
      );
    }

    const session = verifySession(sessionId);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - session invalid or expired' },
        { status: 401 }
      );
    }

    return null; // Success - no error
  } catch (error) {
    console.error('Auth middleware error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Helper to check auth in API routes
 * Usage in API route:
 *   const auth = await requireAuth(request);
 *   if ('error' in auth) return auth.error;
 *   const { session } = auth;
 */
export async function checkAdminAuth(request: NextRequest): Promise<boolean> {
  const auth = await requireAuth(request);
  return auth === null; // null means success (no error response)
}

/**
 * Client-side auth check (for use in Client Components)
 * Calls API to verify session since httpOnly cookies can't be read by JS
 */
export async function isAuthenticated(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  try {
    const response = await fetch('/api/auth/verify', {
      credentials: 'include',
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Get current admin user from API
 * Returns user data if authenticated, null otherwise
 */
export async function getAdminUser(): Promise<{ id: string; email: string } | null> {
  if (typeof window === 'undefined') return null;

  try {
    const response = await fetch('/api/auth/verify', {
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      return data.user || null;
    }
  } catch (error) {
    console.error('Error fetching user:', error);
  }

  return null;
}

/**
 * Logout - clear session cookie
 */
export async function logout(): Promise<void> {
  try {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    // Redirect to login
    if (typeof window !== 'undefined') {
      window.location.href = '/admin/login';
    }
  } catch (error) {
    console.error('Logout error:', error);
  }
}
