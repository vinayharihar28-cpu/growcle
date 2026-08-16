import { NavigationConfig } from "@/shared/types/navigation";
import {
  LayoutDashboard,
  Building2,
  Users,
  UserCheck,
  UserPlus,
  Calendar,
  ClipboardCheck,
  Handshake,
  MessagesSquare,
  CreditCard,
  BellRing,
  BarChart3,
} from "lucide-react";

export const directorNavigation: NavigationConfig = [
  {
    items: [
      {
        title: "Director Dashboard",
        href: "/dashboard/director",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Chapter & Roster",
    items: [
      {
        title: "Assigned Chapters",
        href: "/dashboard/director/chapters",
        icon: Building2,
      },
      {
        title: "Members Directory",
        href: "/dashboard/director/members",
        icon: Users,
      },
      {
        title: "Leadership Team",
        href: "/dashboard/director/leadership",
        icon: UserCheck,
      },
      {
        title: "Visitors",
        href: "/dashboard/director/visitors",
        icon: UserPlus,
      },
    ],
  },
  {
    title: "Chapter Operations",
    items: [
      {
        title: "Meetings",
        href: "/dashboard/director/meetings",
        icon: Calendar,
      },
      {
        title: "Attendance Monitoring",
        href: "/dashboard/director/attendance",
        icon: ClipboardCheck,
      },
    ],
  },
  {
    title: "Networking & Growth",
    items: [
      {
        title: "Referral Pipeline",
        href: "/dashboard/director/referrals",
        icon: Handshake,
      },
      {
        title: "One-to-Ones",
        href: "/dashboard/director/one-to-ones",
        icon: MessagesSquare,
      },
    ],
  },
  {
    title: "Finance & Reports",
    items: [
      {
        title: "Payments & Invoices",
        href: "/dashboard/director/payments",
        icon: CreditCard,
      },
      {
        title: "Chapter Broadcasts",
        href: "/dashboard/director/notifications",
        icon: BellRing,
      },
      {
        title: "Reports & Analytics",
        href: "/dashboard/director/reports",
        icon: BarChart3,
      },
    ],
  },
];
