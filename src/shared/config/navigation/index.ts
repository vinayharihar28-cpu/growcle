import { Role } from "@/shared/stores/workspace";
import { NavigationConfig } from "@/shared/types/navigation";
import { memberNavigation } from "./member";
import { adminNavigation } from "./admin";
import { directorNavigation } from "./director";
import { leadershipNavigation } from "./leadership";

export function getNavigationForRole(role: Role | null): NavigationConfig {
  switch (role) {
    case "Admin":
      return adminNavigation;
    case "Director":
      return directorNavigation;
    case "Leadership Team":
      return leadershipNavigation;
    case "Member":
    default:
      return memberNavigation;
  }
}
