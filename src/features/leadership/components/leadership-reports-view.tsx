"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart3,
  Users,
  IndianRupee,
  Calendar,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  Eye,
  X,
  Printer,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import {
  getLeadershipContext,
  getMeetingReports,
  getMeetingReportDetail,
  LeadershipContext,
} from "../actions/leadership-actions";
import { LeadershipHeaderBar } from "./leadership-header-bar";

interface ReportsViewProps {
  forcedRole?: "ADMIN" | "DIRECTOR" | "LEADERSHIP";
}

export function LeadershipReportsView({ forcedRole }: ReportsViewProps) {
  const [context, setContext] = useState<LeadershipContext | null>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected Meeting Report Detail Modal
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);
  const [reportDetail, setReportDetail] = useState<any | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

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

  const handleOpenDetail = async (meetingId: string) => {
    setSelectedMeetingId(meetingId);
    setLoadingDetail(true);
    try {
      const detail = await getMeetingReportDetail(meetingId);
      setReportDetail(detail);
    } catch (err) {
      console.error("Failed to load meeting report detail", err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportCsv = () => {
    const { exportToCsv } = require("@/lib/export-utils");
    const headers = ["Meeting Date", "Meeting Title", "Turnout %", "Present", "Absent", "Visitors", "Fee Collected (INR)"];
    const rows = reports.map((r) => [
      new Date(r.meetingDate).toLocaleDateString(),
      r.meetingTitle || "Weekly Meeting",
      `${r.turnoutPercentage}%`,
      r.presentCount,
      r.absentCount,
      r.visitorCount,
      r.totalCollection,
    ]);
    exportToCsv(`meeting_reports_${context?.chapterName || "chapter"}`, headers, rows);
  };

  const roleTitle =
    forcedRole === "ADMIN"
      ? "Executive Admin Oversight"
      : forcedRole === "DIRECTOR"
      ? "Regional Director Analytics"
      : "Chapter Leadership Reports";

  return (
    <div className="space-y-6 print:p-0">
      {context && <div className="print:hidden"><LeadershipHeaderBar context={context} /></div>}

      {/* Header & Export Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary border border-primary/20">
              {roleTitle}
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground mt-1">
            Meeting Attendance & Turnout Reports
          </h2>
          <p className="text-sm text-muted-foreground">
            Historical meeting turnouts, fee realizations, present/absent breakdowns, and first-time visitors.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-input bg-card text-foreground text-xs font-bold hover:bg-muted shadow-xs cursor-pointer"
          >
            <Download className="h-4 w-4 text-indigo-500" />
            <span>Export CSV / Excel</span>
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 shadow-sm cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>Print / PDF Export</span>
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 print:grid-cols-4">
        <div className="rounded-xl border bg-card p-4 shadow-sm border-blue-500/20">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Meetings</span>
          <p className="text-2xl font-bold text-foreground mt-1">{reports.length}</p>
          <span className="text-xs text-muted-foreground">Recorded in system</span>
        </div>

        <div className="rounded-xl border bg-card p-4 shadow-sm border-emerald-500/20">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Average Turnout</span>
          <p className="text-2xl font-bold text-emerald-600 mt-1">
            {reports.length > 0
              ? Math.round(reports.reduce((acc, r) => acc + r.turnoutPercentage, 0) / reports.length)
              : 0}
            %
          </p>
          <span className="text-xs text-emerald-600/80 font-medium">Chapter average</span>
        </div>

        <div className="rounded-xl border bg-card p-4 shadow-sm border-purple-500/20">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Cumulative Fees</span>
          <p className="text-2xl font-bold text-purple-600 mt-1">
            ₹{reports.reduce((acc, r) => acc + r.totalCollection, 0)}
          </p>
          <span className="text-xs text-muted-foreground">Total realized fees</span>
        </div>

        <div className="rounded-xl border bg-card p-4 shadow-sm border-amber-500/20">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Chapter Fee Setting</span>
          <p className="text-2xl font-bold text-foreground mt-1">₹{context?.meetingFee || 800}</p>
          <span className="text-xs text-muted-foreground">Standard per meeting</span>
        </div>
      </div>

      {/* Meeting Reports Table */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-muted/20 flex items-center justify-between">
          <h3 className="font-bold text-sm text-foreground">Weekly Meeting Performance Logs</h3>
          <span className="text-xs text-muted-foreground">Click any meeting to inspect detailed breakdown</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="py-3 px-4">Meeting Title</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Turnout Rate</th>
                <th className="py-3 px-4">Present / Total</th>
                <th className="py-3 px-4">Fee Collection</th>
                <th className="py-3 px-4 text-right print:hidden">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    Aggregating meeting reports...
                  </td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    No meeting records found.
                  </td>
                </tr>
              ) : (
                reports.map((report) => (
                  <tr key={report.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-foreground">
                      {report.title}
                    </td>

                    <td className="py-3.5 px-4 text-xs text-muted-foreground flex items-center gap-1.5 pt-4">
                      <Calendar className="h-3.5 w-3.5 text-primary" /> {report.date}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600 border border-emerald-500/20">
                        {report.turnoutPercentage}%
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-xs text-foreground font-medium">
                      <span className="text-emerald-600 font-bold">{report.presentCount}</span> Present •{" "}
                      <span className="text-rose-600 font-bold">{report.absentCount}</span> Absent
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-foreground">
                      ₹{report.totalCollection}
                    </td>

                    <td className="py-3.5 px-4 text-right print:hidden">
                      <button
                        onClick={() => handleOpenDetail(report.id)}
                        className="rounded-lg border border-input bg-card px-3 py-1.5 text-xs font-semibold hover:bg-accent text-foreground inline-flex items-center gap-1 shadow-sm"
                      >
                        <Eye className="h-3.5 w-3.5 text-primary" /> View Report
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Meeting Report Inspection Modal */}
      {selectedMeetingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-2xl border bg-card p-6 shadow-2xl space-y-6 my-8 animate-in fade-in zoom-in duration-150">
            <button
              onClick={() => setSelectedMeetingId(null)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground hover:bg-muted"
            >
              <X className="h-5 w-5" />
            </button>

            {loadingDetail || !reportDetail ? (
              <div className="py-16 text-center text-muted-foreground">
                Loading detailed meeting report...
              </div>
            ) : (
              <div className="space-y-6">
                {/* Header */}
                <div className="border-b pb-4">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                    Executive Meeting Report
                  </span>
                  <h3 className="text-2xl font-bold text-foreground mt-2">{reportDetail.meeting.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {reportDetail.meeting.chapterName} ({reportDetail.meeting.chapterCode}) • {reportDetail.meeting.date}
                  </p>
                </div>

                {/* KPI Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="rounded-xl border bg-muted/20 p-3">
                    <span className="text-xs text-muted-foreground">Turnout Rate</span>
                    <p className="text-xl font-bold text-emerald-600 mt-1">{reportDetail.meeting.turnout}%</p>
                  </div>
                  <div className="rounded-xl border bg-muted/20 p-3">
                    <span className="text-xs text-muted-foreground">Present Attendees</span>
                    <p className="text-xl font-bold text-foreground mt-1">{reportDetail.meeting.presentCount}</p>
                  </div>
                  <div className="rounded-xl border bg-muted/20 p-3">
                    <span className="text-xs text-muted-foreground">Absent Attendees</span>
                    <p className="text-xl font-bold text-rose-600 mt-1">{reportDetail.meeting.absentCount}</p>
                  </div>
                  <div className="rounded-xl border bg-muted/20 p-3">
                    <span className="text-xs text-muted-foreground">Total Fee Collected</span>
                    <p className="text-xl font-bold text-purple-600 mt-1">₹{reportDetail.meeting.totalCollection}</p>
                  </div>
                </div>

                {/* Highlight: First-Time Visitors */}
                {reportDetail.newVisitors && reportDetail.newVisitors.length > 0 && (
                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-amber-500" />
                      <h4 className="font-bold text-sm text-amber-600 dark:text-amber-400">
                        First-Time Chapter Visitors ({reportDetail.newVisitors.length})
                      </h4>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      These guests attended their very first meeting with this chapter today:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {reportDetail.newVisitors.map((v: any) => (
                        <div key={v.id} className="rounded-lg border bg-card p-2 text-xs">
                          <span className="font-bold text-foreground">{v.name}</span>
                          <span className="block text-muted-foreground">{v.business} • {v.phone}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Present Attendees Roster */}
                <div className="space-y-2">
                  <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5 text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" /> Present Attendees ({reportDetail.presentList.length})
                  </h4>
                  <div className="rounded-xl border bg-card max-h-48 overflow-y-auto divide-y text-xs">
                    {reportDetail.presentList.map((attendee: any) => (
                      <div key={attendee.id} className="p-2.5 flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-foreground">{attendee.name}</span>
                          <span className="text-muted-foreground block text-[11px]">{attendee.business}</span>
                        </div>
                        <div className="text-right">
                          <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold text-emerald-600">
                            {attendee.paymentMethod} ₹{attendee.amount}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Absent Members Roster */}
                {reportDetail.absentList && reportDetail.absentList.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5 text-rose-600">
                      <XCircle className="h-4 w-4" /> Absent / Excused ({reportDetail.absentList.length})
                    </h4>
                    <div className="rounded-xl border bg-card max-h-36 overflow-y-auto divide-y text-xs">
                      {reportDetail.absentList.map((attendee: any) => (
                        <div key={attendee.id} className="p-2 flex items-center justify-between">
                          <span className="font-medium text-muted-foreground">{attendee.name}</span>
                          <span className="text-[11px] text-muted-foreground">{attendee.business}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Modal Footer */}
                <div className="flex justify-end gap-2 pt-2 border-t">
                  <button
                    onClick={() => setSelectedMeetingId(null)}
                    className="rounded-lg border border-input bg-background px-4 py-2 text-xs font-semibold hover:bg-accent"
                  >
                    Close
                  </button>
                  <button
                    onClick={handlePrint}
                    className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 flex items-center gap-1.5"
                  >
                    <Printer className="h-4 w-4" /> Print Meeting Report
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
