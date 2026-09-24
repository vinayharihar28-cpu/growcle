import React, { useEffect, useState } from "react";
import { BarChart3, TrendingUp, Download, Building2, Users, Handshake, FileSpreadsheet, FileText } from "lucide-react";
import { getDirectorReports, getAssignedChapters, getMeetingWiseReportData } from "../actions/director-actions";
import { exportMeetingWiseReportToExcel, exportMeetingWiseReportToCsv, MEETING_WISE_REPORT_HEADERS, mapMeetingRowsForExport } from "@/lib/export-utils";
import { LeadershipReportsView } from "@/features/leadership/components/leadership-reports-view";

export function ReportsManagementView() {
  const [reports, setReports] = useState<any>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [chapterId, setChapterId] = useState("all");
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState<"meeting-excel" | "meeting-csv" | "multi-excel" | null>(null);

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

  const handleExportMeetingWiseExcel = async () => {
    setExporting("meeting-excel");
    try {
      const meetingData = await getMeetingWiseReportData(chapterId);
      await exportMeetingWiseReportToExcel(meetingData as any, `meeting_wise_report_${chapterId}`);
    } catch (err) {
      console.error("Failed to export meeting wise Excel", err);
    } finally {
      setExporting(null);
    }
  };

  const handleExportMeetingWiseCsv = async () => {
    setExporting("meeting-csv");
    try {
      const meetingData = await getMeetingWiseReportData(chapterId);
      exportMeetingWiseReportToCsv(meetingData as any, `meeting_wise_report_${chapterId}`);
    } catch (err) {
      console.error("Failed to export meeting wise CSV", err);
    } finally {
      setExporting(null);
    }
  };

  const handleExportExcel = async () => {
    if (!reports || !chapters) return;
    setExporting("multi-excel");
    try {
      const { exportMultiSheetExcel } = await import("@/lib/export-utils");
      const { getDirectorMembers } = await import("../actions/director-actions");

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

      // Sheet 2: Meeting-Wise Breakdown Sheet (with members present, visitors, business generated)
      const meetingWiseData = await getMeetingWiseReportData(chapterId);
      const meetingRows = mapMeetingRowsForExport(meetingWiseData as any);
      sheets.push({ name: "Meeting-Wise Breakdown", headers: MEETING_WISE_REPORT_HEADERS, rows: meetingRows });

      // Sheet 3..N: Chapter-Wise Members Sheets
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

      await exportMultiSheetExcel(`director_reports_${new Date().toISOString().split("T")[0]}`, sheets);
    } catch (err) {
      console.error("Failed to export Excel report", err);
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Director Reports & Analytics</h2>
          <p className="text-muted-foreground">Comprehensive chapter performance, membership metrics, referral revenues, and meeting turnouts.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <button
            onClick={handleExportMeetingWiseExcel}
            disabled={exporting !== null}
            className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3.5 py-2 text-xs font-bold hover:bg-emerald-500/20 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
            title="Download meeting-wise report with members present and business generated in Excel"
          >
            <FileSpreadsheet className="h-4 w-4" />
            {exporting === "meeting-excel" ? "Exporting..." : "Meeting-Wise Excel"}
          </button>
          <button
            onClick={handleExportMeetingWiseCsv}
            disabled={exporting !== null}
            className="rounded-lg border border-border bg-card text-foreground px-3.5 py-2 text-xs font-bold hover:bg-muted flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
            title="Download meeting-wise report with members present and business generated in CSV"
          >
            <FileText className="h-4 w-4 text-indigo-500" />
            {exporting === "meeting-csv" ? "Exporting..." : "Meeting-Wise CSV"}
          </button>
          <button
            onClick={handleExportExcel}
            disabled={exporting !== null}
            className="rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-3.5 py-2 text-xs font-bold hover:bg-indigo-500/20 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
          >
            <Download className="h-4 w-4" />
            {exporting === "multi-excel" ? "Generating..." : "Full Multi-Sheet Excel"}
          </button>
        </div>
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
              <table className="w-full text-left text-sm border-collapse min-w-[650px]">
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
