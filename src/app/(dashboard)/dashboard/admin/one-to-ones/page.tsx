import { OneToOnesTable } from "@/features/networking/components/one-to-ones-table";

export default function AdminOneToOnesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">1-to-1 Meetings (Admin Oversight)</h2>
        <p className="text-muted-foreground">Monitor relationship-building meetings and engagement across all chapters.</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <OneToOnesTable />
      </div>
    </div>
  );
}
