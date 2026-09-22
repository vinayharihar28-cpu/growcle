"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useWorkspaceStore } from "@/shared/stores/workspace";

export function RoleSwitchOverlay() {
  const { isSwitchingRole, switchingTargetRole, finishRoleSwitch } = useWorkspaceStore();
  const pathname = usePathname();

  useEffect(() => {
    if (!isSwitchingRole) return;

    // Safety fallback: maximum 3s
    const timeout = setTimeout(() => {
      finishRoleSwitch();
    }, 3000);

    return () => clearTimeout(timeout);
  }, [isSwitchingRole, finishRoleSwitch]);

  // When pathname changes or target reached, finalize
  useEffect(() => {
    if (isSwitchingRole && switchingTargetRole) {
      const timer = setTimeout(() => {
        finishRoleSwitch();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [pathname, isSwitchingRole, switchingTargetRole, finishRoleSwitch]);

  if (!isSwitchingRole) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/80 backdrop-blur-xs"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center justify-center space-y-3 p-6 text-center">
        {/* Simple Loading Rotator */}
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-sm font-medium text-foreground">
          Switching to {switchingTargetRole || "role"}
        </p>
      </div>
    </div>
  );
}
