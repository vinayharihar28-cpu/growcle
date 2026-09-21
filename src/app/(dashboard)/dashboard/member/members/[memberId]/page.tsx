import { MemberDetailView } from "@/features/member/components/member-detail-view";

interface PageProps {
  params: Promise<{
    memberId: string;
  }>;
}

export const metadata = {
  title: "Member Profile | Chapter Directory | Growcle",
  description: "View chapter colleague profile, business competencies, and networking synergy prompts.",
};

export default async function ChapterMemberDetailPage({ params }: PageProps) {
  const { memberId } = await params;
  return <MemberDetailView memberId={memberId} />;
}
