import { MembersDataTable } from "@/features/members/components/members-data-table";
import { Button } from "@/shared/components/ui/button";

export default function RosterPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Chapter Roster</h2>
          <p className="text-muted-foreground">Manage active members and pending applications.</p>
        </div>
        <div className="space-x-2">
          <Button variant="outline">Import CSV</Button>
          <Button>Add Member</Button>
        </div>
      </div>
      <MembersDataTable />
    </div>
  );
}
