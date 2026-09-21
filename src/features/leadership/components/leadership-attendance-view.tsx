"use client";

import React, { useEffect, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Users,
  Search,
  Check,
  QrCode,
  IndianRupee,
  Lock,
  Eye,
  X,
  UserPlus,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import {
  getLeadershipContext,
  getLeadershipAttendance,
  markAttendance,
  addLeadershipVisitor,
  LeadershipContext,
} from "../actions/leadership-actions";
import { LeadershipHeaderBar } from "./leadership-header-bar";
import { QRCodeSvg } from "@/components/QRCodeSvg";
import { playSuccessChime } from "@/lib/audio-chime";
import { getChapterTheme } from "@/lib/chapter-themes";

export function LeadershipAttendanceView() {
  const searchParams = useSearchParams();
  const initialMeetingId = searchParams.get("meetingId") || undefined;

  const [context, setContext] = useState<LeadershipContext | null>(null);
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | undefined>(initialMeetingId);
  const [searchMember, setSearchMember] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Active QR Modal / Drawer
  const [qrAttendee, setQrAttendee] = useState<any | null>(null);

  // Screenshot Preview Modal
  const [previewScreenshot, setPreviewScreenshot] = useState<{
    url: string;
    name: string;
    utr: string;
    amount: number;
    time: string;
  } | null>(null);

  // Quick Add Visitor Modal
  const [isVisitorModalOpen, setIsVisitorModalOpen] = useState(false);
  const [visitorForm, setVisitorForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    industry: "",
    invitedByMemberId: "",
  });
  const [visitorSubmitting, setVisitorSubmitting] = useState(false);

  const loadData = async (meetingId?: string) => {
    setLoading(true);
    try {
      const ctx = await getLeadershipContext();
      setContext(ctx);
      const res = await getLeadershipAttendance(ctx.chapterId, meetingId);
      setData(res);
      if (!selectedMeetingId && res.selectedMeeting) {
        setSelectedMeetingId(res.selectedMeeting.id);
      }
    } catch (err) {
      console.error("Failed to load attendance", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(selectedMeetingId);
  }, [selectedMeetingId]);

  const handleToggleAttendance = async (attendee: any, checked: boolean, method: string = "UPI") => {
    setUpdatingId(attendee.id);
    startTransition(async () => {
      try {
        await markAttendance({
          memberId: attendee.memberId,
          meetingId: data.selectedMeeting.id,
          checked,
          paymentMethod: method,
          amount: data.selectedMeeting.standardFee,
        });

        if (checked) {
          playSuccessChime();
        }

        // Optimistically update local state
        setData((prev: any) => {
          if (!prev) return prev;
          const updated = prev.attendances.map((a: any) =>
            a.id === attendee.id
              ? {
                  ...a,
                  status: checked ? "PRESENT" : "ABSENT",
                  paid: checked,
                  paymentMethod: checked ? method : null,
                  amount: checked ? prev.selectedMeeting.standardFee : null,
                }
              : a
          );

          // Re-sort: Unmarked/Absent top, Marked/Present bottom
          updated.sort((x: any, y: any) => {
            const xP = x.status === "PRESENT" || x.paid;
            const yP = y.status === "PRESENT" || y.paid;
            if (!xP && yP) return -1;
            if (xP && !yP) return 1;
            return x.memberName.localeCompare(y.memberName);
          });

          const present = updated.filter((a: any) => a.status === "PRESENT" || a.paid).length;
          const absent = updated.length - present;
          const paidUpi = updated.filter((a: any) => a.paid && a.paymentMethod?.includes("UPI")).length;
          const paidCash = updated.filter((a: any) => a.paid && a.paymentMethod === "CASH").length;
          const totalCollection = updated
            .filter((a: any) => a.paid)
            .reduce((sum: number, a: any) => sum + (Number(a.amount) || prev.selectedMeeting.standardFee), 0);

          return {
            ...prev,
            attendances: updated,
            selectedMeeting: {
              ...prev.selectedMeeting,
              present,
              absent,
              paidUpi,
              paidCash,
              totalCollection,
              attendanceRate: updated.length > 0 ? Math.round((present / updated.length) * 100) : 0,
            },
          };
        });
      } catch (err) {
        console.error("Failed to update attendance", err);
      } finally {
        setUpdatingId(null);
      }
    });
  };

  const handleAddVisitorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!context || !visitorForm.firstName || !visitorForm.email) return;
    setVisitorSubmitting(true);
    try {
      await addLeadershipVisitor({
        chapterId: context.chapterId,
        firstName: visitorForm.firstName,
        lastName: visitorForm.lastName,
        email: visitorForm.email,
        phone: visitorForm.phone,
        company: visitorForm.company,
        industry: visitorForm.industry,
        visitDate: new Date(),
        invitedByMemberId: visitorForm.invitedByMemberId || undefined,
      });

      setIsVisitorModalOpen(false);
      setVisitorForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        industry: "",
        invitedByMemberId: "",
      });
      await loadData(selectedMeetingId);
    } catch (err) {
      console.error("Failed to add visitor", err);
    } finally {
      setVisitorSubmitting(false);
    }
  };

  const theme = getChapterTheme(context?.themeColor || data?.selectedMeeting?.themeColor);

  const filteredAttendances = (data?.attendances || []).filter((a: any) => {
    const matchesSearch =
      !searchMember ||
      a.memberName.toLowerCase().includes(searchMember.toLowerCase()) ||
      a.businessName.toLowerCase().includes(searchMember.toLowerCase()) ||
      a.email.toLowerCase().includes(searchMember.toLowerCase());

    const isPresent = a.status === "PRESENT" || a.paid;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "PRESENT" && isPresent) ||
      (statusFilter === "ABSENT" && !isPresent) ||
      (statusFilter === "UPI" && a.paid && a.paymentMethod?.includes("UPI")) ||
      (statusFilter === "CASH" && a.paid && a.paymentMethod === "CASH") ||
      (statusFilter === "SCREENSHOT" && !!a.screenshotUrl);

    return matchesSearch && matchesStatus;
  });

  const getUpiUri = (attendee: any) => {
    const pa = data?.selectedMeeting?.upiId || "chapter@upi";
    const pn = encodeURIComponent(data?.selectedMeeting?.upiName || "SSK Chapter");
    const am = data?.selectedMeeting?.standardFee || 800;
    const tr = `ATT-${attendee.id.substring(0, 8)}`;
    const tn = encodeURIComponent(`Meeting Fee ${attendee.memberName}`);
    return `upi://pay?pa=${pa}&pn=${pn}&am=${am}&tr=${tr}&tn=${tn}&cu=INR`;
  };

  return (
    <div className="space-y-6">
      {context && <LeadershipHeaderBar context={context} />}

      {/* Top Header & Meeting Picker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <span>Meeting Attendance & Fee Collection</span>
            {data?.selectedMeeting?.isTimeLocked && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-500 border border-amber-500/20">
                <Lock className="h-3 w-3" /> Future Meeting (Time-Locked)
              </span>
            )}
          </h2>
          <p className="text-muted-foreground text-sm">
            Live check-in, dynamic UPI QR generation with chime, and payment receipt verification.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setIsVisitorModalOpen(true)}
            className="rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-700 flex items-center gap-1.5 shadow-sm"
          >
            <UserPlus className="h-4 w-4" /> Quick Add Visitor
          </button>

          {data?.meetings && data.meetings.length > 0 && (
            <div className="relative">
              <select
                value={selectedMeetingId}
                onChange={(e) => setSelectedMeetingId(e.target.value)}
                className="rounded-lg border border-input bg-card px-3.5 py-2 text-xs font-semibold text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary pr-8 appearance-none"
              >
                {data.meetings.map((m: any) => (
                  <option key={m.id} value={m.id}>
                    {m.date} - {m.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            </div>
          )}
        </div>
      </div>

      {/* Live Turnout & Collection Counters */}
      {data?.selectedMeeting && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
          <div className="rounded-xl border bg-card p-4 shadow-sm border-blue-500/20">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Strength</span>
            <p className="text-2xl font-bold text-foreground mt-1">{data.selectedMeeting.total}</p>
            <span className="text-xs text-muted-foreground">Expected Attendees</span>
          </div>

          <div className="rounded-xl border bg-card p-4 shadow-sm border-emerald-500/20">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Present</span>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{data.selectedMeeting.present}</p>
            <span className="text-xs text-emerald-600/80 font-medium">
              {data.selectedMeeting.attendanceRate}% Turnout
            </span>
          </div>

          <div className="rounded-xl border bg-card p-4 shadow-sm border-rose-500/20">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Absent / Unmarked</span>
            <p className="text-2xl font-bold text-rose-600 mt-1">{data.selectedMeeting.absent}</p>
            <span className="text-xs text-rose-600/80 font-medium">Pending Check-in</span>
          </div>

          <div className="rounded-xl border bg-card p-4 shadow-sm border-purple-500/20">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">UPI / Screenshot</span>
            <p className="text-2xl font-bold text-purple-600 mt-1">{data.selectedMeeting.paidUpi}</p>
            <span className="text-xs text-purple-600/80 font-medium">Online Paid</span>
          </div>

          <div className="rounded-xl border bg-card p-4 shadow-sm border-amber-500/20 col-span-2 sm:col-span-1">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Fee Collection</span>
            <p className="text-2xl font-bold text-foreground mt-1">₹{data.selectedMeeting.totalCollection}</p>
            <span className="text-xs text-muted-foreground">
              {data.selectedMeeting.paidCash} Cash • Std ₹{data.selectedMeeting.standardFee}
            </span>
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="rounded-xl border bg-card p-4 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search attendee by name, firm, or email..."
            value={searchMember}
            onChange={(e) => setSearchMember(e.target.value)}
            className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-1.5 text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-1.5 text-xs font-semibold"
          >
            <option value="all">All Attendees</option>
            <option value="ABSENT">Absent / Unmarked (Top)</option>
            <option value="PRESENT">Present (Marked)</option>
            <option value="UPI">UPI Paid</option>
            <option value="CASH">Cash Paid</option>
            <option value="SCREENSHOT">With Receipt Screenshot</option>
          </select>
        </div>
      </div>

      {/* Attendee Roster Table */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="py-3 px-4 w-12 text-center">Status</th>
                <th className="py-3 px-4">Attendee / Firm</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Payment & Fee</th>
                <th className="py-3 px-4">Proof / Receipt</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    Loading attendance roster...
                  </td>
                </tr>
              ) : filteredAttendances.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    No attendees match your criteria.
                  </td>
                </tr>
              ) : (
                filteredAttendances.map((attendee: any) => {
                  const isPresent = attendee.status === "PRESENT" || attendee.paid;
                  const isUpdating = updatingId === attendee.id;

                  return (
                    <tr
                      key={attendee.id}
                      className={`hover:bg-muted/30 transition-colors ${
                        isPresent ? "bg-emerald-500/[0.02]" : "bg-background"
                      }`}
                    >
                      {/* Checkbox / Present Toggle */}
                      <td className="py-3 px-4 text-center">
                        <button
                          disabled={isUpdating}
                          onClick={() => handleToggleAttendance(attendee, !isPresent, "UPI")}
                          className={`h-6 w-6 rounded-md border flex items-center justify-center transition-all ${
                            isPresent
                              ? "bg-emerald-600 border-emerald-600 text-white"
                              : "border-muted-foreground/40 hover:border-emerald-600"
                          }`}
                        >
                          {isPresent && <Check className="h-4 w-4 stroke-[3]" />}
                        </button>
                      </td>

                      {/* Attendee Info */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-foreground flex items-center gap-2">
                          <span>{attendee.memberName}</span>
                          {attendee.isVisitor && (
                            <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-500 border border-blue-500/20">
                              VISITOR
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">{attendee.businessName}</div>
                      </td>

                      {/* Attendee Category */}
                      <td className="py-3 px-4 text-xs font-medium text-muted-foreground">
                        {attendee.isVisitor ? "Guest Visitor" : "Chapter Member"}
                      </td>

                      {/* Payment Status Badge */}
                      <td className="py-3 px-4">
                        {attendee.paid ? (
                          <div className="flex items-center gap-1.5">
                            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-600 border border-emerald-500/20">
                              <ShieldCheck className="h-3.5 w-3.5" />
                              {attendee.paymentMethod === "CASH" ? "Cash ₹" : "UPI Paid ₹"}
                              {attendee.amount}
                            </span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-md bg-rose-500/10 px-2 py-1 text-xs font-semibold text-rose-600 border border-rose-500/20">
                            Unpaid (₹{data?.selectedMeeting?.standardFee})
                          </span>
                        )}
                      </td>

                      {/* Proof / Receipt Screenshot */}
                      <td className="py-3 px-4">
                        {attendee.screenshotUrl ? (
                          <button
                            onClick={() =>
                              setPreviewScreenshot({
                                url: attendee.screenshotUrl,
                                name: attendee.memberName,
                                utr: attendee.utr || "N/A",
                                amount: attendee.amount,
                                time: attendee.checkInTime || "Just now",
                              })
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 px-2.5 py-1 text-xs font-semibold text-purple-600 hover:bg-purple-500/20 transition-all"
                          >
                            <Eye className="h-3.5 w-3.5" /> View Receipt
                          </button>
                        ) : attendee.utr ? (
                          <span className="text-xs font-mono text-muted-foreground">UTR: {attendee.utr}</span>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">No upload</span>
                        )}
                      </td>

                      {/* Quick Action Buttons */}
                      <td className="py-3 px-4 text-right space-x-1.5">
                        <button
                          onClick={() => setQrAttendee(attendee)}
                          className="rounded-lg border border-input bg-card px-2.5 py-1.5 text-xs font-semibold hover:bg-accent text-foreground inline-flex items-center gap-1 shadow-sm"
                        >
                          <QrCode className="h-3.5 w-3.5 text-purple-600" /> Show QR
                        </button>

                        <button
                          disabled={isUpdating}
                          onClick={() => handleToggleAttendance(attendee, true, "CASH")}
                          className="rounded-lg border border-emerald-600/30 bg-emerald-500/10 px-2.5 py-1.5 text-xs font-bold text-emerald-600 hover:bg-emerald-500/20 inline-flex items-center gap-1 shadow-sm"
                        >
                          <IndianRupee className="h-3.5 w-3.5" /> CASH
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Embedded Dynamic UPI QR Modal */}
      {qrAttendee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-sm rounded-2xl border bg-card p-6 shadow-2xl space-y-4 text-center animate-in fade-in zoom-in duration-150">
            <button
              onClick={() => setQrAttendee(null)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground hover:bg-muted"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-1">
              <span className="rounded-full bg-purple-500/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-purple-600 border border-purple-500/30">
                Direct UPI Collection
              </span>
              <h3 className="text-lg font-bold text-foreground pt-1">{qrAttendee.memberName}</h3>
              <p className="text-xs text-muted-foreground">{qrAttendee.businessName}</p>
            </div>

            {/* QR Code Container with Auto-Blur when Paid */}
            <div className="relative mx-auto flex items-center justify-center p-2">
              <div className={qrAttendee.paid ? "filter blur-sm opacity-40 transition-all duration-300" : ""}>
                <QRCodeSvg value={getUpiUri(qrAttendee)} size={210} />
              </div>

              {/* Lock Badge Overlay on Payment Confirmation */}
              {qrAttendee.paid && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <div className="rounded-full bg-emerald-600 p-3 text-white shadow-xl">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <span className="rounded-full bg-emerald-950/80 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/40 shadow-lg">
                    Fee Paid & Attendance Recorded
                  </span>
                </div>
              )}
            </div>

            <div className="bg-muted/40 rounded-xl p-3 text-xs space-y-1 text-left">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Standard Fee:</span>
                <span className="font-bold text-foreground">₹{data?.selectedMeeting?.standardFee || 800}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">VPA:</span>
                <span className="font-mono text-foreground font-semibold">{data?.selectedMeeting?.upiId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payee:</span>
                <span className="text-foreground">{data?.selectedMeeting?.upiName}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              {!qrAttendee.paid ? (
                <button
                  onClick={() => {
                    handleToggleAttendance(qrAttendee, true, "UPI");
                    setQrAttendee((prev: any) => ({ ...prev, paid: true, status: "PRESENT" }));
                  }}
                  className="w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-md flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="h-4 w-4" /> Confirm & Mark Present
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleToggleAttendance(qrAttendee, false);
                    setQrAttendee((prev: any) => ({ ...prev, paid: false, status: "ABSENT" }));
                  }}
                  className="w-full rounded-xl border border-rose-500/40 bg-rose-500/10 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-500/20"
                >
                  Undo / Unlock QR
                </button>
              )}
            </div>
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
                Uploaded by {previewScreenshot.name} • Recorded at {previewScreenshot.time}
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

      {/* Quick Add Visitor Modal */}
      {isVisitorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg rounded-2xl border bg-card p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150">
            <button
              onClick={() => setIsVisitorModalOpen(false)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground hover:bg-muted"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <h3 className="text-lg font-bold text-foreground">Quick Add Guest Visitor</h3>
              <p className="text-xs text-muted-foreground">
                Register a visitor for today's meeting. They will appear immediately on the attendance roster.
              </p>
            </div>

            <form onSubmit={handleAddVisitorSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">First Name *</label>
                  <input
                    type="text"
                    required
                    value={visitorForm.firstName}
                    onChange={(e) => setVisitorForm({ ...visitorForm, firstName: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Last Name</label>
                  <input
                    type="text"
                    value={visitorForm.lastName}
                    onChange={(e) => setVisitorForm({ ...visitorForm, lastName: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Email *</label>
                  <input
                    type="email"
                    required
                    value={visitorForm.email}
                    onChange={(e) => setVisitorForm({ ...visitorForm, email: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Phone</label>
                  <input
                    type="tel"
                    value={visitorForm.phone}
                    onChange={(e) => setVisitorForm({ ...visitorForm, phone: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Company / Firm</label>
                  <input
                    type="text"
                    value={visitorForm.company}
                    onChange={(e) => setVisitorForm({ ...visitorForm, company: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Industry / Category</label>
                  <input
                    type="text"
                    value={visitorForm.industry}
                    onChange={(e) => setVisitorForm({ ...visitorForm, industry: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">Invited By (Member)</label>
                <select
                  value={visitorForm.invitedByMemberId}
                  onChange={(e) => setVisitorForm({ ...visitorForm, invitedByMemberId: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm mt-1"
                >
                  <option value="">Direct Lead / Walk-in</option>
                  {(data?.attendances || [])
                    .filter((a: any) => !a.isVisitor)
                    .map((m: any) => (
                      <option key={m.memberId} value={m.memberId}>
                        {m.memberName} ({m.businessName})
                      </option>
                    ))}
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsVisitorModalOpen(false)}
                  className="rounded-lg border border-input bg-background px-4 py-2 text-xs font-semibold hover:bg-accent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={visitorSubmitting}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  {visitorSubmitting ? "Adding..." : "Add to Roster"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
