"use client";

import React, { useState, useEffect } from "react";
import { MeetingsDataTable } from "../components/meetings-data-table";
import { Button } from "@/shared/components/ui/button";
import { createMeeting, getChaptersForMeetings } from "../actions/meetings";
import { updateChapterDetails } from "@/features/director/actions/director-actions";
import { Plus, Calendar, Clock, MapPin, X, Settings2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function MeetingsPage() {
  const queryClient = useQueryClient();
  const [chapters, setChapters] = useState<any[]>([]);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isRegularDayOpen, setIsRegularDayOpen] = useState(false);

  // Schedule Meeting Form
  const [scheduleForm, setScheduleForm] = useState({
    chapterId: "",
    theme: "Weekly Business Synergy Meeting",
    date: new Date().toISOString().split("T")[0],
    startTime: "07:30 AM",
    venue: "Main Conference Room",
    meetingType: "IN_PERSON",
  });
  const [submittingSchedule, setSubmittingSchedule] = useState(false);

  // Regular Day Form
  const [regularDayForm, setRegularDayForm] = useState({
    chapterId: "",
    meetingDay: "Wednesday",
    meetingTime: "07:30 AM",
  });
  const [submittingRegularDay, setSubmittingRegularDay] = useState(false);

  useEffect(() => {
    getChaptersForMeetings().then((data) => {
      setChapters(data);
      if (data.length > 0) {
        setScheduleForm((prev) => ({ ...prev, chapterId: data[0].id }));
        setRegularDayForm({
          chapterId: data[0].id,
          meetingDay: data[0].meetingDay || "Wednesday",
          meetingTime: data[0].meetingTime || "07:30 AM",
        });
      }
    });
  }, []);

  const handleCreateMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleForm.chapterId) return;
    setSubmittingSchedule(true);
    try {
      await createMeeting(scheduleForm);
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
      setIsScheduleOpen(false);
    } catch (err) {
      console.error("Failed to schedule meeting:", err);
    } finally {
      setSubmittingSchedule(false);
    }
  };

  const handleUpdateRegularDay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regularDayForm.chapterId) return;
    setSubmittingRegularDay(true);
    try {
      await updateChapterDetails({
        chapterId: regularDayForm.chapterId,
        meetingDay: regularDayForm.meetingDay,
        meetingTime: regularDayForm.meetingTime,
      });
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
      setIsRegularDayOpen(false);
    } catch (err) {
      console.error("Failed to update regular meeting day:", err);
    } finally {
      setSubmittingRegularDay(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Meeting Management</h2>
          <p className="text-muted-foreground text-sm">
            Schedule upcoming chapter meetings, inspect attendance records, and adjust weekly meeting days.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Button
            variant="outline"
            onClick={() => setIsRegularDayOpen(true)}
            className="text-xs h-9 cursor-pointer"
          >
            <Settings2 className="w-3.5 h-3.5 mr-1.5" /> Set Regular Meeting Day
          </Button>
          <Button
            onClick={() => setIsScheduleOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-9 cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Schedule Meeting
          </Button>
        </div>
      </div>

      <MeetingsDataTable />

      {/* Schedule Meeting Modal */}
      {isScheduleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-md rounded-2xl border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-bold text-foreground">Schedule New Meeting</h3>
                <p className="text-xs text-muted-foreground">Add a new chapter meeting session to the calendar.</p>
              </div>
              <button
                onClick={() => setIsScheduleOpen(false)}
                className="rounded-full p-1.5 text-muted-foreground hover:bg-muted"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateMeeting} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Chapter *</label>
                <select
                  value={scheduleForm.chapterId}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, chapterId: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background p-2 text-sm"
                  required
                >
                  {chapters.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.chapterCode || "Chapter"})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Meeting Title / Theme *</label>
                <input
                  type="text"
                  required
                  value={scheduleForm.theme}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, theme: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background p-2 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-muted-foreground">Meeting Date *</label>
                  <input
                    type="date"
                    required
                    value={scheduleForm.date}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
                    className="w-full rounded-xl border border-input bg-background p-2 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-muted-foreground">Start Time *</label>
                  <input
                    type="text"
                    required
                    value={scheduleForm.startTime}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, startTime: e.target.value })}
                    className="w-full rounded-xl border border-input bg-background p-2 text-sm"
                    placeholder="07:30 AM"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Venue / Location</label>
                <input
                  type="text"
                  value={scheduleForm.venue}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, venue: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background p-2 text-sm"
                  placeholder="e.g. Executive Boardroom"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsScheduleOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submittingSchedule}
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                >
                  {submittingSchedule ? "Scheduling..." : "Schedule Meeting"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Regular Meeting Day Modal */}
      {isRegularDayOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-md rounded-2xl border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-bold text-foreground">Set Regular Weekly Meeting Day</h3>
                <p className="text-xs text-muted-foreground">
                  Configures the recurring day for weekly meetings and automatically shifts upcoming sessions.
                </p>
              </div>
              <button
                onClick={() => setIsRegularDayOpen(false)}
                className="rounded-full p-1.5 text-muted-foreground hover:bg-muted"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateRegularDay} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Select Chapter *</label>
                <select
                  value={regularDayForm.chapterId}
                  onChange={(e) => {
                    const found = chapters.find((c) => c.id === e.target.value);
                    setRegularDayForm({
                      chapterId: e.target.value,
                      meetingDay: found?.meetingDay || "Wednesday",
                      meetingTime: found?.meetingTime || "07:30 AM",
                    });
                  }}
                  className="w-full rounded-xl border border-input bg-background p-2 text-sm"
                  required
                >
                  {chapters.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.chapterCode || "Chapter"})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-muted-foreground">Regular Day *</label>
                  <select
                    value={regularDayForm.meetingDay}
                    onChange={(e) => setRegularDayForm({ ...regularDayForm, meetingDay: e.target.value })}
                    className="w-full rounded-xl border border-input bg-background p-2 text-sm"
                  >
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-muted-foreground">Standard Time *</label>
                  <input
                    type="text"
                    required
                    value={regularDayForm.meetingTime}
                    onChange={(e) => setRegularDayForm({ ...regularDayForm, meetingTime: e.target.value })}
                    className="w-full rounded-xl border border-input bg-background p-2 text-sm"
                    placeholder="07:30 AM"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsRegularDayOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submittingRegularDay}
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                >
                  {submittingRegularDay ? "Updating..." : "Update Regular Day"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
