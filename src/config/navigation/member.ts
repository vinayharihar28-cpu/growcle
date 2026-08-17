import { WorkspaceConfig } from './types';

export const memberNavigationConfig: WorkspaceConfig = {
  id: 'member',
  label: 'Member Workspace',
  description: 'Your personal networking hub, referrals, and 1-on-1 meetings',
  badge: 'Member',
  navigation: [
    {
      groupTitle: 'Core',
      items: [
        { title: 'Dashboard', href: '/dashboard/member', iconName: 'LayoutDashboard' },
        { title: 'Business Profile', href: '/dashboard/profile', iconName: 'User' },
        { title: 'Upcoming Meetings', href: '/dashboard/meetings', iconName: 'Calendar' },
      ],
    },
    {
      groupTitle: 'Networking & Referrals',
      items: [
        { title: 'Business Referrals', href: '/dashboard/referrals', iconName: 'Share2' },
        { title: '1-on-1 Meetings', href: '/dashboard/one-to-ones', iconName: 'Users2' },
        { title: 'Visitors Log', href: '/dashboard/visitors', iconName: 'UserCheck' },
      ],
    },
  ],
};
