"use client";

import React, { useEffect, useState } from "react";
import {
  Search,
  IndianRupee,
  CheckCircle2,
  Lock,
  Eye,
  X,
  Settings,
  ShieldCheck,
  Edit2,
  Download,
  KeyRound,
  Calendar,
  AlertTriangle,
  Clock,
  UserCheck,
  Check,
  CreditCard,
  Building2,
} from "lucide-react";
import {
  getLeadershipContext,
  getLeadershipPayments,
  getMembershipDuesAndStatus,
  recordMembershipFeePayment,
  updatePaymentSettings,
  updateTransaction,
  LeadershipContext,
} from "../actions/leadership-actions";
import { LeadershipHeaderBar } from "./leadership-header-bar";
import { playSuccessChime } from "@/lib/audio-chime";

export function LeadershipPaymentsView() {
  const [context, setContext] = useState<LeadershipContext | null>(null);
  const [activeTab, setActiveTab] = useState<"MEETING_FEES" | "MEMBERSHIP_DUES">("MEETING_FEES");

  // Meeting Fees & Ledger Data
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("all");

  // Membership Dues & Status Data
  const [membershipDues, setMembershipDues] = useState<any[]>([]);
  const [duesLoading, setDuesLoading] = useState(false);
  const [duesSearch, setDuesSearch] = useState("");
  const [duesStatusFilter, setDuesStatusFilter] = useState("all");

  // Record Membership Payment Modal
  const [payingMember, setPayingMember] = useState<any | null>(null);
  const [payForm, setPayForm] = useState({
    amount: 25000,
    paymentMethod: "UPI",
    utr: "",
    termYears: 1,
  });
  const [recordingPayment, setRecordingPayment] = useState(false);

  // Meeting UPI & Fee Settings Modal (No PIN required)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsError, setSettingsError] = useState("");
  const [settingsForm, setSettingsForm] = useState({
    upiId: "",
    upiName: "",
    meetingFee: 800,
  });
  const [savingSettings, setSavingSettings] = useState(false);

  // Edit Transaction Modal
  const [editingTxn, setEditingTxn] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({
    amount: 800,
    paymentMethod: "UPI",
    utr: "",
  });
  const [savingEdit, setSavingEdit] = useState(false);

  // Receipt Screenshot Preview Modal
  const [previewScreenshot, setPreviewScreenshot] = useState<{
    url: string;
    name: string;
    utr: string;
    amount: number;
    time: string;
  } | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const ctx = await getLeadershipContext();
      setContext(ctx);
      const res = await getLeadershipPayments(ctx.chapterId);
      setData(res);
      setSettingsForm({
        upiId: res.stats?.upiId || ctx.upiId,
        upiName: res.stats?.upiName || ctx.upiName,
        meetingFee: res.stats?.standardFee || ctx.meetingFee,
      });

      // Also load membership dues
      const duesRes = await getMembershipDuesAndStatus(ctx.chapterId);
      setMembershipDues(duesRes);
    } catch (err) {
      console.error("Failed to load payments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!context) return;
    setSavingSettings(true);
    try {
      await updatePaymentSettings({
        chapterId: context.chapterId,
        upiId: settingsForm.upiId,
        upiName: settingsForm.upiName,
        meetingFee: Number(settingsForm.meetingFee),
      });
      setIsSettingsOpen(false);
      setSettingsError("");
      playSuccessChime();
      await loadData();
    } catch (err: any) {
      setSettingsError(err.message || "Failed to update payment settings");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTxn) return;
    setSavingEdit(true);
    try {
      await updateTransaction({
        attendanceId: editingTxn.id,
        amount: Number(editForm.amount),
        paymentMethod: editForm.paymentMethod,
        utr: editForm.utr,
      });
      setEditingTxn(null);
      await loadData();
    } catch (err) {
      console.error("Failed to update transaction", err);
    } finally {
      setSavingEdit(false);
    }
  };

  const handleRecordMembershipPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingMember) return;
    setRecordingPayment(true);
    try {
      await recordMembershipFeePayment({
        memberId: payingMember.memberId,
        amount: Number(payForm.amount),
        paymentMethod: payForm.paymentMethod,
        utr: payForm.utr,
        termYears: Number(payForm.termYears),
      });
      setPayingMember(null);
      playSuccessChime();
      await loadData();
    } catch (err) {
      console.error("Failed to record membership payment", err);
    } finally {
      setRecordingPayment(false);
    }
  };

  const filteredLedger = (data?.ledger || []).filter((txn: any) => {
    const matchesSearch =
      !search ||
      txn.memberName.toLowerCase().includes(search.toLowerCase()) ||
      txn.meetingTitle.toLowerCase().includes(search.toLowerCase()) ||
      txn.reference.toLowerCase().includes(search.toLowerCase()) ||
      txn.utr.toLowerCase().includes(search.toLowerCase());

    const matchesMethod =
      methodFilter === "all" ||
      (methodFilter === "UPI" && txn.paymentMethod.includes("UPI")) ||
      (methodFilter === "CASH" && txn.paymentMethod === "CASH") ||
      (methodFilter === "SCREENSHOT" && !!txn.screenshotUrl);

    return matchesSearch && matchesMethod;
  });

  const filteredDues = membershipDues.filter((m: any) => {
    const matchesSearch =
      !duesSearch ||
      m.name.toLowerCase().includes(duesSearch.toLowerCase()) ||
      m.businessName.toLowerCase().includes(duesSearch.toLowerCase()) ||
      m.email.toLowerCase().includes(duesSearch.toLowerCase()) ||
      m.membershipNumber.toLowerCase().includes(duesSearch.toLowerCase());

    const matchesStatus =
      duesStatusFilter === "all" ||
      m.paymentStatus === duesStatusFilter;

    return matchesSearch && matchesStatus;
  });

  const activeMembersCount = membershipDues.filter((m) => m.paymentStatus === "CURRENT").length;
  const dueSoonMembersCount = membershipDues.filter((m) => m.paymentStatus === "DUE_SOON").length;
  const expiredMembersCount = membershipDues.filter((m) => m.paymentStatus === "EXPIRED").length;

  return (
    <div className="space-y-6">
      {context && <LeadershipHeaderBar context={context} />}

      {/* Header & Settings Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Chapter Treasury & Payments
          </h2>
          <p className="text-muted-foreground text-xs mt-0.5">
            Monitor weekly meeting fee collections, track 1-year membership dues, and manage UPI payment settings.
          </p>
        </div>

        <button
          onClick={() => {
            setIsSettingsOpen(true);
            setSettingsError("");
          }}
          className="rounded-lg border border-purple-500/30 bg-purple-500/10 px-3.5 py-2 text-xs font-bold text-purple-600 hover:bg-purple-500/20 flex items-center gap-1.5 shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Settings className="h-4 w-4" /> Change Meeting UPI & Fee
        </button>
      </div>

      {/* Tab Switcher: Meeting Fees vs Membership Payment Status */}
      <div className="flex items-center gap-2 border-b border-border pb-1">
        <button
          onClick={() => setActiveTab("MEETING_FEES")}
          className={`px-4 py-2 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === "MEETING_FEES"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Meeting Fee Collections ({data?.ledger?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab("MEMBERSHIP_DUES")}
          className={`px-4 py-2 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "MEMBERSHIP_DUES"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <span>Membership Payment Status & 1-Year Terms</span>
          {dueSoonMembersCount + expiredMembersCount > 0 && (
            <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-500/15 text-amber-600 font-bold">
              {dueSoonMembersCount + expiredMembersCount} Dues
            </span>
          )}
        </button>
      </div>

      {activeTab === "MEETING_FEES" ? (
        <>
          {/* Financial KPI Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-xl border bg-card p-4 shadow-sm border-emerald-500/20">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Collection</span>
              <p className="text-2xl font-bold text-emerald-600 mt-1">₹{data?.stats?.totalCollected || 0}</p>
              <span className="text-xs text-muted-foreground">Recorded this cycle</span>
            </div>

            <div className="rounded-xl border bg-card p-4 shadow-sm border-purple-500/20">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">UPI / Online Count</span>
              <p className="text-2xl font-bold text-purple-600 mt-1">{data?.stats?.upiCount || 0}</p>
              <span className="text-xs text-muted-foreground">Digital transactions</span>
            </div>

            <div className="rounded-xl border bg-card p-4 shadow-sm border-amber-500/20">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Cash Collection Count</span>
              <p className="text-2xl font-bold text-amber-600 mt-1">{data?.stats?.cashCount || 0}</p>
              <span className="text-xs text-muted-foreground">Direct counter cash</span>
            </div>

            <div className="rounded-xl border bg-card p-4 shadow-sm border-blue-500/20">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Standard Meeting Fee</span>
              <p className="text-2xl font-bold text-foreground mt-1">₹{data?.stats?.standardFee || 800}</p>
              <span className="text-xs text-muted-foreground font-mono truncate block">
                {data?.stats?.upiId}
              </span>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="rounded-xl border bg-card p-4 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search transactions by attendee, reference, or UTR..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-1.5 text-sm"
              />
            </div>

            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="rounded-lg border border-input bg-background px-3 py-1.5 text-xs font-semibold"
            >
              <option value="all">All Payment Methods</option>
              <option value="UPI">UPI / Digital</option>
              <option value="CASH">Cash</option>
              <option value="SCREENSHOT">With Receipt Screenshot</option>
            </select>
          </div>

          {/* Transactions Ledger */}
          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <th className="py-3 px-4">Attendee Name</th>
                    <th className="py-3 px-4">Meeting</th>
                    <th className="py-3 px-4">Amount & Mode</th>
                    <th className="py-3 px-4">UTR / Ref</th>
                    <th className="py-3 px-4">Receipt Proof</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-muted-foreground">
                        Loading treasury ledger...
                      </td>
                    </tr>
                  ) : filteredLedger.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-muted-foreground">
                        No payment records found.
                      </td>
                    </tr>
                  ) : (
                    filteredLedger.map((txn: any) => (
                      <tr key={txn.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4 font-semibold text-foreground">
                          {txn.memberName}
                        </td>

                        <td className="py-3 px-4 text-xs text-muted-foreground">
                          {txn.meetingTitle} ({txn.meetingDate})
                        </td>

                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-600 border border-emerald-500/20">
                            ₹{txn.amount} • {txn.paymentMethod}
                          </span>
                        </td>

                        <td className="py-3 px-4 font-mono text-xs text-muted-foreground">
                          {txn.utr !== "N/A" ? txn.utr : txn.reference}
                        </td>

                        <td className="py-3 px-4">
                          {txn.screenshotUrl ? (
                            <button
                              onClick={() =>
                                setPreviewScreenshot({
                                  url: txn.screenshotUrl,
                                  name: txn.memberName,
                                  utr: txn.utr,
                                  amount: txn.amount,
                                  time: txn.createdAt,
                                })
                              }
                              className="inline-flex items-center gap-1 rounded-lg border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 text-xs font-semibold text-purple-600 hover:bg-purple-500/20 cursor-pointer"
                            >
                              <Eye className="h-3 w-3" /> View Proof
                            </button>
                          ) : (
                            <span className="text-xs text-muted-foreground italic">No upload</span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-xs text-muted-foreground">
                          {txn.createdAt}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              setEditingTxn(txn);
                              setEditForm({
                                amount: txn.amount,
                                paymentMethod: txn.paymentMethod,
                                utr: txn.utr !== "N/A" ? txn.utr : "",
                              });
                            }}
                            className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
                            title="Edit Transaction"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Membership Payment Status & 1-Year Terms View */
        <div className="space-y-4">
          {/* Summary KPIs for Membership Terms */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border bg-card p-4 shadow-sm border-emerald-500/20">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Active & Current</span>
              <p className="text-2xl font-bold text-emerald-600 mt-1">{activeMembersCount} Members</p>
              <span className="text-xs text-muted-foreground">Valid 1-Year Membership Term</span>
            </div>

            <div className="rounded-xl border bg-card p-4 shadow-sm border-amber-500/20">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Renewal Due Soon</span>
              <p className="text-2xl font-bold text-amber-600 mt-1">{dueSoonMembersCount} Members</p>
              <span className="text-xs text-muted-foreground">Expiring within next 30 days</span>
            </div>

            <div className="rounded-xl border bg-card p-4 shadow-sm border-rose-500/20">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Expired / Overdue</span>
              <p className="text-2xl font-bold text-rose-600 mt-1">{expiredMembersCount} Members</p>
              <span className="text-xs text-muted-foreground">Term renewal required</span>
            </div>
          </div>

          {/* Search & Status Filter for Membership Terms */}
          <div className="rounded-xl border bg-card p-4 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by member name, company, email, or membership #..."
                value={duesSearch}
                onChange={(e) => setDuesSearch(e.target.value)}
                className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-1.5 text-sm"
              />
            </div>

            <select
              value={duesStatusFilter}
              onChange={(e) => setDuesStatusFilter(e.target.value)}
              className="rounded-lg border border-input bg-background px-3 py-1.5 text-xs font-semibold"
            >
              <option value="all">All Term Statuses</option>
              <option value="CURRENT">Current & Active</option>
              <option value="DUE_SOON">Due Soon (30 Days)</option>
              <option value="EXPIRED">Expired / Overdue</option>
            </select>
          </div>

          {/* Membership Terms Table */}
          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <th className="py-3 px-4">Member & Business</th>
                    <th className="py-3 px-4">Membership #</th>
                    <th className="py-3 px-4">Term Start</th>
                    <th className="py-3 px-4">Term End (1-Year)</th>
                    <th className="py-3 px-4">Days Left</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-muted-foreground">
                        Loading membership dues...
                      </td>
                    </tr>
                  ) : filteredDues.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-muted-foreground">
                        No members found.
                      </td>
                    </tr>
                  ) : (
                    filteredDues.map((m: any) => (
                      <tr key={m.memberId} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-foreground">{m.name}</div>
                          <div className="text-xs text-muted-foreground">{m.businessName} ({m.industry})</div>
                        </td>

                        <td className="py-3 px-4 font-mono text-xs text-muted-foreground">
                          {m.membershipNumber}
                        </td>

                        <td className="py-3 px-4 text-xs text-foreground">
                          {m.termStartDate}
                        </td>

                        <td className="py-3 px-4 text-xs font-semibold text-foreground">
                          {m.termEndDate}
                        </td>

                        <td className="py-3 px-4 text-xs">
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

                        <td className="py-3 px-4">
                          {m.paymentStatus === "CURRENT" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                              <CheckCircle2 className="h-3 w-3" /> Paid (Current)
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

                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              setPayingMember(m);
                              setPayForm({
                                amount: 25000,
                                paymentMethod: "UPI",
                                utr: "",
                                termYears: 1,
                              });
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-semibold shadow-xs cursor-pointer"
                          >
                            <CreditCard className="h-3 w-3" /> Record Payment
                          </button>
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

      {/* Record Membership Payment Modal */}
      {payingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-2xl border bg-card p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150">
            <button
              onClick={() => setPayingMember(null)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground hover:bg-muted cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <h3 className="text-lg font-bold text-foreground">Record Membership Term Renewal</h3>
              <p className="text-xs text-muted-foreground">For Member: <strong>{payingMember.name}</strong> ({payingMember.membershipNumber})</p>
            </div>

            <form onSubmit={handleRecordMembershipPayment} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Renewal Term</label>
                <select
                  value={payForm.termYears}
                  onChange={(e) => {
                    const yrs = Number(e.target.value);
                    setPayForm({
                      ...payForm,
                      termYears: yrs,
                      amount: yrs * 25000,
                    });
                  }}
                  className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm mt-1"
                >
                  <option value={1}>1 Year (12 Months Term)</option>
                  <option value={2}>2 Years (24 Months Term)</option>
                  <option value={3}>3 Years (36 Months Term)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">Membership Fee Amount (₹) *</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={payForm.amount}
                  onChange={(e) => setPayForm({ ...payForm, amount: Number(e.target.value) })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm mt-1 font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">Payment Mode</label>
                <select
                  value={payForm.paymentMethod}
                  onChange={(e) => setPayForm({ ...payForm, paymentMethod: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm mt-1 font-medium"
                >
                  <option value="UPI">UPI / Digital Gateway</option>
                  <option value="BANK_TRANSFER">Direct Bank Transfer / NEFT</option>
                  <option value="CHEQUE">Cheque / Demand Draft</option>
                  <option value="CASH">Cash</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">UTR / Transaction / Reference ID</label>
                <input
                  type="text"
                  placeholder="e.g. 4239842348"
                  value={payForm.utr}
                  onChange={(e) => setPayForm({ ...payForm, utr: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm font-mono mt-1"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setPayingMember(null)}
                  className="rounded-lg border border-input bg-background px-4 py-2 text-xs font-semibold hover:bg-accent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={recordingPayment}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {recordingPayment ? "Recording..." : "Confirm & Extend Term"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Meeting UPI & Fee Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-2xl border bg-card p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150">
            <button
              onClick={() => setIsSettingsOpen(false)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground hover:bg-muted cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-1">
              <span className="rounded-full bg-purple-500/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-purple-600 border border-purple-500/30">
                Chapter Configuration
              </span>
              <h3 className="text-lg font-bold text-foreground pt-1">Change Meeting UPI & Fee</h3>
              <p className="text-xs text-muted-foreground">
                Configure the Chapter UPI VPA ID, Payee Name, and Standard Weekly Meeting Fee.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-3 pt-2">
              {settingsError && (
                <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-2.5 text-xs text-rose-600">
                  {settingsError}
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-muted-foreground">Chapter UPI VPA *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. sskapex@okaxis"
                  value={settingsForm.upiId}
                  onChange={(e) => setSettingsForm({ ...settingsForm, upiId: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm font-mono mt-1"
                />
                <span className="text-[11px] text-muted-foreground">UPI ID used for QR code generation and mobile intents.</span>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">Payee Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SSK Chapter Treasury"
                  value={settingsForm.upiName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, upiName: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">Standard Meeting Fee (₹) *</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={settingsForm.meetingFee}
                  onChange={(e) => setSettingsForm({ ...settingsForm, meetingFee: Number(e.target.value) })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm mt-1"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  className="rounded-lg border border-input bg-background px-4 py-2 text-xs font-semibold hover:bg-accent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm cursor-pointer"
                >
                  {savingSettings ? "Saving..." : "Save Credentials"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Transaction Modal */}
      {editingTxn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-sm rounded-2xl border bg-card p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150">
            <button
              onClick={() => setEditingTxn(null)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground hover:bg-muted cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <h3 className="text-lg font-bold text-foreground">Adjust Transaction</h3>
              <p className="text-xs text-muted-foreground">Editing record for {editingTxn.memberName}</p>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Amount (₹)</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={editForm.amount}
                  onChange={(e) => setEditForm({ ...editForm, amount: Number(e.target.value) })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">Payment Mode</label>
                <select
                  value={editForm.paymentMethod}
                  onChange={(e) => setEditForm({ ...editForm, paymentMethod: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm mt-1 font-medium"
                >
                  <option value="UPI">UPI / Digital</option>
                  <option value="CASH">Cash</option>
                  <option value="ADV">Advance Adjustment</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">UTR / Transaction ID</label>
                <input
                  type="text"
                  placeholder="e.g. 412389234823"
                  value={editForm.utr}
                  onChange={(e) => setEditForm({ ...editForm, utr: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm font-mono mt-1"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingTxn(null)}
                  className="rounded-lg border border-input bg-background px-4 py-2 text-xs font-semibold hover:bg-accent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  {savingEdit ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Screenshot Preview Modal */}
      {previewScreenshot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-2xl border bg-card p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150">
            <button
              onClick={() => setPreviewScreenshot(null)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground hover:bg-muted cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-foreground">Payment Receipt Proof</h3>
              <p className="text-xs text-muted-foreground">
                Attendee: {previewScreenshot.name} • {previewScreenshot.time}
              </p>
            </div>

            <div className="rounded-xl overflow-hidden border bg-black/10 max-h-[380px] flex items-center justify-center">
              <img
                src={previewScreenshot.url}
                alt="Payment proof receipt"
                className="w-full h-auto object-contain max-h-[380px]"
              />
            </div>

            <div className="rounded-xl bg-muted/30 p-3 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-bold text-emerald-600">₹{previewScreenshot.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">UTR / Reference:</span>
                <span className="font-mono font-semibold text-foreground">{previewScreenshot.utr}</span>
              </div>
            </div>

            <button
              onClick={() => setPreviewScreenshot(null)}
              className="w-full rounded-xl bg-primary py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
