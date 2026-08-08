import { RoleDefinition, PermissionKey, PermissionItem, UserRoleAssignment, PermissionOverride } from '@/types/rbac';
import { MOCK_ROLES, ALL_PERMISSIONS, MOCK_USER_ASSIGNMENTS, MOCK_PERMISSIONS_OVERRIDE } from '../mock-store';

/**
 * RoleRepository
 * Abstracted async data repository for RBAC roles, permission matrices, user assignments, and overrides.
 */
export class RoleRepository {
  private static roles: RoleDefinition[] = [...MOCK_ROLES];
  private static userAssignments: UserRoleAssignment[] = [...MOCK_USER_ASSIGNMENTS];
  private static overrides: Record<string, PermissionOverride> = { ...MOCK_PERMISSIONS_OVERRIDE };

  static async findAllRoles(): Promise<RoleDefinition[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return [...this.roles];
  }

  static async findRoleByCode(code: string): Promise<RoleDefinition | null> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return this.roles.find((r) => r.code === code) || null;
  }

  static async getAllPermissions(): Promise<PermissionItem[]> {
    return ALL_PERMISSIONS;
  }

  static async updateRolePermissions(roleCode: string, permissions: PermissionKey[]): Promise<RoleDefinition> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const role = this.roles.find((r) => r.code === roleCode);
    if (!role) throw new Error('Role not found');

    role.permissions = permissions;
    return { ...role };
  }

  static async createCustomRole(data: Omit<RoleDefinition, 'id' | 'memberCount' | 'isCustom'>): Promise<RoleDefinition> {
    await new Promise((resolve) => setTimeout(resolve, 250));

    const newRole: RoleDefinition = {
      ...data,
      id: `role-${Date.now()}`,
      isCustom: true,
      memberCount: 0,
    };

    this.roles.push(newRole);
    return newRole;
  }

  static async findAllUserAssignments(): Promise<UserRoleAssignment[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return [...this.userAssignments];
  }

  static async assignUserRole(memberId: string, roleCode: string): Promise<UserRoleAssignment> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const assignment = this.userAssignments.find((u) => u.memberId === memberId);
    const roleDef = this.roles.find((r) => r.code === roleCode);

    if (!roleDef) throw new Error('Role not found');

    if (assignment) {
      assignment.roleCode = roleCode;
      assignment.roleName = roleDef.name;
      assignment.assignedAt = new Date().toISOString().split('T')[0];
      return { ...assignment };
    }

    throw new Error('User assignment record not found');
  }

  static async getUserOverride(memberId: string): Promise<PermissionOverride | null> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return this.overrides[memberId] || null;
  }

  static async setUserOverride(override: PermissionOverride): Promise<PermissionOverride> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    this.overrides[override.memberId] = override;
    return { ...override };
  }
}
