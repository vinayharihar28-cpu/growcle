import { Metadata } from "next";
import { VisitorsManagementView } from "@/features/director/components/visitors-management-view";

export const metadata: Metadata = {
  title: "Visitors Oversight & Conversion | Admin Operations",
  description: "Monitor chapter visitors, attendance, follow-ups, and convert guests to active members.",
};

export default function VisitorsPage() {
  return <VisitorsManagementView />;
}
