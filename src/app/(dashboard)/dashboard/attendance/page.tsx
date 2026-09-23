import { Metadata } from "next";
import { AttendanceManagementView } from "@/features/director/components/attendance-management-view";

export const metadata: Metadata = {
  title: "Attendance Monitoring | Admin Operations",
  description: "Monitor chapter-wise attendance rates, present/absent stats, and reliability across all chapters.",
};

export default function AttendancePage() {
  return <AttendanceManagementView />;
}
