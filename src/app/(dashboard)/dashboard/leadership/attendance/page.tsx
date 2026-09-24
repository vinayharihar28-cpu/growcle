import { redirect } from "next/navigation";

export default async function LeadershipAttendancePage({
  searchParams,
}: {
  searchParams?: Promise<{ meetingId?: string }>;
}) {
  const params = await searchParams;
  const meetingId = params?.meetingId;
  if (meetingId) {
    redirect(`/dashboard/leadership/meetings?meetingId=${encodeURIComponent(meetingId)}`);
  }
  redirect("/dashboard/leadership/meetings");
}
