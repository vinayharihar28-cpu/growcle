import { MemberDashboardView } from "@/features/member/components/member-dashboard-view";

export const metadata = {
  title: "Member Workspace | Growcle",
  description: "Primary networking workspace for chapter members.",
};

export default function MemberDashboardRoute() {
  return <MemberDashboardView />;
}
