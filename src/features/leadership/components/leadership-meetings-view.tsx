"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Plus,
  CheckCircle2,
  XCircle,
  FileText,
  UserCheck,
  CalendarCheck,
  Sparkles,
  Lock,
  Search,
  IndianRupee,
  Check,
  X,
  CreditCard,
  QrCode,
  AlertCircle,
  Settings2,
  CalendarDays,
  Repeat,
  Edit3,
  Trash2,
  Sliders,
  UserPlus,
  RotateCcw,
  Eye,
  ShieldCheck,
} from "lucide-react";
import {
  getLeadershipContext,
  getLeadershipMeetings,
  createLeadershipMeeting,
  getLeadershipAttendance,
  markAttendance,
  addLeadershipVisitor,
  bookFeaturePresentation,
  updateChapterMeetingSettings,
  getSuggestedNextMeetingInfo,
  scheduleNextRegularMeeting,
  batchGenerateRegularMeetings,
  updateLeadershipMeeting,
  deleteLeadershipMeeting,
  LeadershipContext,
} from "../actions/leadership-actions";
import { LeadershipHeaderBar } from "./leadership-header-bar";
import { QRCodeSvg } from "@/components/QRCodeSvg";
import { playSuccessChime } from "@/lib/audio-chime";

export function LeadershipMeetingsView() {
  const [context, setContext] = useState<LeadershipContext | null>(null);
  const [meetings, setMeetings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Suggested next meeting info
  const [nextMeetingInfo, setNextMeetingInfo] = useState<any | null>(null);

  // Filter & Search
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "UPCOMING" | "PAST">("ALL");

  // Chapter Regular Day Settings Modal
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsForm, setSettingsForm] = useState({
    meetingDay: "Sunday",
    meetingTime: "07:30 AM",
    meetingLocation: "Business Suites Executive Room",
    meetingFee: 800,
  });
  const [settingsSubmitting, setSettingsSubmitting] = useState(false);

  // Schedule Regular Meet Modal
  const [isRegularMeetOpen, setIsRegularMeetOpen] = useState(false);
  const [regularForm, setRegularForm] = useState({
    title: "",
    date: "",
    location: "",
    meetingType: "HYBRID",
    speaker: "",
    theme: "Weekly Referral & Business Exchange",
    agenda: "1. Welcome & Coffee\n2. President's Address\n3. 45-Second Member Introductions\n4. Feature Presentation\n5. Referral & Business Exchange\n6. Visitor Acknowledgement",
  });
  const [regularSubmitting, setRegularSubmitting] = useState(false);
  const [batchCount, setBatchCount] = useState(4);
  const [batchSubmitting, setBatchSubmitting] = useState(false);

  // Edit Existing Meeting Modal
  const [editingMeeting, setEditingMeeting] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    date: "",
    location: "",
    meetingType: "HYBRID",
    speaker: "",
    theme: "",
    agenda: "",
  });
  const [editSubmitting, setEditSubmitting] = useState(false);

  // Feature Presentation booking modal
  const [selectedMeetingForSpeaker, setSelectedMeetingForSpeaker] = useState<any | null>(null);
  const [speakerForm, setSpeakerForm] = useState({ speaker: "", theme: "" });
  const [speakerSubmitting, setSpeakerSubmitting] = useState(false);

  // URL search params
  const searchParams = useSearchParams();
  const initialMeetingId = searchParams.get("meetingId");

  // Embedded Attendance & Fee Collection Modal State
  const [activeAttendanceMeeting, setActiveAttendanceMeeting] = useState<any | null>(null);
  const [attendanceData, setAttendanceData] = useState<any | null>(null);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [attendanceSearch, setAttendanceSearch] = useState("");
  const [attendanceStatusFilter, setAttendanceStatusFilter] = useState("all");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // QR Modals
  const [isChapterQrOpen, setIsChapterQrOpen] = useState(false);
  const [qrAttendee, setQrAttendee] = useState<any | null>(null);

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

  const loadData = async () => {
    setLoading(true);
    try {
      const ctx = await getLeadershipContext();
      setContext(ctx);
      setSettingsForm({
        meetingDay: ctx.meetingDay || "Sunday",
        meetingTime: ctx.meetingTime || "07:30 AM",
        meetingLocation: ctx.location || "Business Suites Executive Room",
        meetingFee: ctx.meetingFee || 800,
      });

      const [data, nextInfo] = await Promise.all([
        getLeadershipMeetings(ctx.chapterId),
        getSuggestedNextMeetingInfo(ctx.chapterId),
      ]);
      setMeetings(data);
      setNextMeetingInfo(nextInfo);

      if (initialMeetingId) {
        const found = data.find((m) => m.id === initialMeetingId);
        if (found) {
          handleOpenAttendance(found);
        }
      }

      setRegularForm({
        title: nextInfo.suggestedTitle,
        date: nextInfo.nextDate,
        location: nextInfo.meetingLocation,
        meetingType: "HYBRID",
        speaker: "",
        theme: "Weekly Referral & Business Exchange",
        agenda: "1. Welcome & Coffee\n2. President's Address\n3. 45-Second Member Introductions\n4. Feature Presentation\n5. Referral & Business Exchange\n6. Visitor Acknowledgement",
      });
    } catch (err) {
      console.error("Failed to load meetings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!context) return;
    setSettingsSubmitting(true);
    try {
      await updateChapterMeetingSettings({
        chapterId: context.chapterId,
        meetingDay: settingsForm.meetingDay,
        meetingTime: settingsForm.meetingTime,
        meetingLocation: settingsForm.meetingLocation,
        meetingFee: Number(settingsForm.meetingFee),
      });
      setIsSettingsOpen(false);
      await loadData();
    } catch (err) {
      console.error("Failed to update regular meeting settings", err);
    } finally {
      setSettingsSubmitting(false);
    }
  };

  const handleScheduleRegularSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!context || !regularForm.title || !regularForm.date) return;
    setRegularSubmitting(true);
    try {
      await scheduleNextRegularMeeting({
        chapterId: context.chapterId,
        title: regularForm.title,
        date: regularForm.date,
        location: regularForm.location,
        meetingType: regularForm.meetingType,
        speaker: regularForm.speaker,
        theme: regularForm.theme,
        agenda: regularForm.agenda,
      });
      setIsRegularMeetOpen(false);
      await loadData();
    } catch (err) {
      console.error("Failed to schedule regular meeting", err);
    } finally {
      setRegularSubmitting(false);
    }
  };

  const handleBatchGenerate = async () => {
    if (!context) return;
    setBatchSubmitting(true);
    try {
      await batchGenerateRegularMeetings(context.chapterId, Number(batchCount));
      setIsRegularMeetOpen(false);
      await loadData();
    } catch (err) {
      console.error("Failed to batch generate meetings", err);
    } finally {
      setBatchSubmitting(false);
    }
  };

  const handleOpenEdit = (m: any) => {
    setEditingMeeting(m);
    setEditForm({
      title: m.title,
      date: new Date(m.rawDate).toISOString().split("T")[0],
      location: m.location || "Business Suites Executive Room",
      meetingType: m.meetingType || "HYBRID",
      speaker: m.speaker || "",
      theme: m.theme || "",
      agenda: m.agenda || "",
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMeeting) return;
    setEditSubmitting(true);
    try {
      await updateLeadershipMeeting({
        meetingId: editingMeeting.id,
        title: editForm.title,
        date: editForm.date,
        location: editForm.location,
        meetingType: editForm.meetingType,
        speaker: editForm.speaker,
        theme: editForm.theme,
        agenda: editForm.agenda,
      });
      setEditingMeeting(null);
      await loadData();
    } catch (err) {
      console.error("Failed to update meeting", err);
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDeleteMeeting = async (meetingId: string) => {
    if (!window.confirm("Are you sure you want to delete this scheduled meeting?")) return;
    try {
      await deleteLeadershipMeeting(meetingId);
      await loadData();
    } catch (err) {
      console.error("Failed to delete meeting", err);
    }
  };

  const handleOpenAttendance = async (meeting: any) => {
    if (!context) return;
    setActiveAttendanceMeeting(meeting);
    setAttendanceLoading(true);
    setAttendanceStatusFilter("all");
    setAttendanceSearch("");
    try {
      const att = await getLeadershipAttendance(context.chapterId, meeting.id);
      setAttendanceData(att);
    } catch (err) {
      console.error("Failed to load attendance", err);
    } finally {
      setAttendanceLoading(false);
    }
  };

  const getUpiUri = (attendee?: any) => {
    const rawPa = attendanceData?.selectedMeeting?.upiId || context?.upiId || "120040530420@cnrb";
    const pa = rawPa.trim();
    const pn = encodeURIComponent(attendanceData?.selectedMeeting?.upiName || context?.upiName || "Chapter Treasury");
    const rawFee = attendee?.amount || attendanceData?.selectedMeeting?.standardFee || activeAttendanceMeeting?.meetingFee || context?.meetingFee || 800;
    const feeNum = Number(rawFee);
    const am = !isNaN(feeNum) && feeNum > 0 ? feeNum.toFixed(2) : "800.00";
    const safeId = (attendee?.id || "").replace(/[^a-zA-Z0-9]/g, "").slice(0, 10) || "ATT";
    const tr = `ATT${safeId.toUpperCase()}`;
    const desc = attendee ? `Meeting Fee - ${attendee.memberName}` : `Meeting Fee - ${activeAttendanceMeeting?.title || "Session"}`;
    const tn = encodeURIComponent(desc.trim());
    return `upi://pay?pa=${pa}&pn=${pn}&am=${am}&tr=${tr}&tn=${tn}&cu=INR`;
  };

  const handleToggleAttendance = async (item: any, isPresent: boolean, method: string = "UPI") => {
    if (!activeAttendanceMeeting || !context) return;
    setActionLoadingId(item.id);
    const feeAmount = activeAttendanceMeeting.meetingFee || attendanceData?.selectedMeeting?.standardFee || 800;

    // Optimistically update local attendanceData in modal
    setAttendanceData((prev: any) => {
      if (!prev) return prev;
      const updated = prev.attendances.map((a: any) =>
        a.id === item.id
          ? {
              ...a,
              status: isPresent ? "PRESENT" : "ABSENT",
              paid: isPresent,
              paymentMethod: isPresent ? method : null,
              amount: isPresent ? feeAmount : null,
            }
          : a
      );
      const present = updated.filter((a: any) => a.status === "PRESENT" || a.paid).length;
      const absent = updated.length - present;
      const totalCollection = updated
        .filter((a: any) => a.paid)
        .reduce((sum: number, a: any) => sum + (Number(a.amount) || feeAmount), 0);
      return {
        ...prev,
        attendances: updated,
        selectedMeeting: {
          ...prev.selectedMeeting,
          present,
          absent,
          totalCollection,
          attendanceRate: updated.length > 0 ? Math.round((present / updated.length) * 100) : 0,
        },
      };
    });

    try {
      await markAttendance({
        memberId: item.memberId,
        meetingId: activeAttendanceMeeting.id,
        checked: isPresent,
        paymentMethod: method,
        amount: feeAmount,
      });

      if (isPresent) {
        playSuccessChime();
      }

      // Background update outer meetings list stats
      getLeadershipMeetings(context.chapterId).then(setMeetings).catch(console.error);
    } catch (err) {
      console.error("Failed to update attendance and fee", err);
      // Revert if error
      const att = await getLeadershipAttendance(context.chapterId, activeAttendanceMeeting.id);
      setAttendanceData(att);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleAddVisitorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!context || !activeAttendanceMeeting || !visitorForm.firstName || !visitorForm.email) return;
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
        visitDate: new Date(activeAttendanceMeeting.rawDate || Date.now()),
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

      const att = await getLeadershipAttendance(context.chapterId, activeAttendanceMeeting.id);
      setAttendanceData(att);
      const data = await getLeadershipMeetings(context.chapterId);
      setMeetings(data);
    } catch (err) {
      console.error("Failed to add visitor", err);
      alert("Failed to add visitor. Please check inputs.");
    } finally {
      setVisitorSubmitting(false);
    }
  };

  const handleSpeakerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMeetingForSpeaker || !speakerForm.speaker) return;
    setSpeakerSubmitting(true);
    try {
      await bookFeaturePresentation({
        meetingId: selectedMeetingForSpeaker.id,
        speaker: speakerForm.speaker,
        theme: speakerForm.theme,
      });
      setSelectedMeetingForSpeaker(null);
      await loadData();
    } catch (err) {
      console.error("Failed to book presentation", err);
    } finally {
      setSpeakerSubmitting(false);
    }
  };

  const nowMidnight = new Date().setHours(0, 0, 0, 0);

  const filteredMeetings = meetings.filter((m) => {
    const meetingMidnight = new Date(m.rawDate).setHours(0, 0, 0, 0);
    const isUpcoming = meetingMidnight >= nowMidnight;

    if (filterType === "UPCOMING" && !isUpcoming) return false;
    if (filterType === "PAST" && isUpcoming) return false;

    if (!search) return true;
    const q = search.toLowerCase();
    return (
      m.title.toLowerCase().includes(q) ||
      m.location.toLowerCase().includes(q) ||
      (m.speaker && m.speaker.toLowerCase().includes(q)) ||
      m.date.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {context && <LeadershipHeaderBar context={context} />}

      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            Chapter Meetings & Regular Schedule
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Manage recurring weekly regular meetings, sequential week titles, presenter slots, and attendance.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Change Regular Meeting Day / Settings Button */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl border border-border bg-card text-foreground font-semibold text-xs sm:text-sm hover:bg-muted transition-colors shadow-2xs cursor-pointer"
          >
            <Settings2 className="h-4 w-4 text-primary" />
            <span>Regular Day: <strong className="text-primary">{context?.meetingDay || "Sunday"}</strong></span>
          </button>

          {/* Schedule Next Regular Meeting Button */}
          <button
            onClick={() => {
              if (nextMeetingInfo) {
                setRegularForm({
                  title: nextMeetingInfo.suggestedTitle,
                  date: nextMeetingInfo.nextDate,
                  location: nextMeetingInfo.meetingLocation,
                  meetingType: "HYBRID",
                  speaker: "",
                  theme: "Weekly Referral & Business Exchange",
                  agenda: "1. Welcome & Coffee\n2. President's Address\n3. 45-Second Member Introductions\n4. Feature Presentation\n5. Referral & Business Exchange\n6. Visitor Acknowledgement",
                });
              }
              setIsRegularMeetOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs sm:text-sm hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Schedule Regular Meet ({nextMeetingInfo?.suggestedTitle || "Next Week"})</span>
          </button>
        </div>
      </div>

      {/* Recurring Schedule Info Card */}
      <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
            <CalendarDays className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Chapter Meeting Cycle
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-extrabold bg-primary/10 text-primary">
                Every {context?.meetingDay || "Sunday"} at {context?.meetingTime || "07:30 AM"}
              </span>
            </div>
            <p className="text-sm font-bold text-foreground mt-0.5">
              Next suggested: <span className="text-primary">{nextMeetingInfo?.suggestedTitle}</span> on{" "}
              <span className="text-foreground">{nextMeetingInfo?.nextDateFormatted}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="text-xs font-bold text-primary hover:underline px-3 py-1.5 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors"
          >
            Change Day or Time &rarr;
          </button>
        </div>
      </div>

      {/* Search & Status Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card border border-border p-3 rounded-xl">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search meetings by week number, date, title, or presenter..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-background border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-muted/60 p-1 rounded-lg">
          <button
            onClick={() => setFilterType("ALL")}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              filterType === "ALL" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All Meetings ({meetings.length})
          </button>
          <button
            onClick={() => setFilterType("UPCOMING")}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              filterType === "UPCOMING" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilterType("PAST")}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              filterType === "PAST" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Past Sessions
          </button>
        </div>
      </div>

      {/* Meetings List - Full-Width Bar Cards */}
      {loading ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center text-muted-foreground animate-pulse">
          Loading chapter meetings...
        </div>
      ) : filteredMeetings.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center text-muted-foreground">
          No chapter meetings found matching your filter criteria.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMeetings.map((m) => {
            const meetingMidnight = new Date(m.rawDate).setHours(0, 0, 0, 0);
            const isFuture = meetingMidnight > nowMidnight;
            const isToday = meetingMidnight === nowMidnight;

            return (
              <div
                key={m.id}
                className="bg-card border border-border rounded-xl p-4 shadow-xs hover:border-primary/40 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                {/* Left: Date Badge & Core Details */}
                <div className="flex items-start md:items-center gap-4 min-w-[280px]">
                  <div
                    className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl border text-center shrink-0 ${
                      isToday
                        ? "bg-primary text-primary-foreground border-primary"
                        : isFuture
                        ? "bg-muted/60 text-foreground border-border"
                        : "bg-muted/30 text-muted-foreground border-border"
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      {new Date(m.rawDate).toLocaleDateString("en-IN", { month: "short" })}
                    </span>
                    <span className="text-lg font-extrabold leading-none">
                      {new Date(m.rawDate).getDate()}
                    </span>
                    <span className="text-[9px] opacity-80">
                      {new Date(m.rawDate).toLocaleDateString("en-IN", { weekday: "short" })}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-sm sm:text-base text-foreground">{m.title}</h3>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase">
                        {m.meetingType}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{context?.meetingTime || "07:30 AM"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="truncate max-w-[200px]">{m.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Middle: Feature Presenter Showcase */}
                <div className="flex items-center gap-3 bg-muted/30 border border-border/60 rounded-lg px-3 py-2 min-w-[240px]">
                  <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-medium text-muted-foreground">Feature Presenter</div>
                    <div className="text-xs font-bold text-foreground truncate">
                      {m.speaker || "Slot Open"}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedMeetingForSpeaker(m);
                      setSpeakerForm({ speaker: m.speaker || "", theme: m.theme || "" });
                    }}
                    className="text-[11px] font-semibold text-primary hover:underline shrink-0 cursor-pointer"
                  >
                    {m.speaker ? "Change" : "Book Slot"}
                  </button>
                </div>

                {/* Right: Actions & Attendance / Meeting Fees Access */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-border">
                  <div className="flex items-center gap-1.5 flex-wrap text-xs">
                    <span className="font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      ₹{m.meetingFee || 800} Fee
                    </span>
                    <span className="font-semibold px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                      {m.presentCount || 0} Present
                    </span>
                    <span className="font-semibold px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border">
                      {m.paidCount || 0} Paid (₹{(m.collectedAmount || 0).toLocaleString("en-IN")})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Edit Meeting Button */}
                    <button
                      onClick={() => handleOpenEdit(m)}
                      className="p-2 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                      title="Edit meeting day, date, venue, or title"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>

                    {/* Delete Future Meeting Button */}
                    {isFuture && (
                      <button
                        onClick={() => handleDeleteMeeting(m.id)}
                        className="p-2 rounded-lg border border-border bg-card text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                        title="Delete scheduled meeting"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}

                    {/* Meeting Fees & Attendance Button */}
                    <button
                      onClick={() => handleOpenAttendance(m)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-xs cursor-pointer active:scale-95"
                    >
                      <IndianRupee className="h-4 w-4" />
                      <span>Meeting Fees & Attendance</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Chapter Regular Meeting Day Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-xs p-4">
          <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Settings2 className="h-5 w-5 text-primary" />
                <h3 className="text-base font-bold text-foreground">Configure Chapter Regular Meeting Day</h3>
              </div>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-muted-foreground">
              Select which day of the week your chapter holds its regular weekly business exchange. Future meetings will default to this recurring day.
            </p>

            <form onSubmit={handleUpdateSettings} className="space-y-4">
              {/* Day Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Recurring Meeting Day *</label>
                <select
                  value={settingsForm.meetingDay}
                  onChange={(e) => setSettingsForm({ ...settingsForm, meetingDay: e.target.value })}
                  className="w-full border border-input rounded-xl bg-background px-3 py-2 text-sm font-semibold focus:ring-2 focus:ring-primary outline-hidden"
                >
                  <option value="Sunday">Sunday (Every Sunday)</option>
                  <option value="Monday">Monday (Every Monday)</option>
                  <option value="Tuesday">Tuesday (Every Tuesday)</option>
                  <option value="Wednesday">Wednesday (Every Wednesday)</option>
                  <option value="Thursday">Thursday (Every Thursday)</option>
                  <option value="Friday">Friday (Every Friday)</option>
                  <option value="Saturday">Saturday (Every Saturday)</option>
                </select>
              </div>

              {/* Time */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Regular Meeting Time *</label>
                <input
                  type="text"
                  placeholder="e.g. 07:30 AM"
                  value={settingsForm.meetingTime}
                  onChange={(e) => setSettingsForm({ ...settingsForm, meetingTime: e.target.value })}
                  className="w-full border border-input rounded-xl bg-background px-3 py-2 text-sm font-semibold focus:ring-2 focus:ring-primary outline-hidden"
                />
              </div>

              {/* Venue */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Default Venue / Location</label>
                <input
                  type="text"
                  placeholder="e.g. Hotel Grand Conference Suite"
                  value={settingsForm.meetingLocation}
                  onChange={(e) => setSettingsForm({ ...settingsForm, meetingLocation: e.target.value })}
                  className="w-full border border-input rounded-xl bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-hidden"
                />
              </div>

              {/* Fee */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Meeting Attendance Fee (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={settingsForm.meetingFee}
                  onChange={(e) => setSettingsForm({ ...settingsForm, meetingFee: Number(e.target.value) })}
                  className="w-full border border-input rounded-xl bg-background px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-primary outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border text-muted-foreground hover:bg-muted text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={settingsSubmitting}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 disabled:opacity-50 cursor-pointer"
                >
                  {settingsSubmitting ? "Saving..." : "Save Regular Day"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Regular Meeting Modal */}
      {isRegularMeetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-xs p-4">
          <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <CalendarCheck className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="text-lg font-bold text-foreground">Schedule Regular Chapter Meeting</h3>
                  <p className="text-xs text-muted-foreground">Sequential week naming: 20th Week, 21st Week, etc.</p>
                </div>
              </div>
              <button
                onClick={() => setIsRegularMeetOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Quick Batch Generation Option */}
            <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                  <Repeat className="h-4 w-4" />
                  <span>Fast Batch Schedule (Auto-Sequenced)</span>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={batchCount}
                    onChange={(e) => setBatchCount(Number(e.target.value))}
                    className="border border-input rounded-lg bg-background px-2 py-1 text-xs font-bold"
                  >
                    <option value={4}>Next 4 Weeks</option>
                    <option value={8}>Next 8 Weeks</option>
                    <option value={12}>Next 12 Weeks</option>
                  </select>
                  <button
                    type="button"
                    disabled={batchSubmitting}
                    onClick={handleBatchGenerate}
                    className="px-3 py-1 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 disabled:opacity-50 cursor-pointer"
                  >
                    {batchSubmitting ? "Generating..." : "Batch Generate"}
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Automatically creates consecutive weekly meetings on every {context?.meetingDay || "Sunday"} with titles like 21st Week Meeting, 22nd Week Meeting, etc.
              </p>
            </div>

            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider pt-2 border-t">
              Or Schedule Single Meeting:
            </div>

            <form onSubmit={handleScheduleRegularSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-foreground">Meeting Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 23rd Week Meeting"
                  value={regularForm.title}
                  onChange={(e) => setRegularForm({ ...regularForm, title: e.target.value })}
                  className="w-full mt-1 px-3.5 py-2 rounded-xl bg-background border border-input text-foreground text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-foreground">Meeting Date *</label>
                  <input
                    type="date"
                    required
                    value={regularForm.date}
                    onChange={(e) => setRegularForm({ ...regularForm, date: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-background border border-input text-foreground text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground">Format</label>
                  <select
                    value={regularForm.meetingType}
                    onChange={(e) => setRegularForm({ ...regularForm, meetingType: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-background border border-input text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="HYBRID">Hybrid (In-Person + Online)</option>
                    <option value="IN_PERSON">In-Person Only</option>
                    <option value="ONLINE">Online Virtual</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground">Venue / Meeting Location</label>
                <input
                  type="text"
                  value={regularForm.location}
                  onChange={(e) => setRegularForm({ ...regularForm, location: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-foreground">Feature Presenter (Optional)</label>
                  <input
                    type="text"
                    placeholder="Member Name"
                    value={regularForm.speaker}
                    onChange={(e) => setRegularForm({ ...regularForm, speaker: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground">Session Topic</label>
                  <input
                    type="text"
                    placeholder="e.g. Industrial Automation"
                    value={regularForm.theme}
                    onChange={(e) => setRegularForm({ ...regularForm, theme: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsRegularMeetOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border text-muted-foreground hover:bg-muted text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={regularSubmitting}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 disabled:opacity-50 cursor-pointer"
                >
                  {regularSubmitting ? "Scheduling..." : "Schedule Meeting"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Existing Meeting Modal */}
      {editingMeeting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-xs p-4">
          <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-bold text-foreground">Edit Meeting Date & Details</h3>
              </div>
              <button
                onClick={() => setEditingMeeting(null)}
                className="text-muted-foreground hover:text-foreground text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-foreground">Meeting Title *</label>
                <input
                  type="text"
                  required
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full mt-1 px-3.5 py-2 rounded-xl bg-background border border-input text-foreground text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-foreground">Meeting Date *</label>
                  <input
                    type="date"
                    required
                    value={editForm.date}
                    onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-background border border-input text-foreground text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground">Format</label>
                  <select
                    value={editForm.meetingType}
                    onChange={(e) => setEditForm({ ...editForm, meetingType: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-background border border-input text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="HYBRID">Hybrid (In-Person + Online)</option>
                    <option value="IN_PERSON">In-Person Only</option>
                    <option value="ONLINE">Online Virtual</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground">Venue / Location</label>
                <input
                  type="text"
                  value={editForm.location}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-foreground">Keynote Presenter</label>
                  <input
                    type="text"
                    value={editForm.speaker}
                    onChange={(e) => setEditForm({ ...editForm, speaker: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground">Topic / Theme</label>
                  <input
                    type="text"
                    value={editForm.theme}
                    onChange={(e) => setEditForm({ ...editForm, theme: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setEditingMeeting(null)}
                  className="px-4 py-2 rounded-xl border border-border text-muted-foreground hover:bg-muted text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editSubmitting}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 disabled:opacity-50 cursor-pointer"
                >
                  {editSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Embedded Attendance & Payment Management Modal */}
      {activeAttendanceMeeting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-xs p-3 sm:p-6">
          <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 border-b border-border flex items-center justify-between bg-muted/20 gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 shrink-0">
                  <CreditCard className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-bold text-foreground truncate">{activeAttendanceMeeting.title}</h3>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      Standard Fee: ₹{activeAttendanceMeeting.meetingFee || 800}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {activeAttendanceMeeting.date} • Venue: {activeAttendanceMeeting.location}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsChapterQrOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 text-xs font-bold transition-colors cursor-pointer"
                  title="Display UPI QR code for members to scan"
                >
                  <QrCode className="h-4 w-4" />
                  <span className="hidden sm:inline">Chapter Fee QR</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsVisitorModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 text-xs font-bold transition-opacity cursor-pointer shadow-xs"
                >
                  <UserPlus className="h-4 w-4" />
                  <span className="hidden sm:inline">+ Add Visitor</span>
                </button>
                <button
                  onClick={() => {
                    setActiveAttendanceMeeting(null);
                    setAttendanceData(null);
                  }}
                  className="text-muted-foreground hover:text-foreground text-sm p-1.5 rounded-lg hover:bg-muted cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Attendance Statistics Summary */}
            {attendanceData?.selectedMeeting && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-muted/40 border-b border-border">
                <div className="bg-card border border-border rounded-lg p-2.5">
                  <div className="text-[11px] font-medium text-muted-foreground">Total Expected</div>
                  <div className="text-xl font-extrabold text-foreground mt-0.5">
                    {attendanceData.selectedMeeting.total}
                  </div>
                </div>
                <div className="bg-card border border-border rounded-lg p-2.5">
                  <div className="text-[11px] font-medium text-muted-foreground">Collections Realized</div>
                  <div className="text-xl font-extrabold text-primary mt-0.5">
                    ₹{attendanceData.selectedMeeting.totalCollection.toLocaleString("en-IN")}
                  </div>
                </div>
                <div className="bg-card border border-border rounded-lg p-2.5">
                  <div className="text-[11px] font-medium text-muted-foreground">Present Attendees</div>
                  <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {attendanceData.selectedMeeting.present}
                  </div>
                </div>
                <div className="bg-card border border-border rounded-lg p-2.5">
                  <div className="text-[11px] font-medium text-muted-foreground">Fee Pending / Absent</div>
                  <div className="text-xl font-extrabold text-amber-500 mt-0.5">
                    {attendanceData.selectedMeeting.absent}
                  </div>
                </div>
              </div>
            )}

            {/* Search & Status Filter Bar */}
            <div className="p-3 border-b border-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-muted/10">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Filter roster by member, visitor, or company..."
                  value={attendanceSearch}
                  onChange={(e) => setAttendanceSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-background border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setAttendanceStatusFilter("all")}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    attendanceStatusFilter === "all" ? "bg-primary text-primary-foreground font-bold" : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  All ({attendanceData?.attendances?.length || 0})
                </button>
                <button
                  type="button"
                  onClick={() => setAttendanceStatusFilter("PENDING")}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    attendanceStatusFilter === "PENDING" ? "bg-amber-500 text-white font-bold" : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  Fee Pending ({attendanceData?.attendances?.filter((a: any) => !a.paid).length || 0})
                </button>
                <button
                  type="button"
                  onClick={() => setAttendanceStatusFilter("PAID")}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    attendanceStatusFilter === "PAID" ? "bg-emerald-600 text-white font-bold" : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  Paid ({attendanceData?.attendances?.filter((a: any) => a.paid).length || 0})
                </button>
                <button
                  type="button"
                  onClick={() => setAttendanceStatusFilter("VISITOR")}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    attendanceStatusFilter === "VISITOR" ? "bg-indigo-600 text-white font-bold" : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  Visitors ({attendanceData?.attendances?.filter((a: any) => a.isVisitor).length || 0})
                </button>
              </div>
            </div>

            {/* Attendance Roster Table */}
            <div className="flex-1 overflow-y-auto p-4">
              {attendanceLoading ? (
                <div className="py-12 text-center text-muted-foreground text-sm">
                  Loading attendance roster...
                </div>
              ) : !attendanceData || attendanceData.attendances.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground text-sm">
                  No attendance records found for this meeting session.
                </div>
              ) : (
                <div className="divide-y divide-border border border-border rounded-xl overflow-hidden">
                  {attendanceData.attendances
                    .filter((a: any) => {
                      const matchesSearch =
                        !attendanceSearch ||
                        a.memberName.toLowerCase().includes(attendanceSearch.toLowerCase()) ||
                        a.businessName.toLowerCase().includes(attendanceSearch.toLowerCase());
                      if (!matchesSearch) return false;
                      if (attendanceStatusFilter === "PENDING") return !a.paid;
                      if (attendanceStatusFilter === "PAID") return !!a.paid;
                      if (attendanceStatusFilter === "VISITOR") return !!a.isVisitor;
                      return true;
                    })
                    .map((item: any) => {
                      const isPresent = item.status === "PRESENT" || item.paid;
                      const isWorking = actionLoadingId === item.id;

                      return (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3.5 hover:bg-muted/30 transition-colors gap-3"
                        >
                          {/* Attendee info */}
                          <div className="min-w-[200px] flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-foreground">{item.memberName}</span>
                              {item.isVisitor && (
                                <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
                                  Guest Visitor
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">{item.businessName}</div>
                          </div>

                          {/* Payment status badge */}
                          <div className="hidden sm:flex items-center gap-1.5 text-xs">
                            {item.paid ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-semibold border border-emerald-500/20">
                                <Check className="h-3 w-3" /> Paid ₹{item.amount} ({item.paymentMethod || "UPI"})
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 font-semibold border border-amber-500/20">
                                Pending Fee
                              </span>
                            )}
                          </div>

                          {/* Quick Action Toggles */}
                          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                            {isPresent ? (
                              <div className="flex items-center gap-1.5">
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                                  <CheckCircle2 className="h-3.5 w-3.5" /> Present & Paid
                                </span>
                                <button
                                  type="button"
                                  disabled={isWorking}
                                  onClick={() => handleToggleAttendance(item, false)}
                                  className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
                                  title="Mark Absent & Reset Fee"
                                >
                                  <RotateCcw className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  disabled={isWorking}
                                  onClick={() => handleToggleAttendance(item, true, "UPI")}
                                  className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1 shadow-xs cursor-pointer disabled:opacity-50"
                                >
                                  <IndianRupee className="h-3.5 w-3.5" /> Collect UPI
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setQrAttendee(item)}
                                  className="p-1.5 rounded-lg border border-border bg-card text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                                  title="Show UPI QR Code for this member"
                                >
                                  <QrCode className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  disabled={isWorking}
                                  onClick={() => handleToggleAttendance(item, true, "CASH")}
                                  className="px-2.5 py-1.5 rounded-lg border border-border bg-card text-foreground text-xs font-semibold hover:bg-muted transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                                >
                                  <CreditCard className="h-3.5 w-3.5" /> Cash
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-border flex items-center justify-between bg-muted/20">
              <span className="text-xs text-muted-foreground">
                Marking fee automatically updates attendance status to Present in real-time.
              </span>
              <button
                onClick={() => {
                  setActiveAttendanceMeeting(null);
                  setAttendanceData(null);
                }}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold cursor-pointer hover:opacity-90"
              >
                Close Sheet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chapter Overall Fee QR Code Modal */}
      {isChapterQrOpen && activeAttendanceMeeting && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-background/80 backdrop-blur-xs p-4">
          <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-4 text-center">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2">
                <QrCode className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-sm text-foreground">Scan Chapter Meeting Fee QR</h3>
              </div>
              <button
                onClick={() => setIsChapterQrOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-muted-foreground">
              {activeAttendanceMeeting.title}
            </div>

            <div className="flex justify-center p-3 bg-white rounded-2xl border shadow-xs">
              <QRCodeSvg
                value={getUpiUri()}
                size={220}
              />
            </div>

            <div className="space-y-1">
              <div className="text-2xl font-black text-emerald-600">
                ₹{activeAttendanceMeeting.meetingFee || 800}
              </div>
              <p className="text-xs font-medium text-muted-foreground">
                Scan with any UPI app (Google Pay, PhonePe, Paytm, BHIM)
              </p>
              <div className="text-[11px] font-mono text-muted-foreground bg-muted p-1.5 rounded-lg">
                {attendanceData?.selectedMeeting?.upiId || context?.upiId || "120040530420@cnrb"}
              </div>
            </div>

            <button
              onClick={() => setIsChapterQrOpen(false)}
              className="w-full py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Member-Specific Fee QR Code Modal */}
      {qrAttendee && activeAttendanceMeeting && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-background/80 backdrop-blur-xs p-4">
          <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-4 text-center">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2">
                <QrCode className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-sm text-foreground">Pay Meeting Fee</h3>
              </div>
              <button
                onClick={() => setQrAttendee(null)}
                className="text-muted-foreground hover:text-foreground text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div>
              <h4 className="font-bold text-base text-foreground">{qrAttendee.memberName}</h4>
              <p className="text-xs text-muted-foreground">{qrAttendee.businessName}</p>
            </div>

            <div className="flex justify-center p-3 bg-white rounded-2xl border shadow-xs">
              <QRCodeSvg
                value={getUpiUri(qrAttendee)}
                size={220}
              />
            </div>

            <div className="space-y-1">
              <div className="text-2xl font-black text-emerald-600">
                ₹{qrAttendee.amount || activeAttendanceMeeting.meetingFee || 800}
              </div>
              <p className="text-xs font-medium text-muted-foreground">
                Scan with any UPI app to pay
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  handleToggleAttendance(qrAttendee, true, "UPI");
                  setQrAttendee(null);
                }}
                className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                Mark as Paid Now
              </button>
              <button
                type="button"
                onClick={() => setQrAttendee(null)}
                className="px-4 py-2 rounded-xl border border-border text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Add Visitor Modal */}
      {isVisitorModalOpen && activeAttendanceMeeting && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-background/80 backdrop-blur-xs p-4">
          <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="text-base font-bold text-foreground">Add Guest Visitor to Meeting</h3>
                  <p className="text-xs text-muted-foreground">{activeAttendanceMeeting.title}</p>
                </div>
              </div>
              <button
                onClick={() => setIsVisitorModalOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddVisitorSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-foreground">First Name *</label>
                  <input
                    type="text"
                    required
                    value={visitorForm.firstName}
                    onChange={(e) => setVisitorForm({ ...visitorForm, firstName: e.target.value })}
                    className="w-full mt-1 px-3 py-1.5 rounded-lg bg-background border border-input text-foreground text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground">Last Name</label>
                  <input
                    type="text"
                    value={visitorForm.lastName}
                    onChange={(e) => setVisitorForm({ ...visitorForm, lastName: e.target.value })}
                    className="w-full mt-1 px-3 py-1.5 rounded-lg bg-background border border-input text-foreground text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground">Email Address *</label>
                <input
                  type="email"
                  required
                  value={visitorForm.email}
                  onChange={(e) => setVisitorForm({ ...visitorForm, email: e.target.value })}
                  className="w-full mt-1 px-3 py-1.5 rounded-lg bg-background border border-input text-foreground text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-foreground">Phone Number</label>
                  <input
                    type="tel"
                    value={visitorForm.phone}
                    onChange={(e) => setVisitorForm({ ...visitorForm, phone: e.target.value })}
                    className="w-full mt-1 px-3 py-1.5 rounded-lg bg-background border border-input text-foreground text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground">Company / Enterprise</label>
                  <input
                    type="text"
                    value={visitorForm.company}
                    onChange={(e) => setVisitorForm({ ...visitorForm, company: e.target.value })}
                    className="w-full mt-1 px-3 py-1.5 rounded-lg bg-background border border-input text-foreground text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground">Invited By Member (Optional)</label>
                <select
                  value={visitorForm.invitedByMemberId}
                  onChange={(e) => setVisitorForm({ ...visitorForm, invitedByMemberId: e.target.value })}
                  className="w-full mt-1 px-3 py-1.5 rounded-lg bg-background border border-input text-foreground text-xs"
                >
                  <option value="">Direct Visitor (No Inviter)</option>
                  {(attendanceData?.attendances || [])
                    .filter((a: any) => !a.isVisitor)
                    .map((m: any) => (
                      <option key={m.memberId} value={m.memberId}>
                        {m.memberName}
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsVisitorModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border text-muted-foreground hover:bg-muted text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={visitorSubmitting}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 disabled:opacity-50 cursor-pointer"
                >
                  {visitorSubmitting ? "Adding..." : "Add Visitor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Feature Presentation Slot Booking Modal */}
      {selectedMeetingForSpeaker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-xs p-4">
          <div className="bg-card border border-border rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                <h3 className="text-base font-bold text-foreground">Book Feature Presenter</h3>
              </div>
              <button
                onClick={() => setSelectedMeetingForSpeaker(null)}
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-muted-foreground bg-muted/40 p-3 rounded-lg">
              Meeting Date: <strong className="text-foreground">{selectedMeetingForSpeaker.date}</strong>
            </div>

            <form onSubmit={handleSpeakerSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Presenter / Member Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={speakerForm.speaker}
                  onChange={(e) => setSpeakerForm({ ...speakerForm, speaker: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Presentation Topic / Business Theme</label>
                <input
                  type="text"
                  placeholder="e.g. Commercial Real Estate Trends & Opportunities"
                  value={speakerForm.theme}
                  onChange={(e) => setSpeakerForm({ ...speakerForm, theme: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setSelectedMeetingForSpeaker(null)}
                  className="px-4 py-2 rounded-lg border border-border text-muted-foreground hover:bg-muted text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={speakerSubmitting}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-50 cursor-pointer"
                >
                  {speakerSubmitting ? "Saving..." : "Confirm Slot"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
