"use client";

import * as React from "react";
import {
  Calendar, Plus, Clock, MapPin, Mic, Printer,
  ChevronDown, AlertCircle, ChevronRight, Loader2,
  Users, FileText, Sparkles, Globe
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Badge } from "@/shared/components/ui/badge";
import { getMeetingAgenda, getChapterMeetings, createChapterMeeting } from "@/features/chapter/actions/admin-dashboard";

interface AdminMeetingAgendaProps {
  chapterId: string;
  chapterName?: string;
}

const DEFAULT_AGENDA = `1. Call to Order
2. Attendance Roll Call
3. Open Networking (10 min)
4. Member Education Slot (10 min)
5. Referrals & Testimonials
6. Visitor Introductions
7. Feature Presentation
8. Announcements
9. Close of Meeting`;

export function AdminMeetingAgenda({ chapterId, chapterName }: AdminMeetingAgendaProps) {
  const [view, setView] = React.useState<"list" | "create" | "view">("list");
  const [meetings, setMeetings] = React.useState<any[]>([]);
  const [loadingMeetings, setLoadingMeetings] = React.useState(true);
  const [selectedMeeting, setSelectedMeeting] = React.useState<any>(null);
  const [loadingAgenda, setLoadingAgenda] = React.useState(false);
  const [creating, setCreating] = React.useState(false);
  const [createSuccess, setCreateSuccess] = React.useState(false);

  // New Meeting Form State
  const [form, setForm] = React.useState({
    title: "",
    date: "",
    startTime: "",
    location: "",
    speaker: "",
    theme: "",
    agenda: DEFAULT_AGENDA,
    meetingType: "WEEKLY",
    zoomLink: "",
    isHybrid: false,
  });

  const loadMeetings = React.useCallback(() => {
    if (!chapterId) return;
    setLoadingMeetings(true);
    getChapterMeetings(chapterId)
      .then(setMeetings)
      .finally(() => setLoadingMeetings(false));
  }, [chapterId]);

  React.useEffect(() => {
    loadMeetings();
  }, [loadMeetings]);

  const handleViewAgenda = async (meetingId: string) => {
    setLoadingAgenda(true);
    setView("view");
    const data = await getMeetingAgenda(meetingId);
    setSelectedMeeting(data);
    setLoadingAgenda(false);
  };

  const handleCreate = async () => {
    if (!form.date || !chapterId) return;
    setCreating(true);
    try {
      await createChapterMeeting({ ...form, chapterId });
      setCreateSuccess(true);
      loadMeetings();
      setTimeout(() => {
        setCreateSuccess(false);
        setView("list");
      }, 1500);
    } catch {
      alert("Failed to create meeting.");
    } finally {
      setCreating(false);
    }
  };

  const handlePrint = () => window.print();

  // ──────────────────────────────────────────────────────────────────────────
  // MEETING LIST VIEW
  // ──────────────────────────────────────────────────────────────────────────
  if (view === "list") {
    return (
      <div className="space-y-5">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-slate-800 shadow-lg">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <FileText className="h-3.5 w-3.5" /> Meeting Agendas
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold">Reports & Agenda</h2>
            <p className="text-xs text-slate-300">Create, view, and print meeting agendas for weekly chapter sessions.</p>
          </div>
          <Button
            onClick={() => setView("create")}
            className="h-10 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md flex items-center gap-1.5 shrink-0"
          >
            <Plus className="h-4 w-4" /> New Meeting
          </Button>
        </div>

        {/* Meeting List */}
        <Card className="rounded-3xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Calendar className="h-4 w-4 text-indigo-500" /> All Chapter Meetings
            </CardTitle>
            <CardDescription className="text-xs">Click any meeting to view and print its agenda</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {loadingMeetings ? (
              <div className="p-5 space-y-3">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 rounded-2xl" />)}
              </div>
            ) : meetings.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">
                <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm font-medium">No meetings yet.</p>
                <p className="text-xs mt-1">Create your first meeting to get started.</p>
              </div>
            ) : (
              <div className="divide-y">
                {meetings.map((meeting) => {
                  const isPast = new Date(meeting.date) < new Date();
                  return (
                    <button
                      key={meeting.id}
                      onClick={() => handleViewAgenda(meeting.id)}
                      className="w-full flex items-center justify-between gap-4 px-5 py-4 hover:bg-muted/20 transition-colors text-left group"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="h-11 w-11 rounded-2xl bg-indigo-500/10 flex flex-col items-center justify-center shrink-0">
                          <span className="text-[10px] font-bold text-indigo-500 uppercase">
                            {new Date(meeting.date).toLocaleDateString("en-US", { month: "short" })}
                          </span>
                          <span className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400 leading-none">
                            {new Date(meeting.date).getDate()}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-foreground truncate">
                            {meeting.title || `Chapter Meeting — ${new Date(meeting.date).toLocaleDateString("en-US", { weekday: "long" })}`}
                          </p>
                          <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                            {meeting.location && (
                              <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                <MapPin className="h-3 w-3" /> {meeting.location}
                              </span>
                            )}
                            {meeting.speaker && (
                              <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                <Mic className="h-3 w-3" /> {meeting.speaker}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant={isPast ? "secondary" : "outline"} className="text-[10px]">
                          {isPast ? "Completed" : "Upcoming"}
                        </Badge>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // CREATE MEETING FORM
  // ──────────────────────────────────────────────────────────────────────────
  if (view === "create") {
    return (
      <div className="space-y-5 max-w-3xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-foreground">Create New Meeting</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Fill out the meeting details to generate an agenda.</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setView("list")} className="rounded-xl text-xs">
            ← Back to List
          </Button>
        </div>

        {createSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-sm font-semibold flex items-center gap-2">
            ✓ Meeting created successfully!
          </div>
        )}

        <div className="grid grid-cols-1 gap-5">
          <Card className="rounded-3xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Calendar className="h-4 w-4 text-indigo-500" /> Meeting Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Meeting Title</Label>
                  <Input
                    placeholder="e.g. Weekly Chapter Meeting #42"
                    value={form.title}
                    onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                    className="h-10 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Meeting Type</Label>
                  <select
                    value={form.meetingType}
                    onChange={(e) => setForm((p) => ({ ...p, meetingType: e.target.value }))}
                    className="flex h-10 w-full rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="WEEKLY">Weekly</option>
                    <option value="SPECIAL">Special Event</option>
                    <option value="TRAINING">Training</option>
                    <option value="SOCIAL">Social</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Date *</Label>
                  <Input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                    className="h-10 rounded-xl"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Start Time</Label>
                  <Input
                    type="time"
                    value={form.startTime}
                    onChange={(e) => setForm((p) => ({ ...p, startTime: e.target.value }))}
                    className="h-10 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" /> Location / Venue
                  </Label>
                  <Input
                    placeholder="e.g. Grand Ballroom, Hotel XYZ"
                    value={form.location}
                    onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                    className="h-10 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5" /> Zoom / Virtual Link
                  </Label>
                  <Input
                    placeholder="https://zoom.us/j/..."
                    value={form.zoomLink}
                    onChange={(e) => setForm((p) => ({ ...p, zoomLink: e.target.value }))}
                    className="h-10 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold flex items-center gap-1.5">
                    <Mic className="h-3.5 w-3.5" /> Featured Speaker
                  </Label>
                  <Input
                    placeholder="e.g. John Smith, CEO of Acme"
                    value={form.speaker}
                    onChange={(e) => setForm((p) => ({ ...p, speaker: e.target.value }))}
                    className="h-10 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" /> Meeting Theme
                  </Label>
                  <Input
                    placeholder="e.g. Building Referral Confidence"
                    value={form.theme}
                    onChange={(e) => setForm((p) => ({ ...p, theme: e.target.value }))}
                    className="h-10 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isHybrid"
                  checked={form.isHybrid}
                  onChange={(e) => setForm((p) => ({ ...p, isHybrid: e.target.checked }))}
                  className="h-4 w-4 rounded accent-indigo-600"
                />
                <label htmlFor="isHybrid" className="text-xs font-semibold text-foreground cursor-pointer">
                  Hybrid meeting (In-person + Virtual)
                </label>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <FileText className="h-4 w-4 text-emerald-500" /> Meeting Agenda
              </CardTitle>
              <CardDescription className="text-xs">Default agenda template — customize as needed</CardDescription>
            </CardHeader>
            <CardContent>
              <textarea
                rows={10}
                value={form.agenda}
                onChange={(e) => setForm((p) => ({ ...p, agenda: e.target.value }))}
                className="flex w-full rounded-xl border border-input bg-background px-4 py-3 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring font-mono"
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setView("list")} className="rounded-2xl">
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={creating || !form.date}
              className="px-8 h-11 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-2xl shadow-lg"
            >
              {creating ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Creating...</> : "Create Meeting"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // PRINTABLE AGENDA VIEW
  // ──────────────────────────────────────────────────────────────────────────
  if (view === "view") {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between print:hidden">
          <Button variant="ghost" size="sm" onClick={() => setView("list")} className="rounded-xl text-xs">
            ← Back to Meetings
          </Button>
          <Button
            onClick={handlePrint}
            className="h-9 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5"
          >
            <Printer className="h-4 w-4" /> Print Agenda
          </Button>
        </div>

        {loadingAgenda ? (
          <Skeleton className="h-96 w-full rounded-3xl" />
        ) : !selectedMeeting ? (
          <div className="p-12 text-center text-muted-foreground">
            <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Meeting not found.</p>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto print:max-w-none" id="printable-agenda">
            {/* Printable Agenda Card */}
            <Card className="rounded-3xl shadow-md print:shadow-none print:border-0">
              <CardContent className="p-8 space-y-6">

                {/* Chapter Header */}
                <div className="text-center border-b pb-6 space-y-2">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
                    {selectedMeeting.chapter?.name || chapterName || "Chapter"}
                  </p>
                  <h1 className="text-2xl font-extrabold text-foreground">
                    {selectedMeeting.title || "Chapter Meeting Agenda"}
                  </h1>
                  <div className="flex items-center justify-center gap-4 flex-wrap text-xs text-muted-foreground mt-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(selectedMeeting.date).toLocaleDateString("en-US", {
                        weekday: "long", year: "numeric", month: "long", day: "numeric"
                      })}
                    </span>
                    {selectedMeeting.startTime && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {new Date(selectedMeeting.startTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    )}
                    {selectedMeeting.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" /> {selectedMeeting.location}
                      </span>
                    )}
                    {selectedMeeting.isHybrid && (
                      <span className="flex items-center gap-1">
                        <Globe className="h-3.5 w-3.5" /> Hybrid
                      </span>
                    )}
                  </div>
                </div>

                {/* Theme / Speaker */}
                {(selectedMeeting.theme || selectedMeeting.speaker) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedMeeting.theme && (
                      <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200/50 dark:border-indigo-800/30">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 mb-1">Theme</p>
                        <p className="text-sm font-bold text-foreground">{selectedMeeting.theme}</p>
                      </div>
                    )}
                    {selectedMeeting.speaker && (
                      <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-800/30">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 mb-1">Featured Speaker</p>
                        <p className="text-sm font-bold text-foreground">{selectedMeeting.speaker}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Agenda Items */}
                {selectedMeeting.agenda && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                      <FileText className="h-3.5 w-3.5" /> Agenda
                    </h3>
                    <div className="space-y-1">
                      {selectedMeeting.agenda.split("\n").filter(Boolean).map((line: string, i: number) => (
                        <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-muted/30 transition-colors">
                          <span className="text-[11px] font-mono text-muted-foreground shrink-0 mt-0.5 w-5 text-right">{i + 1}.</span>
                          <span className="text-sm text-foreground">{line.replace(/^\d+\.\s*/, "")}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Zoom Link */}
                {selectedMeeting.zoomLink && (
                  <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200/50 dark:border-sky-800/30">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-sky-500 mb-1">Virtual Access</p>
                    <a href={selectedMeeting.zoomLink} target="_blank" rel="noopener noreferrer" className="text-xs text-sky-600 font-semibold break-all hover:underline">
                      {selectedMeeting.zoomLink}
                    </a>
                  </div>
                )}

                {/* Attendance Summary (if logged) */}
                {selectedMeeting.attendances?.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                      <Users className="h-3.5 w-3.5" /> Attendance ({selectedMeeting.attendances.length} members)
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {selectedMeeting.attendances.slice(0, 12).map((a: any) => (
                        <div key={a.id} className="flex items-center gap-2 p-2.5 rounded-xl border border-border/60 text-xs">
                          <div className="h-6 w-6 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center text-[10px] font-bold shrink-0">
                            {a.member?.firstName?.[0]}{a.member?.lastName?.[0]}
                          </div>
                          <span className="font-medium text-foreground truncate">
                            {a.member?.firstName} {a.member?.lastName}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="border-t pt-4 text-center text-[10px] text-muted-foreground print:block">
                  Powered by Growcle · {chapterName} · Generated {new Date().toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    );
  }

  return null;
}
