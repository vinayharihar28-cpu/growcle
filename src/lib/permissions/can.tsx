'use client';

import { ReactNode } from 'react';
import { PermissionKey } from '@/types/rbac';
import { usePermissions } from './use-permissions';

interface CanProps {
  perform: PermissionKey | PermissionKey[];
  requireAll?: boolean;
  fallback?: ReactNode;
  children: ReactNode;
}

/**
 * Declarative component for conditional rendering based on RBAC permissions
 * Example:
 * <Can perform="members.create" fallback={<p>Unauthorized</p>}>
 *   <AddMemberButton />
 * </Can>
 */
export function Can({ perform, requireAll = false, fallback = null, children }: CanProps) {
  const { can, canAny, canAll } = usePermissions();

  let hasAccess = false;

  if (Array.isArray(perform)) {
    hasAccess = requireAll ? canAll(perform) : canAny(perform);
  } else {
    hasAccess = can(perform);
  }

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
