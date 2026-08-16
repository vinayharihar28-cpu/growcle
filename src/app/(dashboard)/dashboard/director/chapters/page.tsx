import { ChaptersManagementView } from "@/features/director/components/chapters-management-view";

export const metadata = {
  title: "Assigned Chapters | Director Dashboard | Growcle",
  description: "Manage and compare operations across all chapters in your assigned director region.",
};

export default function ChaptersPage() {
  return <ChaptersManagementView />;
}
