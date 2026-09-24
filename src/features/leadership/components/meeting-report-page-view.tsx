"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Building2,
  Users,
  CheckCircle2,
  XCircle,
  Download,
  FileSpreadsheet,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Phone,
  Mail,
  RefreshCw,
} from "lucide-react";
import { getMeetingReportDetail } from "../actions/leadership-actions";
import {
  exportMeetingReportToPdf,
  exportMeetingDetailToCsv,
} from "@/lib/export-utils";

interface MeetingReportPageViewProps {
  meetingId: string;
}

export function MeetingReportPageView({ meetingId }: MeetingReportPageViewProps) {
  const [reportDetail, setReportDetail] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [exportingCsv, setExportingCsv] = useState(false);

  const loadReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMeetingReportDetail(meetingId);
      setReportDetail(data);
    } catch (err: any) {
      console.error("Failed to load meeting report:", err);
      setError(err?.message || "Failed to load detailed report.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (meetingId) {
      loadReport();
    }
  }, [meetingId]);

  const handleDownloadPdf = async () => {
    if (!reportDetail) return;
    setExportingPdf(true);
    try {
      await exportMeetingReportToPdf(reportDetail);
    } catch (err) {
      console.error("Failed to export PDF:", err);
    } finally {
      setExportingPdf(false);
    }
  };

  const handleDownloadCsv = () => {
    if (!reportDetail) return;
    setExportingCsv(true);
    try {
      exportMeetingDetailToCsv(reportDetail);
    } catch (err) {
      console.error("Failed to export CSV:", err);
    } finally {
      setExportingCsv(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="h-8 w-8 text-primary animate-spin" />
        <p className="text-sm font-medium text-muted-foreground">Loading executive meeting report...</p>
      </div>
    );
  }

  if (error || !reportDetail) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-4">
        <Link
          href="/dashboard/leadership/reports"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Chapter Reports
        </Link>
        <div className="p-8 rounded-2xl border border-destructive/20 bg-destructive/5 text-center space-y-3">
          <p className="text-sm font-semibold text-destructive">{error || "Report not found"}</p>
          <button
            onClick={loadReport}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { meeting, presentList, absentList, newVisitors } = reportDetail;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Top Navigation & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/dashboard/leadership/reports"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to All Chapter Reports</span>
        </Link>

        {/* Download Buttons (Proper PDF and CSV downloads, not print screen) */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleDownloadCsv}
            disabled={exportingCsv}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-input bg-background hover:bg-muted text-xs font-semibold text-foreground transition-colors cursor-pointer shadow-xs disabled:opacity-50"
            title="Download CSV spreadsheet"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
            <span>{exportingCsv ? "Exporting..." : "Download CSV"}</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={exportingPdf}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors cursor-pointer shadow-sm disabled:opacity-50"
            title="Direct PDF file download"
          >
            <Download className="h-4 w-4" />
            <span>{exportingPdf ? "Generating PDF..." : "Download PDF"}</span>
          </button>
        </div>
      </div>

      {/* Main Report Header Card */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 h-40 w-40 bg-primary/5 rounded-full blur-3xl -z-10" />

        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Executive Meeting Report</span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {meeting.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2.5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5 font-medium text-foreground">
                <Building2 className="h-4 w-4 text-primary" />
                {meeting.chapterName} ({meeting.chapterCode})
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {meeting.date}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                {meeting.location}
              </span>
            </div>
          </div>
        </div>

        {/* KPI Metrics Summary Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4 mt-6 pt-6 border-t border-border">
          <div className="p-4 rounded-2xl bg-muted/40 border border-border/60">
            <p className="text-xs font-semibold text-muted-foreground">Turnout Rate</p>
            <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {meeting.turnout}%
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {meeting.presentCount} of {meeting.totalAttendees} attended
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-muted/40 border border-border/60">
            <p className="text-xs font-semibold text-muted-foreground">Present Attendees</p>
            <p className="text-2xl sm:text-3xl font-black text-foreground mt-1">
              {meeting.presentCount}
            </p>
            <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
              Active Turnout
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-muted/40 border border-border/60">
            <p className="text-xs font-semibold text-muted-foreground">Absent Members</p>
            <p className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400 mt-1">
              {meeting.absentCount}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Excused / Absent
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-muted/40 border border-border/60">
            <p className="text-xs font-semibold text-muted-foreground">Total Fee Collected</p>
            <p className="text-2xl sm:text-3xl font-black text-primary mt-1">
              ₹{meeting.totalCollection.toLocaleString("en-IN")}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              UPI & Cash Collections
            </p>
          </div>
        </div>
      </div>

      {/* First-Time Chapter Visitors Highlight Card */}
      {newVisitors && newVisitors.length > 0 && (
        <div className="p-5 sm:p-6 rounded-3xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20 space-y-3">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <Sparkles className="h-5 w-5" />
            <h2 className="text-sm font-bold uppercase tracking-wider">
              First-Time Chapter Visitors ({newVisitors.length})
            </h2>
          </div>
          <p className="text-xs text-muted-foreground">
            These guests attended their very first meeting with this chapter today:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
            {newVisitors.map((v: any) => (
              <div
                key={v.id}
                className="p-3.5 rounded-2xl border border-amber-500/20 bg-background/80 shadow-xs space-y-1"
              >
                <p className="text-xs font-bold text-foreground">{v.name}</p>
                <p className="text-[11px] text-muted-foreground font-medium">{v.business}</p>
                <div className="flex items-center gap-2 pt-1 text-[11px] text-muted-foreground">
                  {v.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3 text-amber-600" /> {v.phone}
                    </span>
                  )}
                  {v.email && (
                    <span className="flex items-center gap-1 truncate">
                      <Mail className="h-3 w-3 text-amber-600" /> {v.email}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Present Attendees Roster Section */}
      <div className="rounded-3xl border border-border bg-card p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">
                Present Attendees ({presentList.length})
              </h2>
              <p className="text-[11px] text-muted-foreground">
                Members and visitors who attended and cleared meeting fees
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 text-muted-foreground font-semibold border-b border-border">
              <tr>
                <th className="py-3 px-4">Attendee</th>
                <th className="py-3 px-4">Business / Enterprise</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4 text-right">Fee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {presentList.map((attendee: any) => (
                <tr key={attendee.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-bold text-foreground">{attendee.name}</p>
                    <p className="text-[11px] text-muted-foreground">{attendee.phone || attendee.email}</p>
                  </td>
                  <td className="py-3 px-4 font-medium text-muted-foreground">
                    {attendee.business}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        attendee.isVisitor
                          ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                          : "bg-primary/10 text-primary border border-primary/20"
                      }`}
                    >
                      {attendee.isVisitor ? "Visitor" : "Member"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[11px] font-bold border border-emerald-500/20">
                      <CreditCard className="h-3 w-3" />
                      {attendee.paymentMethod || "UPI"} • Paid
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-foreground">
                    ₹{attendee.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Absent Members Roster Section */}
      {absentList && absentList.length > 0 && (
        <div className="rounded-3xl border border-border bg-card p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-600">
              <XCircle className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">
                Absent / Excused Members ({absentList.length})
              </h2>
              <p className="text-[11px] text-muted-foreground">
                Chapter members who were unable to attend this session
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {absentList.map((member: any) => (
              <div
                key={member.id}
                className="p-3.5 rounded-2xl border border-border bg-muted/20 space-y-1"
              >
                <p className="text-xs font-bold text-foreground">{member.name}</p>
                <p className="text-[11px] text-muted-foreground">{member.business}</p>
                {member.phone && (
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1 pt-0.5">
                    <Phone className="h-2.5 w-2.5" /> {member.phone}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
