import { AttendanceManagementView } from "@/features/director/components/attendance-management-view";

export const metadata = {
  title: "Attendance Monitoring | Director Dashboard | Growcle",
  description: "Monitor chapter attendance rates, absences, and substitutes.",
};

export default function DirectorAttendancePage() {
  return <AttendanceManagementView />;
}
