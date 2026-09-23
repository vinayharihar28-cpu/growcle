import { Metadata } from "next";
import { MembersManagementView } from "@/features/director/components/members-management-view";

export const metadata: Metadata = {
  title: "Members Directory & Oversight | Admin & Director Operations",
  description: "Add, edit, transfer, delete, and manage chapter members across the network.",
};

export default function MembersPage() {
  return <MembersManagementView />;
}
