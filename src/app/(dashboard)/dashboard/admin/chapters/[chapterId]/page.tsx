import { ChapterDetailsPage } from "@/features/chapters/pages/chapter-details-page";

export default async function AdminChapterDetailsRoute({
  params,
}: {
  params: Promise<{ chapterId: string }>;
}) {
  const resolvedParams = await params;
  return <ChapterDetailsPage chapterId={resolvedParams.chapterId} />;
}
