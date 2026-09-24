import { NavigationConfig } from "@/shared/types/navigation";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Calendar,
  Handshake,
  MessagesSquare,
  BarChart3,
  BellRing,
  CreditCard,
  Sparkles,
} from "lucide-react";

export const leadershipNavigation: NavigationConfig = [
  {
    items: [
      {
        title: "Leadership Console",
        href: "/dashboard/leadership",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Chapter People",
    items: [
      {
        title: "Members",
        href: "/dashboard/leadership/members",
        icon: Users,
      },
      {
        title: "Visitors",
        href: "/dashboard/leadership/visitors",
        icon: UserPlus,
      },
    ],
  },
  {
    title: "Chapter Meetings",
    items: [
      {
        title: "Meetings",
        href: "/dashboard/leadership/meetings",
        icon: Calendar,
      },
      {
        title: "Feature Presentations",
        href: "/dashboard/leadership/presentations",
        icon: Sparkles,
      },
    ],
  },
  {
    title: "Networking & Growth",
    items: [
      {
        title: "Referrals",
        href: "/dashboard/leadership/referrals",
        icon: Handshake,
      },
      {
        title: "One-to-Ones",
        href: "/dashboard/leadership/one-to-ones",
        icon: MessagesSquare,
      },
    ],
  },
  {
    title: "Finance & Reports",
    items: [
      {
        title: "Dues & Payments",
        href: "/dashboard/leadership/payments",
        icon: CreditCard,
      },
      {
        title: "Announcements",
        href: "/dashboard/leadership/notifications",
        icon: BellRing,
      },
      {
        title: "Chapter Reports",
        href: "/dashboard/leadership/reports",
        icon: BarChart3,
      },
    ],
  },
];
