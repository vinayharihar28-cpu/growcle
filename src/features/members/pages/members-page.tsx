import { MembersDataTable } from "../components/members-data-table";

export default function MembersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Members</h2>
        <p className="text-muted-foreground">Manage and view your networking community.</p>
      </div>
      <MembersDataTable />
    </div>
  );
}
