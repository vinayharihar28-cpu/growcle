"use client";

import React, { useEffect, useState } from "react";
import { Handshake, IndianRupee, ArrowUpRight, CheckCircle2, Clock } from "lucide-react";
import { getDirectorReferrals, getAssignedChapters } from "../actions/director-actions";

export function ReferralsManagementView() {
  const [referrals, setReferrals] = useState<any[]>([]);
  const [chapters, setChapters] = useState<any[]>([]);
  const [chapterId, setChapterId] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getDirectorReferrals(chapterId);
        setReferrals(data);
        const chaps = await getAssignedChapters();
        setChapters(chaps);
      } catch (err) {
        console.error("Failed to load referrals", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [chapterId]);

  const totalValue = referrals.reduce((sum, r) => sum + (r.value || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Director Referral & Closed Business Pipeline</h2>
          <p className="text-muted-foreground">Monitor referral volume, deal stages, closed business revenue, and top producing chapters.</p>
        </div>

        <div className="rounded-xl border bg-card p-4 shadow-sm flex items-center gap-3 shrink-0">
          <IndianRupee className="h-8 w-8 text-emerald-500 bg-emerald-500/10 p-1.5 rounded-lg" />
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase">Pipeline Value</span>
            <p className="text-xl font-bold text-emerald-600">₹{totalValue.toLocaleString("en-IN")}</p>
          </div>
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
        <span className="text-xs font-semibold text-muted-foreground">{referrals.length} Referrals Tracked</span>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        {loading ? (
          <div className="h-64 animate-pulse bg-muted" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse min-w-[650px]">
              <thead className="border-b bg-muted/50 text-xs font-semibold uppercase text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 whitespace-nowrap">Referral Title</th>
                  <th className="px-6 py-3 whitespace-nowrap">Given By</th>
                  <th className="px-6 py-3 whitespace-nowrap">Received By</th>
                  <th className="px-6 py-3 whitespace-nowrap">Chapter</th>
                  <th className="px-6 py-3 whitespace-nowrap">Estimated Value</th>
                  <th className="px-6 py-3 whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {referrals.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/30">
                    <td className="px-6 py-4 font-semibold text-foreground">{r.title}</td>
                    <td className="px-6 py-4 text-xs font-medium">{r.fromMemberName}</td>
                    <td className="px-6 py-4 text-xs font-medium">{r.toMemberName}</td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">{r.chapterName}</td>
                    <td className="px-6 py-4 font-bold text-emerald-600">₹{r.value.toLocaleString("en-IN")}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        r.status === "CLOSED_WON"
                          ? "bg-emerald-500/10 text-emerald-600"
                          : "bg-amber-500/10 text-amber-600"
                      }`}>
                        {r.status}
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
