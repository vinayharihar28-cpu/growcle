import type { User, Member, Role, Permission } from "@prisma/client";

/**
 * The unified Authorization Context.
 * This is resolved after authentication and provides all necessary data 
 * to make authorization decisions without querying the database repeatedly.
 */
export interface AuthorizationContext {
  /** The authenticated User identity */
  user: User;
  
  /** The Member profile associated with the user */
  member: Member | null;
  
  /** An array of all roles assigned to this member */
  roles: Role[];
  
  /** 
   * A flat array of all permissions granted to this member 
   * (computed by aggregating all RolePermissions associated with their Roles)
   */
  permissions: Permission[];
}

/**
 * Common tenant parameters required for authorization checks.
 * A member might belong to an organization and/or a specific chapter.
 */
export interface TenantContext {
  organizationId?: string;
  chapterId?: string;
}
