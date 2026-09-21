import { RoleWorkspaceSkeleton } from "@/shared/components/layout/role-workspace-skeleton";

export default function MemberLoading() {
  return (
    <RoleWorkspaceSkeleton
      roleName="Member Networking"
      description="Loading personal networking KPIs, referrals, 1-to-1 meetings, and chapter directory..."
    />
  );
}
