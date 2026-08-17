'use client';

import { useWorkspaceStore } from '@/shared/stores/workspace';
import { MemberDashboard } from '../components/member-dashboard';
import { ChapterAdminDashboard } from '../components/chapter-admin-dashboard';
import { OrgAdminDashboard } from '../components/org-admin-dashboard';
import { FinanceDashboard } from '../components/finance-dashboard';
import { PlatformAdminDashboard } from '../components/platform-admin-dashboard';

// Placeholder dashboards
const DirectorDashboard = () => <div className="p-6 bg-card rounded-xl border shadow-sm"><h2 className="text-xl font-semibold mb-2">Director Dashboard</h2><p className="text-muted-foreground">Welcome to the Director view.</p></div>;
const LeadershipDashboard = () => <div className="p-6 bg-card rounded-xl border shadow-sm"><h2 className="text-xl font-semibold mb-2">Leadership Team Dashboard</h2><p className="text-muted-foreground">Welcome to the Leadership Team view.</p></div>;
const MembershipDashboard = () => <div className="p-6 bg-card rounded-xl border shadow-sm"><h2 className="text-xl font-semibold mb-2">Membership Dashboard</h2><p className="text-muted-foreground">Welcome to the Membership view.</p></div>;

export default function DashboardPage() {
  const { activeRole } = useWorkspaceStore();

  switch (activeRole) {
    case 'Admin':
    case 'Organization Administrator':
      return <ChapterAdminDashboard />;
    case 'Director':
      return <DirectorDashboard />;
    case 'Leadership Team':
      return <LeadershipDashboard />;
    case 'Membership':
      return <MembershipDashboard />;
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
