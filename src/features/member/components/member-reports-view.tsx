"use client";

import React, { useEffect, useState } from "react";
import { BarChart3, TrendingUp, Handshake, CheckCircle2, IndianRupee, Users, Download } from "lucide-react";
import {
  getMemberContext,
  getMemberReports,
  MemberContext,
} from "../actions/member-actions";
import { MemberHeaderBar } from "./member-header-bar";

export function MemberReportsView() {
  const [context, setContext] = useState<MemberContext | null>(null);
  const [reports, setReports] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const ctx = await getMemberContext();
      setContext(ctx);
      const res = await getMemberReports(ctx.memberId);
      setReports(res);
    } catch (err) {
      console.error("Failed to load reports", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatINR = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const sc = reports?.scorecard || {
    networkingScore: 0,
    attendanceRate: 0,
    referralsGiven: 0,
    referralsReceived: 0,
    closedBusinessValue: 0,
    oneToOnesCompleted: 0,
    visitorsContributed: 0,
  };

  return (
    <div className="space-y-6">
      {context && <MemberHeaderBar context={context} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">My Networking Scorecard & Analytics</h2>
          <p className="text-sm text-muted-foreground">
            Personal engagement metrics, referral ROI, and participation reliability.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm"
        >
          <Download className="h-4 w-4" />
          <span>Print Scorecard</span>
        </button>
      </div>

      {loading ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center text-muted-foreground">
          Loading personal scorecard...
        </div>
      ) : (
        <>
          {/* Main Scorecard Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Networking Score */}
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Networking Score</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">
                  Top Tier
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-primary">{sc.networkingScore}</span>
                <span className="text-xs text-muted-foreground">/ 100</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: `${sc.networkingScore}%` }} />
              </div>
            </div>

            {/* Attendance Reliability */}
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Attendance Rate</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-foreground">{sc.attendanceRate}%</span>
                <span className="text-xs text-emerald-500 font-semibold">Reliable</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${sc.attendanceRate}%` }} />
              </div>
            </div>

            {/* Closed Business Value */}
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Closed Business (INR)</span>
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              </div>
              <div>
                <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {formatINR(sc.closedBusinessValue)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Verified chapter member-to-member transactions
              </p>
            </div>
          </div>

          {/* Activity Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
              <span className="text-xs text-muted-foreground">Referrals Given</span>
              <p className="text-2xl font-bold text-foreground mt-1">{sc.referralsGiven}</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
              <span className="text-xs text-muted-foreground">Referrals Received</span>
              <p className="text-2xl font-bold text-foreground mt-1">{sc.referralsReceived}</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
              <span className="text-xs text-muted-foreground">1-to-1 Sessions</span>
              <p className="text-2xl font-bold text-blue-500 mt-1">{sc.oneToOnesCompleted}</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
              <span className="text-xs text-muted-foreground">Guests Invited</span>
              <p className="text-2xl font-bold text-amber-500 mt-1">{sc.visitorsContributed}</p>
            </div>
          </div>

          {/* Monthly Trajectory */}
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Quarterly Performance Breakdown</h3>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <th className="py-3 px-4">Period</th>
                    <th className="py-3 px-4">Referrals Passed</th>
                    <th className="py-3 px-4">Revenue Impact (INR)</th>
                    <th className="py-3 px-4">Attendance Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {(reports?.monthlyBreakdown || []).map((m: any) => (
                    <tr key={m.month} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-4 font-bold text-foreground">
                        {m.month} 2026
                      </td>
                      <td className="py-3 px-4 text-foreground">
                        {m.referrals} referrals
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                        {formatINR(m.business)}
                      </td>
                      <td className="py-3 px-4 font-semibold text-primary">
                        {m.attendance}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
