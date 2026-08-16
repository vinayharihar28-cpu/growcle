"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Users,
  UserCheck,
  ArrowUpDown,
  ExternalLink,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Plus,
} from "lucide-react";
import { ChapterSummary } from "../actions/director-actions";

interface ChapterPerformanceTableProps {
  chapters: ChapterSummary[];
  onAssignLeadership?: (chapterId: string, position: "PRESIDENT" | "VICE_PRESIDENT" | "TREASURER") => void;
}

export function ChapterPerformanceTable({
  chapters,
  onAssignLeadership,
}: ChapterPerformanceTableProps) {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [viewMode, setViewMode] = useState<"table" | "compare">("table");

  const filteredChapters = chapters.filter((chap) => {
    const matchesStatus =
      filterStatus === "all" || chap.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesSearch =
      chap.name.toLowerCase().includes(search.toLowerCase()) ||
      chap.chapterCode.toLowerCase().includes(search.toLowerCase()) ||
      chap.region.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="rounded-xl border bg-card shadow-sm">
      {/* Header controls */}
      <div className="flex flex-col gap-3 border-b p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-bold tracking-tight">Chapter Performance & Overview</h3>
          <p className="text-sm text-muted-foreground">
            Monitor members, attendance, leadership status, and revenue across assigned chapters.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Filter chapters..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Statuses</option>
            <option value="healthy">Healthy</option>
            <option value="needs_attention">Needs Attention</option>
          </select>

          <div className="inline-flex rounded-lg border bg-muted p-0.5">
            <button
              onClick={() => setViewMode("table")}
              className={`rounded-md px-3 py-1 text-xs font-semibold transition-all ${
                viewMode === "table" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              Table View
            </button>
            <button
              onClick={() => setViewMode("compare")}
              className={`rounded-md px-3 py-1 text-xs font-semibold transition-all ${
                viewMode === "compare" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              Comparison View
            </button>
          </div>
        </div>
      </div>

      {/* Comparison View */}
      {viewMode === "compare" ? (
        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredChapters.map((chap) => (
            <div
              key={chap.id}
              className="rounded-xl border bg-background p-5 shadow-sm space-y-4 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-base text-foreground">{chap.name}</h4>
                  <span className="text-xs text-muted-foreground">{chap.chapterCode} • {chap.region}</span>
                </div>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    chap.status === "HEALTHY"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                  }`}
                >
                  {chap.status === "HEALTHY" ? <CheckCircle2 className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                  {chap.status}
                </span>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs border-t border-b py-3">
                <div>
                  <span className="text-muted-foreground">Members:</span>
                  <p className="font-bold text-sm text-foreground">{chap.memberCount}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Attendance:</span>
                  <p className="font-bold text-sm text-foreground">{chap.attendanceRate}%</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Visitors:</span>
                  <p className="font-bold text-sm text-foreground">{chap.visitorCount} ({chap.visitorConversion}% conv)</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Closed Business:</span>
                  <p className="font-bold text-sm text-emerald-600 dark:text-emerald-400">${(chap.closedBusiness / 1000).toFixed(1)}k</p>
                </div>
              </div>

              {/* Leadership Status */}
              <div className="space-y-1.5 text-xs">
                <span className="font-semibold uppercase tracking-wider text-muted-foreground">Leadership Team</span>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">President:</span>
                  {chap.presidentName !== "Unassigned" ? (
                    <span className="font-medium">{chap.presidentName}</span>
                  ) : (
                    <button
                      onClick={() => onAssignLeadership?.(chap.id, "PRESIDENT")}
                      className="text-primary hover:underline text-[11px] font-semibold flex items-center gap-0.5"
                    >
                      <Plus className="h-3 w-3" /> Assign
                    </button>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Vice President:</span>
                  {chap.vpName !== "Unassigned" ? (
                    <span className="font-medium">{chap.vpName}</span>
                  ) : (
                    <button
                      onClick={() => onAssignLeadership?.(chap.id, "VICE_PRESIDENT")}
                      className="text-primary hover:underline text-[11px] font-semibold flex items-center gap-0.5"
                    >
                      <Plus className="h-3 w-3" /> Assign
                    </button>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Treasurer:</span>
                  {chap.treasurerName !== "Unassigned" ? (
                    <span className="font-medium">{chap.treasurerName}</span>
                  ) : (
                    <button
                      onClick={() => onAssignLeadership?.(chap.id, "TREASURER")}
                      className="text-primary hover:underline text-[11px] font-semibold flex items-center gap-0.5"
                    >
                      <Plus className="h-3 w-3" /> Assign
                    </button>
                  )}
                </div>
              </div>

              <Link
                href={`/dashboard/director/chapters/${chap.id}`}
                className="mt-2 block w-full rounded-md border border-input bg-background py-1.5 text-center text-xs font-semibold text-foreground hover:bg-accent transition-colors"
              >
                Manage Chapter Details
              </Link>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-3">Chapter</th>
                <th className="px-6 py-3">Region</th>
                <th className="px-6 py-3">Members</th>
                <th className="px-6 py-3">Attendance</th>
                <th className="px-6 py-3">Visitors</th>
                <th className="px-6 py-3">Closed Business</th>
                <th className="px-6 py-3">Leadership Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredChapters.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-muted-foreground">
                    No chapters match your criteria.
                  </td>
                </tr>
              ) : (
                filteredChapters.map((chap) => (
                  <tr key={chap.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-semibold text-foreground">
                      <Link href={`/dashboard/director/chapters/${chap.id}`} className="hover:underline flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-primary" />
                        <div>
                          <div>{chap.name}</div>
                          <div className="text-xs text-muted-foreground font-normal">{chap.chapterCode} • {chap.meetingDay}s</div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{chap.region}</td>
                    <td className="px-6 py-4 font-medium">{chap.memberCount} active</td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-foreground">{chap.attendanceRate}%</span>
                    </td>
                    <td className="px-6 py-4">
                      {chap.visitorCount} <span className="text-xs text-muted-foreground">({chap.visitorConversion}% conv)</span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-emerald-600 dark:text-emerald-400">
                      ${(chap.closedBusiness / 1000).toFixed(1)}k
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          chap.status === "HEALTHY"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        {chap.status === "HEALTHY" ? (
                          <>
                            <CheckCircle2 className="h-3 w-3" /> Fully Staffed
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="h-3 w-3" /> Vacancies Exist
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/dashboard/director/chapters/${chap.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                      >
                        Details <ExternalLink className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
