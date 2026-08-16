"use client";

import { useEffect } from "react";
import { useAuthStore, MemberInfo } from "@/shared/stores/auth";
import { useWorkspaceStore, Role } from "@/shared/stores/workspace";

interface AuthInitializerProps {
  user: {
    id: string;
    name: string;
    email: string;
    roles: string[];
  } | null;
  member: MemberInfo | null;
}

export function AuthInitializer({ user, member }: AuthInitializerProps) {
  useEffect(() => {
    if (user && member) {
      useAuthStore.setState({
        user,
        currentMember: member,
        isAuthenticated: true,
      });

      const defaultRoles: Role[] = ["Director", "Admin", "Member", "Finance", "SuperAdmin"];
      const wsStore = useWorkspaceStore.getState();
      if (!wsStore.activeRole) {
        wsStore.setActiveRole("Director");
      }
      wsStore.setAvailableRoles(defaultRoles);
    }
  }, [user, member]);

  return null;
}
