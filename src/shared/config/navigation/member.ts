import { NavigationConfig } from "@/shared/types/navigation";
import {
  LayoutDashboard,
  UserCircle,
  Building2,
  Users,
  Handshake,
  MessagesSquare,
  UserPlus,
  Calendar,
  CheckCircle2,
  Bell,
  BarChart3,
} from "lucide-react";

export const memberNavigation: NavigationConfig = [
  {
    items: [
      {
        title: "Member Overview",
        href: "/dashboard/member",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "My Identity",
    items: [
      {
        title: "My Profile",
        href: "/dashboard/member/profile",
        icon: UserCircle,
      },
      {
        title: "Business Profile",
        href: "/dashboard/member/business",
        icon: Building2,
      },
    ],
  },
  {
    title: "Networking & Growth",
    items: [
      {
        title: "Members Directory",
        href: "/dashboard/member/members",
        icon: Users,
      },
      {
        title: "Referrals (Given & Recv)",
        href: "/dashboard/member/referrals",
        icon: Handshake,
      },
      {
        title: "1-to-1 Synergy Sessions",
        href: "/dashboard/member/one-to-ones",
        icon: MessagesSquare,
      },
      {
        title: "Invited Visitors",
        href: "/dashboard/member/visitors",
        icon: UserPlus,
      },
    ],
  },
  {
    title: "Meetings & Attendance",
    items: [
      {
        title: "Chapter Meetings",
        href: "/dashboard/member/meetings",
        icon: Calendar,
      },
      {
        title: "My Attendance",
        href: "/dashboard/member/attendance",
        icon: CheckCircle2,
      },
    ],
  },
  {
    title: "Engagement & Reports",
    items: [
      {
        title: "Announcements",
        href: "/dashboard/member/notifications",
        icon: Bell,
      },
      {
        title: "My Reports",
        href: "/dashboard/member/reports",
        icon: BarChart3,
      },
    ],
  },
];
