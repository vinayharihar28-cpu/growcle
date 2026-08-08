import { db } from "@/shared/lib/db";
import type { Role, Permission } from "@prisma/client";

/**
 * Retrieves all roles assigned to a specific member.
 */
export async function getRolesForMember(memberId: string): Promise<Role[]> {
  const memberRoles = await db.memberRole.findMany({
    where: { memberId },
    include: {
      role: true,
    },
  });
  
  return memberRoles.map((mr) => mr.role);
}

/**
 * Retrieves a flat list of all unique permissions granted to a specific member 
 * through all of their assigned roles.
 */
export async function getPermissionsForMember(memberId: string): Promise<Permission[]> {
  const roles = await getRolesForMember(memberId);
  const roleIds = roles.map(r => r.id);
  
  if (roleIds.length === 0) return [];

  const rolePermissions = await db.rolePermission.findMany({
    where: {
      roleId: { in: roleIds }
    },
    include: {
      permission: true,
    }
  });
  
  // Deduplicate permissions (in case multiple roles grant the same permission)
  const permissionMap = new Map<string, Permission>();
  rolePermissions.forEach(rp => {
    permissionMap.set(rp.permission.action, rp.permission);
  });
  
  return Array.from(permissionMap.values());
}
