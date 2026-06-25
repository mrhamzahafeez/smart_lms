import { getCurrentUser } from "./auth";
import type { AuthenticatedUser, UserRole } from "@/types/auth";

export class AuthorizationError extends Error {
  status: number;
  constructor(message: string, status = 401) {
    super(message);
    this.name = "AuthorizationError";
    this.status = status;
  }
}

/**
 * Require an authenticated user. Throws AuthorizationError(401) when missing.
 */
export async function requireAuth(): Promise<AuthenticatedUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new AuthorizationError("Unauthorized", 401);
  }
  return user;
}

/**
 * Require a specific role. Throws AuthorizationError(403) when role mismatches.
 */
export async function requireRole(role: UserRole): Promise<AuthenticatedUser> {
  const user = await requireAuth();
  if (user.role !== role) {
    throw new AuthorizationError("Forbidden", 403);
  }
  return user;
}

export async function requireAdmin(): Promise<AuthenticatedUser> {
  return requireRole("ADMIN");
}

export async function requireTeacher(): Promise<AuthenticatedUser> {
  return requireRole("TEACHER");
}

export async function requireStudent(): Promise<AuthenticatedUser> {
  return requireRole("STUDENT");
}

// Prefer named exports; do not export an anonymous default to satisfy linter rules.
