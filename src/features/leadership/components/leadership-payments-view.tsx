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
} from "lucide-react";
import {
  getLeadershipContext,
  getLeadershipPayments,
  updatePaymentSettings,
  updateTransaction,
  LeadershipContext,
} from "../actions/leadership-actions";
import { LeadershipHeaderBar } from "./leadership-header-bar";
import { playSuccessChime } from "@/lib/audio-chime";

export function LeadershipPaymentsView() {
  const [context, setContext] = useState<LeadershipContext | null>(null);
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("all");

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

  return (
    <div className="space-y-6">
      {context && <LeadershipHeaderBar context={context} />}

      {/* Header & Settings Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Chapter Treasury & Payment Collection
          </h2>
          <p className="text-muted-foreground text-sm">
            Monitor attendee payments, inspect screenshot receipts, and manage UPI payment credentials.
          </p>
        </div>

        <button
          onClick={() => {
            setIsSettingsOpen(true);
            setSettingsError("");
          }}
          className="rounded-lg border border-purple-500/30 bg-purple-500/10 px-3.5 py-2 text-xs font-bold text-purple-600 hover:bg-purple-500/20 flex items-center gap-1.5 shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Settings className="h-4 w-4" /> Change Meeting UPI & Amount
        </button>
      </div>

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
                          className="inline-flex items-center gap-1 rounded-lg border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 text-xs font-semibold text-purple-600 hover:bg-purple-500/20"
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
                        className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted"
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

      {/* Meeting UPI & Fee Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-2xl border bg-card p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150">
            <button
              onClick={() => setIsSettingsOpen(false)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground hover:bg-muted"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-1">
              <span className="rounded-full bg-purple-500/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-purple-600 border border-purple-500/30">
                Chapter Configuration
              </span>
              <h3 className="text-lg font-bold text-foreground pt-1">Change Meeting UPI & Amount</h3>
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
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm"
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
              className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground hover:bg-muted"
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
              className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground hover:bg-muted"
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
