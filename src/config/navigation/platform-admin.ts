import { WorkspaceConfig } from './types';

export const platformAdminNavigationConfig: WorkspaceConfig = {
  id: 'platform-admin',
  label: 'Platform Administration',
  description: 'Global SaaS dashboard, tenant subscriptions, and system health tools',
  badge: 'Platform Admin',
  navigation: [
    {
      groupTitle: 'Platform Controls',
      items: [
        { title: 'SaaS Overview', href: '/dashboard', iconName: 'LayoutDashboard' },
        { title: 'Organizations & Tenants', href: '/dashboard/super-admin', iconName: 'Building' },
      ],
    },
  ],
};
