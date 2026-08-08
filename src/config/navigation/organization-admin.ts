import { WorkspaceConfig } from './types';

export const organizationAdminNavigationConfig: WorkspaceConfig = {
  id: 'organization-admin',
  label: 'Organization Administration',
  description: 'Manage all local chapters, custom branding, and executive roles',
  badge: 'Org Admin',
  navigation: [
    {
      groupTitle: 'Local Chapters',
      items: [
        { title: 'Org Overview', href: '/dashboard', iconName: 'LayoutDashboard', requiredPermission: 'chapters.view' },
        { title: 'Chapters list', href: '/dashboard/chapter/goals', iconName: 'Building', requiredPermission: 'chapters.view' },
        { title: 'All Members', href: '/dashboard/members', iconName: 'Users', requiredPermission: 'members.view' },
      ],
    },
    {
      groupTitle: 'Customization & Branding',
      items: [
        { title: 'White-Label Branding', href: '/dashboard/super-admin/branding', iconName: 'Palette', requiredPermission: 'system.branding' },
      ],
    },
  ],
};
