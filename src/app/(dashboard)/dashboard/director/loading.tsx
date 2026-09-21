import { RoleWorkspaceSkeleton } from "@/shared/components/layout/role-workspace-skeleton";

export default function DirectorLoading() {
  return (
    <RoleWorkspaceSkeleton
      roleName="Regional Director"
      description="Loading regional chapters, health scores, performance benchmarks, and leadership teams..."
    />
  );
}
