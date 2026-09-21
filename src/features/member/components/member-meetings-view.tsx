"use client";

import React, { useEffect, useState, useTransition } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  FileText,
  Sparkles,
  Users,
  Video,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import {
  getMemberContext,
  getMemberMeetings,
  recordSelfAttendance,
  getMeetingAttendees,
  MemberContext,
} from "../actions/member-actions";
import { MemberHeaderBar } from "./member-header-bar";

export function MemberMeetingsView() {
  const [context, setContext] = useState<MemberContext | null>(null);
  const [meetings, setMeetings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgenda, setSelectedAgenda] = useState<any | null>(null);
  const [checkingInId, setCheckingInId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Attendees modal
  const [selectedMeetingForAttendees, setSelectedMeetingForAttendees] = useState<any | null>(null);
  const [attendees, setAttendees] = useState<any[]>([]);
  const [loadingAttendees, setLoadingAttendees] = useState(false);

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

  return (
    <div className="space-y-6">
      {context && <MemberHeaderBar context={context} />}

      <div>
        <h2 className="text-xl font-bold text-foreground">Chapter Meetings Calendar</h2>
        <p className="text-sm text-muted-foreground">
          View upcoming weekly business exchanges, keynote speakers, agendas, and mark your attendance.
        </p>
      </div>

      {loading ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center text-muted-foreground">
          Loading chapter meetings...
        </div>
      ) : meetings.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center text-muted-foreground">
          No meetings found on schedule for {context?.chapterName}.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {meetings.map((m) => (
            <div
              key={m.id}
              className="bg-card border border-border rounded-xl p-5 shadow-sm hover:border-primary/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase">
                      {m.meetingType}
                    </span>
                    <h3 className="font-bold text-base text-foreground mt-1">{m.title}</h3>
                  </div>

                  {m.hasCheckedIn ? (
                    <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Checked In
                    </span>
                  ) : (
                    <button
                      disabled={checkingInId === m.id || isPending}
                      onClick={() => handleSelfCheckIn(m.id)}
                      className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>{checkingInId === m.id ? "Checking In..." : "Mark Present"}</span>
                    </button>
                  )}
                </div>

                <div className="space-y-1.5 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2 text-foreground font-semibold">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>{m.date}</span>
                    <span className="text-muted-foreground font-normal">• {context?.meetingTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{m.location}</span>
                  </div>
                  {m.speaker && (
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-amber-500" />
                      <span>Speaker: <strong className="text-foreground">{m.speaker}</strong></span>
                    </div>
                  )}
                  {m.theme && (
                    <div className="text-xs text-muted-foreground italic pl-6">
                      Theme: &ldquo;{m.theme}&rdquo;
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-border">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedAgenda(m)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span>Run-Sheet</span>
                  </button>

                  <button
                    onClick={() => handleOpenAttendees(m)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Users className="h-3.5 w-3.5 text-blue-500" />
                    <span>Attendees</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href="/dashboard/member/visitors"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground px-2 py-0.5 rounded-md hover:bg-muted/40 transition-colors"
                  >
                    <UserPlus className="h-3 w-3 text-primary" />
                    <span>Invite Guest</span>
                  </Link>
                  <span className="text-[11px] text-muted-foreground">
                    Status: <strong className="text-foreground">{m.myAttendanceStatus}</strong>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Agenda Detail Modal */}
      {selectedAgenda && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-base font-bold text-foreground">{selectedAgenda.title}</h3>
                <p className="text-xs text-muted-foreground">{selectedAgenda.date} • {selectedAgenda.location}</p>
              </div>
              <button
                onClick={() => setSelectedAgenda(null)}
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                ✕
              </button>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Official Session Run-Sheet
              </h4>
              <div className="bg-muted/40 rounded-lg p-4 font-mono text-xs whitespace-pre-line text-foreground border border-border">
                {selectedAgenda.agenda}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-muted-foreground">
                Speaker: <strong className="text-foreground">{selectedAgenda.speaker}</strong>
              </span>
              <button
                onClick={() => setSelectedAgenda(null)}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Attendees Modal */}
      {selectedMeetingForAttendees && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-base font-bold text-foreground">Session Attendance</h3>
                <p className="text-xs text-muted-foreground">{selectedMeetingForAttendees.title} • {selectedMeetingForAttendees.date}</p>
              </div>
              <button
                onClick={() => setSelectedMeetingForAttendees(null)}
                className="text-muted-foreground hover:text-foreground text-sm"
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
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold"
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
