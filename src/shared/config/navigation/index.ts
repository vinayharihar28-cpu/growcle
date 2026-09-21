import { Role } from "@/shared/stores/workspace";
import { NavigationConfig } from "@/shared/types/navigation";
import { memberNavigation } from "./member";
import { adminNavigation } from "./admin";
import { financeNavigation } from "./finance";
import { superAdminNavigation } from "./super-admin";
import { directorNavigation } from "./director";
import { leadershipNavigation } from "./leadership";

export function getNavigationForRole(role: Role | null): NavigationConfig {
  switch (role) {
    case "SuperAdmin":
      return superAdminNavigation;
    case "Director":
      return directorNavigation;
    case "Admin":
    case "Organization Administrator":
      return adminNavigation;
    case "President":
    case "Vice President":
    case "Secretary":
    case "Treasurer":
    case "Leadership Team":
    case "Finance":
      return leadershipNavigation;
    case "Member":
    default:
      return memberNavigation;
  }
}
