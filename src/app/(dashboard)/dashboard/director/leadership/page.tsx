import { LeadershipManagementView } from "@/features/director/components/leadership-management-view";

export const metadata = {
  title: "Leadership Management | Director Dashboard | Growcle",
  description: "Manage President, Vice President, and Treasurer assignments across assigned chapters.",
};

export default function DirectorLeadershipPage() {
  return <LeadershipManagementView />;
}
