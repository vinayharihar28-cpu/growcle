import { PaymentsManagementView } from "@/features/director/components/payments-management-view";

export const metadata = {
  title: "Payment Oversight | Director Dashboard | Growcle",
  description: "Monitor chapter membership payments, invoices, and dues.",
};

export default function DirectorPaymentsPage() {
  return <PaymentsManagementView />;
}
