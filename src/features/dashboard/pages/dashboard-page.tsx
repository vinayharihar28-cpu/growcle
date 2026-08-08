'use client';

import { useWorkspaceStore } from '@/shared/stores/workspace';
import { MemberDashboard } from '../components/member-dashboard';
import { ChapterAdminDashboard } from '../components/chapter-admin-dashboard';
import { OrgAdminDashboard } from '../components/org-admin-dashboard';
import { FinanceDashboard } from '../components/finance-dashboard';
import { PlatformAdminDashboard } from '../components/platform-admin-dashboard';

export default function DashboardPage() {
  const { activeRole } = useWorkspaceStore();

  switch (activeRole) {
    case 'Admin':
    case 'Organization Administrator':
      return <ChapterAdminDashboard />;
    case 'Finance':
    case 'Treasurer':
      return <FinanceDashboard />;
    case 'SuperAdmin':
      return <PlatformAdminDashboard />;
    case 'Member':
    case 'Vice President':
    case 'Secretary':
    default:
      return <MemberDashboard />;
  }
}
