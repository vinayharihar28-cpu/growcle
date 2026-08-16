"use client";

import React, { useEffect, useState } from "react";
import { Calendar, Building2, MapPin, Users, Clock, Plus } from "lucide-react";
import { getDirectorMeetings, getAssignedChapters } from "../actions/director-actions";

export function MeetingsManagementView() {
  const [meetings, setMeetings] = useState<any[]>([]);
  const [chapters, setChapters] = useState<any[]>([]);
  const [chapterId, setChapterId] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getDirectorMeetings(chapterId);
        setMeetings(data);
        const chaps = await getAssignedChapters();
        setChapters(chaps);
      } catch (err) {
        console.error("Failed to load meetings", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [chapterId]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Director Meetings Oversight</h2>
        <p className="text-muted-foreground">Monitor weekly chapter meeting schedules, speakers, hybrid links, and agendas.</p>
      </div>

      <div className="rounded-xl border bg-card p-4 shadow-sm flex items-center justify-between">
        <select
          value={chapterId}
          onChange={(e) => setChapterId(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium"
        >
          <option value="all">All Assigned Chapters</option>
          {chapters.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <span className="text-xs font-semibold text-muted-foreground">{meetings.length} Scheduled Meetings</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="h-48 rounded-xl bg-muted animate-pulse col-span-full" />
        ) : (
          meetings.map((m) => (
            <div key={m.id} className="rounded-xl border bg-card p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-xs font-bold text-primary uppercase">{m.chapterName}</span>
                <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-semibold text-blue-600">{m.status}</span>
              </div>
              <h4 className="font-bold text-base text-foreground">{m.title}</h4>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-primary" /> {new Date(m.date).toLocaleDateString()}</p>
                <p className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-primary" /> {m.location}</p>
                <p className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-primary" /> {m.attendanceCount} Registered Attendees</p>
              </div>
              <div className="rounded-lg bg-muted/40 p-2.5 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">Speaker:</span> {m.speaker}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
