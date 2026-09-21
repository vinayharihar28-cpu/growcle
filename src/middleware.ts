import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Validate session by hitting the better-auth endpoint directly.
  // We use native fetch to ensure compatibility with Edge Runtime.
  const authUrl = request.nextUrl.origin || process.env.BETTER_AUTH_URL;
  
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

    // Security headers
    response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("Referrer-Policy", "no-referrer");
    response.headers.set("Permissions-Policy", "geolocation=(), microphone=()");

    // Content Security Policy - minimal default
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data:",
      "font-src 'self' data:",
    ].join('; ');
    response.headers.set("Content-Security-Policy", csp);

    // Simple in-memory rate limiting per IP for middleware
    const ip = request.headers.get('x-forwarded-for') || (request as any).ip || request.headers.get('x-real-ip') || 'unknown';
    const key = `ratelimit:${ip}:${new Date().getUTCMinutes()}`;
    const limit = 200; // requests per minute
    const currentRequests = (globalThis as any).__rateLimitMap?.get(key) || 0;
    if (currentRequests > limit) {
      return new NextResponse(JSON.stringify({ error: 'Too many requests' }), { status: 429 });
    }
    if (!(globalThis as any).__rateLimitMap) {
      (globalThis as any).__rateLimitMap = new Map();
    }
    (globalThis as any).__rateLimitMap.set(key, currentRequests + 1);

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
