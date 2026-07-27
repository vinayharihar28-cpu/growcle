import { WorkspaceConfig } from './types';

export const adminNavigationConfig: WorkspaceConfig = {
  id: 'admin',
  label: 'Administration Workspace',
  description: 'Manage members, meetings, chapter settings, and permissions',
  badge: 'Admin',
  navigation: [
    {
      groupTitle: 'Management',
      items: [
        { title: 'Admin Overview', href: '/dashboard/administration', iconName: 'ShieldCheck', requiredPermission: 'members.view' },
        { title: 'Members Directory', href: '/dashboard/members', iconName: 'Users', requiredPermission: 'members.view' },
        { title: 'Meetings & Attendance', href: '/dashboard/meetings', iconName: 'Calendar', requiredPermission: 'meetings.view' },
        { title: 'Visitors & Guests', href: '/dashboard/visitors', iconName: 'UserPlus', requiredPermission: 'members.view' },
      ],
    },
    {
      groupTitle: 'Access & Governance',
      items: [
        { title: 'Roles & RBAC Matrix', href: '/dashboard/rbac', iconName: 'KeyRound', requiredPermission: 'rbac.roles_manage' },
        { title: 'Chapter Settings', href: '/dashboard/chapter/goals', iconName: 'Building2', requiredPermission: 'chapters.manage' },
      ],
    },
  ],
};
