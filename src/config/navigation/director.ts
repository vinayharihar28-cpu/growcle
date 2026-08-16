import { WorkspaceConfig } from './types';

export const directorNavigationConfig: WorkspaceConfig = {
  id: 'director',
  label: 'Director Workspace',
  description: 'Manage assigned chapters, leadership teams, members, and performance',
  badge: 'Director',
  navigation: [
    {
      groupTitle: 'Overview',
      items: [
        {
          title: 'Dashboard',
          href: '/dashboard/director',
          iconName: 'LayoutDashboard',
        },
      ],
    },
    {
      groupTitle: 'Chapter & Roster',
      items: [
        {
          title: 'Assigned Chapters',
          href: '/dashboard/director/chapters',
          iconName: 'Building2',
        },
        {
          title: 'Members',
          href: '/dashboard/director/members',
          iconName: 'Users',
        },
        {
          title: 'Leadership',
          href: '/dashboard/director/leadership',
          iconName: 'UserCheck',
        },
        {
          title: 'Visitors',
          href: '/dashboard/director/visitors',
          iconName: 'UserPlus',
        },
      ],
    },
    {
      groupTitle: 'Operations',
      items: [
        {
          title: 'Meetings',
          href: '/dashboard/director/meetings',
          iconName: 'Calendar',
        },
        {
          title: 'Attendance',
          href: '/dashboard/director/attendance',
          iconName: 'ClipboardCheck',
        },
      ],
    },
    {
      groupTitle: 'Networking',
      items: [
        {
          title: 'Referrals',
          href: '/dashboard/director/referrals',
          iconName: 'Handshake',
        },
        {
          title: '1-to-1 Meetings',
          href: '/dashboard/director/one-to-ones',
          iconName: 'MessagesSquare',
        },
      ],
    },
    {
      groupTitle: 'Finance & Analytics',
      items: [
        {
          title: 'Payments',
          href: '/dashboard/director/payments',
          iconName: 'CreditCard',
        },
        {
          title: 'Notifications',
          href: '/dashboard/director/notifications',
          iconName: 'BellRing',
        },
        {
          title: 'Reports & Analytics',
          href: '/dashboard/director/reports',
          iconName: 'BarChart3',
        },
      ],
    },
  ],
};
