"use client";

import React, { useEffect, useState } from "react";
import { BarChart3, TrendingUp, Download, Building2, Users, Handshake } from "lucide-react";
import { getDirectorReports, getAssignedChapters } from "../actions/director-actions";
import { LeadershipReportsView } from "@/features/leadership/components/leadership-reports-view";

export function ReportsManagementView() {
  const [reports, setReports] = useState<any>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [chapterId, setChapterId] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getDirectorReports(chapterId);
        setReports(data);
        const chaps = await getAssignedChapters();
        setChapters(chaps);
      } catch (err) {
        console.error("Failed to load reports", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [chapterId]);

  const handleExportExcel = async () => {
    if (!reports || !chapters) return;
    try {
      const { exportMultiSheetExcel } = await import("@/lib/export-utils");
      const { getDirectorMembers, getDirectorMeetings } = await import("../actions/director-actions");

      const sheets: any[] = [];

      // Sheet 1: Chapters Overview
      const overviewHeaders = ["Chapter Name", "Region", "Active Members", "Attendance %", "Visitors", "Visitor Conv %", "Closed Business (INR)"];
      const overviewRows = reports.chapters.map((c: any) => [
        c.name,
        c.region || "Region",
        c.memberCount,
        `${c.attendanceRate}%`,
        c.visitorCount,
        `${c.visitorConversion}%`,
        c.closedBusiness,
      ]);
      sheets.push({ name: "Chapters Overview", headers: overviewHeaders, rows: overviewRows });

      // Sheet 2..N: Chapter-Wise Members Sheets
      for (const chap of reports.chapters) {
        const mems = await getDirectorMembers({ chapterId: chap.id });
        const memHeaders = ["Member Name", "Email", "Phone", "Business Name", "Industry", "Role", "Status"];
        const memRows = mems.map((m: any) => [
          `${m.firstName} ${m.lastName}`,
          m.email,
          m.phone || "N/A",
          m.businessName || "Member",
          m.industry || "General",
          m.currentRole || "MEMBER",
          m.status,
        ]);
        sheets.push({ name: `${chap.name.substring(0, 20)} Members`, headers: memHeaders, rows: memRows });
      }

      // Meeting-Wise Breakdown Sheet
      const meetings = await getDirectorMeetings(chapterId);
      const meetingHeaders = ["Meeting Date", "Chapter", "Meeting Title", "Speaker", "Location", "Type", "Attendees", "Status"];
      const meetingRows = meetings.map((m: any) => [
        new Date(m.date).toLocaleDateString("en-IN"),
        m.chapterName,
        m.title,
        m.speaker,
        m.location,
        m.meetingType,
        m.attendanceCount,
        m.status,
      ]);
      sheets.push({ name: "Meeting-Wise Breakdown", headers: meetingHeaders, rows: meetingRows });

      await exportMultiSheetExcel(`director_reports_${new Date().toISOString().split("T")[0]}`, sheets);
    } catch (err) {
      console.error("Failed to export Excel report", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Director Reports & Analytics</h2>
          <p className="text-muted-foreground">Comprehensive chapter performance, membership metrics, referral revenues, and leadership reports.</p>
        </div>
        <button
          onClick={handleExportExcel}
          className="rounded-md border border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-4 py-2 text-sm font-semibold hover:bg-indigo-500/20 flex items-center gap-2 self-start md:self-auto cursor-pointer"
        >
          <Download className="h-4 w-4" /> Export Multi-Sheet Excel
        </button>
      </div>

      <div className="rounded-xl border bg-card p-4 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <select
          value={chapterId}
          onChange={(e) => setChapterId(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium w-full sm:w-auto"
        >
          <option value="all">All Assigned Chapters</option>
          {chapters.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {loading || !reports ? (
        <div className="h-64 rounded-xl bg-muted animate-pulse" />
      ) : (
        <div className="space-y-6">
          {/* Performance Monthly Trends */}
          <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" /> Monthly Performance Trends
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
              {reports.monthlyPerformance.map((item: any) => (
                <div key={item.month} className="rounded-lg border bg-background p-3 text-center space-y-1">
                  <span className="text-xs font-bold uppercase text-muted-foreground">{item.month}</span>
                  <p className="text-base font-bold text-emerald-600">₹{(item.business / 1000).toFixed(0)}k</p>
                  <span className="text-[11px] text-muted-foreground">{item.referrals} Referrals</span>
                  <div className="text-[10px] text-purple-600 font-semibold">{item.attendance}% Att.</div>
                </div>
              ))}
            </div>
          </div>

          {/* Chapter Comparison Analytics */}
          <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" /> Assigned Chapters Comparison
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="border-b bg-muted/50 text-xs font-semibold uppercase text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 whitespace-nowrap">Chapter</th>
                    <th className="px-4 py-3 whitespace-nowrap">Members</th>
                    <th className="px-4 py-3 whitespace-nowrap">Attendance Rate</th>
                    <th className="px-4 py-3 whitespace-nowrap">Visitors</th>
                    <th className="px-4 py-3 whitespace-nowrap">Visitor Conversion</th>
                    <th className="px-4 py-3 whitespace-nowrap">Referrals</th>
                    <th className="px-4 py-3 whitespace-nowrap">Closed Business</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {reports.chapters.map((c: any) => (
                    <tr key={c.id}>
                      <td className="px-4 py-3 font-semibold">{c.name}</td>
                      <td className="px-4 py-3 font-medium">{c.memberCount}</td>
                      <td className="px-4 py-3 font-semibold">{c.attendanceRate}%</td>
                      <td className="px-4 py-3">{c.visitorCount}</td>
                      <td className="px-4 py-3 text-emerald-600 font-semibold">{c.visitorConversion}%</td>
                      <td className="px-4 py-3 font-medium">{c.referralCount}</td>
                      <td className="px-4 py-3 font-bold text-emerald-600">₹{(c.closedBusiness / 1000).toFixed(1)}k</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Meeting Attendance & Turnout PDF Reports */}
          <div className="pt-4 border-t">
            <LeadershipReportsView forcedRole="DIRECTOR" />
          </div>
        </div>
      )}
    </div>
  );
}
