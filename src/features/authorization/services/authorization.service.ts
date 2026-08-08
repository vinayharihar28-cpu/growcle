import type { Role, Permission, Member } from "@prisma/client";
import { getRolesForMember, getPermissionsForMember } from "../repositories/rbac.repository";

export class AuthorizationService {
  /**
   * Checks if a member possesses a specific role slug.
   */
  public static hasRole(roles: Role[], roleSlug: string): boolean {
    return roles.some((r) => r.name === roleSlug);
  }

  /**
   * Checks if a member possesses a specific permission slug.
   */
  public static hasPermission(permissions: Permission[], permissionSlug: string): boolean {
    return permissions.some((p) => p.action === permissionSlug);
  }

  /**
   * Checks if a member possesses ANY of the provided permission slugs.
   */
  public static hasAnyPermission(permissions: Permission[], permissionSlugs: string[]): boolean {
    return permissionSlugs.some((slug) => this.hasPermission(permissions, slug));
  }

  /**
   * Checks if a member possesses ALL of the provided permission slugs.
   */
  public static hasAllPermissions(permissions: Permission[], permissionSlugs: string[]): boolean {
    return permissionSlugs.every((slug) => this.hasPermission(permissions, slug));
  }

  /**
   * Evaluates if a member is authorized to access a specific Organization context.
   * Basic implementation: Checks if the member belongs to the organization.
   */
  public static canAccessOrganization(member: Member, organizationId: string): boolean {
    return member.organizationId === organizationId;
  }

  /**
   * Evaluates if a member is authorized to access a specific Chapter context.
   * Basic implementation: Checks if the member belongs to the chapter.
   */
  public static canAccessChapter(member: Member, chapterId: string): boolean {
    return member.chapterId === chapterId;
  }

  /**
   * Resolves the full authorization profile for a member directly from the database.
   */
  public static async resolveMemberProfile(memberId: string) {
    const [roles, permissions] = await Promise.all([
      getRolesForMember(memberId),
      getPermissionsForMember(memberId),
    ]);
    return { roles, permissions };
  }
}
