'use client';

import { useState, useEffect, useCallback } from 'react';
import { RbacService } from '../services/rbac-service';
import { RoleDefinition, PermissionItem, PermissionKey, UserRoleAssignment } from '@/types/rbac';

export function useRbac() {
  const [roles, setRoles] = useState<RoleDefinition[]>([]);
  const [permissions, setPermissions] = useState<PermissionItem[]>([]);
  const [assignments, setAssignments] = useState<UserRoleAssignment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [rolesData, permsData, assignData] = await Promise.all([
        RbacService.getRoles(),
        RbacService.getAllPermissions(),
        RbacService.getUserAssignments(),
      ]);

      setRoles(rolesData);
      setPermissions(permsData);
      setAssignments(assignData);
    } catch (err) {
      console.error('Failed to fetch RBAC state', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(fetchAll);
  }, [fetchAll]);

  const togglePermissionForRole = async (roleCode: string, permissionKey: PermissionKey) => {
    const role = roles.find((r) => r.code === roleCode);
    if (!role) return;

    let updatedPermissions: PermissionKey[];
    if (role.permissions.includes(permissionKey)) {
      updatedPermissions = role.permissions.filter((p) => p !== permissionKey);
    } else {
      updatedPermissions = [...role.permissions, permissionKey];
    }

    // Optimistic UI update
    setRoles((prev) => prev.map((r) => (r.code === roleCode ? { ...r, permissions: updatedPermissions } : r)));

    await RbacService.updateRolePermissions(roleCode, updatedPermissions);
  };

  const createRole = async (data: Omit<RoleDefinition, 'id' | 'memberCount' | 'isCustom'>) => {
    const newRole = await RbacService.createCustomRole(data);
    await fetchAll();
    return newRole;
  };

  const assignRoleToUser = async (memberId: string, roleCode: string) => {
    const updated = await RbacService.assignUserRole(memberId, roleCode);
    setAssignments((prev) => prev.map((a) => (a.memberId === memberId ? updated : a)));
  };

  return {
    roles,
    permissions,
    assignments,
    loading,
    refresh: fetchAll,
    togglePermissionForRole,
    createRole,
    assignRoleToUser,
  };
}
