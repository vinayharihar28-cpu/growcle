import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Validate session by hitting the better-auth endpoint directly.
  // We use native fetch to ensure compatibility with Edge Runtime.
  const authUrl = process.env.BETTER_AUTH_URL || request.nextUrl.origin;
  
  try {
    const res = await fetch(`${authUrl}/api/auth/get-session`, {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    });

    const session = await res.json();

    // If no session data is returned, user is not authenticated
    if (!res.ok || !session || !session.session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Attach user information to headers if downstream components need it
    const response = NextResponse.next();
    response.headers.set("x-user-id", session.user.id);
    return response;
    
  } catch (error) {
    console.error("[Auth Middleware] Failed to validate session:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  // Only protect the dashboard routes as per requirements.
  matcher: ["/dashboard/:path*"],
};
