import { db } from "@/shared/lib/db";
import { Role } from "@/shared/stores/workspace";
import { cache } from "react";

/**
 * Resolves the available workspace roles for a user based on their email and database roles.
 *
 * Rules:
 * 1. vinayharihar28@gmail.com -> Unified roles ["Admin", "Leadership Team", "Member"]
 * 2. PLATFORM_ADMIN / ORGANIZATION_ADMIN / ADMIN / DIRECTOR -> Unified roles ["Admin", "Leadership Team", "Member"]
 * 3. PRESIDENT / CHAPTER_ADMIN / CHAPTER_OFFICER / VICE_PRESIDENT / TREASURER -> ["Leadership Team", "Member"]
 * 4. MEMBER -> Access ONLY to Member workspace ["Member"]
 */
export const getUserAvailableRoles = cache(async (userId: string, email: string): Promise<Role[]> => {
  if (email.toLowerCase() === "vinayharihar28@gmail.com") {
    return ["Admin", "Leadership Team", "Member"];
  }

  const member = await db.member.findFirst({
    where: {
      OR: [{ userId }, { email }],
    },
    include: {
      roles: {
        include: { role: true },
      },
    },
  });

  const roleNames = member?.roles.map((r) => r.role.name.toUpperCase()) || [];

  if (
    roleNames.includes("PLATFORM_ADMIN") ||
    roleNames.includes("ORGANIZATION_ADMIN") ||
    roleNames.includes("ADMIN") ||
    roleNames.includes("DIRECTOR")
  ) {
    return ["Admin", "Leadership Team", "Member"];
  }

  if (
    roleNames.includes("PRESIDENT") ||
    roleNames.includes("VICE_PRESIDENT") ||
    roleNames.includes("TREASURER") ||
    roleNames.includes("CHAPTER_ADMIN") ||
    roleNames.includes("CHAPTER_OFFICER")
  ) {
    return ["Leadership Team", "Member"];
  }

  return ["Member"];
});

export function getDefaultDashboardPath(roles: Role[]): string {
  if (roles.includes("Admin") || roles.includes("Director")) return "/dashboard/director";
  if (roles.includes("Leadership Team")) return "/dashboard/leadership";
  return "/dashboard/member";
}
