import { Metadata } from "next";
import { ChaptersManagementView } from "@/features/director/components/chapters-management-view";

export const metadata: Metadata = {
  title: "Chapter Management | Admin & Director Operations",
  description: "Create, edit, assign, deactivate, and configure chapters across all days and regions.",
};

export default function ChaptersPage() {
  return <ChaptersManagementView />;
}
