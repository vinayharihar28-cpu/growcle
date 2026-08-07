'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/shared/stores/auth';
import { getMemberDashboardStats } from '../actions/dashboard';
import { Share2, Users2, Calendar, TrendingUp, Handshake, CircleDollarSign, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';

export function MemberDashboard() {
  const { currentMember } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentMember?.id) return;
    const memberId = currentMember.id;
    async function loadStats() {
      try {
        const data = await getMemberDashboardStats(memberId);
        setStats(data);
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [currentMember?.id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground font-semibold">Loading your metrics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="p-6 rounded-2xl border bg-gradient-to-br from-slate-900 to-indigo-950 text-white space-y-2 shadow-md">
        <h2 className="text-xl font-bold">Welcome back, {currentMember?.firstName || 'Member'}!</h2>
        <p className="text-xs text-indigo-200">
          Your personal networking dashboard. Track referrals, log 1-on-1s, and check upcoming chapter meetings.
        </p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Referrals Given
            </CardTitle>
            <Share2 className="w-4 h-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.referralsGiven ?? 0}</div>
            <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> Live tracker
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Referrals Received
            </CardTitle>
            <Handshake className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.referralsReceived ?? 0}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Valued at ${stats?.referralsValue ?? 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              1-on-1 Meetings
            </CardTitle>
            <Users2 className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.oneToOnesCount ?? 0}</div>
            <p className="text-[10px] text-blue-600 font-semibold mt-1">Total completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Attendance Rate
            </CardTitle>
            <CircleDollarSign className="w-4 h-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.attendanceRate ?? 100}%</div>
            <p className="text-[10px] text-emerald-600 font-semibold mt-1">Active standing</p>
          </CardContent>
        </Card>
      </div>

      {/* Main dashboard columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-bold">Recent Referrals Logged</CardTitle>
            <CardDescription className="text-xs">Your contribution to chapter growth</CardDescription>
          </CardHeader>
          <CardContent className="divide-y text-xs">
            {stats?.recentReferrals && stats.recentReferrals.length > 0 ? (
              stats.recentReferrals.map((ref: any) => (
                <div key={ref.id} className="py-2.5 flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-foreground">{ref.referralName}</span>
                    <p className="text-[11px] text-muted-foreground">
                      Passed to {ref.toMember ? `${ref.toMember.firstName} ${ref.toMember.lastName}` : "Member"}
                    </p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    ref.status === "CLOSED_WON" 
                      ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" 
                      : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                  }`}>
                    {ref.status === "CLOSED_WON" ? `Closed Won ($${ref.value || 0})` : ref.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center text-slate-500 py-6 flex items-center justify-center gap-1.5">
                <AlertCircle className="w-4 h-4" /> No referrals passed yet.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold">Upcoming Chapter Meetings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            {stats?.upcomingMeetings && stats.upcomingMeetings.length > 0 ? (
              stats.upcomingMeetings.map((meet: any) => (
                <div key={meet.id} className="p-3 border rounded-xl bg-accent/30 space-y-1.5">
                  <span className="text-[9px] uppercase font-bold text-indigo-600 dark:text-indigo-400">
                    {meet.chapter?.name || "Silicon Valley Founders"}
                  </span>
                  <h5 className="font-bold text-foreground">Induction Ceremony & Weekly Meeting</h5>
                  <div className="text-[11px] text-muted-foreground">
                    {new Date(meet.date).toLocaleDateString("en-US", { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric', 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-slate-500 py-6 flex items-center justify-center gap-1.5">
                <Calendar className="w-4 h-4" /> No upcoming meetings scheduled.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

