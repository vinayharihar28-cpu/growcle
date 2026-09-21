"use client";

import { useEffect } from "react";
import { useAuthStore, MemberInfo } from "@/shared/stores/auth";
import { useWorkspaceStore, Role, ChapterOption } from "@/shared/stores/workspace";

interface AuthInitializerProps {
  user: {
    id: string;
    name: string;
    email: string;
    roles: string[];
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
  useEffect(() => {
    if (user && member) {
      useAuthStore.setState({
        user,
        currentMember: member,
        isAuthenticated: true,
      });

      const wsStore = useWorkspaceStore.getState();
      wsStore.setAvailableRoles(availableRoles);

      // If activeRole is not in user's permitted roles, switch to their primary permitted role
      if (!wsStore.activeRole || !availableRoles.includes(wsStore.activeRole)) {
        const preferredRole = availableRoles.includes("Admin")
          ? "Admin"
          : availableRoles.includes("Director")
          ? "Director"
          : availableRoles.includes("Leadership Team")
          ? "Leadership Team"
          : availableRoles[0] || "Member";
        wsStore.setActiveRole(preferredRole);
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
  }, [user, member, availableRoles, chapters]);

  return null;
}
