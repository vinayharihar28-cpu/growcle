import React from "react";

export default function DashboardLoading() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-3">
      <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      <p className="text-sm font-medium text-muted-foreground">Loading workspace...</p>
    </div>
  );
}
