import { Metadata } from "next";
import { PaymentsManagementView } from "@/features/director/components/payments-management-view";

export const metadata: Metadata = {
  title: "Payments & Treasury Management | Admin Operations",
  description: "Monitor chapter financial ledgers, 1-year membership terms, dues, and payment collections.",
};

export default function PaymentsPage() {
  return <PaymentsManagementView />;
}
