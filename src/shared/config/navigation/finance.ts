import { NavigationConfig } from "@/shared/types/navigation";
import { LayoutDashboard, Receipt, IndianRupee, PieChart } from "lucide-react";

export const financeNavigation: NavigationConfig = [
  {
    items: [
      {
        title: "Finance Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Financials",
    items: [
      {
        title: "Invoices",
        href: "/dashboard/invoices",
        icon: Receipt,
      },
      {
        title: "Expenses",
        href: "/dashboard/expenses",
        icon: IndianRupee,
      },
      {
        title: "Reports",
        href: "/dashboard/finance-reports",
        icon: PieChart,
      },
    ],
  },
];
