"use client";

import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMeetings, updateMeeting } from "../actions/meetings";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Calendar, Clock, MapPin, Edit3, X, CheckCircle2 } from "lucide-react";
import { useWorkspaceStore } from "@/shared/stores/workspace";

export function MeetingsDataTable() {
  const queryClient = useQueryClient();
  const { selectedChapterId } = useWorkspaceStore();
  const [editingMeeting, setEditingMeeting] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({
    theme: "",
    date: "",
    startTime: "07:30 AM",
    venue: "",
    status: "SCHEDULED",
  });
  const [saving, setSaving] = useState(false);

  const { data: meetings = [], isLoading } = useQuery({
    queryKey: ["meetings", selectedChapterId],
    queryFn: () => getMeetings(selectedChapterId !== "all" ? selectedChapterId : undefined),
  });

  const handleOpenEdit = (m: any) => {
    setEditingMeeting(m);
    setEditForm({
      theme: m.theme || m.title || "",
      date: m.date ? new Date(m.date).toISOString().split("T")[0] : "",
      startTime: m.startTime || "07:30 AM",
      venue: m.location || m.venue || "",
      status: m.status || "SCHEDULED",
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMeeting) return;
    setSaving(true);
    try {
      await updateMeeting(editingMeeting.id, {
        theme: editForm.theme,
        date: editForm.date,
        startTime: editForm.startTime,
        venue: editForm.venue,
        status: editForm.status as any,
      });
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
      setEditingMeeting(null);
    } catch (err) {
      console.error("Failed to update meeting:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Upcoming & Past Meetings</CardTitle>
          <CardDescription>View, audit, and modify meeting dates, venues, and regular schedules across chapters.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center text-sm text-muted-foreground">Loading meetings...</div>
          ) : (
            <div className="rounded-xl border overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/40 text-[11px] font-bold uppercase tracking-wider">
                  <TableRow>
                    <TableHead>Chapter</TableHead>
                    <TableHead>Theme / Title</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Venue / Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-xs">
                  {meetings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-28 text-center text-muted-foreground">
                        No meetings scheduled for this chapter filter.
                      </TableCell>
                    </TableRow>
                  ) : (
                    meetings.map((meeting: any) => (
                      <TableRow key={meeting.id} className="hover:bg-muted/30">
                        <TableCell className="font-semibold text-foreground">
                          {meeting.chapter?.name || "Chapter Session"}
                          {meeting.chapter?.chapterCode && (
                            <span className="block text-[10px] text-muted-foreground font-mono">
                              {meeting.chapter.chapterCode}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          {meeting.theme || meeting.title || "Weekly Business Meeting"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 font-medium">
                            <Calendar className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                            {new Date(meeting.date).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </div>
                          <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] mt-0.5">
                            <Clock className="w-3 h-3 shrink-0" />
                            {meeting.startTime || "07:30 AM"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="w-3 h-3 text-muted-foreground shrink-0" />
                            {meeting.location || meeting.venue || "Virtual / Hybrid Room"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={meeting.status === "COMPLETED" ? "default" : "secondary"}
                            className={
                              meeting.status === "COMPLETED"
                                ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                                : "bg-indigo-500/10 text-indigo-600 border border-indigo-500/20"
                            }
                          >
                            {meeting.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs px-2.5 cursor-pointer"
                            onClick={() => handleOpenEdit(meeting)}
                          >
                            <Edit3 className="w-3.5 h-3.5 mr-1" /> Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Meeting Modal */}
      {editingMeeting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-md rounded-2xl border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-bold text-foreground">Edit Scheduled Meeting</h3>
                <p className="text-xs text-muted-foreground">{editingMeeting.chapter?.name}</p>
              </div>
              <button
                onClick={() => setEditingMeeting(null)}
                className="rounded-full p-1.5 text-muted-foreground hover:bg-muted"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Meeting Title / Theme</label>
                <input
                  type="text"
                  required
                  value={editForm.theme}
                  onChange={(e) => setEditForm({ ...editForm, theme: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background p-2 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-muted-foreground">Date</label>
                  <input
                    type="date"
                    required
                    value={editForm.date}
                    onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                    className="w-full rounded-xl border border-input bg-background p-2 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-muted-foreground">Start Time</label>
                  <input
                    type="text"
                    required
                    value={editForm.startTime}
                    onChange={(e) => setEditForm({ ...editForm, startTime: e.target.value })}
                    className="w-full rounded-xl border border-input bg-background p-2 text-sm"
                    placeholder="07:30 AM"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Venue / Location</label>
                <input
                  type="text"
                  value={editForm.venue}
                  onChange={(e) => setEditForm({ ...editForm, venue: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background p-2 text-sm"
                  placeholder="e.g. Executive Boardroom or Google Meet"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Meeting Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background p-2 text-sm"
                >
                  <option value="SCHEDULED">SCHEDULED</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingMeeting(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                >
                  {saving ? "Saving..." : "Update Meeting"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
