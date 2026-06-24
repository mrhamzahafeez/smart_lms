import { NextRequest, NextResponse } from "next/server";

import { clearSessionCookie, validateRequestOrigin } from "@/lib/auth";

/**
 * POST /api/auth/logout
 *
 * Clear the session cookie and invalidate the current session.
 * - Validates request origin (CSRF protection)
 * - Clears the session cookie
 */
export async function POST(request: NextRequest) {
  try {
    // CSRF protection: validate request origin
    const origin = request.headers.get("origin") || request.headers.get("referer");
    if (!validateRequestOrigin(origin?.split("/").slice(0, 3).join("/"))) {
      return NextResponse.json(
        { error: "Request origin not allowed" },
        { status: 403 },
      );
    }

    // Clear session cookie
    await clearSessionCookie();

    return NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("[AUTH/LOGOUT] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
