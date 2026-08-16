import { getServerAuthOrigin } from "@/lib/auth-url";
import { getSessionCookie } from "better-auth/cookies";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/user", "/chat"];
const authRoutes = ["/signin", "/signup"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const canonicalOrigin = getServerAuthOrigin();
  const canonicalURL = new URL(canonicalOrigin);

  // OAuth providers require an exact callback origin. Send Vercel preview
  // traffic to the configured production host before authentication starts.
  if (
    request.nextUrl.hostname.endsWith(".vercel.app") &&
    canonicalURL.hostname !== request.nextUrl.hostname &&
    canonicalURL.hostname !== "localhost"
  ) {
    return NextResponse.redirect(
      new URL(`${pathname}${request.nextUrl.search}`, canonicalOrigin),
    );
  }

  const sessionCookie = getSessionCookie(request);
  const isAuthenticated = !!sessionCookie;

  // Redirect authenticated users away from auth pages
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Keep the proxy check lightweight. Each protected page performs the
  // authoritative Better Auth session lookup before rendering private data.
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      const signInURL = new URL("/signin", request.url);
      signInURL.searchParams.set("reason", "proxy-cookie");
      return NextResponse.redirect(signInURL);
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
