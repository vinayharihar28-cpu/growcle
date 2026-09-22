"use client";

import React, { useEffect, useState } from "react";
import {
  IndianRupee,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  Award,
  Quote,
  CheckCircle2,
  Calendar,
  User,
  Building2,
  Search,
} from "lucide-react";
import {
  getMemberContext,
  getMemberTYFCBSummary,
  MemberContext,
} from "@/features/member/actions/member-actions";
import { MemberHeaderBar } from "@/features/member/components/member-header-bar";

export function TYFCBDashboardView() {
  const [context, setContext] = useState<MemberContext | null>(null);
  const [data, setData] = useState<{
    givenTotal: number;
    receivedTotal: number;
    totalClosedBusiness: number;
    givenDeals: any[];
    receivedDeals: any[];
    testimonials: any[];
  }>({
    givenTotal: 0,
    receivedTotal: 0,
    totalClosedBusiness: 0,
    givenDeals: [],
    receivedDeals: [],
    testimonials: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"received" | "given" | "testimonials">("received");
  const [search, setSearch] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const ctx = await getMemberContext();
      setContext(ctx);
      const summary = await getMemberTYFCBSummary(ctx.memberId);
      setData(summary);
    } catch (err) {
      console.error("Failed to load TYFCB summary", err);
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

  const filteredReceived = data.receivedDeals.filter(
    (d) =>
      !search ||
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.giverName.toLowerCase().includes(search.toLowerCase())
  );

  const filteredGiven = data.givenDeals.filter(
    (d) =>
      !search ||
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.recipientName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {context && <MemberHeaderBar context={context} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            Thank You For Closed Business (TYFCB)
          </h2>
          <p className="text-sm text-muted-foreground">
            Track business revenue generated for fellow chapter colleagues and closed deals won through referral synergy.
          </p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Closed Business
            </span>
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-foreground">
            {formatINR(data.totalClosedBusiness)}
          </div>
          <p className="text-[11px] text-muted-foreground">Combined gross economic value generated</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Closed Deals Won (Earned)
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ArrowDownLeft className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {formatINR(data.receivedTotal)}
          </div>
          <p className="text-[11px] text-muted-foreground">{data.receivedDeals.length} converted client contracts</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Business Given To Others
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <ArrowUpRight className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
            {formatINR(data.givenTotal)}
          </div>
          <p className="text-[11px] text-muted-foreground">{data.givenDeals.length} deals passed & converted</p>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center bg-muted/60 p-1 rounded-xl border border-border/80">
          <button
            onClick={() => setActiveTab("received")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "received"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ArrowDownLeft className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Closed Deals Won ({data.receivedDeals.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("given")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "given"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ArrowUpRight className="h-3.5 w-3.5 text-blue-500" />
            <span>Business Given ({data.givenDeals.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("testimonials")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "testimonials"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Quote className="h-3.5 w-3.5 text-primary" />
            <span>Testimonials ({data.testimonials.length})</span>
          </button>
        </div>

        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search deals, members, or amounts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-xs"
          />
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center text-muted-foreground">
          Loading TYFCB details...
        </div>
      ) : activeTab === "received" ? (
        <div className="bg-card border border-border rounded-xl shadow-xs overflow-hidden">
          {filteredReceived.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground space-y-1 text-sm">
              <p>No converted deals won yet.</p>
              <p className="text-xs text-muted-foreground">
                When a referral you receive is won, mark it as converted to record TYFCB revenue!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <th className="py-3 px-4">Opportunity</th>
                    <th className="py-3 px-4">Referred By</th>
                    <th className="py-3 px-4">Closed Deal Value</th>
                    <th className="py-3 px-4">Date Converted</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredReceived.map((d) => (
                    <tr key={d.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-4 font-semibold text-foreground">{d.title}</td>
                      <td className="py-3 px-4 text-xs font-medium text-foreground">{d.giverName}</td>
                      <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                        {formatINR(d.amount)}
                      </td>
                      <td className="py-3 px-4 text-xs text-muted-foreground">{d.date}</td>
                      <td className="py-3 px-4 text-right">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="h-3 w-3" /> Converted Won
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : activeTab === "given" ? (
        <div className="bg-card border border-border rounded-xl shadow-xs overflow-hidden">
          {filteredGiven.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground space-y-1 text-sm">
              <p>No converted business given to colleagues yet.</p>
              <p className="text-xs text-muted-foreground">
                Pass client referrals to colleagues—when they win the business, it will appear here!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <th className="py-3 px-4">Opportunity</th>
                    <th className="py-3 px-4">Beneficiary Member</th>
                    <th className="py-3 px-4">Revenue Generated</th>
                    <th className="py-3 px-4">Date Closed</th>
                    <th className="py-3 px-4 text-right">Synergy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredGiven.map((d) => (
                    <tr key={d.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-4 font-semibold text-foreground">{d.title}</td>
                      <td className="py-3 px-4 text-xs font-medium text-foreground">{d.recipientName}</td>
                      <td className="py-3 px-4 font-bold text-blue-600 dark:text-blue-400">
                        {formatINR(d.amount)}
                      </td>
                      <td className="py-3 px-4 text-xs text-muted-foreground">{d.date}</td>
                      <td className="py-3 px-4 text-right">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                          <CheckCircle2 className="h-3 w-3" /> Giver Converted
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* Testimonials Tab */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.testimonials.length === 0 ? (
            <div className="md:col-span-2 bg-card border border-dashed border-border rounded-xl p-12 text-center text-muted-foreground text-sm">
              No written testimonials received yet. When closed deals are converted, peer testimonials are recorded here.
            </div>
          ) : (
            data.testimonials.map((t) => (
              <div
                key={t.id}
                className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-3 relative overflow-hidden"
              >
                <Quote className="h-8 w-8 text-primary/20 absolute top-3 right-3" />
                <p className="text-sm text-foreground italic leading-relaxed pt-1">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
                  <div className="font-semibold text-foreground">— {t.fromName}</div>
                  <div className="text-muted-foreground">{t.date}</div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
