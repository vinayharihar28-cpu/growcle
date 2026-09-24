"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  Users,
  IndianRupee,
  Calendar,
  Download,
  FileSpreadsheet,
  Eye,
  ArrowRight,
} from "lucide-react";
import {
  getLeadershipContext,
  getMeetingReports,
  LeadershipContext,
} from "../actions/leadership-actions";
import { LeadershipHeaderBar } from "./leadership-header-bar";
import {
  exportMeetingWiseReportToExcel,
  exportMeetingWiseReportToCsv,
  MeetingWiseExportRow,
} from "@/lib/export-utils";

interface ReportsViewProps {
  forcedRole?: "ADMIN" | "DIRECTOR" | "LEADERSHIP";
}

export function LeadershipReportsView({ forcedRole }: ReportsViewProps) {
  const [context, setContext] = useState<LeadershipContext | null>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const ctx = await getLeadershipContext();
      setContext(ctx);
      const res = await getMeetingReports(ctx.chapterId);
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

  const getMeetingExportRows = (): MeetingWiseExportRow[] => {
    return reports.map((r) => ({
      meetingDate: r.rawDate ? r.rawDate.split("T")[0] : r.date,
      chapterName: r.chapterName || context?.chapterName || "Chapter",
      chapterCode: r.chapterCode || context?.chapterCode || "CHP",
      meetingTitle: r.title || "Weekly Business Meeting",
      totalChapterMembers: r.totalChapterMembers || r.totalAttendees || 0,
      membersPresent: r.membersPresent ?? r.presentCount ?? 0,
      membersAbsent: r.membersAbsent ?? r.absentCount ?? 0,
      memberTurnoutRate: r.turnoutPercentage,
      visitorsPresent: r.visitorsPresent ?? 0,
      totalAttendees: r.totalAttendees || (r.presentCount ?? 0),
      totalBusinessGenerated: r.businessGenerated ?? 0,
      referralsExchanged: r.referralsExchanged ?? 0,
      feesCollected: r.totalCollection ?? 0,
      status: "COMPLETED",
    }));
  };

  const handleExportCsv = () => {
    const rows = getMeetingExportRows();
    exportMeetingWiseReportToCsv(
      rows,
      `${context?.chapterName || "Chapter"}_Meeting_Wise_Report`
    );
  };

  const handleExportExcel = async () => {
    const rows = getMeetingExportRows();
    await exportMeetingWiseReportToExcel(
      rows,
      `${context?.chapterName || "Chapter"}_Meeting_Wise_Report`
    );
  };

  const totalMembersPresentAcross = reports.reduce(
    (acc, r) => acc + (r.membersPresent ?? r.presentCount ?? 0),
    0
  );
  const totalBusinessGeneratedAcross = reports.reduce(
    (acc, r) => acc + (r.businessGenerated || 0),
    0
  );
  const totalCollectionsAcross = reports.reduce(
    (acc, r) => acc + (r.totalCollection || 0),
    0
  );
  const avgTurnoutRate = reports.length
    ? Math.round(
        reports.reduce((acc, r) => acc + Number(r.turnoutPercentage || 0), 0) /
          reports.length
      )
    : 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Leadership Header */}
      {context && <LeadershipHeaderBar context={context} />}

      {/* Action and Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">Chapter Analytics & Meeting Reports</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Historical meeting breakdowns, attendance performance, and revenue records for {context?.chapterName || "your chapter"}.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-input bg-card text-xs font-semibold text-foreground hover:bg-muted transition-colors shadow-sm cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Meeting-Wise CSV</span>
          </button>
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-sm cursor-pointer"
          >
            <FileSpreadsheet className="h-3.5 w-3.5" />
            <span>Meeting-Wise Excel</span>
          </button>
        </div>
      </div>

      {/* Aggregate KPI Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Average Turnout
          </span>
          <p className="text-2xl font-bold text-foreground mt-1">
            {avgTurnoutRate}%
          </p>
          <span className="text-xs text-muted-foreground">
            Across {reports.length} meetings
          </span>
        </div>

        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Total Attendances
          </span>
          <p className="text-2xl font-bold text-emerald-600 mt-1">
            {totalMembersPresentAcross}
          </p>
          <span className="text-xs text-muted-foreground">
            Members present cumulative
          </span>
        </div>

        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Total Revenue Collected
          </span>
          <p className="text-2xl font-bold text-foreground mt-1">
            ₹{totalCollectionsAcross.toLocaleString("en-IN")}
          </p>
          <span className="text-xs text-muted-foreground">
            Meeting fee collections
          </span>
        </div>

        <div className="rounded-xl border bg-card p-4 shadow-sm border-amber-500/20">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Chapter Fee Setting
          </span>
          <p className="text-2xl font-bold text-foreground mt-1">
            ₹{context?.meetingFee || 800}
          </p>
          <span className="text-xs text-muted-foreground">
            Standard per meeting
          </span>
        </div>
      </div>

      {/* Meeting Reports Table */}
      <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-muted/20 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-foreground">
              Weekly Meeting Performance Logs
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Click &quot;View Report&quot; on any meeting to open its full executive report page
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="py-3 px-4">Meeting Title</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Turnout Rate</th>
                <th className="py-3 px-4">Members Present</th>
                <th className="py-3 px-4">Business Generated</th>
                <th className="py-3 px-4">Fee Collection</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    Aggregating meeting reports...
                  </td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    No meeting records found.
                  </td>
                </tr>
              ) : (
                reports.map((report) => (
                  <tr key={report.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-foreground">
                      {report.title}
                    </td>

                    <td className="py-3.5 px-4 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                        {report.date}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600 border border-emerald-500/20">
                        {report.turnoutPercentage}%
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-xs text-foreground font-medium">
                      <div>
                        <span className="text-emerald-600 font-bold">
                          {report.membersPresent ?? report.presentCount}
                        </span>{" "}
                        Members Present
                        <span className="text-muted-foreground block text-[11px]">
                          {report.absentCount} Absent • {report.visitorsPresent || 0} Visitors
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-emerald-600 dark:text-emerald-400">
                      ₹{Number(report.businessGenerated || 0).toLocaleString("en-IN")}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-foreground">
                      ₹{report.totalCollection}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {/* Navigates directly to dedicated full report page with real PDF / CSV downloads */}
                      <Link
                        href={`/dashboard/leadership/reports/${report.id}`}
                        className="rounded-lg border border-input bg-card px-3 py-1.5 text-xs font-semibold hover:bg-accent text-foreground inline-flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5 text-primary" />
                        <span>View Report</span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
