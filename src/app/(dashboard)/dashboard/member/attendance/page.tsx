import { MemberAttendanceView } from "@/features/member/components/member-attendance-view";

export const metadata = {
  title: "My Attendance | Member Workspace | Growcle",
  description: "Monitor personal attendance reliability and history.",
};

export default function MemberAttendancePage() {
  return <MemberAttendanceView />;
}
