"use client";

import React, { useEffect, useState } from "react";
import { ClipboardCheck, Building2, TrendingUp, CheckCircle2, XCircle, UserCheck } from "lucide-react";
import { getDirectorAttendance, getAssignedChapters } from "../actions/director-actions";

export function AttendanceManagementView() {
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [chapters, setChapters] = useState<any[]>([]);
  const [chapterId, setChapterId] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getDirectorAttendance(chapterId);
        setAttendanceRecords(data);
        const chaps = await getAssignedChapters();
        setChapters(chaps);
      } catch (err) {
        console.error("Failed to load attendance", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [chapterId]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Director Attendance Monitoring</h2>
        <p className="text-muted-foreground">Track member attendance rates, absent trends, substitutes, and excuses across assigned chapters.</p>
      </div>

      <div className="rounded-xl border bg-card p-4 shadow-sm flex items-center justify-between">
        <select
          value={chapterId}
          onChange={(e) => setChapterId(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium"
        >
          <option value="all">All Assigned Chapters</option>
          {chapters.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        {loading ? (
          <div className="h-64 animate-pulse bg-muted" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50 text-xs font-semibold uppercase text-muted-foreground">
                <tr>
                  <th className="px-6 py-3">Meeting Title & Chapter</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Roster Size</th>
                  <th className="px-6 py-3">Present</th>
                  <th className="px-6 py-3">Substitutes</th>
                  <th className="px-6 py-3">Absent / Excused</th>
                  <th className="px-6 py-3">Attendance Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {attendanceRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/30">
                    <td className="px-6 py-4 font-semibold text-foreground">
                      <div>{r.meetingTitle}</div>
                      <div className="text-xs text-muted-foreground font-normal">{r.chapterName}</div>
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">{new Date(r.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-medium">{r.totalMembers} members</td>
                    <td className="px-6 py-4 font-semibold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" /> {r.present}
                    </td>
                    <td className="px-6 py-4 text-purple-600 font-medium">{r.substitute} subs</td>
                    <td className="px-6 py-4 text-amber-600 font-medium">{r.absent + r.excused}</td>
                    <td className="px-6 py-4 font-bold text-foreground">{r.attendancePercentage}%</td>
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
