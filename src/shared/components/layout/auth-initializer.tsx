"use client";

import { useEffect } from "react";
import { useAuthStore, MemberInfo } from "@/shared/stores/auth";

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
    }
  }, [user, member]);

  return null;
}
