import { Metadata } from "next";
import { LeadershipManagementView } from "@/features/director/components/leadership-management-view";

export const metadata: Metadata = {
  title: "Leadership Team Assignment | Admin Operations",
  description: "Assign and oversee chapter Presidents, Vice Presidents, and Treasurers across all chapters.",
};

export default function LeadershipRoute() {
  return <LeadershipManagementView />;
}
