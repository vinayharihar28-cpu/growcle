import React from "react";
import { Sparkles, Shield, Crown, Building2, UserCheck } from "lucide-react";

interface RoleWorkspaceSkeletonProps {
  roleName?: string;
  description?: string;
}

export function RoleWorkspaceSkeleton({
  roleName = "Workspace",
  description = "Loading workspace metrics, permissions, and operations...",
}: RoleWorkspaceSkeletonProps) {
  const getIcon = () => {
    if (roleName.includes("Admin")) return Crown;
    if (roleName.includes("Director")) return Building2;
    if (roleName.includes("Leadership")) return Shield;
    return UserCheck;
  };

  const IconComponent = getIcon();

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner Skeleton with pulsing indicator */}
      <div className="rounded-xl border bg-card/60 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            <IconComponent className="h-3.5 w-3.5 animate-pulse" />
            <span>Loading {roleName} Data...</span>
          </div>
          <div className="h-7 w-48 sm:w-64 bg-muted/60 rounded-md animate-pulse" />
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-28 bg-muted/50 rounded-lg animate-pulse" />
          <div className="h-9 w-32 bg-primary/20 rounded-lg animate-pulse" />
        </div>
      </div>

      {/* KPI Cards Skeleton Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl border bg-card/50 p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 bg-muted/50 rounded-md animate-pulse" />
              <div className="h-8 w-8 rounded-lg bg-primary/10 animate-pulse" />
            </div>
            <div className="h-8 w-20 bg-muted/70 rounded-md animate-pulse" />
            <div className="h-3 w-32 bg-muted/40 rounded-md animate-pulse" />
          </div>
        ))}
      </div>

      {/* Main Content Area Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl border bg-card/50 p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-2 border-b">
            <div className="h-5 w-36 bg-muted/60 rounded-md animate-pulse" />
            <div className="h-8 w-24 bg-muted/40 rounded-lg animate-pulse" />
          </div>
          <div className="space-y-3 pt-2">
            {[1, 2, 3, 4].map((row) => (
              <div key={row} className="h-12 w-full bg-muted/30 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
        <div className="rounded-xl border bg-card/50 p-6 shadow-xs space-y-4">
          <div className="h-5 w-28 bg-muted/60 rounded-md animate-pulse pb-2 border-b" />
          <div className="h-40 w-full rounded-xl bg-muted/20 flex flex-col items-center justify-center p-4 border border-dashed border-border/80">
            <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin mb-2" />
            <span className="text-xs font-medium text-foreground">Syncing workspace feed</span>
            <span className="text-[10px] text-muted-foreground mt-0.5">Please wait a moment...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
