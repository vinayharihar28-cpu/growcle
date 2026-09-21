"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Plus,
  CheckCircle2,
  FileText,
  UserCheck,
  CalendarCheck,
  Sparkles,
} from "lucide-react";
import {
  getLeadershipContext,
  getLeadershipMeetings,
  createLeadershipMeeting,
  LeadershipContext,
} from "../actions/leadership-actions";
import { LeadershipHeaderBar } from "./leadership-header-bar";

export function LeadershipMeetingsView() {
  const [context, setContext] = useState<LeadershipContext | null>(null);
  const [meetings, setMeetings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Agenda modal
  const [selectedAgenda, setSelectedAgenda] = useState<any | null>(null);

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
        location: "Business Suites Executive Room",
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

  return (
    <div className="space-y-6">
      {context && <LeadershipHeaderBar context={context} />}

      {/* Header with Title and Create Meeting Action */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Chapter Meetings Schedule</h2>
          <p className="text-sm text-muted-foreground">
            Manage upcoming chapter sessions, feature presentations, and agenda run-sheets.
          </p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Schedule New Meeting</span>
        </button>
      </div>

      {/* Meetings List */}
      {loading ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center text-muted-foreground">
          Loading chapter meetings...
        </div>
      ) : meetings.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center text-muted-foreground">
          No meetings found for this chapter yet. Schedule one above!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {meetings.map((m) => (
            <div
              key={m.id}
              className="bg-card border border-border rounded-xl p-5 shadow-sm hover:border-primary/50 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase">
                      {m.meetingType}
                    </span>
                    <h3 className="font-bold text-base text-foreground mt-1">{m.title}</h3>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                      m.status === "SCHEDULED"
                        ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                        : m.status === "COMPLETED"
                        ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {m.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2 text-foreground font-medium">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>{m.date}</span>
                    <span className="text-muted-foreground">• {context?.meetingTime || "07:30 AM"}</span>
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

              <div className="flex items-center justify-between gap-2 pt-4 mt-4 border-t border-border">
                <button
                  onClick={() => setSelectedAgenda(m)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>View Agenda</span>
                </button>

                <Link
                  href={`/dashboard/leadership/attendance?meetingId=${m.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  <UserCheck className="h-3.5 w-3.5" />
                  <span>Take Attendance ({m.attendanceCount || 0})</span>
                </Link>
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
                Official Meeting Agenda & Run-sheet
              </h4>
              <div className="bg-muted/40 rounded-lg p-4 font-mono text-xs whitespace-pre-line text-foreground border border-border">
                {selectedAgenda.agenda}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-muted-foreground">
                Speaker: <strong className="text-foreground">{selectedAgenda.speaker || "None designated"}</strong>
              </span>
              <button
                onClick={() => setSelectedAgenda(null)}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Meeting Modal */}
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
                className="text-muted-foreground hover:text-foreground text-sm"
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
                  placeholder="e.g. Weekly Business Exchange - Week 14"
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

              <div>
                <label className="text-xs font-medium text-muted-foreground">Agenda / Run-sheet</label>
                <textarea
                  rows={4}
                  value={createForm.agenda}
                  onChange={(e) => setCreateForm({ ...createForm, agenda: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
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
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50"
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
