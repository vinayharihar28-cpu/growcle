import { Metadata } from "next";
import { ReferralsManagementView } from "@/features/director/components/referrals-management-view";

export const metadata: Metadata = {
  title: "Referral Pipeline Oversight | Admin Operations",
  description: "Track chapter referrals, closed business generated, and cross-chapter synergies.",
};

export default function ReferralsPage() {
  return <ReferralsManagementView />;
}
