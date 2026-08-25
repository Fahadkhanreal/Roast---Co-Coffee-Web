import { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIE_NAME = 'admin_session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

interface AdminSession {
  id: string;
  email: string;
  createdAt: number;
}

// In-memory session store (use Redis in production)
const sessions: { [key: string]: AdminSession } = {};

/**
 * Create a new admin session
 */
export function createSession(adminId: string, email: string): string {
  const sessionId = require('crypto').randomBytes(32).toString('hex');
  const session: AdminSession = {
    id: adminId,
    email: email,
    createdAt: Date.now(),
  };

  sessions[sessionId] = session;
  return sessionId;
}

/**
 * Verify session exists and is valid
 */
export function verifySession(sessionId: string): AdminSession | null {
  if (!sessionId || !sessions[sessionId]) {
    return null;
  }

  const session = sessions[sessionId];

  // Check if session expired (24 hours)
  if (Date.now() - session.createdAt > SESSION_DURATION) {
    delete sessions[sessionId];
    return null;
  }

  return session;
}

/**
 * Destroy session
 */
export function destroySession(sessionId: string): void {
  delete sessions[sessionId];
}

/**
 * Set secure httpOnly cookie with session
 */
export function setSessionCookie(response: NextResponse, sessionId: string): void {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: sessionId,
    httpOnly: true, // NOT accessible from JavaScript
    secure: true, // Only sent over HTTPS
    sameSite: 'strict', // CSRF protection
    maxAge: SESSION_DURATION, // 24 hours
    path: '/', // Available site-wide
  });
}

/**
 * Clear session cookie
 */
export function clearSessionCookie(response: NextResponse): void {
  response.cookies.delete(SESSION_COOKIE_NAME);
}

/**
 * Get session ID from request cookies
 */
export function getSessionFromRequest(request: NextRequest): string | undefined {
  return request.cookies.get(SESSION_COOKIE_NAME)?.value;
}

/**
 * Cleanup expired sessions every 30 minutes
 */
setInterval(() => {
  const now = Date.now();
  for (const sessionId in sessions) {
    const session = sessions[sessionId];
    if (now - session.createdAt > SESSION_DURATION) {
      delete sessions[sessionId];
    }
  }
}, 30 * 60 * 1000);
