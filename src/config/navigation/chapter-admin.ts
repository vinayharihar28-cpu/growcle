import { WorkspaceConfig } from './types';

export const chapterAdminNavigationConfig: WorkspaceConfig = {
  id: 'chapter-admin',
  label: 'Chapter Administration',
  description: 'Manage weekly chapter operations, meeting agendas, and members',
  badge: 'Chapter Admin',
  navigation: [
    {
      groupTitle: 'Operations',
      items: [
        { title: 'Chapter Overview', href: '/dashboard', iconName: 'LayoutDashboard', requiredPermission: 'members.view' },
        { title: 'Members Directory', href: '/dashboard/members', iconName: 'Users', requiredPermission: 'members.view' },
        { title: 'Meetings & Attendance', href: '/dashboard/meetings', iconName: 'Calendar', requiredPermission: 'meetings.view' },
        { title: 'Visitors Log', href: '/dashboard/visitors', iconName: 'UserPlus', requiredPermission: 'members.view' },
      ],
    },
    {
      groupTitle: 'Governance',
      items: [
        { title: 'Chapter Settings', href: '/dashboard/chapter/goals', iconName: 'Building2', requiredPermission: 'chapters.manage' },
      ],
    },
  ],
};
