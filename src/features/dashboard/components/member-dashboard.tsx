"use client";

import * as React from "react";
import { useAuthStore } from "@/shared/stores/auth";
import { getMemberDashboardStats } from "../actions/dashboard";
import { 
  Share2, Handshake, DollarSign, Calendar, TrendingUp, Users2, Plus, 
  UserCheck, ArrowRight, Sparkles, Activity, CheckCircle2, RefreshCw, AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { LogReferralModal } from "@/features/referrals/components/log-referral-modal";
import { ScheduleOneToOneModal } from "@/features/networking/components/schedule-1to1-modal";

interface MemberDashboardProps {
  onNavigateTab?: (tab: "overview" | "profile" | "referrals" | "visitors") => void;
}

export function MemberDashboard({ onNavigateTab }: MemberDashboardProps) {
  const { currentMember } = useAuthStore();
  const [stats, setStats] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  // Quick Action Modal States
  const [isLogReferralOpen, setIsLogReferralOpen] = React.useState(false);
  const [isScheduleOneToOneOpen, setIsScheduleOneToOneOpen] = React.useState(false);

  const loadStats = React.useCallback(async () => {
    if (!currentMember?.id) return;
    try {
      setLoading(true);
      const data = await getMemberDashboardStats(currentMember.id);
      setStats(data);
    } catch (err) {
      console.error("Failed to load member stats:", err);
    } finally {
      setLoading(false);
    }
  }, [currentMember?.id]);

  React.useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Skeleton Loading View
  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-28 w-full rounded-3xl" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Skeleton className="h-32 rounded-3xl" />
          <Skeleton className="h-32 rounded-3xl" />
          <Skeleton className="h-32 rounded-3xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-2 h-80 rounded-3xl" />
          <Skeleton className="h-80 rounded-3xl" />
        </div>
      </div>
    );
  }

  const revenueData = stats?.monthlyRevenue || [
    { month: "Jan", revenue: 4500, referrals: 3 },
    { month: "Feb", revenue: 8200, referrals: 5 },
    { month: "Mar", revenue: 12400, referrals: 8 },
    { month: "Apr", revenue: 9100, referrals: 6 },
    { month: "May", revenue: 15600, referrals: 11 },
    { month: "Jun", revenue: stats?.referralsValue || 18400, referrals: 14 },
  ];

  return (
    <div className="space-y-6">
      
      {/* 1. Welcome Header Banner & Quick Action Buttons */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <Sparkles className="h-3.5 w-3.5" /> Member Workspace
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {currentMember?.firstName || "Member"}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Track your chapter referrals, measure closed revenue, and schedule strategic 1-to-1 meetings.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Button 
            onClick={() => setIsLogReferralOpen(true)}
            className="h-10 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4" /> Log Referral
          </Button>

          <Button 
            onClick={() => setIsScheduleOneToOneOpen(true)}
            variant="outline"
            className="h-10 px-4 rounded-xl border-slate-700 bg-slate-900/60 text-slate-200 hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5"
          >
            <Users2 className="h-4 w-4" /> Schedule 1-to-1
          </Button>

          {onNavigateTab && (
            <Button 
              onClick={() => onNavigateTab("profile")}
              variant="outline"
              className="h-10 px-4 rounded-xl border-slate-700 bg-slate-900/60 text-slate-200 hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5"
            >
              <UserCheck className="h-4 w-4" /> Update Profile
            </Button>
          )}
        </div>
      </div>

      {/* 2. KPI Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* KPI 1: Referrals Given */}
        <Card className="rounded-3xl shadow-sm border-border/80 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Total Referrals Given
            </CardTitle>
            <div className="h-9 w-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Share2 className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-3xl font-extrabold text-foreground">{stats?.referralsGiven ?? 0}</div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5" /> Passed to Chapter
            </p>
          </CardContent>
        </Card>

        {/* KPI 2: Referrals Received */}
        <Card className="rounded-3xl shadow-sm border-border/80 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Total Referrals Received
            </CardTitle>
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Handshake className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-3xl font-extrabold text-foreground">{stats?.referralsReceived ?? 0}</div>
            <p className="text-xs text-muted-foreground font-medium">Inbound business leads</p>
          </CardContent>
        </Card>

        {/* KPI 3: Revenue Value Generated */}
        <Card className="rounded-3xl shadow-sm border-border/80 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Value Generated (Revenue)
            </CardTitle>
            <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <DollarSign className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-3xl font-extrabold text-foreground">
              ${(stats?.referralsValue ?? 0).toLocaleString()}
            </div>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
              Verified Closed Business (TYFCB)
            </p>
          </CardContent>
        </Card>

      </div>

      {/* 3. Main Dashboard Charts & Recent Activity Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: 6-Month Revenue Bar Chart (Recharts) */}
        <Card className="lg:col-span-2 rounded-3xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Activity className="h-4 w-4 text-indigo-500" /> Revenue Generated (Last 6 Months)
              </CardTitle>
              <CardDescription className="text-xs">
                Monthly breakdown of closed-won business value ($)
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}`} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "#0f172a", 
                      borderColor: "#334155", 
                      borderRadius: "12px", 
                      color: "#fff",
                      fontSize: "12px"
                    }}
                    formatter={(val: any) => [`$${Number(val).toLocaleString()}`, "Revenue"]}
                  />
                  <Bar dataKey="revenue" fill="#6366f1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Right 1 Col: Recent Activity Feed */}
        <Card className="rounded-3xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-emerald-500" /> Recent Activity Feed
            </CardTitle>
            <CardDescription className="text-xs">Latest meetings, 1-to-1s & referrals</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y text-xs max-h-72 overflow-y-auto">
              {stats?.recentReferrals && stats.recentReferrals.length > 0 ? (
                stats.recentReferrals.map((ref: any) => (
                  <div key={ref.id} className="p-4 flex items-center justify-between hover:bg-muted/20 transition-colors">
                    <div className="space-y-0.5">
                      <p className="font-semibold text-foreground">{ref.referralName}</p>
                      <p className="text-[11px] text-muted-foreground">
                        Passed to {ref.toMember ? `${ref.toMember.firstName} ${ref.toMember.lastName}` : "Member"}
                      </p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      ref.status === "CLOSED_WON"
                        ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                        : "bg-indigo-500/10 text-indigo-600 border border-indigo-500/20"
                    }`}>
                      {ref.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-muted-foreground space-y-2">
                  <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground/60" />
                  <p>No recent referral activity logged.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Quick Action Dialog Modals */}
      <LogReferralModal
        isOpen={isLogReferralOpen}
        onClose={() => setIsLogReferralOpen(false)}
        onSuccess={loadStats}
      />

      <ScheduleOneToOneModal
        isOpen={isScheduleOneToOneOpen}
        onClose={() => setIsScheduleOneToOneOpen(false)}
        onSuccess={loadStats}
      />

    </div>
  );
}
