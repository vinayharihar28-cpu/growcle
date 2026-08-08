'use client';

import { useWorkspaceStore } from '@/stores/use-workspace-store';
import { MemberDashboard } from '../components/member-dashboard';
import { ChapterAdminDashboard } from '../components/chapter-admin-dashboard';
import { OrgAdminDashboard } from '../components/org-admin-dashboard';
import { FinanceDashboard } from '../components/finance-dashboard';
import { PlatformAdminDashboard } from '../components/platform-admin-dashboard';

export default function DashboardPage() {
  const { activeWorkspace } = useWorkspaceStore();

  switch (activeWorkspace) {
    case 'chapter-admin':
      return <ChapterAdminDashboard />;
    case 'organization-admin':
      return <OrgAdminDashboard />;
    case 'finance':
      return <FinanceDashboard />;
    case 'platform-admin':
      return <PlatformAdminDashboard />;
    case 'member':
    default:
      return <MemberDashboard />;
  }
}
