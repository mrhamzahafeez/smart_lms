import { z } from "zod";

/**
 * Shared authentication types and validation schemas.
 *
 * Authentication only — authorization, role permissions, and user
 * management belong to future feature specifications.
 */

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Roles mirror the Prisma `UserRole` enum. Kept as a literal union so the
 * value can be shared across server and client without importing the
 * generated Prisma client into the browser bundle.
 */
export type UserRole = "ADMIN" | "TEACHER" | "STUDENT";

/**
 * The signed contents of the session JWT. Keep this minimal — it must never
 * contain the password hash or any sensitive secret.
 */
export interface SessionPayload {
  sub: string;
  email: string;
  role: UserRole;
}

/**
 * The authenticated user context exposed to the application. This is the
 * safe, password-free shape returned by session helpers and `/api/auth/me`.
 */
export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
  isActive: boolean;
}
