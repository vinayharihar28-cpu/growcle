import { ReferralsDataTable } from "../components/referrals-data-table";
import { CreateReferralForm } from "../components/create-referral-form";

export default function ReferralsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Referrals</h2>
        <p className="text-muted-foreground">Manage the business opportunities passed within your network.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <ReferralsDataTable />
        </div>
        <div>
          <CreateReferralForm />
        </div>
      </div>
    </div>
  );
}
