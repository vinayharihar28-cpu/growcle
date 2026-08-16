"use client";

import React, { useEffect, useState } from "react";
import { UserPlus, Search, CheckCircle2, UserCheck, Calendar } from "lucide-react";
import { getDirectorVisitors, getAssignedChapters } from "../actions/director-actions";
import { ConvertVisitorModal } from "./convert-visitor-modal";

export function VisitorsManagementView() {
  const [visitors, setVisitors] = useState<any[]>([]);
  const [chapters, setChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [chapterId, setChapterId] = useState("all");
  const [status, setStatus] = useState("all");

  const [convertModalState, setConvertModalState] = useState<{
    isOpen: boolean;
    visitor: any | null;
  }>({ isOpen: false, visitor: null });

  const loadVisitors = async () => {
    setLoading(true);
    try {
      const data = await getDirectorVisitors({ chapterId, status });
      setVisitors(data);
      const chaps = await getAssignedChapters();
      setChapters(chaps);
    } catch (err) {
      console.error("Failed to load visitors", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVisitors();
  }, [chapterId, status]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Director Visitor Management</h2>
          <p className="text-muted-foreground">Monitor chapter guest attendance, conversion pipelines, and convert qualified visitors to active members.</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="rounded-xl border bg-card p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <select
            value={chapterId}
            onChange={(e) => setChapterId(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Assigned Chapters</option>
            {chapters.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Visitor Statuses</option>
            <option value="PENDING">Pending Visit</option>
            <option value="ATTENDED">Attended</option>
            <option value="NO_SHOW">No Show</option>
            <option value="CONVERTED">Converted to Member</option>
          </select>
        </div>

        <div className="text-xs font-semibold text-muted-foreground">
          Showing {visitors.length} Visitors
        </div>
      </div>

      {/* Visitors Table */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        {loading ? (
          <div className="h-64 animate-pulse bg-muted" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50 text-xs font-semibold uppercase text-muted-foreground">
                <tr>
                  <th className="px-6 py-3">Visitor Name</th>
                  <th className="px-6 py-3">Company & Industry</th>
                  <th className="px-6 py-3">Chapter</th>
                  <th className="px-6 py-3">Invited By</th>
                  <th className="px-6 py-3">Visit Date</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Conversion Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {visitors.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                      No visitors found in this filter range.
                    </td>
                  </tr>
                ) : (
                  visitors.map((v) => (
                    <tr key={v.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-semibold text-foreground">
                        <div>{v.name}</div>
                        <div className="text-xs text-muted-foreground font-normal">{v.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">{v.company}</div>
                        <div className="text-xs text-muted-foreground">{v.industry}</div>
                      </td>
                      <td className="px-6 py-4 font-medium text-foreground">{v.chapterName}</td>
                      <td className="px-6 py-4 text-xs text-muted-foreground">{v.invitedBy}</td>
                      <td className="px-6 py-4 text-xs text-muted-foreground">
                        {new Date(v.visitDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          v.status === "CONVERTED"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : v.status === "ATTENDED"
                            ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        }`}>
                          {v.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {v.status !== "CONVERTED" ? (
                          <button
                            onClick={() => setConvertModalState({ isOpen: true, visitor: v })}
                            className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors"
                          >
                            <UserCheck className="h-3.5 w-3.5" /> Convert to Member
                          </button>
                        ) : (
                          <span className="text-xs font-semibold text-emerald-600 flex items-center justify-end gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Active Member
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConvertVisitorModal
        isOpen={convertModalState.isOpen}
        onClose={() => setConvertModalState({ isOpen: false, visitor: null })}
        visitor={convertModalState.visitor}
        onSuccess={loadVisitors}
      />
    </div>
  );
}
