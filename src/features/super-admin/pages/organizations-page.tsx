import { OrganizationsDataTable } from "@/features/super-admin/components/organizations-data-table";

export default function OrganizationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Organizations</h2>
        <p className="text-muted-foreground">Manage all tenants using your white-label SaaS.</p>
      </div>
      <div className="grid grid-cols-1 gap-6">
        <OrganizationsDataTable />
      </div>
    </div>
  );
}
