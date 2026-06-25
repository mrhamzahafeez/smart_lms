import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

/**
 * Middleware to enforce role-based access for admin/teacher/student
 * routes and their corresponding API namespaces.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip internal Next.js and public asset paths
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/static")
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("session")?.value;
  const payload = token ? verifyToken(token) : null;

  const redirectToUnauthorized = NextResponse.redirect(new URL("/unauthorized", req.url));

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (!payload || payload.role !== "ADMIN") return redirectToUnauthorized;
    return NextResponse.next();
  }

  if (pathname.startsWith("/teacher") || pathname.startsWith("/api/teacher")) {
    if (!payload || payload.role !== "TEACHER") return redirectToUnauthorized;
    return NextResponse.next();
  }

  if (pathname.startsWith("/student") || pathname.startsWith("/api/student")) {
    if (!payload || payload.role !== "STUDENT") return redirectToUnauthorized;
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/teacher/:path*",
    "/student/:path*",
    "/api/admin/:path*",
    "/api/teacher/:path*",
    "/api/student/:path*",
  ],
};
