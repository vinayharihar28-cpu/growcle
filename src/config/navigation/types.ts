import { ComponentType } from 'react';
import { PermissionKey } from '@/types/rbac';

export type WorkspaceType = 'member' | 'admin' | 'super-admin' | 'finance';

export interface NavItem {
  title: string;
  href: string;
  iconName: string; // Lucide icon name string for serializability
  badge?: string;
  requiredPermission?: PermissionKey;
}

export interface NavGroup {
  groupTitle?: string;
  items: NavItem[];
}

export interface WorkspaceConfig {
  id: WorkspaceType;
  label: string;
  description: string;
  badge: string;
  navigation: NavGroup[];
}
