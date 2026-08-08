import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/shared/lib/db";
import { AuthorizationService } from "../services/authorization.service";
import type { AuthorizationContext, TenantContext } from "../types";
import { ROLES } from "../constants/roles";

/**
 * Resolves the full Authorization Context for the currently authenticated user.
 * This function should be called at the top of Server Components or Actions.
 * 
 * @param tenant The context specifying which Organization/Chapter is being accessed.
 * @returns The resolved AuthorizationContext or redirects to an error/login page.
 */
export async function resolveAuthorizationContext(tenant?: TenantContext): Promise<AuthorizationContext> {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/login");
  }

  // If no tenant is provided, we only have the User identity. 
  // We can't resolve a specific Member profile without a context (Organization/Chapter).
  if (!tenant || (!tenant.organizationId && !tenant.chapterId)) {
    return {
      user: { ...user, image: user.image ?? null },
      member: null,
      roles: [],
      permissions: [],
    };
  }

  // Attempt to find the specific Membership record for this User in the requested context
  const member = await db.member.findFirst({
    where: {
      userId: user.id,
      ...(tenant.organizationId ? { organizationId: tenant.organizationId } : {}),
      ...(tenant.chapterId ? { chapterId: tenant.chapterId } : {}),
    },
  });

  if (!member) {
    // User is authenticated but does not belong to this tenant.
    redirect("/unauthorized"); 
  }

  // Resolve the Roles and Permissions for this Member
  const { roles, permissions } = await AuthorizationService.resolveMemberProfile(member.id);

  // Platform Admins implicitly get all permissions, but standard engine still maps them explicitly.
  return {
    user: { ...user, image: user.image ?? null },
    member,
    roles,
    permissions,
  };
}

/**
 * Server Guard: Ensures the current user possesses a specific permission within the tenant context.
 * Redirects if unauthorized.
 */
export async function requirePermission(permissionSlug: string, tenant: TenantContext): Promise<AuthorizationContext> {
  const context = await resolveAuthorizationContext(tenant);
  
  if (context.member && AuthorizationService.hasPermission(context.permissions, permissionSlug)) {
    return context;
  }
  
  // Also check if they are a PLATFORM_ADMIN (super override)
  if (AuthorizationService.hasRole(context.roles, ROLES.PLATFORM_ADMIN)) {
    return context;
  }

  redirect("/unauthorized");
}

/**
 * Server Guard: Ensures the current user possesses a specific role within the tenant context.
 * Redirects if unauthorized.
 */
export async function requireRole(roleSlug: string, tenant: TenantContext): Promise<AuthorizationContext> {
  const context = await resolveAuthorizationContext(tenant);
  
  if (context.member && AuthorizationService.hasRole(context.roles, roleSlug)) {
    return context;
  }
  
  if (AuthorizationService.hasRole(context.roles, ROLES.PLATFORM_ADMIN)) {
    return context;
  }

  redirect("/unauthorized");
}
