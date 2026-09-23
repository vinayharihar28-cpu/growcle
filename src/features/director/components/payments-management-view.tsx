"use client";

import React, { useEffect, useState } from "react";
import { CreditCard, IndianRupee, CheckCircle2, Clock, AlertTriangle, Search, Filter, Calendar } from "lucide-react";
import { getDirectorPayments, getDirectorMembershipDues, getAssignedChapters } from "../actions/director-actions";

export function PaymentsManagementView() {
  const [activeTab, setActiveTab] = useState<"LEDGER" | "MEMBERSHIP_DUES">("LEDGER");
  const [payments, setPayments] = useState<any[]>([]);
  const [membershipDues, setMembershipDues] = useState<any[]>([]);
  const [chapters, setChapters] = useState<any[]>([]);
  const [chapterId, setChapterId] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [paymentData, duesData, chaps] = await Promise.all([
          getDirectorPayments(chapterId),
          getDirectorMembershipDues(chapterId),
          getAssignedChapters(),
        ]);
        setPayments(paymentData);
        setMembershipDues(duesData);
        setChapters(chaps);
      } catch (err) {
        console.error("Failed to load payments", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [chapterId]);

  const filteredPayments = payments.filter(
    (p) =>
      !search ||
      p.memberName.toLowerCase().includes(search.toLowerCase()) ||
      p.chapterName.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase())
  );

  const filteredDues = membershipDues.filter(
    (m) =>
      !search ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.chapterName.toLowerCase().includes(search.toLowerCase()) ||
      m.businessName.toLowerCase().includes(search.toLowerCase()) ||
      m.membershipNumber.toLowerCase().includes(search.toLowerCase())
  );

  const totalCollected = payments
    .filter((p) => p.status === "SUCCEEDED" || p.status === "PAID")
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  const pendingDues = payments
    .filter((p) => p.status === "PENDING" || p.status === "UNPAID")
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  const activeDuesCount = membershipDues.filter((m) => m.paymentStatus === "CURRENT").length;
  const dueSoonCount = membershipDues.filter((m) => m.paymentStatus === "DUE_SOON").length;
  const expiredCount = membershipDues.filter((m) => m.paymentStatus === "EXPIRED").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Director Payment & Treasury Oversight</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Monitor chapter membership payments, 1-year terms, dues, and transaction ledgers.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-border pb-1">
        <button
          onClick={() => setActiveTab("LEDGER")}
          className={`px-4 py-2 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === "LEDGER"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Chapter Financial Ledgers ({payments.length})
        </button>
        <button
          onClick={() => setActiveTab("MEMBERSHIP_DUES")}
          className={`px-4 py-2 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "MEMBERSHIP_DUES"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <span>Member 1-Year Terms & Dues ({membershipDues.length})</span>
          {dueSoonCount + expiredCount > 0 && (
            <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-500/15 text-amber-600 font-bold">
              {dueSoonCount + expiredCount} Due
            </span>
          )}
        </button>
      </div>

      {activeTab === "LEDGER" ? (
        <>
          {/* Financial Overview KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-xl p-5 shadow-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Revenue Collected</span>
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              </div>
              <div className="text-3xl font-extrabold text-foreground">₹{totalCollected.toLocaleString("en-IN")}</div>
              <p className="text-xs text-muted-foreground">Successfully processed</p>
            </div>

            <div className="bg-card border border-border rounded-xl p-5 shadow-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pending Dues & Renewal</span>
                <Clock className="h-5 w-5 text-amber-500" />
              </div>
              <div className="text-3xl font-extrabold text-foreground">₹{pendingDues.toLocaleString("en-IN")}</div>
              <p className="text-xs text-muted-foreground">Awaiting payment verification</p>
            </div>

            <div className="bg-card border border-border rounded-xl p-5 shadow-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Ledger Invoices</span>
                <CreditCard className="h-5 w-5 text-indigo-500" />
              </div>
              <div className="text-3xl font-extrabold text-foreground">{payments.length}</div>
              <p className="text-xs text-muted-foreground">Recorded across chapter members</p>
            </div>
          </div>

          {/* Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card border border-border rounded-xl p-3.5 shadow-xs">
            <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search member, invoice, or chapter..."
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
              Showing {filteredPayments.length} Invoices
            </span>
          </div>

          {/* Payment Ledger Table */}
          <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
            {loading ? (
              <div className="h-64 animate-pulse bg-muted" />
            ) : filteredPayments.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground text-sm">
                No payment ledger records found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead className="border-b border-border bg-muted/50 text-xs font-semibold uppercase text-muted-foreground">
                    <tr>
                      <th className="px-6 py-3.5 whitespace-nowrap">Invoice Ref</th>
                      <th className="px-6 py-3.5 whitespace-nowrap">Member Name</th>
                      <th className="px-6 py-3.5 whitespace-nowrap">Chapter</th>
                      <th className="px-6 py-3.5 whitespace-nowrap">Amount (₹)</th>
                      <th className="px-6 py-3.5 whitespace-nowrap">Payment Method</th>
                      <th className="px-6 py-3.5 whitespace-nowrap">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredPayments.map((p) => (
                      <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 text-xs font-mono font-bold text-primary">{p.id}</td>
                        <td className="px-6 py-4 font-semibold text-foreground">{p.memberName}</td>
                        <td className="px-6 py-4 font-medium text-muted-foreground">{p.chapterName}</td>
                        <td className="px-6 py-4 font-extrabold text-foreground">₹{Number(p.amount).toLocaleString("en-IN")}</td>
                        <td className="px-6 py-4 text-xs text-muted-foreground">{p.paymentMethod}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            p.status === "SUCCEEDED" || p.status === "PAID"
                              ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                              : p.status === "PENDING" || p.status === "UNPAID"
                              ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                              : "bg-red-500/10 text-red-600 border border-red-500/20"
                          }`}>
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : (
        /* Membership Terms & Dues View */
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border bg-card p-4 shadow-xs border-emerald-500/20">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Active & Current</span>
              <p className="text-2xl font-bold text-emerald-600 mt-1">{activeDuesCount} Members</p>
              <span className="text-xs text-muted-foreground">Valid 1-Year Membership Term</span>
            </div>

            <div className="rounded-xl border bg-card p-4 shadow-xs border-amber-500/20">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Renewal Due Soon</span>
              <p className="text-2xl font-bold text-amber-600 mt-1">{dueSoonCount} Members</p>
              <span className="text-xs text-muted-foreground">Within next 30 days</span>
            </div>

            <div className="rounded-xl border bg-card p-4 shadow-xs border-rose-500/20">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Expired / Overdue</span>
              <p className="text-2xl font-bold text-rose-600 mt-1">{expiredCount} Members</p>
              <span className="text-xs text-muted-foreground">Requires renewal</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card border border-border rounded-xl p-3.5 shadow-xs">
            <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search member, company, or membership #..."
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
              Showing {filteredDues.length} Members
            </span>
          </div>

          <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="border-b border-border bg-muted/50 text-xs font-semibold uppercase text-muted-foreground">
                  <tr>
                    <th className="px-6 py-3.5 whitespace-nowrap">Member Name</th>
                    <th className="px-6 py-3.5 whitespace-nowrap">Chapter</th>
                    <th className="px-6 py-3.5 whitespace-nowrap">Membership #</th>
                    <th className="px-6 py-3.5 whitespace-nowrap">Term Start</th>
                    <th className="px-6 py-3.5 whitespace-nowrap">Term End (1-Year)</th>
                    <th className="px-6 py-3.5 whitespace-nowrap">Days Left</th>
                    <th className="px-6 py-3.5 whitespace-nowrap">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-muted-foreground">
                        Loading member dues...
                      </td>
                    </tr>
                  ) : filteredDues.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-muted-foreground">
                        No member records found.
                      </td>
                    </tr>
                  ) : (
                    filteredDues.map((m) => (
                      <tr key={m.memberId} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-foreground">{m.name}</div>
                          <div className="text-xs text-muted-foreground">{m.businessName}</div>
                        </td>
                        <td className="px-6 py-4 text-xs font-medium text-muted-foreground">{m.chapterName}</td>
                        <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{m.membershipNumber}</td>
                        <td className="px-6 py-4 text-xs text-foreground">{m.termStartDate}</td>
                        <td className="px-6 py-4 text-xs font-bold text-foreground">{m.termEndDate}</td>
                        <td className="px-6 py-4 text-xs">
                          {m.daysRemaining > 0 ? (
                            <span className={m.daysRemaining <= 30 ? "text-amber-600 font-bold" : "text-muted-foreground"}>
                              {m.daysRemaining} days
                            </span>
                          ) : (
                            <span className="text-rose-600 font-bold">
                              Expired {Math.abs(m.daysRemaining)}d ago
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {m.paymentStatus === "CURRENT" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                              <CheckCircle2 className="h-3 w-3" /> Paid (Active)
                            </span>
                          ) : m.paymentStatus === "DUE_SOON" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                              <Clock className="h-3 w-3" /> Due Soon
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 border border-rose-500/20">
                              <AlertTriangle className="h-3 w-3" /> Expired
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
