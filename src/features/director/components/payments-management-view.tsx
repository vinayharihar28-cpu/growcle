"use client";

import React, { useEffect, useState } from "react";
import {
  CreditCard,
  IndianRupee,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  Calendar,
  QrCode,
  Settings,
  Edit2,
  ExternalLink,
  Save,
  Check,
  Copy,
  X,
  Smartphone,
  ShieldCheck,
} from "lucide-react";
import {
  getDirectorPayments,
  getDirectorMembershipDues,
  getAssignedChapters,
  updateChapterDetails,
} from "../actions/director-actions";
import { QRCodeSvg } from "@/components/QRCodeSvg";

export function PaymentsManagementView() {
  const [activeTab, setActiveTab] = useState<"LEDGER" | "MEMBERSHIP_DUES" | "UPI_SETTINGS">("LEDGER");
  const [payments, setPayments] = useState<any[]>([]);
  const [membershipDues, setMembershipDues] = useState<any[]>([]);
  const [chapters, setChapters] = useState<any[]>([]);
  const [chapterId, setChapterId] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Chapter UPI & Fee Editor state
  const [editingChapter, setEditingChapter] = useState<any | null>(null);
  const [formUpiId, setFormUpiId] = useState("");
  const [formUpiName, setFormUpiName] = useState("");
  const [formMeetingFee, setFormMeetingFee] = useState<number>(800);
  const [savingChapter, setSavingChapter] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [saveErrorMsg, setSaveErrorMsg] = useState<string | null>(null);
  const [copiedVpa, setCopiedVpa] = useState<string | null>(null);

  const loadAllData = async () => {
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
  };

  useEffect(() => {
    loadAllData();
  }, [chapterId]);

  const openChapterEditor = (chap: any) => {
    setEditingChapter(chap);
    setFormUpiId(chap.upiId || "");
    setFormUpiName(chap.upiName || `${chap.name} Chapter Treasury`);
    setFormMeetingFee(Number(chap.meetingFee) || 800);
    setSaveSuccessMsg(null);
    setSaveErrorMsg(null);
  };

  const handleSaveChapterUpi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingChapter) return;
    if (!formUpiId.trim()) {
      setSaveErrorMsg("Please provide a valid UPI ID (e.g. treasury@bank or name@upi).");
      return;
    }

    setSavingChapter(true);
    setSaveErrorMsg(null);
    setSaveSuccessMsg(null);
    try {
      await updateChapterDetails({
        chapterId: editingChapter.id,
        upiId: formUpiId.trim(),
        upiName: formUpiName.trim() || `${editingChapter.name} Chapter Treasury`,
        meetingFee: Number(formMeetingFee) || 800,
      });

      setSaveSuccessMsg(`Payment settings for ${editingChapter.name} saved successfully.`);
      await loadAllData();
      setTimeout(() => {
        setEditingChapter(null);
        setSaveSuccessMsg(null);
      }, 1200);
    } catch (err: any) {
      setSaveErrorMsg(err.message || "Failed to update chapter payment details.");
    } finally {
      setSavingChapter(false);
    }
  };

  const handleCopyVpa = (vpa: string) => {
    navigator.clipboard.writeText(vpa);
    setCopiedVpa(vpa);
    setTimeout(() => setCopiedVpa(null), 2000);
  };

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

  // Live UPI URI generator for the modal/preview
  const previewFee = Number(formMeetingFee) || 800;
  const previewVpa = formUpiId.trim() || "120040530420@cnrb";
  const previewName = encodeURIComponent(formUpiName.trim() || "Chapter Treasury");
  const previewUpiUri = `upi://pay?pa=${previewVpa}&pn=${previewName}&am=${previewFee.toFixed(2)}&cu=INR&tn=${encodeURIComponent("Chapter Meeting Fee")}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Admin Payment & Treasury Oversight</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Monitor chapter membership payments, 1-year terms, chapter UPI QR configurations, and transaction ledgers.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-1 overflow-x-auto max-w-full">
        <button
          onClick={() => setActiveTab("LEDGER")}
          className={`px-4 py-2 text-sm font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "LEDGER"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Chapter Financial Ledgers ({payments.length})
        </button>
        <button
          onClick={() => setActiveTab("MEMBERSHIP_DUES")}
          className={`px-4 py-2 text-sm font-bold border-b-2 whitespace-nowrap shrink-0 transition-all cursor-pointer flex items-center gap-2 ${
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
        <button
          onClick={() => setActiveTab("UPI_SETTINGS")}
          className={`px-4 py-2 text-sm font-bold border-b-2 whitespace-nowrap shrink-0 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "UPI_SETTINGS"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <QrCode className="h-4 w-4" />
          <span>Chapter UPI & QR Settings ({chapters.length})</span>
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
                <table className="w-full text-left text-sm border-collapse min-w-[650px]">
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
                              : p.status === "PENDING"
                              ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                              : "bg-rose-500/10 text-rose-600 border border-rose-500/20"
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
      ) : activeTab === "MEMBERSHIP_DUES" ? (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card border border-border rounded-xl p-3.5 shadow-xs">
            <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search members by name, company, or code..."
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
              <table className="w-full text-left text-sm border-collapse min-w-[650px]">
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
      ) : (
        /* UPI & QR Settings Tab */
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <QrCode className="h-5 w-5 text-primary" />
                  Official Chapter UPI & Dynamic QR Code Configuration
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Configure the official receiving Virtual Payment Address (UPI VPA), Payee Name, and Standard Meeting Fee for each chapter. The generated QR codes are 100% spec-compliant with Google Pay, PhonePe, Paytm, and BHIM, with pre-filled amounts.
                </p>
              </div>
            </div>
          </div>

          {/* Chapter Payment Settings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {chapters.map((chap) => {
              const fee = Number(chap.meetingFee) || 800;
              const vpa = chap.upiId || "120040530420@cnrb";
              const payee = chap.upiName || `${chap.name} Chapter Treasury`;
              const upiUri = `upi://pay?pa=${vpa.trim()}&pn=${encodeURIComponent(payee)}&am=${fee.toFixed(2)}&cu=INR&tn=${encodeURIComponent(`Meeting Fee ${chap.name}`)}`;

              return (
                <div
                  key={chap.id}
                  className="bg-card border border-border rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 border-b border-border pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-foreground text-base">{chap.name}</h4>
                        <span className="text-[10px] font-mono font-semibold bg-muted px-2 py-0.5 rounded text-muted-foreground">
                          {chap.chapterCode}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {chap.meetingDay} &bull; {chap.meetingTime} &bull; {chap.location}
                      </p>
                    </div>

                    <button
                      onClick={() => openChapterEditor(chap)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      Configure
                    </button>
                  </div>

                  {/* QR Preview & Details Box */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 bg-muted/30 border border-border/60 rounded-xl p-4">
                    <div className="shrink-0 flex flex-col items-center">
                      <QRCodeSvg value={upiUri} size={130} />
                      <span className="text-[10px] font-bold text-muted-foreground mt-1">
                        ISO Spec QR
                      </span>
                    </div>

                    <div className="space-y-2 text-xs flex-1 w-full">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground font-medium">Standard Meeting Fee:</span>
                        <span className="font-bold text-emerald-600 text-sm">
                          ₹{fee.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </span>
                      </div>

                      <div className="space-y-0.5">
                        <span className="text-muted-foreground font-medium block">Payee VPA / UPI ID:</span>
                        <div className="flex items-center justify-between bg-background border border-border rounded-md px-2 py-1">
                          <span className="font-mono text-xs font-bold text-foreground truncate max-w-[180px]">
                            {vpa}
                          </span>
                          <button
                            onClick={() => handleCopyVpa(vpa)}
                            className="text-muted-foreground hover:text-foreground text-[11px] p-0.5 ml-1"
                            title="Copy UPI ID"
                          >
                            {copiedVpa === vpa ? (
                              <Check className="h-3.5 w-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-muted-foreground font-medium">Payee Name:</span>
                        <span className="font-semibold text-foreground text-right truncate max-w-[170px]">
                          {payee}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-[11px] pt-1 border-t border-border/40">
                        <span className="text-muted-foreground">Scannable Amount:</span>
                        <span className="font-mono font-bold text-primary">₹{fee.toFixed(2)} Pre-filled</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-muted-foreground flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                      <CheckCircle2 className="h-3 w-3" /> Scanner Ready (GPay, PhonePe, Paytm)
                    </span>
                    <span>{chap.memberCount} Members</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Modal / Dialog for Editing Chapter UPI & Fee */}
          {editingChapter && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
              <div className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-start justify-between border-b border-border pb-3">
                  <div>
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                      <Settings className="h-5 w-5 text-primary" />
                      Configure Chapter Payment Settings
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {editingChapter.name} ({editingChapter.chapterCode})
                    </p>
                  </div>
                  <button
                    onClick={() => setEditingChapter(null)}
                    className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {saveSuccessMsg && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>{saveSuccessMsg}</span>
                  </div>
                )}

                {saveErrorMsg && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs font-semibold flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span>{saveErrorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleSaveChapterUpi} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-foreground block mb-1">
                      Chapter UPI ID / Virtual Payment Address (VPA) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formUpiId}
                      onChange={(e) => setFormUpiId(e.target.value)}
                      placeholder="e.g. 120040530420@cnrb or chapter@icici"
                      className="w-full px-3.5 py-2.5 text-sm font-mono border border-input rounded-xl bg-background text-foreground focus:ring-2 focus:ring-primary outline-hidden"
                    />
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Must be a valid bank UPI handle (e.g. yourchapter@icici, mobile@upi).
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-foreground block mb-1">
                      Payee Display Name
                    </label>
                    <input
                      type="text"
                      value={formUpiName}
                      onChange={(e) => setFormUpiName(e.target.value)}
                      placeholder="e.g. Apex Central Chapter Treasury"
                      className="w-full px-3.5 py-2.5 text-sm border border-input rounded-xl bg-background text-foreground focus:ring-2 focus:ring-primary outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-foreground block mb-1">
                      Standard Meeting Fee Amount (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      step={1}
                      value={formMeetingFee}
                      onChange={(e) => setFormMeetingFee(Number(e.target.value))}
                      placeholder="e.g. 250 or 800"
                      className="w-full px-3.5 py-2.5 text-sm font-bold border border-input rounded-xl bg-background text-foreground focus:ring-2 focus:ring-primary outline-hidden"
                    />
                    <p className="text-[11px] text-muted-foreground mt-1">
                      This amount will be automatically hardcoded into the QR code payload (`am={previewFee.toFixed(2)}`).
                    </p>
                  </div>

                  {/* Live Interactive Spec QR Preview */}
                  <div className="bg-muted/40 border border-border rounded-xl p-4 text-center space-y-3">
                    <span className="text-xs font-bold text-foreground block">
                      Live Scannable QR Code Preview
                    </span>

                    <div className="flex justify-center">
                      <QRCodeSvg value={previewUpiUri} size={160} />
                    </div>

                    <div className="text-xs space-y-1 text-left bg-background border border-border rounded-lg p-2.5">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Pre-filled Amount:</span>
                        <span className="font-bold text-emerald-600">₹{previewFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">VPA:</span>
                        <span className="font-mono text-foreground font-semibold">{previewVpa}</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground font-mono break-all pt-1 border-t border-border/50">
                        {previewUpiUri}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingChapter(null)}
                      className="px-4 py-2 text-xs font-bold rounded-xl border border-input text-muted-foreground hover:bg-muted cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={savingChapter}
                      className="px-5 py-2 text-xs font-bold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {savingChapter ? (
                        <>Saving...</>
                      ) : (
                        <>
                          <Save className="h-4 w-4" /> Save Payment Settings
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
