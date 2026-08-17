import { NavigationConfig } from "@/shared/types/navigation";
import { 
  LayoutDashboard, Settings, FileText, Banknote, Users, Building, Calendar, Contact, 
  Handshake, UserPlus, MessagesSquare, Megaphone, CheckCircle, GraduationCap,
  ShieldAlert, Bell, BarChart3, Activity, Briefcase
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
    title: "Network Management",
    items: [
      {
        title: "Chapters",
        href: "/dashboard/chapters",
        icon: Building,
      },
      {
        title: "Members",
        href: "/dashboard/members",
        icon: Users,
      },
      {
        title: "Directors",
        href: "/dashboard/admin/directors",
        icon: Briefcase,
      },
      {
        title: "Leadership",
        href: "/dashboard/admin/leadership",
        icon: GraduationCap,
      },
      {
        title: "Visitors",
        href: "/dashboard/visitors",
        icon: UserPlus,
      },
    ],
  },
  {
    title: "Activity & Events",
    items: [
      {
        title: "Meetings",
        href: "/dashboard/meetings",
        icon: Calendar,
      },
      {
        title: "Attendance",
        href: "/dashboard/attendance",
        icon: Contact,
      },
    ],
  },
  {
    title: "Growth & Revenue",
    items: [
      {
        title: "Referrals",
        href: "/dashboard/referrals",
        icon: Handshake,
      },
      {
        title: "One-to-Ones",
        href: "/dashboard/one-to-ones",
        icon: MessagesSquare,
      },
      {
        title: "Payments",
        href: "/dashboard/payments",
        icon: Banknote,
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        title: "Notifications",
        href: "/dashboard/notifications",
        icon: Bell,
      },
      {
        title: "Reports & Analytics",
        href: "/dashboard/reports",
        icon: BarChart3,
      },
      {
        title: "RBAC",
        href: "/dashboard/rbac",
        icon: ShieldAlert,
      },
      {
        title: "Audit Logs",
        href: "/dashboard/audit-logs",
        icon: Activity,
      },
      {
        title: "Platform Settings",
        href: "/dashboard/settings",
        icon: Settings,
      },
    ],
  },
];
