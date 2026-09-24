import { Suspense } from "react";
import { LeadershipMeetingsView } from "@/features/leadership/components/leadership-meetings-view";

export const metadata = {
  title: "Chapter Meetings | Leadership Dashboard | Growcle",
  description: "Schedule chapter meetings, manage agendas, collect meeting fees, and track attendance.",
};

export default function LeadershipMeetingsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-muted-foreground text-sm">
          Loading chapter meetings...
        </div>
      }
    >
      <LeadershipMeetingsView />
    </Suspense>
  );
}
