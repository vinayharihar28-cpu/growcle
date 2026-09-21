import { MemberReferralsView } from "@/features/member/components/member-referrals-view";

export const metadata = {
  title: "My Referrals | Member Workspace | Growcle",
  description: "Track given and received referrals and closed business transactions.",
};

export default function MemberReferralsPage() {
  return <MemberReferralsView />;
}
