"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  QrCode,
  IndianRupee,
  CheckCircle2,
  UploadCloud,
  ShieldCheck,
  Building2,
  Calendar,
  Lock,
  ArrowRight,
  Sparkles,
  Smartphone,
  ExternalLink,
  FileImage,
  X,
  Clock,
  User,
} from "lucide-react";
import {
  getLeadershipContext,
  getLeadershipAttendance,
  submitMemberPaymentWithScreenshot,
  LeadershipContext,
} from "@/features/leadership/actions/leadership-actions";
import { QRCodeSvg } from "@/components/QRCodeSvg";
import { playSuccessChime } from "@/lib/audio-chime";
import { getChapterTheme } from "@/lib/chapter-themes";

export default function MemberPayKioskPage() {
  const [context, setContext] = useState<LeadershipContext | null>(null);
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedMemberId, setSelectedMemberId] = useState<string>("");
  const [utrNumber, setUtrNumber] = useState<string>("");
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const ctx = await getLeadershipContext();
      setContext(ctx);
      const res = await getLeadershipAttendance(ctx.chapterId);
      setData(res);
      if (res.attendances && res.attendances.length > 0) {
        setSelectedMemberId(res.attendances[0].memberId);
      }
    } catch (err) {
      console.error("Failed to load kiosk data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const currentAttendee = (data?.attendances || []).find(
    (a: any) => a.memberId === selectedMemberId
  );

  const feeAmount = data?.selectedMeeting?.standardFee || context?.meetingFee || 800;
  const theme = getChapterTheme(context?.themeColor);

  const getUpiUrl = () => {
    if (!currentAttendee) return "";
    const rawPa = data?.selectedMeeting?.upiId || context?.upiId || "120040530420@cnrb";
    const pa = rawPa.trim();
    const pn = encodeURIComponent(data?.selectedMeeting?.upiName || context?.upiName || "Chapter Treasury");
    const feeNum = Number(feeAmount);
    const am = !isNaN(feeNum) && feeNum > 0 ? feeNum.toFixed(2) : "800.00";
    const safeId = (currentAttendee.id || "").replace(/[^a-zA-Z0-9]/g, "").slice(0, 10) || "KIOSK";
    const tr = `KIOSK${safeId.toUpperCase()}`;
    const tn = encodeURIComponent(`Meeting Fee ${currentAttendee.memberName || ""}`.trim());
    return `upi://pay?pa=${pa}&pn=${pn}&am=${am}&tr=${tr}&tn=${tn}&cu=INR`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAttendee || !data?.selectedMeeting) return;
    if (!screenshotPreview && !utrNumber) {
      alert("Please upload a payment screenshot or enter the UTR / Transaction ID.");
      return;
    }

    setSubmitting(true);
    try {
      await submitMemberPaymentWithScreenshot({
        memberId: currentAttendee.memberId,
        meetingId: data.selectedMeeting.id,
        amount: feeAmount,
        utr: utrNumber || `SCREENSHOT-${Date.now().toString().slice(-6)}`,
        screenshotDataUrl: screenshotPreview || "",
        paymentMethod: "UPI_SCREENSHOT",
      });

      playSuccessChime();
      setConfirmed(true);
      await loadData();
    } catch (err) {
      console.error("Failed to record payment", err);
      alert("Failed to submit payment receipt. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex flex-col items-center justify-center p-4 sm:p-6">
      {/* Container */}
      <div className="w-full max-w-lg space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-600 border border-emerald-500/20 shadow-xs">
            <ShieldCheck className="h-4 w-4" /> Official Chapter Venue Check-In
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            {context?.chapterName || "Growcle Chapter"}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
            Weekly Meeting Attendance & Self-Service UPI Fee Payment
          </p>
        </div>

        {/* Main Card */}
        <div className="rounded-3xl border bg-card p-6 sm:p-8 shadow-xl space-y-6 relative overflow-hidden">
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-muted-foreground">Loading venue check-in terminal...</p>
            </div>
          ) : (
            <>
              {/* Meeting Info Badge */}
              <div className="rounded-2xl border bg-muted/30 p-3.5 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    {data?.selectedMeeting?.date || "Today's Meeting"}
                  </span>
                  <span className="text-muted-foreground block text-[11px]">
                    {data?.selectedMeeting?.title || "Weekly Business Exchange"}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-muted-foreground block text-[10px] uppercase font-bold">Standard Fee</span>
                  <span className="text-base font-bold text-foreground">₹{feeAmount}</span>
                </div>
              </div>

              {/* Attendee Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Select Your Name / Firm
                </label>
                <div className="relative">
                  <select
                    value={selectedMemberId}
                    onChange={(e) => {
                      setSelectedMemberId(e.target.value);
                      setConfirmed(false);
                      setScreenshotPreview(null);
                      setUtrNumber("");
                    }}
                    className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
                  >
                    {(data?.attendances || []).map((a: any) => (
                      <option key={a.memberId} value={a.memberId}>
                        {a.memberName} {a.isVisitor ? "(Visitor)" : `• ${a.businessName}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Status Banner If Already Checked-In / Paid */}
              {currentAttendee?.paid || confirmed ? (
                <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-6 text-center space-y-3 animate-in fade-in zoom-in-95">
                  <div className="h-14 w-14 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                      Attendance Recorded & Fee Settled!
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Welcome, <span className="font-semibold text-foreground">{currentAttendee?.memberName}</span>.
                      Your presence is verified for today's meeting.
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-xl bg-background/80 px-4 py-2 border text-xs font-mono font-semibold">
                    <span>Payment: ₹{feeAmount} (UPI Verified)</span>
                  </div>
                </div>
              ) : (
                /* Unpaid: QR Code & Screenshot Upload Form */
                <form onSubmit={handleConfirmPayment} className="space-y-6">
                  {/* Dynamic UPI QR Code Panel */}
                  <div className="rounded-2xl border border-purple-500/30 bg-purple-950/10 p-5 text-center space-y-3">
                    <span className="rounded-full bg-purple-500/20 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 border border-purple-500/30">
                      Scan or Tap to Pay ₹{feeAmount}
                    </span>

                    <div className="mx-auto flex justify-center p-2">
                      <QRCodeSvg value={getUpiUrl()} size={190} />
                    </div>

                    <div className="text-xs space-y-0.5">
                      <p className="font-semibold text-foreground font-mono">{data?.selectedMeeting?.upiId || context?.upiId || "120040530420@cnrb"}</p>
                      <p className="text-muted-foreground text-[11px]">{data?.selectedMeeting?.upiName || context?.upiName || "Chapter Treasury"}</p>
                    </div>

                    {/* Mobile UPI Intent Button */}
                    <a
                      href={getUpiUrl()}
                      className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-purple-600 hover:bg-purple-700 text-white py-2.5 text-xs font-bold shadow-md transition-all sm:hidden"
                    >
                      <Smartphone className="h-4 w-4" /> Pay via GPay / PhonePe / Paytm
                    </a>
                  </div>

                  {/* Screenshot Upload Dropzone */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                      <span>Upload Payment Screenshot *</span>
                      <span className="text-[10px] font-normal text-muted-foreground">Receipt / Success screen</span>
                    </label>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {!screenshotPreview ? (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="rounded-2xl border-2 border-dashed border-input hover:border-primary/60 bg-muted/20 hover:bg-muted/30 p-5 text-center cursor-pointer transition-all space-y-2"
                      >
                        <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                          <UploadCloud className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-foreground">
                            Click to upload payment screenshot
                          </p>
                          <p className="text-[11px] text-muted-foreground">PNG, JPG, or Screenshot from your UPI app</p>
                        </div>
                      </div>
                    ) : (
                      <div className="relative rounded-2xl border overflow-hidden bg-black/5 p-2 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={screenshotPreview}
                            alt="Receipt Preview"
                            className="h-14 w-14 rounded-lg object-cover border"
                          />
                          <div>
                            <span className="text-xs font-bold text-foreground block">Screenshot Attached</span>
                            <span className="text-[11px] text-emerald-600 font-semibold">Ready for verification</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setScreenshotPreview(null)}
                          className="rounded-full p-1.5 text-muted-foreground hover:bg-muted"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* UTR Reference Input */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">
                      UPI Reference / UTR Number (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 412398458923"
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                      className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-xs font-mono mt-0.5"
                    />
                  </div>

                  {/* Submit Confirmation Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white py-3 text-xs font-bold shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {submitting ? (
                      <span>Verifying & Recording Attendance...</span>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" /> Submit Receipt & Mark Attendance
                      </>
                    )}
                  </button>
                </form>
              )}
            </>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="text-center text-xs text-muted-foreground">
          <span>Chapter Officer or Leader? </span>
          <a href="/dashboard/leadership" className="font-semibold text-primary hover:underline">
            Go to Leadership Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
