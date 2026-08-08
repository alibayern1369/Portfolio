/**
 * Simple in-memory rate limiter for login brute-force protection.
 * Suitable for single-instance deployments; resets on process restart.
 */

interface AttemptState {
  count: number;
  firstAt: number;
  lockedUntil: number;
}

const attempts = new Map<string, AttemptState>();

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes lock

function cleanup(now: number) {
  if (attempts.size < 500) return;
  for (const [key, state] of attempts) {
    if (state.lockedUntil < now && now - state.firstAt > WINDOW_MS) {
      attempts.delete(key);
    }
  }
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}

export function checkLoginRateLimit(key: string): { allowed: boolean; retryAfterSec?: number } {
  const now = Date.now();
  cleanup(now);
  const state = attempts.get(key);

  if (!state) return { allowed: true };

  if (state.lockedUntil > now) {
    return { allowed: false, retryAfterSec: Math.ceil((state.lockedUntil - now) / 1000) };
  }

  if (now - state.firstAt > WINDOW_MS) {
    attempts.delete(key);
    return { allowed: true };
  }

  if (state.count >= MAX_ATTEMPTS) {
    state.lockedUntil = now + LOCKOUT_MS;
    return { allowed: false, retryAfterSec: Math.ceil(LOCKOUT_MS / 1000) };
  }

  return { allowed: true };
}

export function recordLoginFailure(key: string): void {
  const now = Date.now();
  const state = attempts.get(key);

  if (!state || now - state.firstAt > WINDOW_MS) {
    attempts.set(key, { count: 1, firstAt: now, lockedUntil: 0 });
    return;
  }

  state.count += 1;
  if (state.count >= MAX_ATTEMPTS) {
    state.lockedUntil = now + LOCKOUT_MS;
  }
}

export function clearLoginFailures(key: string): void {
  attempts.delete(key);
}
