"use client";

import React, { useEffect, useState } from "react";
import {
  CreditCard,
  IndianRupee,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Copy,
  Check,
  QrCode,
  ShieldCheck,
  FileText,
  ExternalLink,
  Eye,
  X,
  Sparkles,
} from "lucide-react";
import {
  getMemberContext,
  getMemberMembershipStatus,
  submitMemberMembershipFeePayment,
  MemberContext,
} from "../actions/member-actions";
import { MemberHeaderBar } from "./member-header-bar";
import { QRCodeSvg } from "@/components/QRCodeSvg";

export function MemberMembershipView() {
  const [context, setContext] = useState<MemberContext | null>(null);
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Form state
  const [amount, setAmount] = useState(25000);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [utr, setUtr] = useState("");
  const [notes, setNotes] = useState("");
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Lightbox modal for previewing receipt screenshots
  const [activeReceiptUrl, setActiveReceiptUrl] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const ctx = await getMemberContext();
      setContext(ctx);
      const res = await getMemberMembershipStatus(ctx.memberId);
      setData(res);
      setAmount(res.annualFee || 25000);
    } catch (err) {
      console.error("Failed to load membership status", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCopyUpi = () => {
    if (!data?.upiId) return;
    navigator.clipboard.writeText(data.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Image size exceeds 5MB limit.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setScreenshotPreview(reader.result as string);
      setErrorMsg("");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!utr.trim()) {
      setErrorMsg("Please enter the UTR / Transaction Reference Number.");
      return;
    }
    if (!context?.memberId) return;

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      await submitMemberMembershipFeePayment({
        memberId: context.memberId,
        amount: Number(amount),
        utr: utr.trim(),
        paymentMethod,
        screenshotUrl: screenshotPreview || undefined,
        notes: notes.trim() || undefined,
      });
      setSubmitSuccess(true);
      setUtr("");
      setNotes("");
      setScreenshotPreview(null);
      await loadData();
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit membership payment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatINR = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const qrImageUrl = data?.upiId
    ? `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(
        `upi://pay?pa=${data.upiId}&pn=${encodeURIComponent(
          data.upiName
        )}&am=${amount}&cu=INR&tn=${encodeURIComponent(
          `Membership ${data.membershipNumber}`
        )}`
      )}`
    : "";

  return (
    <div className="space-y-6">
      {context && <MemberHeaderBar context={context} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-border pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-primary" />
            Membership Status & Annual Dues
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Monitor your 1-year chapter tenure, upcoming renewal schedule, and pay via Chapter UPI QR.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="bg-card border border-border rounded-2xl p-16 text-center text-muted-foreground animate-pulse">
          Loading membership status and payment details...
        </div>
      ) : !data ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center text-muted-foreground">
          No membership record found.
        </div>
      ) : (
        <>
          {/* 1-Year Tenure Overview Card */}
          <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Membership Tier
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                    <Sparkles className="h-3.5 w-3.5" />
                    {data.tenureLabel}
                  </span>
                  {data.paymentStatus === "CURRENT" ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Active & Current
                    </span>
                  ) : data.paymentStatus === "DUE_SOON" ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      <Clock className="h-3.5 w-3.5" />
                      Renewal Due Soon ({data.daysRemaining} days left)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      Membership Expired
                    </span>
                  )}
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-foreground">
                  {data.name} &bull;{" "}
                  <span className="text-muted-foreground font-normal text-lg">
                    {data.businessName}
                  </span>
                </h3>
                <p className="text-xs font-mono text-muted-foreground">
                  ID: <span className="font-semibold text-foreground">{data.membershipNumber}</span> &bull; Chapter:{" "}
                  <span className="font-semibold text-foreground">{data.chapterName} ({data.chapterCode})</span>
                </p>
              </div>

              {/* Annual Fee Display */}
              <div className="bg-muted/40 border border-border/80 rounded-xl p-4 text-right flex flex-col justify-center min-w-[200px]">
                <span className="text-xs font-medium text-muted-foreground">Annual Membership Fee</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-foreground">
                  {formatINR(data.annualFee)}
                </span>
                <span className="text-[11px] text-muted-foreground">Per 1-Year Tenure</span>
              </div>
            </div>

            {/* Tenure Progress Bar */}
            <div className="space-y-2 pt-2 border-t border-border">
              <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  <span>Term Start: <strong className="text-foreground">{data.termStartDate}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  <span>Renewal Date: <strong className="text-foreground">{data.termEndDate}</strong></span>
                </div>
              </div>

              <div className="w-full bg-muted rounded-full h-3 overflow-hidden p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    data.paymentStatus === "CURRENT"
                      ? "bg-emerald-500"
                      : data.paymentStatus === "DUE_SOON"
                      ? "bg-amber-500"
                      : "bg-rose-500"
                  }`}
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round((data.elapsedDays / data.totalDaysInTerm) * 100)
                    )}%`,
                  }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>{data.elapsedDays} days elapsed</span>
                <span className="font-bold text-foreground">
                  {data.daysRemaining > 0
                    ? `${data.daysRemaining} days remaining in cycle`
                    : "Term expired — renewal required"}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Section: UPI QR + Verification Upload Form */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Col: UPI QR Code & Instructions (5 Cols) */}
            <div className="lg:col-span-5 bg-card border border-border rounded-2xl p-6 shadow-sm space-y-5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-primary font-bold text-base">
                  <QrCode className="h-5 w-5" />
                  <h4>Chapter Official UPI QR Code</h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Scan this live QR with Google Pay, PhonePe, Paytm, BHIM, or any UPI banking application to pay your annual chapter membership dues.
                </p>

                {/* QR Code Container */}
                <div className="flex flex-col items-center justify-center p-5 bg-white rounded-2xl border shadow-inner max-w-[260px] mx-auto">
                  <QRCodeSvg
                    value={
                      data?.upiUri ||
                      `upi://pay?pa=${(data?.upiId || "120040530420@cnrb").trim()}&pn=${encodeURIComponent(
                        data?.upiName || "Chapter Treasury"
                      )}&am=${Number(amount).toFixed(2)}&cu=INR&tn=${encodeURIComponent(
                        `Membership ${data?.membershipNumber || ""}`
                      )}`
                    }
                    size={190}
                  />
                  <span className="text-[11px] font-bold text-slate-800 mt-2 text-center">
                    ₹{amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })} &bull; Growcle Official
                  </span>
                </div>

                {/* UPI ID Copy Box */}
                <div className="bg-muted/50 border border-border rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground font-medium">Payee VPA / UPI ID:</span>
                    <button
                      onClick={handleCopyUpi}
                      className="inline-flex items-center gap-1 text-primary hover:underline font-bold text-[11px] cursor-pointer"
                    >
                      {copiedUpi ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-500" />
                          <span className="text-emerald-500">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copy VPA</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="font-mono text-xs font-bold text-foreground break-all">
                    {data.upiId}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Account Name: <strong className="text-foreground">{data.upiName}</strong>
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={data.upiUri}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 text-xs font-bold transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open in UPI App (Mobile Only)
                </a>
              </div>
            </div>

            {/* Right Col: Payment Verification Proof Form (7 Cols) */}
            <div className="lg:col-span-7 bg-card border border-border rounded-2xl p-6 shadow-sm space-y-5">
              <div>
                <div className="flex items-center gap-2 text-foreground font-bold text-lg">
                  <ShieldCheck className="h-5 w-5 text-emerald-500" />
                  <h4>Submit Payment Proof for Verification</h4>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  After completing the transfer, enter the Bank UTR / Reference ID and attach the payment screenshot so Chapter Leadership & Director can verify and issue your receipt.
                </p>
              </div>

              {submitSuccess && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div className="space-y-0.5 text-xs">
                    <p className="font-bold">Payment Receipt Submitted Successfully!</p>
                    <p className="text-muted-foreground">
                      Your transaction is now queued for verification by Chapter Leadership & Director. Status will update below shortly.
                    </p>
                  </div>
                </div>
              )}

              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmitPayment} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Amount */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">
                      Amount Paid (₹) <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <input
                        type="number"
                        min="1"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        required
                        className="pl-9 pr-3 py-2 w-full border border-input rounded-xl bg-background text-sm font-bold focus:ring-2 focus:ring-primary outline-hidden"
                      />
                    </div>
                  </div>

                  {/* Payment Mode */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">
                      Payment Mode <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full border border-input rounded-xl bg-background px-3 py-2 text-sm font-semibold focus:ring-2 focus:ring-primary outline-hidden"
                    >
                      <option value="UPI">UPI (GPay / PhonePe / Paytm / BHIM)</option>
                      <option value="IMPS_NEFT">NEFT / IMPS Bank Transfer</option>
                      <option value="CHEQUE_CASH">Cheque / Direct Treasury Cash</option>
                    </select>
                  </div>
                </div>

                {/* UTR / Ref Number */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">
                    Bank UTR / Transaction Reference Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 425689124589 or UPI-TXN-987654"
                    value={utr}
                    onChange={(e) => setUtr(e.target.value)}
                    required
                    className="w-full border border-input rounded-xl bg-background px-3.5 py-2 text-sm font-mono font-medium focus:ring-2 focus:ring-primary outline-hidden uppercase placeholder:normal-case"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    You can copy the 12-digit UTR from your UPI payment success screen.
                  </p>
                </div>

                {/* Screenshot Upload */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">
                    Upload Payment Screenshot <span className="text-xs font-normal text-muted-foreground">(Recommended)</span>
                  </label>

                  {screenshotPreview ? (
                    <div className="relative border border-border rounded-xl p-3 bg-muted/30 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={screenshotPreview}
                          alt="Receipt Preview"
                          className="w-14 h-14 object-cover rounded-lg border shadow-xs shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-foreground truncate">
                            Payment receipt attached
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            Ready for leadership review
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => setActiveReceiptUrl(screenshotPreview)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                          title="View preview"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setScreenshotPreview(null)}
                          className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10"
                          title="Remove screenshot"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-border hover:border-primary/60 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-muted/10 hover:bg-muted/20">
                      <Upload className="h-6 w-6 text-muted-foreground mb-1.5" />
                      <span className="text-xs font-semibold text-foreground">
                        Click to upload transfer screenshot
                      </span>
                      <span className="text-[10px] text-muted-foreground mt-0.5">
                        PNG, JPG or JPEG up to 5MB
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Additional Notes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">
                    Notes / Remarks <span className="text-xs font-normal text-muted-foreground">(Optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Paid for 2026-2027 renewal tenure from HDFC account."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full border border-input rounded-xl bg-background p-3 text-xs focus:ring-2 focus:ring-primary outline-hidden"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-bold hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>Processing Submission...</>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        Submit Proof for Leadership Verification
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Membership Transactions & Verification History */}
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-foreground text-base">
                  Membership Dues & Transaction History
                </h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                {data.transactions.length} Records
              </span>
            </div>

            {data.transactions.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground text-xs">
                No past membership payment records logged yet. Your submissions will appear here.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Date & Time</th>
                      <th className="py-3 px-4">Description</th>
                      <th className="py-3 px-4">UTR / Ref #</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Receipt Proof</th>
                      <th className="py-3 px-4">Verification Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {data.transactions.map((tx: any) => (
                      <tr key={tx.id} className="hover:bg-muted/20 transition-colors">
                        <td className="py-3 px-4 text-xs text-muted-foreground whitespace-nowrap">
                          {tx.createdAt}
                        </td>
                        <td className="py-3 px-4 text-xs font-bold text-foreground">
                          {tx.description}
                        </td>
                        <td className="py-3 px-4 font-mono text-xs font-semibold text-foreground">
                          {tx.utr}
                        </td>
                        <td className="py-3 px-4 font-extrabold text-foreground">
                          ₹{Number(tx.amount).toLocaleString("en-IN")}
                        </td>
                        <td className="py-3 px-4">
                          {tx.screenshotUrl ? (
                            <button
                              onClick={() => setActiveReceiptUrl(tx.screenshotUrl)}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-muted hover:bg-muted/80 text-xs font-medium text-primary cursor-pointer transition-colors"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              <span>View Receipt</span>
                            </button>
                          ) : (
                            <span className="text-xs text-muted-foreground italic">
                              No screenshot
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {tx.status === "SUCCESS" || tx.status === "PAID" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Verified & Active
                            </span>
                          ) : tx.status === "PENDING" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                              <Clock className="h-3.5 w-3.5" />
                              Pending Verification
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 border border-rose-500/20">
                              <AlertTriangle className="h-3.5 w-3.5" />
                              Failed / Rejected
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* Lightbox / Modal for Viewing Screenshot */}
      {activeReceiptUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setActiveReceiptUrl(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-card rounded-2xl overflow-hidden border shadow-2xl p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3 border-b">
              <h4 className="text-xs font-bold text-foreground">Attached Payment Screenshot Proof</h4>
              <button
                onClick={() => setActiveReceiptUrl(null)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-4 flex items-center justify-center max-h-[80vh] overflow-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeReceiptUrl}
                alt="Payment Proof Receipt"
                className="max-h-[70vh] object-contain rounded-lg border shadow-sm"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
