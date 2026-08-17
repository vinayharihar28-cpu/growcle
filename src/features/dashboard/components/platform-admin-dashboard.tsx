"use client";

import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { Building2, ClipboardList, CreditCard, DollarSign } from "lucide-react";
import { getPlatformDashboardStats } from "../actions/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { DashboardError } from "./org-admin-dashboard";

export function PlatformAdminDashboard() {
  const { data, isLoading } = useQuery({ queryKey: ["platform-dashboard"], queryFn: getPlatformDashboardStats });

  if (isLoading) return <PlatformDashboardSkeleton />;
  if (!data) return <DashboardError title="Platform data is currently unavailable." />;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 p-6 text-white shadow-xl sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-300">Platform administration</p>
        <h1 className="mt-2 text-2xl font-bold">SaaS health and tenant operations</h1>
        <p className="mt-1 text-sm text-slate-300">Monitor active tenants, recurring subscription revenue, and critical audit activity.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <PlatformMetric label="Active organizations" value={data.activeOrganizations} icon={<Building2 className="h-5 w-5" />} />
        <PlatformMetric label="Active subscriptions" value={data.activeSubscriptions} icon={<CreditCard className="h-5 w-5" />} />
        <PlatformMetric label="Monthly recurring revenue" value={`${data.currency} ${data.mrr.toLocaleString()}`} icon={<DollarSign className="h-5 w-5" />} />
        <PlatformMetric label="Recent audit events" value={data.recentAuditLogs.length} icon={<ClipboardList className="h-5 w-5" />} />
      </div>

      <Card className="rounded-3xl"><CardHeader><CardTitle className="text-base">Recent audit activity</CardTitle></CardHeader><CardContent className="p-0">
        {data.recentAuditLogs.length ? <div className="divide-y">{data.recentAuditLogs.map((log) => <div key={log.id} className="flex flex-col gap-1 p-4 text-sm sm:flex-row sm:items-center sm:justify-between"><div><p className="font-semibold">{log.action}</p><p className="text-xs text-muted-foreground">{log.entity}{log.who ? ` · ${log.who}` : ""}</p></div><time className="text-xs text-muted-foreground">{new Date(log.when).toLocaleString()}</time></div>)}</div> : <div className="p-10 text-center text-sm text-muted-foreground">No audit events have been recorded yet.</div>}
      </CardContent></Card>
    </div>
  );
}

function PlatformMetric({ label, value, icon }: { label: string; value: string | number; icon: ReactNode }) {
  return <Card className="rounded-3xl"><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</CardTitle><span className="text-indigo-500">{icon}</span></CardHeader><CardContent><p className="text-2xl font-bold">{value}</p></CardContent></Card>;
}

function PlatformDashboardSkeleton() {
  return <div className="space-y-6"><Skeleton className="h-36 w-full rounded-3xl" /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-28 rounded-3xl" />)}</div><Skeleton className="h-64 rounded-3xl" /></div>;
}
