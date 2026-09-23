import { Metadata } from "next";
import { ReportsManagementView } from "@/features/director/components/reports-management-view";

export const metadata: Metadata = {
  title: "Reports & Analytics | Admin Operations",
  description: "Download chapter-wise and meeting-wise performance analytics, attendance, and revenue spreadsheets.",
};

export default function ReportsPage() {
  return <ReportsManagementView />;
}
