import { NavigationConfig } from "@/shared/types/navigation";
import { 
  LayoutDashboard, Users, UserPlus, Handshake, MessagesSquare, 
  Banknote, Receipt, BarChart3, Settings, UserCircle
} from "lucide-react";

export const memberNavigation: NavigationConfig = [
  {
    items: [
      {
        title: "Member Workspace",
        href: "/dashboard/member",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Networking",
    items: [
      {
        title: "Referrals",
        href: "/dashboard/referrals",
        icon: Handshake,
      },
      {
        title: "1-to-1 Meetings",
        href: "/dashboard/one-to-ones",
        icon: MessagesSquare,
      },
      {
        title: "Closed Business (TYFCB)",
        href: "/dashboard/tyfcb",
        icon: Banknote,
      },
      {
        title: "Visitors",
        href: "/dashboard/visitors",
        icon: UserPlus,
      },
      {
        title: "Members Directory",
        href: "/dashboard/members",
        icon: Users,
      },
    ],
  },
  {
    title: "Finance & Reports",
    items: [
      {
        title: "My Invoices",
        href: "/dashboard/invoices",
        icon: Receipt,
      },
      {
        title: "My Performance",
        href: "/dashboard/performance",
        icon: BarChart3,
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        title: "My Profile",
        href: "/dashboard/profile",
        icon: UserCircle,
      },
      {
        title: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
      },
    ],
  },
];
