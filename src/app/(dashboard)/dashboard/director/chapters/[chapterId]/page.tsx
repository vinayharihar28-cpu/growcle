import { ChapterDetailView } from "@/features/director/components/chapter-detail-view";

export const metadata = {
  title: "Chapter Details | Director Dashboard | Growcle",
  description: "Detailed view of members, leadership, meetings, and performance for a chapter.",
};

export default async function ChapterDetailPage({
  params,
}: {
  params: Promise<{ chapterId: string }>;
}) {
  const { chapterId } = await params;
  return <ChapterDetailView chapterId={chapterId} />;
}
