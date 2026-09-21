"use client";

import React, { useEffect, useState } from "react";
import {
  Users,
  UserPlus,
  Calendar,
  ClipboardCheck,
  IndianRupee,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Clock,
  MapPin,
  ArrowRight,
  Plus,
  Send,
  Lock,
  QrCode,
  Award,
  Layers,
  BarChart3,
} from "lucide-react";
import {
  getLeadershipContext,
  getLeadershipDashboardData,
  LeadershipContext,
  LeadershipKPIs,
  UpcomingMeetingSummary,
} from "../actions/leadership-actions";
import { LeadershipHeaderBar } from "./leadership-header-bar";
import Link from "next/link";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { getChapterTheme } from "@/lib/chapter-themes";

export function LeadershipDashboardView() {
  const [context, setContext] = useState<LeadershipContext | null>(null);
  const [kpis, setKpis] = useState<LeadershipKPIs | null>(null);
  const [upcomingMeeting, setUpcomingMeeting] = useState<UpcomingMeetingSummary | null>(null);
  const [meetingHistory, setMeetingHistory] = useState<any[]>([]);
  const [currentMeetingIdx, setCurrentMeetingIdx] = useState<number>(0);
  const [attendanceComposition, setAttendanceComposition] = useState<any[]>([]);
  const [weeklyRevenue, setWeeklyRevenue] = useState<any[]>([]);
  const [topReferrers, setTopReferrers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"attendance" | "revenue">("attendance");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const ctx = await getLeadershipContext();
        setContext(ctx);
        const data = await getLeadershipDashboardData(ctx.chapterId);
        setKpis(data.kpis);
        setUpcomingMeeting(data.upcomingMeeting);
        setMeetingHistory(data.meetingHistory || []);
        if (data.meetingHistory && data.meetingHistory.length > 0) {
          setCurrentMeetingIdx(data.meetingHistory.length - 1);
        }
        setAttendanceComposition(data.attendanceCompositionTrend || []);
        setWeeklyRevenue(data.weeklyRevenueTrend || []);
        setTopReferrers(data.topReferrers || []);
      } catch (err) {
        console.error("Failed to load leadership dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading || !context || !kpis) {
    return (
      <div className="space-y-6 animate-pulse p-4">
        <div className="h-24 rounded-xl bg-muted" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 rounded-xl bg-muted" />
          ))}
        </div>
        <div className="h-64 rounded-xl bg-muted" />
      </div>
    );
  }

  const theme = getChapterTheme(context.themeColor);

  const kpiCards = [
    {
      title: "Total Chapter Strength",
      value: kpis.totalStrength,
      subText: `${kpis.activeMembers} Members • ${kpis.upcomingVisitors} Visitors`,
      icon: Users,
      color: "text-blue-500 bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      title: "Latest Turnout Rate",
      value: `${kpis.attendancePercentage}%`,
      subText: `+${kpis.attendanceTrend}% vs prior cycle`,
      icon: ClipboardCheck,
      color: "text-emerald-500 bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      title: "Total Fee Realization",
      value: `₹${(kpis.totalFeeRealization / 1000).toFixed(1)}k`,
      subText: `Standard meeting fee ₹${context.meetingFee}`,
      icon: IndianRupee,
      color: "text-purple-500 bg-purple-500/10",
      border: "border-purple-500/20",
    },
    {
      title: "Closed Business Won",
      value: `₹${(kpis.closedBusiness / 1000).toFixed(1)}k`,
      subText: `${kpis.closedReferrals} Closed Deals • ${kpis.totalMeetingsCount} Meetings`,
      icon: TrendingUp,
      color: "text-amber-500 bg-amber-500/10",
      border: "border-amber-500/20",
    },
  ];

  const inspectedMeeting = meetingHistory[currentMeetingIdx] || upcomingMeeting;

  return (
    <div className="space-y-6">
      {/* Chapter Scope Header */}
      <LeadershipHeaderBar context={context} />

      {/* Quick Action Navigation Bar */}
      <div className="rounded-xl border bg-card p-4 shadow-sm flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-2">Quick Actions:</span>
        <Link
          href="/dashboard/leadership/attendance"
          className="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 flex items-center gap-1.5 shadow-sm"
        >
          <QrCode className="h-3.5 w-3.5" /> Take Attendance & Fee QR
        </Link>
        <Link
          href="/dashboard/leadership/members"
          className="rounded-md border bg-background px-3 py-1.5 text-xs font-semibold hover:bg-accent flex items-center gap-1.5"
        >
          <Plus className="h-3.5 w-3.5 text-primary" /> Add Member
        </Link>
        <Link
          href="/dashboard/leadership/visitors"
          className="rounded-md border bg-background px-3 py-1.5 text-xs font-semibold hover:bg-accent flex items-center gap-1.5"
        >
          <UserPlus className="h-3.5 w-3.5 text-emerald-600" /> Add Visitor
        </Link>
        <Link
          href="/dashboard/leadership/meetings"
          className="rounded-md border bg-background px-3 py-1.5 text-xs font-semibold hover:bg-accent flex items-center gap-1.5"
        >
          <Calendar className="h-3.5 w-3.5 text-blue-600" /> Schedule Meeting
        </Link>
        <Link
          href="/dashboard/leadership/payments"
          className="rounded-md border bg-background px-3 py-1.5 text-xs font-semibold hover:bg-accent flex items-center gap-1.5"
        >
          <IndianRupee className="h-3.5 w-3.5 text-purple-600" /> Payment & Fee Settings
        </Link>
        <Link
          href="/dashboard/leadership/reports"
          className="rounded-md border bg-background px-3 py-1.5 text-xs font-semibold hover:bg-accent flex items-center gap-1.5"
        >
          <BarChart3 className="h-3.5 w-3.5 text-amber-600" /> Executive Reports
        </Link>
      </div>

      {/* Hero KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`rounded-xl border bg-card p-5 shadow-sm space-y-3 hover:shadow-md transition-all ${card.border}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{card.title}</span>
                <div className={`rounded-lg p-2 ${card.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="space-y-0.5">
                <p className="text-2xl font-bold tracking-tight text-foreground">{card.value}</p>
                <p className="text-xs text-muted-foreground">{card.subText}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Meeting Control Panel with Carousel Navigation */}
      {inspectedMeeting && (
        <div className="rounded-xl border border-primary/30 bg-gradient-to-r from-primary/10 via-card to-background p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-primary/15 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-primary border border-primary/30">
                  Meeting Control Center
                </span>
                {inspectedMeeting.isTimeLocked && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-500 border border-amber-500/20">
                    <Lock className="h-3 w-3" /> Time-Locked
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-xl font-bold text-foreground">{inspectedMeeting.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-primary" /> {inspectedMeeting.date}
                </p>
              </div>

              {/* Stats for inspected meeting */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1 text-xs">
                <div className="rounded-lg border bg-muted/20 p-2.5">
                  <span className="text-muted-foreground">Turnout Rate</span>
                  <p className="text-lg font-bold text-emerald-600 mt-0.5">{inspectedMeeting.turnoutPercentage}%</p>
                </div>
                <div className="rounded-lg border bg-muted/20 p-2.5">
                  <span className="text-muted-foreground">Fee Realization</span>
                  <p className="text-lg font-bold text-foreground mt-0.5">₹{inspectedMeeting.feeRealization}</p>
                </div>
                <div className="rounded-lg border bg-muted/20 p-2.5 col-span-2 sm:col-span-1">
                  <span className="text-muted-foreground">Standard Fee</span>
                  <p className="text-lg font-bold text-purple-600 mt-0.5">₹{context.meetingFee}</p>
                </div>
              </div>
            </div>

            {/* Carousel Navigation & Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
              {meetingHistory.length > 1 && (
                <div className="flex items-center justify-center gap-1 rounded-lg border bg-card p-1 shadow-sm">
                  <button
                    disabled={currentMeetingIdx <= 0}
                    onClick={() => setCurrentMeetingIdx((prev) => Math.max(0, prev - 1))}
                    className="rounded p-2 text-muted-foreground hover:bg-muted disabled:opacity-30"
                    title="Previous Meeting"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="px-2 text-xs font-semibold text-muted-foreground">
                    {currentMeetingIdx + 1} of {meetingHistory.length}
                  </span>
                  <button
                    disabled={currentMeetingIdx >= meetingHistory.length - 1}
                    onClick={() => setCurrentMeetingIdx((prev) => Math.min(meetingHistory.length - 1, prev + 1))}
                    className="rounded p-2 text-muted-foreground hover:bg-muted disabled:opacity-30"
                    title="Next Meeting"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}

              <Link
                href={`/dashboard/leadership/attendance?meetingId=${inspectedMeeting.id}`}
                className="rounded-lg bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-all text-center flex items-center justify-center gap-2 shadow-sm"
              >
                <QrCode className="h-4 w-4" /> Take Attendance & Fee QR
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Tabbed Analytics Suite */}
      <div className="rounded-xl border bg-card p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
          <div>
            <h3 className="font-bold text-lg text-foreground">Executive Analytics Suite</h3>
            <p className="text-xs text-muted-foreground">
              Real-time attendance composition and revenue realization trends.
            </p>
          </div>

          <div className="flex items-center gap-1 rounded-lg border bg-muted/30 p-1">
            <button
              onClick={() => setActiveTab("attendance")}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                activeTab === "attendance"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Attendance Composition
            </button>
            <button
              onClick={() => setActiveTab("revenue")}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                activeTab === "revenue"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Revenue Realization (₹)
            </button>
          </div>
        </div>

        {/* Tab 1: Attendance Composition Chart */}
        {activeTab === "attendance" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Stacked Weekly Attendees (Members vs Visitors)</span>
              <span>Past Meetings</span>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceComposition} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(20, 20, 25, 0.95)",
                      borderRadius: "8px",
                      border: "1px solid rgba(255,255,255,0.1)",
                      fontSize: "12px",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                  <Bar dataKey="members" name="Inducted Members" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
                  <Bar dataKey="visitors" name="Guest Visitors" stackId="a" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Tab 2: Revenue Realization Chart */}
        {activeTab === "revenue" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Meeting Fee Realization by Payment Mode (₹)</span>
              <span>Cash • UPI • Advance</span>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyRevenue} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(value: any) => [`₹${value}`, ""]}
                    contentStyle={{
                      backgroundColor: "rgba(20, 20, 25, 0.95)",
                      borderRadius: "8px",
                      border: "1px solid rgba(255,255,255,0.1)",
                      fontSize: "12px",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                  <Area type="monotone" dataKey="upi" name="UPI / Online" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} />
                  <Area type="monotone" dataKey="cash" name="Cash Collection" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
                  <Area type="monotone" dataKey="advance" name="Advance Dues" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.4} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Top Referrers Leaderboard */}
      <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" /> Top Referrers Leaderboard
            </h3>
            <p className="text-xs text-muted-foreground">
              Members driving the highest referral volume this chapter quarter.
            </p>
          </div>
          <Link href="/dashboard/leadership/referrals" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
            All Referrals <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {topReferrers.map((ref, idx) => (
            <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl border bg-muted/20 hover:bg-muted/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs ${
                  idx === 0 ? "bg-amber-500/20 text-amber-500 border border-amber-500/30" :
                  idx === 1 ? "bg-slate-300/20 text-slate-300 border border-slate-300/30" :
                  idx === 2 ? "bg-amber-700/20 text-amber-700 border border-amber-700/30" :
                  "bg-muted text-muted-foreground"
                }`}>
                  #{idx + 1}
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{ref.name}</p>
                  <p className="text-xs text-muted-foreground">{ref.businessName}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-base font-bold text-emerald-600">{ref.count}</span>
                <span className="text-[10px] block text-muted-foreground uppercase">Passed</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
