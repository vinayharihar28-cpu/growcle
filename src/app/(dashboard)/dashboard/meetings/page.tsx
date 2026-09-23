import { Metadata } from "next";
import { MeetingsManagementView } from "@/features/director/components/meetings-management-view";

export const metadata: Metadata = {
  title: "Meetings Oversight & Scheduling | Admin Operations",
  description: "Manage chapter weekly meeting schedules, presentations, venues, and regular meeting cycles.",
};

export default function MeetingsPage() {
  return <MeetingsManagementView />;
}
