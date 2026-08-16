import { ReferralsManagementView } from "@/features/director/components/referrals-management-view";

export const metadata = {
  title: "Referral Pipeline | Director Dashboard | Growcle",
  description: "Monitor referral volumes, deal value, and closed business across assigned chapters.",
};

export default function DirectorReferralsPage() {
  return <ReferralsManagementView />;
}
