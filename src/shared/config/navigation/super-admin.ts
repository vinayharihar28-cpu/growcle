import { NavigationConfig } from "@/shared/types/navigation";
import { LayoutDashboard, Building2, Users, Settings, Palette } from "lucide-react";

export const superAdminNavigation: NavigationConfig = [
  {
    items: [
      {
        title: "Platform Overview",
        href: "/dashboard/platform-admin",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Tenant Management",
    items: [
      {
        title: "Organizations",
        href: "/dashboard/super-admin/organizations",
        icon: Building2,
      },
      {
        title: "Global Users",
        href: "/dashboard/super-admin/users",
        icon: Users,
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        title: "Branding Defaults",
        href: "/dashboard/super-admin/branding",
        icon: Palette,
      },
      {
        title: "Global Settings",
        href: "/dashboard/super-admin/settings",
        icon: Settings,
      },
    ],
  },
];
