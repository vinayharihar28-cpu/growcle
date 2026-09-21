import { LeadershipPaymentsView } from "@/features/leadership/components/leadership-payments-view";

export const metadata = {
  title: "Chapter Dues & Treasury | Leadership Dashboard | Growcle",
  description: "Monitor chapter membership dues, meeting fee receipts, and payment status.",
};

export default function LeadershipPaymentsPage() {
  return <LeadershipPaymentsView />;
}
