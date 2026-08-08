import { PermissionKey, RoleDefinition, PermissionOverride } from '@/types/rbac';

export interface UserPermissionContext {
  role: RoleDefinition;
  overrides?: PermissionOverride;
  isSuperAdmin?: boolean;
}

/**
 * Core Permission Evaluator
 * Evaluates whether a given user context possesses a specific permission key.
 */
export function can(
  permission: PermissionKey,
  context?: UserPermissionContext | null
): boolean {
  if (!context) return false;

  // Super Admin has unrestricted system bypass
  if (context.isSuperAdmin || context.role?.code === 'SUPER_ADMIN') {
    return true;
  }

  const { role, overrides } = context;

  // Check explicit revokes in user override
  if (overrides?.revokedPermissions?.includes(permission)) {
    return false;
  }

  // Check explicit grants in user override
  if (overrides?.grantedPermissions?.includes(permission)) {
    return true;
  }

  // Fallback to role definition permissions
  return role?.permissions?.includes(permission) ?? false;
}

/**
 * Evaluates multiple permissions with OR condition
 */
export function canAny(
  permissions: PermissionKey[],
  context?: UserPermissionContext | null
): boolean {
  return permissions.some((p) => can(p, context));
}

/**
 * Evaluates multiple permissions with AND condition
 */
export function canAll(
  permissions: PermissionKey[],
  context?: UserPermissionContext | null
): boolean {
  return permissions.every((p) => can(p, context));
}
