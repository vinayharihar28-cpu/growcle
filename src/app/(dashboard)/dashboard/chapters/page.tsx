import { ChapterListPage } from "@/features/chapters/pages/chapter-list-page";

export default async function ChaptersRoute({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const isCreateOpen = resolvedParams.create === 'true';

  return <ChapterListPage initialCreateOpen={isCreateOpen} />;
}
