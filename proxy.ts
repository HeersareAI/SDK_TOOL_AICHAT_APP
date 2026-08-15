import { auth } from "@/lib/auth";
import { getSessionCookie } from "better-auth/cookies";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/user", "/chat"];
const authRoutes = ["/signin", "/signup"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = getSessionCookie(request);
  const isAuthenticated = !!sessionCookie;

  // Redirect authenticated users away from auth pages
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Validate protected routes against Better Auth instead of relying on the
  // presence of a specifically named cookie.
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/user/:path*",
    "/chat/:path*",
    "/signin",
    "/signup",
  ],
};
