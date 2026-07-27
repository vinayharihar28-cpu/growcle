'use client';

import { create } from 'zustand';
import { PermissionKey, RoleDefinition, PermissionOverride } from '@/types/rbac';
import { can, canAny, canAll, UserPermissionContext } from './permission-engine';

// Default Admin Role for demo/test context
const DEFAULT_ROLE: RoleDefinition = {
  id: 'role-org-admin',
  name: 'Organization Admin',
  code: 'ORG_ADMIN',
  description: 'Full management access to chapter members, meetings, and local settings',
  scope: 'ORGANIZATION',
  isCustom: false,
  memberCount: 8,
  permissions: [
    'members.view',
    'members.create',
    'members.edit',
    'members.delete',
    'meetings.view',
    'meetings.create',
    'meetings.edit',
    'meetings.attendance',
    'chapters.view',
    'chapters.manage',
    'rbac.roles_manage',
    'rbac.assign',
    'reports.view',
    'system.branding',
  ],
};

interface PermissionsState {
  currentRole: RoleDefinition;
  userOverrides: PermissionOverride;
  isSuperAdmin: boolean;
  setCurrentRole: (role: RoleDefinition) => void;
  setUserOverrides: (overrides: PermissionOverride) => void;
  toggleSuperAdmin: () => void;
}

export const usePermissionsStore = create<PermissionsState>((set) => ({
  currentRole: DEFAULT_ROLE,
  userOverrides: {
    memberId: 'usr-1',
    grantedPermissions: [],
    revokedPermissions: [],
  },
  isSuperAdmin: false,
  setCurrentRole: (role) => set({ currentRole: role }),
  setUserOverrides: (userOverrides) => set({ userOverrides }),
  toggleSuperAdmin: () => set((state) => ({ isSuperAdmin: !state.isSuperAdmin })),
}));

export function usePermissions() {
  const { currentRole, userOverrides, isSuperAdmin } = usePermissionsStore();

  const context: UserPermissionContext = {
    role: currentRole,
    overrides: userOverrides,
    isSuperAdmin,
  };

  return {
    currentRole,
    isSuperAdmin,
    can: (permission: PermissionKey) => can(permission, context),
    canAny: (permissions: PermissionKey[]) => canAny(permissions, context),
    canAll: (permissions: PermissionKey[]) => canAll(permissions, context),
    hasRole: (roleCode: string) => currentRole.code === roleCode || isSuperAdmin,
  };
}
