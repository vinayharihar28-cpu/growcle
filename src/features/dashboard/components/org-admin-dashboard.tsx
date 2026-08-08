"use client";

import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { Building2, DollarSign, Trophy, Users } from "lucide-react";
import { useAuthStore } from "@/shared/stores/auth";
import { getOrganizationDashboardStats } from "../actions/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";

export function OrgAdminDashboard() {
  const organizationId = useAuthStore((state) => state.currentMember?.organizationId);
  const { data, isLoading } = useQuery({
    queryKey: ["organization-dashboard", organizationId],
    queryFn: () => getOrganizationDashboardStats(organizationId!),
    enabled: Boolean(organizationId),
  });

  if (isLoading || !organizationId) {
    return <OrganizationDashboardSkeleton />;
  }

  if (!data) {
    return <DashboardError title="Organization data is currently unavailable." />;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 p-6 text-white shadow-xl sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-300">Organization workspace</p>
        <h1 className="mt-2 text-2xl font-bold">{data.organizationName}</h1>
        <p className="mt-1 text-sm text-slate-300">A live view across your chapters, active members, and closed business.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Active chapters" value={data.totalChapters} icon={<Building2 className="h-5 w-5" />} />
        <MetricCard label="Active members" value={data.totalMembers} icon={<Users className="h-5 w-5" />} />
        <MetricCard label="Organization revenue" value={`$${data.revenueGenerated.toLocaleString()}`} icon={<DollarSign className="h-5 w-5" />} />
        <MetricCard label="Top chapter" value={data.topChapter?.name ?? "No chapters yet"} icon={<Trophy className="h-5 w-5" />} compact />
      </div>

      <Card className="overflow-hidden rounded-3xl">
        <CardHeader>
          <CardTitle className="text-base">Chapter performance</CardTitle>
          <p className="text-xs text-muted-foreground">Compare member coverage and visitor conversion across active chapters.</p>
        </CardHeader>
        <CardContent className="p-0">
          {data.chapters.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-left text-sm">
                <thead className="border-y bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr><th className="px-6 py-3 font-semibold">Chapter</th><th className="px-6 py-3 font-semibold">Region</th><th className="px-6 py-3 font-semibold">Active members</th><th className="px-6 py-3 font-semibold">Visitor conversion</th></tr>
                </thead>
                <tbody className="divide-y">
                  {data.chapters.map((chapter) => (
                    <tr key={chapter.id} className="transition-colors hover:bg-muted/30">
                      <td className="px-6 py-4 font-semibold">{chapter.name}</td>
                      <td className="px-6 py-4 text-muted-foreground">{chapter.region ?? "—"}</td>
                      <td className="px-6 py-4">{chapter.activeMembers}</td>
                      <td className="px-6 py-4">{chapter.visitorConversionRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <div className="p-10 text-center text-sm text-muted-foreground">No active chapters have been created yet.</div>}
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({ label, value, icon, compact = false }: { label: string; value: string | number; icon: ReactNode; compact?: boolean }) {
  return <Card className="rounded-3xl"><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</CardTitle><span className="text-indigo-500">{icon}</span></CardHeader><CardContent><p className={compact ? "text-lg font-bold" : "text-3xl font-bold"}>{value}</p></CardContent></Card>;
}

function OrganizationDashboardSkeleton() {
  return <div className="space-y-6"><Skeleton className="h-36 w-full rounded-3xl" /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-28 rounded-3xl" />)}</div><Skeleton className="h-64 rounded-3xl" /></div>;
}

export function DashboardError({ title }: { title: string }) {
  return <Card className="rounded-3xl"><CardContent className="p-10 text-center text-sm text-muted-foreground">{title}</CardContent></Card>;
}
