"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuthStore, MemberInfo } from "@/shared/stores/auth";
import { useWorkspaceStore, Role, ChapterOption } from "@/shared/stores/workspace";

interface AuthInitializerProps {
  user: {
    id: string;
    name: string;
    email: string;
    roles: string[];
    image?: string;
  } | null;
  member: MemberInfo | null;
  availableRoles: Role[];
  chapters?: ChapterOption[];
}

export function AuthInitializer({
  user,
  member,
  availableRoles,
  chapters = [],
}: AuthInitializerProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (user && member) {
      useAuthStore.setState({
        user,
        currentMember: member,
        isAuthenticated: true,
      });

      const wsStore = useWorkspaceStore.getState();
      wsStore.setAvailableRoles(availableRoles);

      // Determine active role based on current pathname first
      let resolvedRole: Role | null = null;
      if ((pathname.startsWith("/dashboard/admin") || pathname.startsWith("/dashboard/director")) && availableRoles.includes("Admin")) {
        resolvedRole = "Admin";
      } else if (pathname.startsWith("/dashboard/leadership") && availableRoles.includes("Leadership Team")) {
        resolvedRole = "Leadership Team";
      } else if (pathname.startsWith("/dashboard/member") && availableRoles.includes("Member")) {
        resolvedRole = "Member";
      }

      // If not derived from URL, check cookie
      if (!resolvedRole && typeof document !== "undefined") {
        const roleCookieMatch = document.cookie.match(new RegExp("(^| )active-role=([^;]+)"));
        if (roleCookieMatch && roleCookieMatch[2]) {
          const cookieVal = decodeURIComponent(roleCookieMatch[2]) as Role;
          if (cookieVal === "Director" && availableRoles.includes("Admin")) {
            resolvedRole = "Admin";
          } else if (availableRoles.includes(cookieVal)) {
            resolvedRole = cookieVal;
          }
        }
      }

      // If still not resolved, use highest permitted role
      if (!resolvedRole) {
        resolvedRole = availableRoles.includes("Admin")
          ? "Admin"
          : availableRoles.includes("Director")
          ? "Admin"
          : availableRoles.includes("Leadership Team")
          ? "Leadership Team"
          : availableRoles[0] || "Member";
      }

      wsStore.setActiveRole(resolvedRole);

      // Save resolved role in cookie for persistence
      if (typeof document !== "undefined") {
        document.cookie = `active-role=${encodeURIComponent(resolvedRole)}; path=/; max-age=31536000; SameSite=Lax`;
      }

      // Update chapters for switching
      wsStore.setAvailableChapters(chapters);

      // Check cookie for selected chapter
      if (typeof document !== "undefined") {
        const match = document.cookie.match(new RegExp("(^| )active-chapter-id=([^;]+)"));
        if (match && match[2]) {
          wsStore.setSelectedChapterId(match[2]);
        }
      }
    }
  }, [user, member, availableRoles, chapters, pathname]);

  return null;
}
