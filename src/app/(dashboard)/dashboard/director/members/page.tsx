import { MembersManagementView } from "@/features/director/components/members-management-view";

export const metadata = {
  title: "Members Management | Director Dashboard | Growcle",
  description: "Manage members, update profiles, and assign member roles across assigned chapters.",
};

export default function DirectorMembersPage() {
  return <MembersManagementView />;
}
