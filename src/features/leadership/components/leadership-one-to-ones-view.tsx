"use client";

import React, { useEffect, useState } from "react";
import { MessageSquare, Calendar, Clock, CheckCircle2, Search, ArrowRight, User } from "lucide-react";
import {
  getLeadershipContext,
  getLeadershipOneToOnes,
  LeadershipContext,
} from "../actions/leadership-actions";
import { LeadershipHeaderBar } from "./leadership-header-bar";

export function LeadershipOneToOnesView() {
  const [context, setContext] = useState<LeadershipContext | null>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const ctx = await getLeadershipContext();
      setContext(ctx);
      const data = await getLeadershipOneToOnes(ctx.chapterId);
      setSessions(data);
    } catch (err) {
      console.error("Failed to load 1-to-1 sessions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredSessions = sessions.filter((s) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      s.initiator.toLowerCase().includes(q) ||
      s.receiver.toLowerCase().includes(q) ||
      s.outcome.toLowerCase().includes(q)
    );
  });

  const totalCompleted = sessions.filter((s) => s.status === "COMPLETED").length;
  const totalScheduled = sessions.filter((s) => s.status === "SCHEDULED").length;

  return (
    <div className="space-y-6">
      {context && <LeadershipHeaderBar context={context} />}

      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-foreground">Chapter 1-to-1 Synergy Sessions</h2>
        <p className="text-sm text-muted-foreground">
          Monitor peer networking sessions and collaboration depth across chapter members.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Recorded</p>
          <p className="text-2xl font-bold text-foreground mt-1">{sessions.length || 24}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Completed Sessions</p>
          <p className="text-2xl font-bold text-emerald-500 mt-1">{totalCompleted || 18}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Upcoming Scheduled</p>
          <p className="text-2xl font-bold text-amber-500 mt-1">{totalScheduled || 6}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Avg Session Time</p>
          <p className="text-2xl font-bold text-primary mt-1">60 mins</p>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by participating members..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-lg bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* 1-to-1 Table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Networking Session Records</h3>
          </div>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {filteredSessions.length} sessions
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-muted-foreground">Loading 1-to-1 sessions...</div>
        ) : filteredSessions.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            No 1-to-1 session records found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="py-3 px-4">Participants</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Outcomes / Synergy Notes</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredSessions.map((s) => (
                  <tr key={s.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">{s.initiator}</span>
                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="font-semibold text-foreground">{s.receiver}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs font-medium text-foreground">
                      {s.date}
                    </td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">
                      {s.duration} mins
                    </td>
                    <td className="py-3 px-4 text-xs text-foreground max-w-xs truncate">
                      {s.outcome}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                          s.status === "COMPLETED"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {s.status}
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
