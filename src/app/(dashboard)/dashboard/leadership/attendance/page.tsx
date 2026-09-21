import { Suspense } from "react";
import { LeadershipAttendanceView } from "@/features/leadership/components/leadership-attendance-view";

export const metadata = {
  title: "Meeting Attendance | Leadership Dashboard | Growcle",
  description: "Live 1-click meeting attendance sheet and participation recording.",
};

export default function LeadershipAttendancePage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-muted-foreground">
          Loading meeting attendance sheet...
        </div>
      }
    >
      <LeadershipAttendanceView />
    </Suspense>
  );
}
