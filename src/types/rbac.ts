export type RoleScope = 'GLOBAL' | 'ORGANIZATION' | 'CHAPTER';

export type PermissionAction = 'view' | 'create' | 'edit' | 'delete' | 'approve' | 'export';

export type PermissionKey =
  | 'members.view'
  | 'members.create'
  | 'members.edit'
  | 'members.delete'
  | 'meetings.view'
  | 'meetings.create'
  | 'meetings.edit'
  | 'meetings.attendance'
  | 'chapters.view'
  | 'chapters.manage'
  | 'rbac.roles_manage'
  | 'rbac.assign'
  | 'finance.view'
  | 'finance.manage'
  | 'reports.view'
  | 'system.branding';

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
