import crypto from 'crypto';

// Store active CSRF tokens (in production, use Redis)
const csrfTokens: { [key: string]: { token: string; expiresAt: number } } = {};

/**
 * Generate a new CSRF token
 */
export function generateCSRFToken(): string {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 30 * 60 * 1000; // 30 minutes

  csrfTokens[token] = { token, expiresAt };

  // Cleanup expired tokens
  cleanupExpiredTokens();

  return token;
}

/**
 * Verify CSRF token
 */
export function verifyCSRFToken(token: string): boolean {
  if (!token || !csrfTokens[token]) {
    return false;
  }

  const { expiresAt } = csrfTokens[token];
  if (Date.now() > expiresAt) {
    delete csrfTokens[token];
    return false;
  }

  // Consume token (can only be used once)
  delete csrfTokens[token];
  return true;
}

/**
 * Cleanup expired tokens every 10 minutes
 */
function cleanupExpiredTokens() {
  const now = Date.now();
  for (const token in csrfTokens) {
    if (now > csrfTokens[token].expiresAt) {
      delete csrfTokens[token];
    }
  }
}

// Run cleanup every 10 minutes
setInterval(cleanupExpiredTokens, 10 * 60 * 1000);
