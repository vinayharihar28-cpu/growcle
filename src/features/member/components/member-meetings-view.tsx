"use client";

import React, { useEffect, useState, useTransition } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  FileText,
  Lock,
  Users,
  Video,
  UserPlus,
  Sparkles,
  Search,
  Check,
  X,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import {
  getMemberContext,
  getMemberMeetings,
  recordSelfAttendance,
  getMeetingAttendees,
  bookMemberFeaturePresentation,
  MemberContext,
} from "../actions/member-actions";
import { MemberHeaderBar } from "./member-header-bar";
import { playSuccessChime } from "@/lib/audio-chime";

export function MemberMeetingsView() {
  const [context, setContext] = useState<MemberContext | null>(null);
  const [meetings, setMeetings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Agenda modal
  const [selectedAgenda, setSelectedAgenda] = useState<any | null>(null);

  // Attendees modal
  const [selectedMeetingForAttendees, setSelectedMeetingForAttendees] = useState<any | null>(null);
  const [attendees, setAttendees] = useState<any[]>([]);
  const [loadingAttendees, setLoadingAttendees] = useState(false);

  // Feature Presentation booking modal
  const [bookingMeeting, setBookingMeeting] = useState<any | null>(null);
  const [presentationTopic, setPresentationTopic] = useState("");
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState("");

  // Self Check-in
  const [checkingInId, setCheckingInId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const loadData = async () => {
    setLoading(true);
    try {
      const ctx = await getMemberContext();
      setContext(ctx);
      const list = await getMemberMeetings(ctx.chapterId, ctx.memberId);
      setMeetings(list);
    } catch (err) {
      console.error("Failed to load meetings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelfCheckIn = (meetingId: string) => {
    if (!context) return;
    setCheckingInId(meetingId);
    startTransition(async () => {
      try {
        await recordSelfAttendance(meetingId, context.memberId);
        playSuccessChime();
        setMeetings((prev) =>
          prev.map((m) =>
            m.id === meetingId
              ? { ...m, hasCheckedIn: true, myAttendanceStatus: "PRESENT" }
              : m
          )
        );
      } catch (err) {
        console.error("Self check-in failed", err);
      } finally {
        setCheckingInId(null);
      }
    });
  };

  const handleOpenAttendees = async (m: any) => {
    setSelectedMeetingForAttendees(m);
    setLoadingAttendees(true);
    try {
      const list = await getMeetingAttendees(m.id);
      setAttendees(list);
    } catch (err) {
      console.error("Failed to load attendees", err);
    } finally {
      setLoadingAttendees(false);
    }
  };

  const handleOpenBooking = (m: any) => {
    setBookingMeeting(m);
    setPresentationTopic(m.isMySlot ? m.theme : "");
    setBookingError("");
  };

  const handleBookPresentationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!context || !bookingMeeting || !presentationTopic.trim()) return;
    setBookingSubmitting(true);
    setBookingError("");
    try {
      await bookMemberFeaturePresentation({
        meetingId: bookingMeeting.id,
        memberId: context.memberId,
        topic: presentationTopic.trim(),
      });
      playSuccessChime();
      setBookingMeeting(null);
      await loadData();
    } catch (err: any) {
      setBookingError(err.message || "Failed to book feature presentation slot");
    } finally {
      setBookingSubmitting(false);
    }
  };

  const filteredMeetings = meetings.filter((m) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      m.title.toLowerCase().includes(q) ||
      m.location.toLowerCase().includes(q) ||
      m.speaker.toLowerCase().includes(q) ||
      m.theme.toLowerCase().includes(q) ||
      m.date.toLowerCase().includes(q)
    );
  });

  const nowTime = new Date().setHours(0, 0, 0, 0);

  return (
    <div className="space-y-6">
      {context && <MemberHeaderBar context={context} />}

      {/* Title & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Chapter Meetings Calendar</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            View upcoming business sessions, book feature presentations, and check in on meeting day.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search meetings or presenters..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-card border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Meetings List - Full-Width Bar Cards */}
      {loading ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center text-muted-foreground">
          Loading chapter meetings...
        </div>
      ) : filteredMeetings.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center text-muted-foreground">
          No meetings found on schedule for {context?.chapterName}.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMeetings.map((m) => {
            const meetingMidnight = new Date(m.rawDate).setHours(0, 0, 0, 0);
            const isFuture = meetingMidnight > nowTime;
            const isToday = meetingMidnight === nowTime;

            return (
              <div
                key={m.id}
                className="bg-card border border-border rounded-xl p-4 shadow-xs hover:border-primary/40 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                {/* Left: Date Badge & Title */}
                <div className="flex items-start sm:items-center gap-3.5 min-w-[280px]">
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
                      <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-primary/10 text-primary uppercase">
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
                        <span className="truncate max-w-[180px]">{m.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Middle: Feature Presentation Showcase & Booking */}
                <div className="flex items-center gap-3 bg-muted/30 border border-border/70 rounded-xl p-2.5 min-w-[260px] max-w-md flex-1">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500 shrink-0">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Feature Presentation
                      </span>
                      {m.isMySlot && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                          My Slot 🎤
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-bold text-foreground truncate mt-0.5">
                      {m.speaker}
                    </div>
                    {m.theme && m.speaker !== "Slot Open" && (
                      <div className="text-[11px] text-muted-foreground truncate">
                        &ldquo;{m.theme}&rdquo;
                      </div>
                    )}
                  </div>

                  {isFuture && (m.isGenericSlot || m.isMySlot) && (
                    <button
                      onClick={() => handleOpenBooking(m)}
                      className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold transition-colors shrink-0 cursor-pointer"
                    >
                      {m.isMySlot ? "Edit Topic" : "Book Slot"}
                    </button>
                  )}
                </div>

                {/* Right: Actions & Attendance Status */}
                <div className="flex items-center gap-2.5 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-border justify-between sm:justify-end">
                  <button
                    onClick={() => handleOpenAttendees(m)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-input bg-card text-foreground hover:bg-muted text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                  >
                    <Users className="h-3.5 w-3.5 text-blue-500" />
                    <span>Attendees</span>
                  </button>

                  <button
                    onClick={() => setSelectedAgenda(m)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-input bg-card text-foreground hover:bg-muted text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                  >
                    <FileText className="h-3.5 w-3.5 text-indigo-500" />
                    <span>Agenda</span>
                  </button>

                  {/* Attendance status / Check-In button */}
                  {m.hasCheckedIn ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/30">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Checked In
                    </span>
                  ) : isFuture ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-medium border border-border">
                      <Lock className="h-3 w-3 text-amber-500" /> Opens 12:00 AM
                    </span>
                  ) : (
                    <button
                      disabled={checkingInId === m.id || isPending}
                      onClick={() => handleSelfCheckIn(m.id)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>{checkingInId === m.id ? "Checking In..." : "Check In"}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Feature Presentation Slot Booking Modal */}
      {bookingMeeting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                <h3 className="text-base font-bold text-foreground">
                  {bookingMeeting.isMySlot ? "Update Feature Presentation" : "Reserve Feature Presentation Slot"}
                </h3>
              </div>
              <button
                onClick={() => setBookingMeeting(null)}
                className="text-muted-foreground hover:text-foreground text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-muted-foreground bg-muted/40 p-3 rounded-xl">
              <div>Meeting Date: <strong className="text-foreground">{bookingMeeting.date}</strong></div>
              <div>Chapter: <strong className="text-foreground">{context?.chapterName}</strong></div>
            </div>

            <form onSubmit={handleBookPresentationSubmit} className="space-y-4">
              {bookingError && (
                <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-600 text-xs font-semibold">
                  {bookingError}
                </div>
              )}

              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Presentation Topic / Showcase Theme *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Commercial Real Estate Structuring & Tax Benefits"
                  value={presentationTopic}
                  onChange={(e) => setPresentationTopic(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                />
                <span className="text-[11px] text-muted-foreground mt-1 block">
                  Give a 5-minute showcase of your core competency and dream referral target.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setBookingMeeting(null)}
                  className="px-4 py-2 rounded-lg border border-border text-muted-foreground hover:bg-muted text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingSubmitting}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  {bookingSubmitting ? "Reserving..." : "Confirm & Lock Slot"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Agenda Detail Modal */}
      {selectedAgenda && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-base font-bold text-foreground">{selectedAgenda.title}</h3>
                <p className="text-xs text-muted-foreground">{selectedAgenda.date} • {selectedAgenda.location}</p>
              </div>
              <button
                onClick={() => setSelectedAgenda(null)}
                className="text-muted-foreground hover:text-foreground text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Official Session Run-Sheet & Agenda
              </h4>
              <div className="bg-muted/40 rounded-xl p-4 font-mono text-xs whitespace-pre-line text-foreground border border-border">
                {selectedAgenda.agenda}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-muted-foreground">
                Presenter: <strong className="text-foreground">{selectedAgenda.speaker}</strong>
              </span>
              <button
                onClick={() => setSelectedAgenda(null)}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Attendees Modal */}
      {selectedMeetingForAttendees && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-base font-bold text-foreground">Session Attendance</h3>
                <p className="text-xs text-muted-foreground">{selectedMeetingForAttendees.title} • {selectedMeetingForAttendees.date}</p>
              </div>
              <button
                onClick={() => setSelectedMeetingForAttendees(null)}
                className="text-muted-foreground hover:text-foreground text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {loadingAttendees ? (
              <div className="p-8 text-center text-xs text-muted-foreground">Loading checked-in attendees...</div>
            ) : attendees.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground">
                No member attendance recorded yet for this session.
              </div>
            ) : (
              <div className="max-h-72 overflow-y-auto divide-y divide-border">
                {attendees.map((att) => (
                  <div key={att.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-semibold text-foreground">{att.name}</div>
                      <div className="text-muted-foreground">{att.businessName} ({att.industry})</div>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        {att.status}
                      </span>
                      {att.checkInTime && (
                        <div className="text-[10px] text-muted-foreground mt-0.5">{att.checkInTime}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedMeetingForAttendees(null)}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
