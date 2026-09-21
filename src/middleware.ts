import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // DashboardLayout validates Better Auth sessions. Performing the same lookup
  // here through an internal HTTP request added a full extra round trip to every
  // dashboard navigation.
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
  const key = `ratelimit:${ip}:${new Date().getUTCMinutes()}`;
  const limit = 200;
  const currentRequests = (globalThis as any).__rateLimitMap?.get(key) || 0;

  if (currentRequests >= limit) {
    return new NextResponse(JSON.stringify({ error: "Too many requests" }), { status: 429 });
  }

  if (!(globalThis as any).__rateLimitMap) {
    (globalThis as any).__rateLimitMap = new Map();
  }

  (globalThis as any).__rateLimitMap.set(key, currentRequests + 1);

  const response = NextResponse.next();
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "no-referrer");
  response.headers.set("Permissions-Policy", "geolocation=(), microphone=()");
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data:",
      "font-src 'self' data:",
    ].join("; "),
  );

  return response;
}

export const config = {
  // Only protect the dashboard routes as per requirements.
  matcher: ["/dashboard/:path*"],
};
