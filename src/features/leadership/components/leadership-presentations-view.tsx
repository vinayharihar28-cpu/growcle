"use client";

import React, { useEffect, useState } from "react";
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Users,
  Search,
  Plus,
  CheckCircle2,
  AlertCircle,
  Edit3,
  Trash2,
  Building2,
  UserCheck,
  Briefcase,
  Layers,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import {
  getLeadershipContext,
  getLeadershipMeetings,
  getLeadershipMembers,
  bookFeaturePresentation,
  LeadershipContext,
} from "../actions/leadership-actions";
import { LeadershipHeaderBar } from "./leadership-header-bar";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";

export function LeadershipPresentationsView() {
  const [context, setContext] = useState<LeadershipContext | null>(null);
  const [meetings, setMeetings] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "CONFIRMED" | "OPEN">("ALL");

  // Booking / Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMeetingId, setSelectedMeetingId] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [speakerName, setSpeakerName] = useState("");
  const [theme, setTheme] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const ctx = await getLeadershipContext();
      setContext(ctx);
      const [meets, mems] = await Promise.all([
        getLeadershipMeetings(ctx.chapterId),
        getLeadershipMembers(ctx.chapterId),
      ]);
      setMeetings(meets);
      setMembers(mems);
    } catch (err) {
      console.error("Failed to load feature presentations data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openBookModal = (meeting?: any) => {
    if (meeting) {
      setSelectedMeetingId(meeting.id);
      setSpeakerName(
        meeting.speaker && meeting.speaker !== "Featured Member" ? meeting.speaker : ""
      );
      setTheme(
        meeting.theme && meeting.theme !== "Networking Growth" ? meeting.theme : ""
      );

      // Try to find matching member
      const matchedMem = members.find(
        (m) =>
          m.name.toLowerCase() === (meeting.speaker || "").toLowerCase() ||
          meeting.speaker?.toLowerCase().includes(m.firstName.toLowerCase())
      );
      setSelectedMemberId(matchedMem ? matchedMem.id : "");
    } else {
      // Pick first upcoming meeting without confirmed speaker or just first upcoming
      const openMeeting = meetings.find(
        (m) =>
          !m.speaker ||
          m.speaker === "Featured Member" ||
          m.speaker === ""
      ) || meetings[0];
      setSelectedMeetingId(openMeeting ? openMeeting.id : "");
      setSelectedMemberId("");
      setSpeakerName("");
      setTheme("");
    }
    setIsModalOpen(true);
  };

  const handleMemberSelect = (memberId: string) => {
    setSelectedMemberId(memberId);
    if (!memberId) {
      setSpeakerName("");
      return;
    }
    const mem = members.find((m) => m.id === memberId);
    if (mem) {
      setSpeakerName(mem.name);
      if (!theme) {
        setTheme(`${mem.businessName} & ${mem.industry} Showcase`);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMeetingId || !speakerName.trim()) return;
    setSubmitting(true);
    try {
      await bookFeaturePresentation({
        meetingId: selectedMeetingId,
        speaker: speakerName.trim(),
        theme: theme.trim() || "Feature Presentation",
        memberId: selectedMemberId || undefined,
      });
      setIsModalOpen(false);
      setSuccessToast(`Feature presentation scheduled for ${speakerName}!`);
      setTimeout(() => setSuccessToast(null), 4000);
      await loadData();
    } catch (err) {
      console.error("Failed to schedule presentation", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClearSlot = async (meetingId: string) => {
    if (!window.confirm("Are you sure you want to clear this presentation slot?")) return;
    try {
      await bookFeaturePresentation({
        meetingId,
        speaker: "Featured Member",
        theme: "Networking Growth",
      });
      setSuccessToast("Presentation slot opened.");
      setTimeout(() => setSuccessToast(null), 3000);
      await loadData();
    } catch (err) {
      console.error("Failed to clear slot", err);
    }
  };

  // Filter meetings
  const filteredMeetings = meetings.filter((m) => {
    const hasSpeaker =
      m.speaker &&
      m.speaker !== "Featured Member" &&
      m.speaker.trim() !== "";

    if (filterType === "CONFIRMED" && !hasSpeaker) return false;
    if (filterType === "OPEN" && hasSpeaker) return false;

    if (!search) return true;
    const q = search.toLowerCase();
    return (
      m.title.toLowerCase().includes(q) ||
      m.date.toLowerCase().includes(q) ||
      (m.speaker && m.speaker.toLowerCase().includes(q)) ||
      (m.theme && m.theme.toLowerCase().includes(q))
    );
  });

  const confirmedCount = meetings.filter(
    (m) => m.speaker && m.speaker !== "Featured Member" && m.speaker.trim() !== ""
  ).length;
  const openCount = meetings.length - confirmedCount;

  // Next upcoming confirmed speaker
  const nextConfirmed = meetings.find(
    (m) => m.speaker && m.speaker !== "Featured Member" && m.speaker.trim() !== ""
  );

  return (
    <div className="space-y-6">
      {context && <LeadershipHeaderBar context={context} />}

      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Feature Presentations Hub
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Sparkles className="h-3 w-3" />
              Weekly 8-Min Spotlight
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Assign upcoming weekly feature presenter slots, select chapter members, and manage presentation topics.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/dashboard/leadership/meetings"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-input bg-card hover:bg-muted text-xs font-semibold text-foreground transition-colors"
          >
            <Calendar className="h-3.5 w-3.5 text-blue-500" />
            <span>Chapter Meetings Schedule</span>
          </Link>

          <button
            onClick={() => openBookModal()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-xs shadow-sm hover:opacity-90 transition-opacity cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Assign Presenter Slot</span>
          </button>
        </div>
      </div>

      {/* Success Toast */}
      {successToast && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Total Scheduled Sessions
            </span>
            <p className="text-2xl font-bold text-foreground mt-1">{meetings.length}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Weekly regular chapter slots</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Calendar className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Confirmed Presenters
            </span>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              {confirmedCount}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Slots with booked members</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <UserCheck className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Open / Unassigned Slots
            </span>
            <p className="text-2xl font-bold text-amber-500 mt-1">{openCount}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Need members to present</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Sparkles className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Featured Presenter Spotlight Banner (if upcoming confirmed) */}
      {nextConfirmed && (
        <div className="bg-gradient-to-r from-amber-500/10 via-card to-primary/10 border border-amber-500/20 rounded-2xl p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Next Featured Presenter ({nextConfirmed.date})
                </span>
                <h3 className="text-lg font-bold text-foreground mt-0.5">
                  {nextConfirmed.speaker}
                </h3>
                <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                  <span className="font-semibold text-foreground">{nextConfirmed.theme}</span>
                  <span>•</span>
                  <span>{nextConfirmed.title}</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => openBookModal(nextConfirmed)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/30 bg-card hover:bg-amber-500/10 text-xs font-semibold text-foreground transition-colors self-start sm:self-auto cursor-pointer"
            >
              <Edit3 className="h-3.5 w-3.5 text-amber-600" />
              <span>Edit Spotlight Topic</span>
            </button>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by member name, session, or topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-background border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-muted/60 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setFilterType("ALL")}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                filterType === "ALL"
                  ? "bg-card text-foreground shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All Slots ({meetings.length})
            </button>
            <button
              onClick={() => setFilterType("CONFIRMED")}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                filterType === "CONFIRMED"
                  ? "bg-card text-foreground shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Confirmed ({confirmedCount})
            </button>
            <button
              onClick={() => setFilterType("OPEN")}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                filterType === "OPEN"
                  ? "bg-card text-foreground shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Open ({openCount})
            </button>
          </div>
        </div>
      </div>

      {/* Presentations Schedule Table */}
      <div className="bg-card border border-border rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <h3 className="font-semibold text-sm text-foreground">
              Weekly Feature Presentations Roster
            </h3>
          </div>
          <span className="text-xs text-muted-foreground">
            {filteredMeetings.length} sessions listed
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-muted-foreground text-sm">
            Loading feature presentation schedule...
          </div>
        ) : filteredMeetings.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground text-sm space-y-2">
            <p>No feature presentations match your filter.</p>
            <button
              onClick={() => {
                setSearch("");
                setFilterType("ALL");
              }}
              className="text-xs text-primary font-semibold hover:underline"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="py-3 px-4">Session Date</th>
                  <th className="py-3 px-4">Meeting Title</th>
                  <th className="py-3 px-4">Featured Presenter</th>
                  <th className="py-3 px-4">Topic / Theme</th>
                  <th className="py-3 px-4">Slot Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredMeetings.map((m) => {
                  const isConfirmed =
                    m.speaker &&
                    m.speaker !== "Featured Member" &&
                    m.speaker.trim() !== "";

                  // Find member details if matched
                  const memberInfo = members.find(
                    (mem) =>
                      mem.name.toLowerCase() === (m.speaker || "").toLowerCase() ||
                      m.speaker?.toLowerCase().includes(mem.firstName.toLowerCase())
                  );

                  return (
                    <tr key={m.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-xs text-foreground flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-primary" />
                          <span>{m.date}</span>
                        </div>
                        <span className="text-[11px] text-muted-foreground">
                          {m.location}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-foreground text-xs">
                          {m.title}
                        </span>
                        <span className="block text-[11px] text-muted-foreground">
                          {m.meetingType || "HYBRID"} Session
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {isConfirmed ? (
                          <div className="flex items-center gap-2.5">
                            <Avatar className="h-8 w-8 rounded-full border border-primary/20 shrink-0">
                              <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                                {m.speaker ? m.speaker[0] : "P"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-bold text-xs text-foreground">{m.speaker}</p>
                              {memberInfo ? (
                                <p className="text-[11px] text-muted-foreground">
                                  {memberInfo.businessName} &bull; {memberInfo.industry}
                                </p>
                              ) : (
                                <p className="text-[11px] text-muted-foreground">
                                  Chapter Member
                                </p>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-muted-foreground text-xs italic">
                            <AlertCircle className="h-4 w-4 text-amber-500" />
                            <span>Slot Unassigned</span>
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {isConfirmed ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium">
                            <Sparkles className="h-3 w-3 shrink-0" />
                            <span className="truncate max-w-[200px]">{m.theme}</span>
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">
                            Topic pending presenter
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {isConfirmed ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="h-3 w-3" />
                            Confirmed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            Open Slot
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openBookModal(m)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                              isConfirmed
                                ? "border border-input bg-card hover:bg-muted text-foreground"
                                : "bg-primary text-primary-foreground hover:opacity-90 shadow-2xs"
                            }`}
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                            <span>{isConfirmed ? "Edit Slot" : "Select Member"}</span>
                          </button>

                          {isConfirmed && (
                            <button
                              onClick={() => handleClearSlot(m.id)}
                              className="p-1 rounded-lg hover:bg-rose-500/10 text-muted-foreground hover:text-rose-600 transition-colors cursor-pointer"
                              title="Clear presenter slot"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Book / Edit Feature Presentation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-xs p-4">
          <div className="bg-card border border-border rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-5 animate-in fade-in-50">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                <h3 className="font-bold text-base text-foreground">
                  Assign Feature Presenter Slot
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Meeting Session Selector */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  Target Chapter Meeting Session *
                </label>
                <select
                  required
                  value={selectedMeetingId}
                  onChange={(e) => setSelectedMeetingId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-xs font-medium focus:ring-2 focus:ring-primary/20"
                >
                  <option value="" disabled>Select meeting session...</option>
                  {meetings.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.date} — {m.title} ({m.location})
                    </option>
                  ))}
                </select>
              </div>

              {/* Member Picker Dropdown */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  Select Chapter Member to Present *
                </label>
                <select
                  value={selectedMemberId}
                  onChange={(e) => handleMemberSelect(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-xs font-medium focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Choose a member from chapter roster...</option>
                  {members.map((mem) => (
                    <option key={mem.id} value={mem.id}>
                      {mem.name} — {mem.businessName} ({mem.industry})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Selecting a member automatically populates their verified name and industry credentials.
                </p>
              </div>

              {/* Speaker Name Input (Editable/Customizable) */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  Speaker / Presenter Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Rajesh Kumar or Guest Expert"
                  value={speakerName}
                  onChange={(e) => setSpeakerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-xs focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Presentation Topic / Theme */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  Presentation Theme / Topic *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Scaling B2B Corporate Architecture in 2026"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-xs focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="rounded-xl bg-muted/40 p-3 text-xs text-muted-foreground space-y-1 border border-border/50">
                <span className="font-semibold text-foreground block">
                  Presentation Guidelines:
                </span>
                <p>&bull; 8-Minute Core Business Presentation followed by 2 minutes of Q&A.</p>
                <p>&bull; The speaker will be spotlighted on the meeting agenda sent to all chapter colleagues.</p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-muted text-muted-foreground text-xs font-semibold hover:bg-muted/80 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !selectedMeetingId || !speakerName.trim()}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{submitting ? "Booking..." : "Confirm Presenter Slot"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
