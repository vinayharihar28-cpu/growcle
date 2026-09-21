import { RoleWorkspaceSkeleton } from "@/shared/components/layout/role-workspace-skeleton";

export default function LeadershipLoading() {
  return (
    <RoleWorkspaceSkeleton
      roleName="Leadership Team"
      description="Loading chapter operations, upcoming meetings, attendance rosters, and visitor logs..."
    />
  );
}
