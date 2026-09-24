"use client";

import React, { useEffect, useState } from "react";
import { Calendar, Building2, MapPin, Users, Clock, Video, CheckCircle, Search, Filter, Download, FileSpreadsheet, FileText } from "lucide-react";
import { getDirectorMeetings, getAssignedChapters, getMeetingWiseReportData } from "../actions/director-actions";
import { exportMeetingWiseReportToExcel, exportMeetingWiseReportToCsv } from "@/lib/export-utils";
import { Button } from "@/shared/components/ui/button";

export function MeetingsManagementView() {
  const [meetings, setMeetings] = useState<any[]>([]);
  const [chapters, setChapters] = useState<any[]>([]);
  const [chapterId, setChapterId] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getDirectorMeetings(chapterId);
        setMeetings(data);
        const chaps = await getAssignedChapters();
        setChapters(chaps);
      } catch (err) {
        console.error("Failed to load meetings", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [chapterId]);

  const handleExportMeetingWise = async (format: "excel" | "csv") => {
    try {
      setExporting(true);
      const data = await getMeetingWiseReportData(chapterId === "all" ? undefined : chapterId);
      if (!data || data.length === 0) {
        alert("No meeting records available to export.");
        return;
      }
      const filename = `meeting_wise_report_${chapterId === "all" ? "all_chapters" : chapterId}_${new Date().toISOString().split("T")[0]}`;
      if (format === "excel") {
        exportMeetingWiseReportToExcel(data, filename);
      } else {
        exportMeetingWiseReportToCsv(data, filename);
      }
    } catch (err) {
      console.error("Meeting-wise export failed", err);
      alert("Failed to export meeting report.");
    } finally {
      setExporting(false);
    }
  };

  const filteredMeetings = meetings.filter(
    (m) =>
      !search ||
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.chapterName.toLowerCase().includes(search.toLowerCase()) ||
      m.speaker.toLowerCase().includes(search.toLowerCase())
  );

  const totalMeetings = meetings.length;
  const completedMeetings = meetings.filter((m) => m.status === "COMPLETED").length;
  const totalAttendees = meetings.reduce((sum, m) => sum + (m.attendanceCount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Director Meetings Oversight</h2>
          <p className="text-sm text-muted-foreground">Comprehensive full-width oversight of weekly chapter meetings, agendas, speakers, attendance, and business generated.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={exporting}
            onClick={() => handleExportMeetingWise("csv")}
            className="text-xs h-9 cursor-pointer border-border"
          >
            <FileText className="w-4 h-4 mr-1.5 text-blue-500" />
            {exporting ? "Exporting..." : "Meeting CSV"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={exporting}
            onClick={() => handleExportMeetingWise("excel")}
            className="text-xs h-9 cursor-pointer border-emerald-500/30 text-emerald-600 hover:text-emerald-700 bg-emerald-500/5 hover:bg-emerald-500/10 font-semibold"
          >
            <FileSpreadsheet className="w-4 h-4 mr-1.5 text-emerald-600" />
            {exporting ? "Exporting..." : "Meeting-Wise Excel"}
          </Button>
        </div>
      </div>

      {/* Prominent Full-Width Metrics Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Scheduled Meetings</span>
            <Calendar className="h-5 w-5 text-indigo-500" />
          </div>
          <div className="text-3xl font-extrabold text-foreground">{totalMeetings}</div>
          <p className="text-xs text-muted-foreground">Active in assigned chapters</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Completed Meetings</span>
            <CheckCircle className="h-5 w-5 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-foreground">{completedMeetings}</div>
          <p className="text-xs text-muted-foreground">Minutes & attendance finalized</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Registrations</span>
            <Users className="h-5 w-5 text-blue-500" />
          </div>
          <div className="text-3xl font-extrabold text-foreground">{totalAttendees}</div>
          <p className="text-xs text-muted-foreground">Members & visitors recorded</p>
        </div>
      </div>

      {/* Filter & Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card border border-border rounded-xl p-3.5 shadow-xs">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search meeting, speaker, or chapter..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 w-full border border-input rounded-lg bg-background text-sm focus:ring-2 focus:ring-primary outline-hidden"
            />
          </div>
          <select
            value={chapterId}
            onChange={(e) => setChapterId(e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Assigned Chapters</option>
            {chapters.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <span className="text-xs font-semibold text-muted-foreground shrink-0">
          Showing {filteredMeetings.length} Meetings
        </span>
      </div>

      {/* Full-Width Bar List (Bull-Bar Layout) */}
      <div className="space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-xl bg-muted animate-pulse w-full" />
            ))}
          </div>
        ) : filteredMeetings.length === 0 ? (
          <div className="bg-card border border-dashed border-border rounded-xl p-12 text-center text-muted-foreground text-sm">
            No meetings found for the selected criteria.
          </div>
        ) : (
          filteredMeetings.map((m) => (
            <div
              key={m.id}
              className="bg-card border border-border rounded-xl p-4 shadow-xs hover:border-primary/50 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              {/* Left Bar Info */}
              <div className="flex items-start gap-4 min-w-0 flex-1">
                <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0 hidden sm:flex items-center justify-center">
                  <Calendar className="h-6 w-6" />
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary uppercase border border-primary/20">
                      {m.chapterName}
                    </span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      m.status === "COMPLETED"
                        ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                        : "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                    }`}>
                      {m.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-base text-foreground truncate">{m.title}</h4>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-primary" /> {new Date(m.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-primary" /> {m.location}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-foreground">
                      Speaker: {m.speaker}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Bar Stats & Actions */}
              <div className="flex items-center gap-6 shrink-0 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 justify-between md:justify-end">
                <div className="text-right">
                  <div className="text-sm font-extrabold text-foreground flex items-center justify-end gap-1">
                    <Users className="h-4 w-4 text-indigo-500" /> {m.attendanceCount} Attendees
                  </div>
                  <div className="text-[11px] text-muted-foreground">Registered attendance</div>
                </div>

                <Button variant="outline" size="sm" className="text-xs font-semibold">
                  View Agendas & Minutes
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
