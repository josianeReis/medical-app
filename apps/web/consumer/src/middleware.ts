import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // Protected routes that require authentication
  const protectedRoutes = ["/dashboard"];
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Check for session cookie
  const sessionCookie = getSessionCookie(request);
  console.log("🚀 ~ middleware ~ sessionCookie:", sessionCookie)

  // if (!sessionCookie) {
  //   // Redirect to login if no session cookie found
  //   const url = request.nextUrl.clone();
  //   url.pathname = "/login";
  //   return NextResponse.redirect(url);
  // }

  return NextResponse.next();
}

export const config = {
  // Apply middleware to specific routes
  matcher: ["/dashboard/:path*"],
};
