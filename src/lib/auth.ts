import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";

import { prisma } from "@/lib/prisma";
import type {
  AuthenticatedUser,
  SessionPayload,
  UserRole,
} from "@/types/auth";

/**
 * Authentication utilities: password hashing/comparison, JWT
 * generation/verification, and session cookie helpers.
 *
 * This module implements authentication only. Authorization and role
 * permission checks belong to future feature specifications.
 */

const SALT_ROUNDS = 12;
const SESSION_COOKIE_NAME = "session";
const DEFAULT_EXPIRES_IN = "7d";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set.");
  }
  return secret;
}

function getJwtExpiresIn(): SignOptions["expiresIn"] {
  return (process.env.JWT_EXPIRES_IN ||
    DEFAULT_EXPIRES_IN) as SignOptions["expiresIn"];
}

/**
 * Convert JWT expiry string to milliseconds for cookie maxAge.
 * Supports formats like "7d", "24h", "3600" (seconds).
 */
function getExpiryInSeconds(expiresIn: SignOptions["expiresIn"]): number {
  if (typeof expiresIn === "number") {
    return expiresIn;
  }

  if (typeof expiresIn === "string") {
    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (match) {
      const value = parseInt(match[1], 10);
      const unit = match[2];

      switch (unit) {
        case "s":
          return value;
        case "m":
          return value * 60;
        case "h":
          return value * 60 * 60;
        case "d":
          return value * 60 * 60 * 24;
        default:
          return 60 * 60 * 24 * 7; // Default to 7 days
      }
    }
  }

  return 60 * 60 * 24 * 7; // Default to 7 days
}

/**
 * Validate request origin to prevent CSRF attacks.
 * Returns true if the origin is trusted, false otherwise.
 */
export function validateRequestOrigin(requestOrigin?: string): boolean {
  if (!requestOrigin) {
    return false;
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) {
    // In development without explicit NEXT_PUBLIC_APP_URL, accept localhost
    return requestOrigin.includes("localhost") || requestOrigin.includes("127.0.0.1");
  }

  return requestOrigin === appUrl || requestOrigin === new URL(appUrl).origin;
}

/**
 * Hash a plain-text password using bcrypt with a minimum of 10 salt rounds.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compare a plain-text password against a stored bcrypt hash.
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Generate a signed session JWT for the given payload.
 */
export function generateToken(payload: SessionPayload): string {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: getJwtExpiresIn(),
  });
}

/**
 * Verify and decode a session JWT. Returns the payload or `null` if the
 * token is missing, malformed, or expired.
 */
export function verifyToken(token: string): SessionPayload | null {
  try {
    const decoded = jwt.verify(token, getJwtSecret());
    if (typeof decoded === "string") {
      return null;
    }

    const { sub, email, role } = decoded as Partial<SessionPayload>;
    if (!sub || !email || !role) {
      return null;
    }

    return { sub, email, role: role as UserRole };
  } catch {
    return null;
  }
}

/**
 * Persist the session token in an HttpOnly cookie.
 * Secure in production, SameSite=lax to mitigate CSRF.
 * Cookie expiry is synchronized with JWT expiry.
 */
export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  const expiresInSeconds = getExpiryInSeconds(getJwtExpiresIn());

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: expiresInSeconds,
  });
}

/**
 * Remove the session cookie, invalidating the current browser session.
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Read and verify the session token from the request cookies.
 */
export async function getSessionPayload(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return null;
  }
  return verifyToken(token);
}

/**
 * Resolve the current authenticated user from the session cookie and the
 * PostgreSQL source of truth. Returns `null` when there is no valid session
 * or the user no longer exists / is inactive.
 *
 * The password hash is never returned.
 */
export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  const payload = await getSessionPayload();
  if (!payload) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: {
      id: true,
      email: true,
      role: true,
      isActive: true,
    },
  });

  if (!user || !user.isActive) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role as UserRole,
    isActive: user.isActive,
  };
}
