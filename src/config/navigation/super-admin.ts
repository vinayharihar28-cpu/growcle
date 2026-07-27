import { WorkspaceConfig } from './types';

export const superAdminNavigationConfig: WorkspaceConfig = {
  id: 'super-admin',
  label: 'Super Admin Portal',
  description: 'Global SaaS tenant management, white-label branding & system setup',
  badge: 'Super Admin',
  navigation: [
    {
      groupTitle: 'System Control',
      items: [
        { title: 'Organizations', href: '/dashboard/super-admin', iconName: 'Building' },
        { title: 'White-Label Branding', href: '/dashboard/super-admin/branding', iconName: 'Palette' },
        { title: 'Global Roles & RBAC', href: '/dashboard/rbac', iconName: 'Lock' },
      ],
    },
  ],
};
