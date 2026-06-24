import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import {
  generateToken,
  setSessionCookie,
  verifyPassword,
  validateRequestOrigin,
} from "@/lib/auth";
import { loginSchema } from "@/types/auth";

/**
 * POST /api/auth/login
 *
 * Authenticate a user by email and password.
 * - Validates request origin (CSRF protection)
 * - Rejects non-JSON requests
 * - Validates input
 * - Verifies credentials against the database
 * - Generates JWT token
 * - Sets secure session cookie
 * - Returns user info (without password)
 */
export async function POST(request: NextRequest) {
  try {
    // Reject non-JSON requests
    const contentType = request.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      return NextResponse.json(
        { error: "Content-Type must be application/json" },
        { status: 400 },
      );
    }

    // CSRF protection: validate request origin
    const origin = request.headers.get("origin") || request.headers.get("referer");
    if (!validateRequestOrigin(origin?.split("/").slice(0, 3).join("/"))) {
      return NextResponse.json(
        { error: "Request origin not allowed" },
        { status: 403 },
      );
    }

    const body = await request.json();

    // Validate input
    const validatedData = loginSchema.parse(body);

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
        isActive: true,
      },
    });

    // User not found or inactive
    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Verify password
    const passwordMatch = await verifyPassword(
      validatedData.password,
      user.password,
    );

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Generate JWT token
    const token = generateToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    // Set session cookie
    await setSessionCookie(token);

    // Return user info (password never exposed)
    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.issues,
        },
        { status: 400 },
      );
    }

    console.error("[AUTH/LOGIN] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
