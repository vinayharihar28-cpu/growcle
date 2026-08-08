import { VisitorsDataTable } from "../components/visitors-data-table";

export default function VisitorsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Visitors</h2>
        <p className="text-muted-foreground">Manage guests and prospective members.</p>
      </div>
      <VisitorsDataTable />
    </div>
  );
}
