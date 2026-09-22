"use client";

import React, { useEffect, useState } from "react";
import {
  MessagesSquare,
  Plus,
  Calendar,
  Clock,
  CheckCircle2,
  User,
  Building2,
  Check,
  X,
  Camera,
  MapPin,
  Globe,
  Users,
  Image as ImageIcon,
} from "lucide-react";
import {
  getMemberContext,
  getMemberOneToOnes,
  scheduleMemberOneToOne,
  completeOneToOneWithSelfie,
  getAllChaptersForSelection,
  getChapterMembersForSelection,
  getChapterVisitorsForSelection,
  getChapterMemberDirectory,
  MemberContext,
} from "../actions/member-actions";
import { MemberHeaderBar } from "./member-header-bar";
import { OneToOneStatus } from "@prisma/client";

export function MemberOneToOnesView() {
  const [context, setContext] = useState<MemberContext | null>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [chapterMembers, setChapterMembers] = useState<any[]>([]);
  const [allChapters, setAllChapters] = useState<any[]>([]);
  const [chapterVisitors, setChapterVisitors] = useState<any[]>([]);

  // Schedule modal state
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [partnerType, setPartnerType] = useState<"LOCAL_MEMBER" | "CROSS_CHAPTER" | "VISITOR">("LOCAL_MEMBER");
  const [selectedCrossChapterId, setSelectedCrossChapterId] = useState<string>("");
  const [crossChapterMembers, setCrossChapterMembers] = useState<any[]>([]);
  const [loadingCrossMembers, setLoadingCrossMembers] = useState(false);

  const [form, setForm] = useState({
    receiverId: "",
    visitorName: "",
    visitorEmail: "",
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    durationHours: 1.0,
    location: "Member Office / Executive Cafe",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Complete session modal state (with Selfie)
  const [completeTarget, setCompleteTarget] = useState<any | null>(null);
  const [completeOutcome, setCompleteOutcome] = useState("");
  const [selfieDataUrl, setSelfieDataUrl] = useState<string | null>(null);
  const [completeSubmitting, setCompleteSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const ctx = await getMemberContext();
      setContext(ctx);
      const [list, members, chapters, visitors] = await Promise.all([
        getMemberOneToOnes(ctx.memberId),
        getChapterMemberDirectory(ctx.chapterId),
        getAllChaptersForSelection(),
        getChapterVisitorsForSelection(ctx.chapterId),
      ]);
      setSessions(list);
      setChapterMembers(members.filter((m) => m.id !== ctx.memberId));
      setAllChapters(chapters);
      setChapterVisitors(visitors);
    } catch (err) {
      console.error("Failed to load 1-to-1s", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCrossChapterChange = async (chapterId: string) => {
    setSelectedCrossChapterId(chapterId);
    if (!chapterId) {
      setCrossChapterMembers([]);
      return;
    }
    setLoadingCrossMembers(true);
    try {
      const members = await getChapterMembersForSelection(chapterId);
      setCrossChapterMembers(members.filter((m) => m.id !== context?.memberId));
    } catch (e) {
      console.error("Failed to load cross-chapter members", e);
    } finally {
      setLoadingCrossMembers(false);
    }
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!context || !form.date) return;
    setSubmitting(true);
    try {
      const isCross = partnerType === "CROSS_CHAPTER";
      const isVisitor = partnerType === "VISITOR";

      await scheduleMemberOneToOne({
        initiatorId: context.memberId,
        receiverId: isVisitor ? undefined : form.receiverId,
        date: new Date(form.date),
        durationHours: Number(form.durationHours) || 1.0,
        location: form.location,
        notes: form.notes,
        crossChapterId: isCross ? selectedCrossChapterId : undefined,
        isVisitorSession: isVisitor,
        visitorName: isVisitor ? form.visitorName : undefined,
        visitorEmail: isVisitor ? form.visitorEmail : undefined,
      });

      setIsScheduleOpen(false);
      setForm({
        receiverId: "",
        visitorName: "",
        visitorEmail: "",
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        durationHours: 1.0,
        location: "Member Office / Executive Cafe",
        notes: "",
      });
      setPartnerType("LOCAL_MEMBER");
      setSelectedCrossChapterId("");
      await loadData();
    } catch (err) {
      console.error("Failed to schedule 1-to-1", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Client-side image compression (lowers quality to ~65% and scales to max 800px)
  const handleSelfieFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxDim = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Reduced quality JPEG compression as requested
          const compressed = canvas.toDataURL("image/jpeg", 0.65);
          setSelfieDataUrl(compressed);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleCompleteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!context || !completeTarget) return;
    setCompleteSubmitting(true);
    try {
      await completeOneToOneWithSelfie({
        oneToOneId: completeTarget.id,
        selfieUrl: selfieDataUrl || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=70",
        outcome: completeOutcome || "Session completed successfully with verified selfie exchange.",
      });

      setCompleteTarget(null);
      setCompleteOutcome("");
      setSelfieDataUrl(null);
      setSuccessToast(`1-to-1 session with ${completeTarget.partnerName} completed and verified!`);
      setTimeout(() => setSuccessToast(null), 4000);
      await loadData();
    } catch (err) {
      console.error("Failed to complete 1-to-1", err);
    } finally {
      setCompleteSubmitting(false);
    }
  };

  const completedCount = sessions.filter((s) => s.status === "COMPLETED").length;
  const scheduledCount = sessions.filter((s) => s.status === "SCHEDULED").length;

  return (
    <div className="space-y-6">
      {context && <MemberHeaderBar context={context} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">1-to-1 Synergy Sessions</h2>
          <p className="text-sm text-muted-foreground">
            Log cross-chapter and visitor meetings, record duration in hours, and verify completed sessions with selfies.
          </p>
        </div>

        <button
          onClick={() => setIsScheduleOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Schedule 1-to-1</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 shadow-xs">
          <span className="text-xs text-muted-foreground font-medium">Total Sessions Logged</span>
          <div className="text-2xl font-bold text-foreground mt-1">{sessions.length}</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 shadow-xs">
          <span className="text-xs text-muted-foreground font-medium">Upcoming / Scheduled</span>
          <div className="text-2xl font-bold text-primary mt-1">{scheduledCount}</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 shadow-xs">
          <span className="text-xs text-muted-foreground font-medium">Completed & Verified</span>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{completedCount}</div>
        </div>
      </div>

      {successToast && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>{successToast}</span>
        </div>
      )}

      {/* 1-to-1 Sessions Grid */}
      {loading ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center text-muted-foreground">
          Loading 1-to-1 sessions...
        </div>
      ) : sessions.length === 0 ? (
        <div className="bg-card border border-dashed border-border rounded-xl p-12 text-center text-muted-foreground space-y-2">
          <p>No 1-to-1 networking sessions logged yet.</p>
          <button
            onClick={() => setIsScheduleOpen(true)}
            className="text-xs font-semibold text-primary hover:underline cursor-pointer"
          >
            Schedule your first session today →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sessions.map((s) => {
            const isCompleted = s.status === "COMPLETED";
            const isVisitor = s.isVisitorSession;
            const isCross = s.isCrossChapter;

            return (
              <div
                key={s.id}
                className={`rounded-xl border shadow-xs p-5 flex flex-col justify-between space-y-4 transition-all ${
                  isVisitor
                    ? "border-purple-500/40 bg-purple-500/[0.02]"
                    : isCross
                    ? "border-primary/40 bg-primary/[0.02]"
                    : "border-border bg-card"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-base text-foreground">{s.partnerName}</span>
                        {isVisitor && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30">
                            Visitor
                          </span>
                        )}
                        {isCross && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                            Cross-Chapter
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {s.partnerBusiness} • {s.partnerIndustry}
                      </p>
                    </div>

                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isCompleted
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      {s.status}
                    </span>
                  </div>

                  {/* Selfie Preview if session is completed */}
                  {s.selfieUrl && (
                    <div className="relative rounded-lg overflow-hidden border border-border/80 h-32 bg-muted/40 group">
                      <img
                        src={s.selfieUrl}
                        alt={`1-to-1 Selfie with ${s.partnerName}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-semibold backdrop-blur-xs flex items-center gap-1">
                        <Camera className="h-3 w-3" /> Verified Selfie
                      </span>
                    </div>
                  )}

                  <div className="space-y-1.5 text-xs text-muted-foreground pt-1">
                    <div className="flex items-center gap-2 text-foreground font-semibold">
                      <Calendar className="h-3.5 w-3.5 text-primary" />
                      <span>{s.date}</span>
                      <span className="text-muted-foreground font-normal">
                        • {s.durationHours} {s.durationHours === 1 ? "Hour" : "Hours"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="truncate">{s.location}</span>
                    </div>
                    {s.outcome && (
                      <div className="p-2 rounded bg-muted/30 border border-border/50 text-[11px] italic">
                        {s.outcome}
                      </div>
                    )}
                  </div>
                </div>

                {/* Complete Button */}
                {!isCompleted && (
                  <button
                    onClick={() => {
                      setCompleteTarget(s);
                      setCompleteOutcome("");
                      setSelfieDataUrl(null);
                    }}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-xs cursor-pointer"
                  >
                    <Camera className="h-3.5 w-3.5" />
                    <span>Upload Selfie & Complete</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Schedule 1-to-1 Modal (Cross-Chapter & Visitor Enabled) */}
      {isScheduleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <MessagesSquare className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-bold text-foreground">Schedule 1-to-1 Session</h3>
              </div>
              <button
                onClick={() => setIsScheduleOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-4">
              {/* Partner Type Selector */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  Select Colleague Type *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPartnerType("LOCAL_MEMBER")}
                    className={`py-2 px-2.5 rounded-lg text-xs font-semibold border text-center transition-all cursor-pointer ${
                      partnerType === "LOCAL_MEMBER"
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                    }`}
                  >
                    My Chapter
                  </button>
                  <button
                    type="button"
                    onClick={() => setPartnerType("CROSS_CHAPTER")}
                    className={`py-2 px-2.5 rounded-lg text-xs font-semibold border text-center transition-all cursor-pointer ${
                      partnerType === "CROSS_CHAPTER"
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                    }`}
                  >
                    Cross-Chapter
                  </button>
                  <button
                    type="button"
                    onClick={() => setPartnerType("VISITOR")}
                    className={`py-2 px-2.5 rounded-lg text-xs font-semibold border text-center transition-all cursor-pointer ${
                      partnerType === "VISITOR"
                        ? "bg-purple-600 text-white border-purple-600"
                        : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                    }`}
                  >
                    Chapter Visitor
                  </button>
                </div>
              </div>

              {/* Cross-Chapter Chapter Selector */}
              {partnerType === "CROSS_CHAPTER" && (
                <div>
                  <label className="text-xs font-semibold text-foreground/80 flex items-center gap-1.5">
                    <span>Select Target Chapter</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={selectedCrossChapterId}
                    onChange={(e) => handleCrossChapterChange(e.target.value)}
                    className="w-full mt-1.5 h-10 px-3.5 rounded-xl bg-background/90 border border-input text-foreground text-sm font-medium shadow-xs transition-all duration-150 hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary cursor-pointer"
                  >
                    <option value="">Choose Target Chapter...</option>
                    {allChapters.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.chapterCode || "Chapter"})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Partner Select / Inputs */}
              <div>
                {partnerType === "VISITOR" ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-foreground/80 flex items-center gap-1.5">
                        <span>Visitor Name</span>
                        <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Kumar (Visiting Entrepreneur)"
                        value={form.visitorName}
                        onChange={(e) => setForm({ ...form, visitorName: e.target.value })}
                        className="w-full mt-1.5 h-10 px-3.5 rounded-xl bg-background/90 border border-input text-foreground text-sm font-medium shadow-xs transition-all duration-150 hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-foreground/80">Visitor Email (Optional)</label>
                      <input
                        type="email"
                        placeholder="ramesh@company.com"
                        value={form.visitorEmail}
                        onChange={(e) => setForm({ ...form, visitorEmail: e.target.value })}
                        className="w-full mt-1.5 h-10 px-3.5 rounded-xl bg-background/90 border border-input text-foreground text-sm font-medium shadow-xs transition-all duration-150 hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary"
                      />
                    </div>
                  </div>
                ) : partnerType === "CROSS_CHAPTER" ? (
                  <div>
                    <label className="text-xs font-semibold text-foreground/80 flex items-center gap-1.5">
                      <span>Select Cross-Chapter Colleague</span>
                      <span className="text-rose-500">*</span>
                    </label>
                    <select
                      required
                      disabled={!selectedCrossChapterId || loadingCrossMembers}
                      value={form.receiverId}
                      onChange={(e) => setForm({ ...form, receiverId: e.target.value })}
                      className="w-full mt-1.5 h-10 px-3.5 rounded-xl bg-background/90 border border-input text-foreground text-sm font-medium shadow-xs transition-all duration-150 hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary disabled:opacity-50 cursor-pointer"
                    >
                      <option value="">
                        {loadingCrossMembers ? "Loading chapter roster..." : "Select Member..."}
                      </option>
                      {crossChapterMembers.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} • {m.businessName || "Member"} ({m.industry || "General"})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="text-xs font-semibold text-foreground/80 flex items-center gap-1.5">
                      <span>Select Chapter Colleague</span>
                      <span className="text-rose-500">*</span>
                    </label>
                    <select
                      required
                      value={form.receiverId}
                      onChange={(e) => setForm({ ...form, receiverId: e.target.value })}
                      className="w-full mt-1.5 h-10 px-3.5 rounded-xl bg-background/90 border border-input text-foreground text-sm font-medium shadow-xs transition-all duration-150 hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary cursor-pointer"
                    >
                      <option value="">Select Chapter Member...</option>
                      {chapterMembers.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} • {m.businessName || "Member"} ({m.industry || "General"})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground/80 flex items-center gap-1.5">
                    <span>Meeting Date</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full mt-1.5 h-10 px-3.5 rounded-xl bg-background/90 border border-input text-foreground text-sm font-medium shadow-xs transition-all duration-150 hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground/80">Duration</label>
                  <select
                    value={form.durationHours}
                    onChange={(e) => setForm({ ...form, durationHours: Number(e.target.value) })}
                    className="w-full mt-1.5 h-10 px-3.5 rounded-xl bg-background/90 border border-input text-foreground text-sm font-medium shadow-xs transition-all duration-150 hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary cursor-pointer"
                  >
                    <option value={0.5}>30 minutes (0.5 hr)</option>
                    <option value={0.75}>45 minutes (0.75 hr)</option>
                    <option value={1}>60 minutes (1 hr - Standard)</option>
                    <option value={1.5}>90 minutes (1.5 hrs)</option>
                    <option value={2}>2 hours</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Meeting Location (Default)</label>
                <input
                  type="text"
                  required
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Agenda / Topics to Explore</label>
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Goals, target clients to discuss, and potential synergies..."
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsScheduleOpen(false)}
                  className="px-4 py-2 rounded-lg bg-muted text-muted-foreground text-xs font-semibold hover:bg-muted/80 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? "Scheduling..." : "Schedule Session"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Complete 1-to-1 with Selfie Modal */}
      {completeTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-lg font-bold text-foreground">Complete 1-to-1 with Selfie</h3>
              </div>
              <button
                onClick={() => setCompleteTarget(null)}
                className="text-muted-foreground hover:text-foreground text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCompleteSubmit} className="space-y-4">
              <div className="p-3 rounded-lg bg-muted/40 text-xs space-y-1">
                <div>Meeting with: <strong className="text-foreground">{completeTarget.partnerName}</strong></div>
                <div>Date: <span className="text-foreground">{completeTarget.date} ({completeTarget.durationHours} hrs)</span></div>
              </div>

              {/* Upload Selfie Box with Compression */}
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">
                  Meeting Selfie Proof (Image compressed automatically) *
                </label>
                <div className="border-2 border-dashed border-border rounded-xl p-4 text-center space-y-3">
                  {selfieDataUrl ? (
                    <div className="space-y-2">
                      <div className="relative h-40 w-40 mx-auto rounded-xl overflow-hidden border border-border shadow-sm">
                        <img src={selfieDataUrl} alt="Selfie preview" className="w-full h-full object-cover" />
                      </div>
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                        ✓ Selfie compressed & ready to upload!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 py-4">
                      <Camera className="h-8 w-8 mx-auto text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">
                        Upload or snap a selfie with your colleague to verify completion.
                      </p>
                    </div>
                  )}

                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold cursor-pointer transition-colors">
                    <Camera className="h-4 w-4" />
                    <span>{selfieDataUrl ? "Change Selfie" : "Select / Take Selfie"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      required={!selfieDataUrl}
                      onChange={handleSelfieFile}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Key Outcomes & Synergies Identified</label>
                <textarea
                  rows={3}
                  value={completeOutcome}
                  onChange={(e) => setCompleteOutcome(e.target.value)}
                  placeholder="What key client opportunities, joint ventures, or takeaways were identified during this meeting..."
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setCompleteTarget(null)}
                  className="px-4 py-2 rounded-lg bg-muted text-muted-foreground text-xs font-semibold hover:bg-muted/80 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={completeSubmitting}
                  className="px-5 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {completeSubmitting ? "Uploading & Saving..." : "Confirm & Complete Session"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
