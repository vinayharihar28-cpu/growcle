"use client";

import React from "react";
import { Building2, MapPin, Clock, ShieldCheck, UserCheck, Calendar, ClipboardCheck } from "lucide-react";
import Link from "next/link";
import { LeadershipContext } from "../actions/leadership-actions";

interface LeadershipHeaderBarProps {
  context: LeadershipContext;
}

export function LeadershipHeaderBar({ context }: LeadershipHeaderBarProps) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Chapter Workspace</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
            <ShieldCheck className="h-3 w-3" /> {context.position}
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mt-1">{context.chapterName}</h2>
        <div className="mt-2 flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5 text-primary" /> {context.chapterCode}</span>
          <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-primary" /> {context.location}</span>
          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-primary" /> {context.meetingDay}s @ {context.meetingTime}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 self-start md:self-auto">
        <Link
          href="/dashboard/leadership/attendance"
          className="rounded-md bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <ClipboardCheck className="h-4 w-4" /> Start Meeting Attendance
        </Link>
        <Link
          href="/dashboard/leadership/meetings"
          className="rounded-md border border-input bg-background px-3 py-2 text-xs font-semibold hover:bg-accent transition-colors flex items-center gap-1.5"
        >
          <Calendar className="h-3.5 w-3.5" /> Meeting Operations
        </Link>
      </div>
    </div>
  );
}
