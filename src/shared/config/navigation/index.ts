import { Role } from "@/shared/stores/workspace";
import { NavigationConfig } from "@/shared/types/navigation";
import { memberNavigation } from "./member";
import { adminNavigation } from "./admin";
import { financeNavigation } from "./finance";
import { superAdminNavigation } from "./super-admin";
import { directorNavigation } from "./director";

export function getNavigationForRole(role: Role | null): NavigationConfig {
  switch (role) {
    case "SuperAdmin":
      return superAdminNavigation;
    case "Director":
      return directorNavigation;
    case "Admin":
    case "Organization Administrator":
      return adminNavigation;
    case "Finance":
    case "Treasurer":
      return financeNavigation;
    case "Member":
    case "Vice President":
    case "Secretary":
    default:
      return memberNavigation;
  }
}
