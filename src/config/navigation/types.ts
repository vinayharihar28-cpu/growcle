import { PermissionKey } from '@/types/rbac';

export type WorkspaceType =
  | 'member'
  | 'chapter-admin'
  | 'organization-admin'
  | 'finance'
  | 'platform-admin';

export interface NavItem {
  title: string;
  href: string;
  iconName: string;
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

export interface SettingsSection {
  id: string;
  title: string;
  description: string;
  requiredPermission?: PermissionKey;
}
