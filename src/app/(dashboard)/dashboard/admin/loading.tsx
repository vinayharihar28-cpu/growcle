import { RoleWorkspaceSkeleton } from "@/shared/components/layout/role-workspace-skeleton";

export default function AdminLoading() {
  return (
    <RoleWorkspaceSkeleton
      roleName="Platform Admin"
      description="Loading system analytics, organizations, chapters, and audit logs..."
    />
  );
}
