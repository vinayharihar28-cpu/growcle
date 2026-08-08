import { MeetingsDataTable } from "../components/meetings-data-table";
import { Button } from "@/shared/components/ui/button";

export default function MeetingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Meetings</h2>
          <p className="text-muted-foreground">Manage your chapter's meeting schedule and attendance.</p>
        </div>
        <Button>Schedule Meeting</Button>
      </div>
      <MeetingsDataTable />
    </div>
  );
}
