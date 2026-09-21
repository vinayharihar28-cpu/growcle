"use client";

import React, { useEffect, useState } from "react";
import {
  Handshake,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  Clock,
  Search,
  IndianRupee,
  MoreVertical,
} from "lucide-react";
import {
  getMemberContext,
  getMemberReferrals,
  giveMemberReferral,
  updateMemberReferralStatus,
  getChapterMemberDirectory,
  MemberContext,
} from "../actions/member-actions";
import { MemberHeaderBar } from "./member-header-bar";
import { ReferralStatus } from "@prisma/client";

export function MemberReferralsView() {
  const [context, setContext] = useState<MemberContext | null>(null);
  const [referrals, setReferrals] = useState<{ given: any[]; received: any[] }>({
    given: [],
    received: [],
  });
  const [activeTab, setActiveTab] = useState<"given" | "received">("given");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [chapterMembers, setChapterMembers] = useState<any[]>([]);

  // Give modal
  const [isGiveOpen, setIsGiveOpen] = useState(false);
  const [giveForm, setGiveForm] = useState({
    toMemberId: "",
    referralName: "",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    value: 0,
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const ctx = await getMemberContext();
      setContext(ctx);
      const res = await getMemberReferrals(ctx.memberId);
      setReferrals(res);
      const members = await getChapterMemberDirectory(ctx.chapterId);
      setChapterMembers(members.filter((m) => m.id !== ctx.memberId));
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

  const handleGiveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!context || !giveForm.toMemberId || !giveForm.referralName) return;
    setSubmitting(true);
    try {
      await giveMemberReferral({
        fromMemberId: context.memberId,
        toMemberId: giveForm.toMemberId,
        chapterId: context.chapterId,
        referralName: giveForm.referralName,
        clientName: giveForm.clientName,
        clientEmail: giveForm.clientEmail,
        clientPhone: giveForm.clientPhone,
        value: Number(giveForm.value) || 0,
        notes: giveForm.notes,
      });
      setIsGiveOpen(false);
      setGiveForm({
        toMemberId: "",
        referralName: "",
        clientName: "",
        clientEmail: "",
        clientPhone: "",
        value: 0,
        notes: "",
      });
      await loadData();
    } catch (err) {
      console.error("Failed to pass referral", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = async (referralId: string, status: ReferralStatus) => {
    if (!context) return;
    try {
      await updateMemberReferralStatus(referralId, context.memberId, status);
      await loadData();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const currentList = activeTab === "given" ? referrals.given : referrals.received;
  const filteredList = currentList.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      r.title.toLowerCase().includes(q) ||
      r.partnerName.toLowerCase().includes(q) ||
      r.clientName.toLowerCase().includes(q)
    );
  });

  const allList = [...referrals.given, ...referrals.received];
  const closedWonDeals = allList.filter((r) => r.status === "CLOSED_WON");
  const closedRevenue = closedWonDeals.reduce((sum, r) => sum + r.value, 0);

  return (
    <div className="space-y-6">
      {context && <MemberHeaderBar context={context} />}

      {/* Header and Give Action */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">My Chapter Referrals</h2>
          <p className="text-sm text-muted-foreground">
            Track business referrals you have passed to chapter peers or received for your enterprise.
          </p>
        </div>

        <button
          onClick={() => setIsGiveOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Give New Referral</span>
        </button>
      </div>

      {/* Referral KPI Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Referrals Given</span>
            <ArrowUpRight className="h-4 w-4 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-1">{referrals.given.length}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Referrals Received</span>
            <ArrowDownLeft className="h-4 w-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-foreground mt-1">{referrals.received.length}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Won Deals</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-500 mt-1">{closedWonDeals.length}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Closed Business (INR)</span>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {formatINR(closedRevenue || 0)}
          </p>
        </div>
      </div>

      {/* Tabs and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab("given")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "given"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ArrowUpRight className="h-3.5 w-3.5 text-primary" />
            <span>Given Referrals ({referrals.given.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("received")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "received"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ArrowDownLeft className="h-3.5 w-3.5 text-blue-500" />
            <span>Received Referrals ({referrals.received.length})</span>
          </button>
        </div>

        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search referral title or partner..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Referrals Table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-muted-foreground">Loading referrals...</div>
        ) : filteredList.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground space-y-2">
            <p>No referrals found in this tab.</p>
            <button
              onClick={() => setIsGiveOpen(true)}
              className="text-xs font-semibold text-primary hover:underline"
            >
              Give a referral now →
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="py-3 px-4">Opportunity</th>
                  <th className="py-3 px-4">{activeTab === "given" ? "Passed To" : "Received From"}</th>
                  <th className="py-3 px-4">Client Contact</th>
                  <th className="py-3 px-4">Deal Value</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  {activeTab === "received" && <th className="py-3 px-4 text-right">Update Status</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredList.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-foreground">{r.title}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1">{r.notes}</div>
                    </td>
                    <td className="py-3 px-4 text-xs font-medium text-foreground">
                      <div>{r.partnerName}</div>
                      <div className="text-muted-foreground">{r.partnerEmail}</div>
                    </td>
                    <td className="py-3 px-4 text-xs">
                      <div className="font-medium text-foreground">{r.clientName}</div>
                      <div className="text-muted-foreground">{r.clientPhone || r.clientEmail || "Direct Contact"}</div>
                    </td>
                    <td className="py-3 px-4 font-bold text-foreground">
                      {r.value > 0 ? formatINR(r.value) : "—"}
                    </td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">
                      {r.date}
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
                    {activeTab === "received" && (
                      <td className="py-3 px-4 text-right">
                        <select
                          value={r.status}
                          onChange={(e) => handleStatusUpdate(r.id, e.target.value as any)}
                          className="px-2 py-1 rounded bg-muted border border-border text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                          <option value="PENDING">Pending</option>
                          <option value="CONTACTED">Contacted</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="CLOSED_WON">Closed Won (Success)</option>
                          <option value="CLOSED_LOST">Closed Lost</option>
                        </select>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Give Referral Modal */}
      {isGiveOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Handshake className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-bold text-foreground">Give Chapter Referral</h3>
              </div>
              <button
                onClick={() => setIsGiveOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGiveSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Select Recipient Member *</label>
                <select
                  required
                  value={giveForm.toMemberId}
                  onChange={(e) => setGiveForm({ ...giveForm, toMemberId: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select Chapter Colleague</option>
                  {chapterMembers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} — {m.businessName} ({m.industry})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Referral Opportunity Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Retail POS Hardware Upgrade"
                  value={giveForm.referralName}
                  onChange={(e) => setGiveForm({ ...giveForm, referralName: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Client Name / Business</label>
                  <input
                    type="text"
                    placeholder="e.g. Grand Supermarket"
                    value={giveForm.clientName}
                    onChange={(e) => setGiveForm({ ...giveForm, clientName: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Estimated Deal Value (₹ INR)</label>
                  <input
                    type="number"
                    placeholder="40000"
                    value={giveForm.value || ""}
                    onChange={(e) => setGiveForm({ ...giveForm, value: Number(e.target.value) })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Client Email</label>
                  <input
                    type="email"
                    placeholder="contact@client.com"
                    value={giveForm.clientEmail}
                    onChange={(e) => setGiveForm({ ...giveForm, clientEmail: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Client Phone</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 00000"
                    value={giveForm.clientPhone}
                    onChange={(e) => setGiveForm({ ...giveForm, clientPhone: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Synergy Notes & Context</label>
                <textarea
                  rows={2}
                  placeholder="Explain why the client needs this service now..."
                  value={giveForm.notes}
                  onChange={(e) => setGiveForm({ ...giveForm, notes: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsGiveOpen(false)}
                  className="px-4 py-2 rounded-lg border border-border text-muted-foreground hover:bg-muted text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-50"
                >
                  {submitting ? "Passing..." : "Confirm & Pass Referral"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
