import { MemberMeetingsView } from "@/features/member/components/member-meetings-view";

export const metadata = {
  title: "Chapter Meetings | Member Workspace | Growcle",
  description: "View upcoming chapter sessions, keynote speakers, agendas, and self check-in.",
};

export default function MemberMeetingsPage() {
  return <MemberMeetingsView />;
}
