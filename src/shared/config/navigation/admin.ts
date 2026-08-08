import { NavigationConfig } from "@/shared/types/navigation";
import { 
  LayoutDashboard, Settings, FileText, Banknote, Users, Building, Calendar, Contact, 
  Handshake, UserPlus, MessagesSquare, Megaphone, CheckCircle, GraduationCap
} from "lucide-react";

export const adminNavigation: NavigationConfig = [
  {
    items: [
      {
        title: "Dashboard",
        href: "/dashboard/admin",
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
        title: "Closed Business",
        href: "/dashboard/tyfcb",
        icon: CheckCircle,
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
    title: "Chapter Management",
    items: [
      {
        title: "Chapter Overview",
        href: "/dashboard/chapter/overview",
        icon: Building,
      },
      {
        title: "Meeting Agendas",
        href: "/dashboard/meetings",
        icon: Calendar,
      },
      {
        title: "Roster & Leadership",
        href: "/dashboard/chapter/roster",
        icon: Contact,
      },
      {
        title: "Goals & Performance",
        href: "/dashboard/chapter/goals",
        icon: FileText,
      },
    ],
  },
  {
    title: "Marketing & Growth",
    items: [
      {
        title: "Public Chapter Pages",
        href: "/dashboard/marketing/pages",
        icon: Megaphone,
      },
      {
        title: "Lead Capture",
        href: "/dashboard/marketing/leads",
        icon: Users,
      },
    ],
  },
  {
    title: "Finance & Admin",
    items: [
      {
        title: "Invoices & Receipts",
        href: "/dashboard/billing",
        icon: Banknote,
      },
      {
        title: "Organization Settings",
        href: "/dashboard/settings",
        icon: Settings,
      },
    ],
  },
];
