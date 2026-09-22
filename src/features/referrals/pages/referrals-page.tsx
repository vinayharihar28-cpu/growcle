import { ReferralsDataTable } from "../components/referrals-data-table";

export default function ReferralsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Platform Referrals</h2>
        <p className="text-muted-foreground">Monitor and audit all business referrals passed across chapters and members.</p>
      </div>
      <div className="w-full">
        <ReferralsDataTable />
      </div>
    </div>
  );
}
