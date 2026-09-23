import { Metadata } from "next";
import { MemberMembershipView } from "@/features/member/components/member-membership-view";

export const metadata: Metadata = {
  title: "Membership Status & Payments | Growcle",
  description: "View 1-year chapter membership status, tenure, renewal dates, and submit annual dues via UPI.",
};

export default function MemberMembershipPage() {
  return <MemberMembershipView />;
}
