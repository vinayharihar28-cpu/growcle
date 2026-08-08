import { RoleDefinition, PermissionKey, PermissionItem, UserRoleAssignment } from '@/types/rbac';
import { assignRbacRole, createRbacRole, getRbacAssignments, getRbacPermissions, getRbacRoles, updateRbacRolePermissions } from "../actions/rbac";

export class RbacService {
  static async getRoles(): Promise<RoleDefinition[]> {
    return getRbacRoles();
  }

  static async getAllPermissions(): Promise<PermissionItem[]> {
    return getRbacPermissions();
  }

  static async updateRolePermissions(roleCode: string, permissions: PermissionKey[]): Promise<RoleDefinition> {
    return updateRbacRolePermissions(roleCode, permissions);
  }

  static async createCustomRole(data: Omit<RoleDefinition, 'id' | 'memberCount' | 'isCustom'>): Promise<RoleDefinition> {
    return createRbacRole(data);
  }

  static async getUserAssignments(): Promise<UserRoleAssignment[]> {
    return getRbacAssignments();
  }

  static async assignUserRole(memberId: string, roleCode: string): Promise<UserRoleAssignment> {
    return assignRbacRole(memberId, roleCode);
  }
}
