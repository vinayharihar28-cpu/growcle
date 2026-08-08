export type RoleScope = 'GLOBAL' | 'ORGANIZATION' | 'CHAPTER';

export type PermissionAction = 'view' | 'create' | 'edit' | 'delete' | 'approve' | 'export';

// Permission identifiers are owned by the backend. Keep this open so newly
// created backend permissions appear in the management UI without a frontend release.
export type PermissionKey = string;

export interface PermissionItem {
  key: PermissionKey;
  label: string;
  description: string;
  category: 'Members' | 'Meetings' | 'Chapters' | 'RBAC & Access' | 'Finance' | 'System';
}

export interface RoleDefinition {
  id: string;
  name: string;
  code: string;
  description: string;
  scope: RoleScope;
  isCustom: boolean;
  memberCount: number;
  permissions: PermissionKey[];
}

export interface PermissionCategoryGroup {
  category: string;
  permissions: PermissionItem[];
}

export interface UserRoleAssignment {
  memberId: string;
  memberName: string;
  memberEmail: string;
  chapterName: string;
  roleCode: string;
  roleName: string;
  assignedAt: string;
}

export interface PermissionOverride {
  memberId: string;
  grantedPermissions: PermissionKey[];
  revokedPermissions: PermissionKey[];
}
