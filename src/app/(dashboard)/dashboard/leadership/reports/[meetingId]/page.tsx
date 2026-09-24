import { MeetingReportPageView } from "@/features/leadership/components/meeting-report-page-view";

export const metadata = {
  title: "Meeting Report | Chapter Leadership | Growcle",
  description: "Executive chapter meeting attendance, fee collection, and turnout report.",
};

interface PageProps {
  params: Promise<{
    meetingId: string;
  }>;
}

export default async function MeetingReportPage({ params }: PageProps) {
  const { meetingId } = await params;
  return <MeetingReportPageView meetingId={meetingId} />;
}
