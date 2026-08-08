"use client";

import * as React from "react";
import {
  Users, UserPlus, DollarSign, TrendingUp, Activity,
  Calendar, Sparkles, Plus, ClipboardList, ChevronRight,
  CheckCircle2, AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  Tooltip, CartesianGrid
} from "recharts";
import { getChapterAdminStats } from "@/features/chapter/actions/admin-dashboard";
import { useAuthStore } from "@/shared/stores/auth";

interface AdminOverviewProps {
  chapterId: string;
  chapterName?: string;
  onNavigateTab: (tab: "overview" | "attendance" | "agenda") => void;
}

export function AdminOverviewDashboard({ chapterId, chapterName, onNavigateTab }: AdminOverviewProps) {
  const [stats, setStats] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!chapterId) return;
    getChapterAdminStats(chapterId)
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [chapterId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full rounded-3xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 rounded-3xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-2 h-80 rounded-3xl" />
          <Skeleton className="h-80 rounded-3xl" />
        </div>
      </div>
    );
  }

  const attendanceData = stats?.weeklyAttendance || [
    { week: "W1", rate: 78 }, { week: "W2", rate: 82 }, { week: "W3", rate: 88 },
    { week: "W4", rate: 85 }, { week: "W5", rate: 91 }, { week: "W6", rate: 94 },
    { week: "W7", rate: 89 }, { week: "W8", rate: 96 },
  ];

  const upcomingDate = stats?.upcomingMeeting?.date
    ? new Date(stats.upcomingMeeting.date).toLocaleDateString("en-US", {
        weekday: "short", month: "short", day: "numeric"
      })
    : "None scheduled";

  const kpis = [
    {
      label: "Active Members",
      value: stats?.totalMembers ?? 0,
      sub: "Chapter roster",
      icon: Users,
      color: "indigo",
    },
    {
      label: "Visitor Conversion",
      value: `${stats?.visitorConversionRate ?? 0}%`,
      sub: `${stats?.totalVisitors ?? 0} visitors total`,
      icon: TrendingUp,
      color: "emerald",
    },
    {
      label: "Chapter Revenue",
      value: `$${((stats?.chapterRevenue ?? 0) / 1000).toFixed(1)}k`,
      sub: "Closed business (TYFCB)",
      icon: DollarSign,
      color: "amber",
    },
    {
      label: "Last Meeting",
      value: `${stats?.lastMeetingRate ?? 0}%`,
      sub: "Attendance rate",
      icon: Activity,
      color: "sky",
    },
  ];

  const colorMap: Record<string, string> = {
    indigo: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    sky: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  };

  return (
    <div className="space-y-6">

      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <Sparkles className="h-3.5 w-3.5" /> Chapter Administration
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {chapterName || "Chapter"} Workspace
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Monitor chapter health, manage attendance, generate meeting agendas, and drive member engagement.
          </p>
          {stats?.upcomingMeeting && (
            <div className="flex items-center gap-2 text-xs text-indigo-300 font-medium pt-1">
              <Calendar className="h-3.5 w-3.5" />
              Next meeting: {upcomingDate} {stats.upcomingMeeting.location ? `· ${stats.upcomingMeeting.location}` : ""}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Button
            onClick={() => onNavigateTab("attendance")}
            className="h-10 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md flex items-center gap-1.5"
          >
            <ClipboardList className="h-4 w-4" /> Record Attendance
          </Button>
          <Button
            onClick={() => onNavigateTab("agenda")}
            variant="outline"
            className="h-10 px-4 rounded-xl border-slate-700 bg-slate-900/60 text-slate-200 hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4" /> New Meeting Agenda
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label} className="rounded-3xl shadow-sm border-border/80 hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground leading-tight">
                  {kpi.label}
                </CardTitle>
                <div className={`h-8 w-8 rounded-xl flex items-center justify-center ${colorMap[kpi.color]}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent className="space-y-0.5 pt-0">
                <div className="text-2xl sm:text-3xl font-extrabold text-foreground">{kpi.value}</div>
                <p className="text-[11px] text-muted-foreground font-medium">{kpi.sub}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Attendance Trend Chart */}
        <Card className="lg:col-span-2 rounded-3xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Activity className="h-4 w-4 text-indigo-500" /> Member Retention & Attendance Trend
            </CardTitle>
            <CardDescription className="text-xs">
              8-week attendance rate tracking for chapter health score
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="attendanceGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.15)" />
                  <XAxis dataKey="week" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      borderRadius: "12px",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                    formatter={(v: any) => [`${v}%`, "Attendance Rate"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="rate"
                    stroke="#6366f1"
                    strokeWidth={2.5}
                    fill="url(#attendanceGrad)"
                    dot={{ r: 4, fill: "#6366f1", strokeWidth: 2, stroke: "#fff" }}
                    activeDot={{ r: 6 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Panel */}
        <Card className="rounded-3xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold">Quick Actions</CardTitle>
            <CardDescription className="text-xs">Chapter management shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 p-4 pt-0">
            {[
              {
                label: "Record Attendance",
                desc: "Mark this week's roll call",
                icon: ClipboardList,
                tab: "attendance" as const,
                color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20",
              },
              {
                label: "Meeting Agenda",
                desc: "Create or view meeting agendas",
                icon: Calendar,
                tab: "agenda" as const,
                color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20",
              },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  onClick={() => onNavigateTab(action.tab)}
                  className="w-full flex items-center justify-between p-4 rounded-2xl border border-border/60 hover:bg-muted/40 transition-all group cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${action.color}`}>
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{action.label}</p>
                      <p className="text-[11px] text-muted-foreground">{action.desc}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </button>
              );
            })}

            {/* Chapter Health Badge */}
            <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200/50 dark:border-emerald-800/30">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Chapter Health</span>
              </div>
              <p className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400">
                {(stats?.lastMeetingRate ?? 0) >= 90
                  ? "Excellent"
                  : (stats?.lastMeetingRate ?? 0) >= 75
                  ? "Good"
                  : "Needs Attention"}
              </p>
              <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400/70 mt-0.5">
                Based on last meeting attendance rate
              </p>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
