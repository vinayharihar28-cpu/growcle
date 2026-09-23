"use client";

import React, { useEffect, useState } from "react";
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
} from "lucide-react";
import {
  getLeadershipContext,
  getLeadershipMeetings,
  createLeadershipMeeting,
  getLeadershipAttendance,
  markAttendance,
  bookFeaturePresentation,
  LeadershipContext,
} from "../actions/leadership-actions";
import { LeadershipHeaderBar } from "./leadership-header-bar";

export function LeadershipMeetingsView() {
  const [context, setContext] = useState<LeadershipContext | null>(null);
  const [meetings, setMeetings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "UPCOMING" | "PAST">("ALL");

  // Create meeting modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: "",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    location: "Business Suites Executive Room",
    meetingType: "HYBRID",
    speaker: "",
    theme: "",
    agenda: "1. Welcome & Networking\n2. President's Address\n3. 45-Second Member Introductions\n4. Feature Presentation\n5. Referral & Business Exchange\n6. Visitor Acknowledgement",
  });
  const [submitting, setSubmitting] = useState(false);

  // Feature Presentation booking modal
  const [selectedMeetingForSpeaker, setSelectedMeetingForSpeaker] = useState<any | null>(null);
  const [speakerForm, setSpeakerForm] = useState({ speaker: "", theme: "" });
  const [speakerSubmitting, setSpeakerSubmitting] = useState(false);

  // Embedded Attendance Modal
  const [activeAttendanceMeeting, setActiveAttendanceMeeting] = useState<any | null>(null);
  const [attendanceData, setAttendanceData] = useState<any | null>(null);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [attendanceSearch, setAttendanceSearch] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const ctx = await getLeadershipContext();
      setContext(ctx);
      const data = await getLeadershipMeetings(ctx.chapterId);
      setMeetings(data);
    } catch (err) {
      console.error("Failed to load meetings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!context || !createForm.title || !createForm.date) return;
    setSubmitting(true);
    try {
      await createLeadershipMeeting({
        chapterId: context.chapterId,
        title: createForm.title,
        date: new Date(createForm.date),
        location: createForm.location,
        meetingType: createForm.meetingType,
        speaker: createForm.speaker,
        theme: createForm.theme,
        agenda: createForm.agenda,
      });
      setIsCreateOpen(false);
      setCreateForm({
        title: "",
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        location: context.location || "Business Suites Executive Room",
        meetingType: "HYBRID",
        speaker: "",
        theme: "",
        agenda: "1. Welcome & Networking\n2. President's Address\n3. 45-Second Member Introductions\n4. Feature Presentation\n5. Referral & Business Exchange\n6. Visitor Acknowledgement",
      });
      await loadData();
    } catch (err) {
      console.error("Failed to schedule meeting", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenAttendance = async (meeting: any) => {
    if (!context) return;
    setActiveAttendanceMeeting(meeting);
    setAttendanceLoading(true);
    try {
      const att = await getLeadershipAttendance(context.chapterId, meeting.id);
      setAttendanceData(att);
    } catch (err) {
      console.error("Failed to load attendance", err);
    } finally {
      setAttendanceLoading(false);
    }
  };

  const handleToggleAttendance = async (item: any, isPresent: boolean, method: string = "UPI") => {
    if (!activeAttendanceMeeting) return;
    setActionLoadingId(item.id);
    try {
      await markAttendance({
        memberId: item.memberId,
        meetingId: activeAttendanceMeeting.id,
        checked: isPresent,
        paymentMethod: method,
      });
      if (context) {
        const att = await getLeadershipAttendance(context.chapterId, activeAttendanceMeeting.id);
        setAttendanceData(att);
      }
    } catch (err) {
      console.error("Failed to update attendance", err);
    } finally {
      setActionLoadingId(null);
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

      {/* Top Header & Scheduling Action */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Chapter Meetings & Attendance</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Full-view schedule, feature presenter bookings, and live meeting attendance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Schedule Chapter Meeting</span>
          </button>
        </div>
      </div>

      {/* Search & Status Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card border border-border p-3 rounded-xl">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search meetings by date, title, or presenter..."
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
        <div className="bg-card border border-border rounded-xl p-12 text-center text-muted-foreground">
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
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-foreground">{m.title}</h3>
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

                {/* Right: Actions & Attendance Access */}
                <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-border">
                  {isFuture ? (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-medium border border-border">
                      <Lock className="h-3.5 w-3.5 text-amber-500" />
                      <span>Opens 12:00 AM on meeting date</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleOpenAttendance(m)}
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-semibold transition-colors shadow-xs cursor-pointer"
                    >
                      <UserCheck className="h-4 w-4" />
                      <span>Open Attendance</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Embedded Attendance & Payment Management Modal */}
      {activeAttendanceMeeting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-3 sm:p-6">
          <div className="bg-card border border-border rounded-xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 border-b border-border flex items-center justify-between bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
                  <UserCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">{activeAttendanceMeeting.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {activeAttendanceMeeting.date} • Chapter Meeting Fee: ₹{activeAttendanceMeeting.meetingFee || 800}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveAttendanceMeeting(null);
                  setAttendanceData(null);
                }}
                className="text-muted-foreground hover:text-foreground text-sm p-1 cursor-pointer"
              >
                ✕
              </button>
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
                  <div className="text-[11px] font-medium text-muted-foreground">Present Attendees</div>
                  <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {attendanceData.selectedMeeting.present}
                  </div>
                </div>
                <div className="bg-card border border-border rounded-lg p-2.5">
                  <div className="text-[11px] font-medium text-muted-foreground">Absent Members</div>
                  <div className="text-xl font-extrabold text-amber-500 mt-0.5">
                    {attendanceData.selectedMeeting.absent}
                  </div>
                </div>
                <div className="bg-card border border-border rounded-lg p-2.5">
                  <div className="text-[11px] font-medium text-muted-foreground">Collections Realized</div>
                  <div className="text-xl font-extrabold text-primary mt-0.5">
                    ₹{attendanceData.selectedMeeting.totalCollection.toLocaleString("en-IN")}
                  </div>
                </div>
              </div>
            )}

            {/* Search Filter Inside Attendance */}
            <div className="p-3 border-b border-border flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Filter roster by member or visitor name..."
                  value={attendanceSearch}
                  onChange={(e) => setAttendanceSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-background border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
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
                    .filter((a: any) =>
                      !attendanceSearch ||
                      a.memberName.toLowerCase().includes(attendanceSearch.toLowerCase()) ||
                      a.businessName.toLowerCase().includes(attendanceSearch.toLowerCase())
                    )
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
                          <div className="flex items-center gap-2">
                            {isPresent ? (
                              <button
                                disabled={isWorking}
                                onClick={() => handleToggleAttendance(item, false)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold hover:bg-rose-500/10 hover:text-rose-600 hover:border-rose-500/30 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" /> Present / Paid
                              </button>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <button
                                  disabled={isWorking}
                                  onClick={() => handleToggleAttendance(item, true, "UPI")}
                                  className="px-2.5 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-1 shadow-xs cursor-pointer disabled:opacity-50"
                                >
                                  <QrCode className="h-3.5 w-3.5" /> UPI Pay
                                </button>
                                <button
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
            <div className="p-3 border-t border-border flex items-center justify-end bg-muted/20">
              <button
                onClick={() => {
                  setActiveAttendanceMeeting(null);
                  setAttendanceData(null);
                }}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold cursor-pointer hover:opacity-90"
              >
                Close Attendance Sheet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feature Presentation Slot Booking Modal */}
      {selectedMeetingForSpeaker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
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

      {/* Manual Schedule Meeting Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <CalendarCheck className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-bold text-foreground">Schedule Chapter Meeting</h3>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Meeting Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Weekly Business Exchange - Week 15"
                  value={createForm.title}
                  onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Meeting Date *</label>
                  <input
                    type="date"
                    required
                    value={createForm.date}
                    onChange={(e) => setCreateForm({ ...createForm, date: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Meeting Format</label>
                  <select
                    value={createForm.meetingType}
                    onChange={(e) => setCreateForm({ ...createForm, meetingType: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="HYBRID">Hybrid (In-Person + Online)</option>
                    <option value="IN_PERSON">In-Person Only</option>
                    <option value="ONLINE">Online Virtual</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Meeting Venue / Link</label>
                <input
                  type="text"
                  value={createForm.location}
                  onChange={(e) => setCreateForm({ ...createForm, location: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Keynote / Speaker</label>
                  <input
                    type="text"
                    placeholder="Member Name"
                    value={createForm.speaker}
                    onChange={(e) => setCreateForm({ ...createForm, speaker: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Session Theme</label>
                  <input
                    type="text"
                    placeholder="e.g. Scaling Cross-Border Logistics"
                    value={createForm.theme}
                    onChange={(e) => setCreateForm({ ...createForm, theme: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-lg border border-border text-muted-foreground hover:bg-muted text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? "Scheduling..." : "Schedule Meeting"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
