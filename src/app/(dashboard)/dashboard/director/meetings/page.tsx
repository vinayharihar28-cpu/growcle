import { MeetingsManagementView } from "@/features/director/components/meetings-management-view";

export const metadata = {
  title: "Meetings Oversight | Director Dashboard | Growcle",
  description: "Monitor weekly meeting schedules, speakers, and agendas across assigned chapters.",
};

export default function DirectorMeetingsPage() {
  return <MeetingsManagementView />;
}
