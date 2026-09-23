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
  CreditCard,
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
        title: "My Profile & Portfolio",
        href: "/dashboard/member/profile",
        icon: UserCircle,
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
        title: "TYFCB (Closed Business)",
        href: "/dashboard/member/tyfcb",
        icon: BarChart3,
      },
      {
        title: "Invited Visitors",
        href: "/dashboard/member/visitors",
        icon: UserPlus,
      },
    ],
  },
  {
    title: "Chapter Meetings",
    items: [
      {
        title: "Chapter Meetings",
        href: "/dashboard/member/meetings",
        icon: Calendar,
      },
    ],
  },
  {
    title: "Membership & Dues",
    items: [
      {
        title: "Membership Payment",
        href: "/dashboard/member/membership",
        icon: CreditCard,
      },
    ],
  },
  {
    title: "Engagement & Performance",
    items: [
      {
        title: "Announcements",
        href: "/dashboard/member/notifications",
        icon: Bell,
      },
      {
        title: "My Scorecard",
        href: "/dashboard/member/reports",
        icon: BarChart3,
      },
    ],
  },
];

