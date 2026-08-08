import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";

/**
 * Retrieves the current session object.
 * Use this in Server Components and Server Actions.
 */
export async function getCurrentSession() {
  const reqHeaders = await headers();
  return await auth.api.getSession({
    headers: reqHeaders,
  });
}

/**
 * Retrieves the currently authenticated user.
 * Use this when you only need the user data and not the session metadata.
 */
export async function getCurrentUser() {
  const session = await getCurrentSession();
  return session?.user || null;
}

/**
 * Ensures the user is authenticated.
 * If not authenticated, redirects to the login page.
 * Returns the session and user if authenticated.
 * 
 * @param redirectTo The path to redirect to if unauthenticated (defaults to "/login")
 */
export async function requireAuth(redirectTo: string = "/login") {
  const session = await getCurrentSession();
  
  if (!session || !session.user) {
    redirect(redirectTo);
  }
  
  return session;
}

/**
 * Checks if the user is authenticated without throwing exceptions or redirecting.
 * Useful for conditional rendering or logic branches.
 * 
 * @returns boolean indicating authentication status
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getCurrentSession();
  return !!(session && session.user);
}
