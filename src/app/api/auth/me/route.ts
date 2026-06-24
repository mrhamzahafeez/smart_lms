import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";

/**
 * GET /api/auth/me
 *
 * Retrieve the current authenticated user from the session.
 * Returns null or the user object (without password).
 */
export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("[AUTH/ME] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
