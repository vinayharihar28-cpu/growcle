import { DirectorDashboardView } from "@/features/director/components/director-dashboard-view";

export const metadata = {
  title: "Admin Dashboard | Growcle",
  description: "Manage chapters, leadership teams, members, and operations.",
};

export default function AdminDashboardRoute() {
  return <DirectorDashboardView />;
}
