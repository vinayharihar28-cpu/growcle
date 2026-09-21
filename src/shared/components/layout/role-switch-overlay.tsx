"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useWorkspaceStore } from "@/shared/stores/workspace";
import { Shield, Sparkles, Building2, Crown, UserCheck } from "lucide-react";

export function RoleSwitchOverlay() {
  const { isSwitchingRole, switchingTargetRole, finishRoleSwitch } = useWorkspaceStore();
  const pathname = usePathname();
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    if (!isSwitchingRole) {
      setProgress(15);
      return;
    }

    // Animate progress smoothly
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 92) return 92;
        return prev + Math.floor(Math.random() * 18) + 8;
      });
    }, 120);

    // Safety fallback: maximum 4.5s
    const timeout = setTimeout(() => {
      finishRoleSwitch();
    }, 4500);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isSwitchingRole, finishRoleSwitch]);

  // When pathname matches target role or changes, finalize transition
  useEffect(() => {
    if (isSwitchingRole && switchingTargetRole) {
      const timer = setTimeout(() => {
        setProgress(100);
        const exitTimer = setTimeout(() => {
          finishRoleSwitch();
        }, 220);
        return () => clearTimeout(exitTimer);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [pathname, isSwitchingRole, switchingTargetRole, finishRoleSwitch]);

  if (!isSwitchingRole) return null;

  const getRoleIcon = () => {
    switch (switchingTargetRole) {
      case "Admin":
      case "SuperAdmin":
      case "Organization Administrator":
        return Crown;
      case "Director":
        return Building2;
      case "Leadership Team":
      case "President":
      case "Vice President":
      case "Treasurer":
      case "Secretary":
        return Shield;
      default:
        return UserCheck;
    }
  };

  const IconComponent = getRoleIcon();

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/85 backdrop-blur-md transition-all duration-300 animate-in fade-in"
      role="status"
      aria-live="polite"
    >
      {/* Ambient background glow */}
      <div className="absolute w-72 h-72 rounded-full bg-primary/20 blur-3xl pointer-events-none animate-pulse" />

      {/* Main Loading Card */}
      <div className="relative z-10 flex flex-col items-center max-w-sm w-full mx-4 p-8 rounded-2xl border bg-card/90 shadow-2xl text-center space-y-5">
        {/* Animated Icon Container with Multi-Ring Pulse */}
        <div className="relative flex items-center justify-center">
          {/* Outer glowing pulsing ring */}
          <div className="absolute h-20 w-20 rounded-full border-2 border-primary/30 animate-ping opacity-60" />
          
          {/* Rotating gradient ring */}
          <div className="h-16 w-16 rounded-full border-3 border-transparent border-t-primary border-r-primary animate-spin" />
          
          {/* Center icon badge */}
          <div className="absolute h-12 w-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shadow-inner">
            <IconComponent className="h-6 w-6 animate-pulse" />
          </div>
        </div>

        {/* Text Details */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            <Sparkles className="h-3 w-3" /> Switching Workspace
          </div>
          <h3 className="text-xl font-bold tracking-tight text-foreground">
            {switchingTargetRole ? `${switchingTargetRole} Workspace` : "Loading..."}
          </h3>
          <p className="text-xs text-muted-foreground max-w-xs">
            Configuring role permissions, workspace navigation, and chapter analytics...
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full space-y-1.5">
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-200 ease-out rounded-full shadow-xs"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground px-1">
            <span>Authenticating session</span>
            <span>{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
