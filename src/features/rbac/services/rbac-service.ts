import { RoleRepository } from '@/lib/mock/repositories/role-repository';
import { RoleDefinition, PermissionKey, PermissionItem, UserRoleAssignment, PermissionOverride } from '@/types/rbac';

export class RbacService {
  static async getRoles(): Promise<RoleDefinition[]> {
    return RoleRepository.findAllRoles();
  }

  static async getAllPermissions(): Promise<PermissionItem[]> {
    return RoleRepository.getAllPermissions();
  }

  static async updateRolePermissions(roleCode: string, permissions: PermissionKey[]): Promise<RoleDefinition> {
    return RoleRepository.updateRolePermissions(roleCode, permissions);
  }

  static async createCustomRole(data: Omit<RoleDefinition, 'id' | 'memberCount' | 'isCustom'>): Promise<RoleDefinition> {
    return RoleRepository.createCustomRole(data);
  }

  static async getUserAssignments(): Promise<UserRoleAssignment[]> {
    return RoleRepository.findAllUserAssignments();
  }

  static async assignUserRole(memberId: string, roleCode: string): Promise<UserRoleAssignment> {
    return RoleRepository.assignUserRole(memberId, roleCode);
  }

  static async getUserOverride(memberId: string): Promise<PermissionOverride | null> {
    return RoleRepository.getUserOverride(memberId);
  }

  static async setUserOverride(override: PermissionOverride): Promise<PermissionOverride> {
    return RoleRepository.setUserOverride(override);
  }
}
