"use client";

import React, { useEffect, useState } from "react";
import { Share2, ArrowRight, IndianRupee, CheckCircle2, Clock, Search, Filter } from "lucide-react";
import {
  getLeadershipContext,
  getLeadershipReferrals,
  LeadershipContext,
} from "../actions/leadership-actions";
import { LeadershipHeaderBar } from "./leadership-header-bar";

export function LeadershipReferralsView() {
  const [context, setContext] = useState<LeadershipContext | null>(null);
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const ctx = await getLeadershipContext();
      setContext(ctx);
      const res = await getLeadershipReferrals(ctx.chapterId);
      setData(res);
    } catch (err) {
      console.error("Failed to load referrals", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatINR = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const referrals = data?.referrals || [];
  const filteredReferrals = referrals.filter((r: any) => {
    const matchesSearch =
      !search ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.fromMember.toLowerCase().includes(search.toLowerCase()) ||
      r.toMember.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalReferrals = data?.totalReferrals || 0;
  const closedWonCount = data?.closedWonCount || 0;
  const totalClosedBusiness = data?.totalClosedBusiness || 0;
  const winRate = totalReferrals > 0 ? Math.round((closedWonCount / totalReferrals) * 100) : 0;

  return (
    <div className="space-y-6">
      {context && <LeadershipHeaderBar context={context} />}

      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-foreground">Chapter Business & Referrals</h2>
        <p className="text-sm text-muted-foreground">
          Track referral exchanges, deal sizes, and closed chapter business.
        </p>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Referrals</p>
          <p className="text-2xl font-bold text-foreground mt-1">{totalReferrals}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Closed Deals</p>
          <p className="text-2xl font-bold text-emerald-500 mt-1">{closedWonCount}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Deal Win Rate</p>
          <p className="text-2xl font-bold text-blue-500 mt-1">{winRate}%</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Closed Business Value</p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {formatINR(totalClosedBusiness)}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search referral title, giver, or recipient..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex items-center gap-2">
          {["all", "PENDING", "CONTACTED", "CLOSED_WON", "CLOSED_LOST"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                statusFilter === st
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {st.replace("_", " ").toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Referrals Table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Referral Transactions Ledger</h3>
          </div>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {filteredReferrals.length} deals
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-muted-foreground">Loading chapter referrals...</div>
        ) : filteredReferrals.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            No referral records found matching your filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="py-3 px-4">Opportunity</th>
                  <th className="py-3 px-4">From Member</th>
                  <th className="py-3 px-4">To Member</th>
                  <th className="py-3 px-4">Value (INR)</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredReferrals.map((r: any) => (
                  <tr key={r.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4 font-semibold text-foreground">
                      {r.title}
                    </td>
                    <td className="py-3 px-4 text-xs font-medium text-foreground">
                      {r.fromMember}
                    </td>
                    <td className="py-3 px-4 text-xs font-medium text-foreground">
                      {r.toMember}
                    </td>
                    <td className="py-3 px-4 font-bold text-foreground">
                      {r.value > 0 ? formatINR(r.value) : "—"}
                    </td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">
                      {r.createdAt}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                          r.status === "CLOSED_WON"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            : r.status === "CLOSED_LOST"
                            ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                            : r.status === "CONTACTED"
                            ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {r.status.replace("_", " ")}
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
