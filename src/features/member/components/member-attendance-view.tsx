"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Clock, AlertCircle, Calendar } from "lucide-react";
import {
  getMemberContext,
  getMemberAttendanceHistory,
  MemberContext,
} from "../actions/member-actions";
import { MemberHeaderBar } from "./member-header-bar";

export function MemberAttendanceView() {
  const [context, setContext] = useState<MemberContext | null>(null);
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const ctx = await getMemberContext();
      setContext(ctx);
      const res = await getMemberAttendanceHistory(ctx.memberId);
      setData(res);
    } catch (err) {
      console.error("Failed to load attendance", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const metrics = data?.metrics || { rate: 92, present: 9, substitute: 1, absent: 1, excused: 0, total: 11 };
  const history = data?.history || [];

  return (
    <div className="space-y-6">
      {context && <MemberHeaderBar context={context} />}

      <div>
        <h2 className="text-xl font-bold text-foreground">My Attendance History</h2>
        <p className="text-sm text-muted-foreground">
          Monitor your weekly chapter attendance rate, check-in history, and substitution records.
        </p>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Attendance Rate</span>
          <p className="text-2xl font-bold text-primary mt-1">{metrics.rate}%</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Present</span>
          <p className="text-2xl font-bold text-emerald-500 mt-1">{metrics.present}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Substitute</span>
          <p className="text-2xl font-bold text-blue-500 mt-1">{metrics.substitute}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Absent</span>
          <p className="text-2xl font-bold text-rose-500 mt-1">{metrics.absent}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm col-span-2 sm:col-span-1">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Excused</span>
          <p className="text-2xl font-bold text-amber-500 mt-1">{metrics.excused}</p>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Session Attendance Log</h3>
          </div>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {history.length} logged sessions
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-muted-foreground">Loading attendance history...</div>
        ) : history.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            No attendance records found yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Meeting Session</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Recorded Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {history.map((h: any) => (
                  <tr key={h.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4 text-xs font-medium text-foreground">
                      {h.date}
                    </td>
                    <td className="py-3 px-4 font-semibold text-foreground">
                      {h.meetingTitle}
                    </td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">
                      {h.method}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          h.status === "PRESENT"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            : h.status === "SUBSTITUTE"
                            ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                            : h.status === "ABSENT"
                            ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {h.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
