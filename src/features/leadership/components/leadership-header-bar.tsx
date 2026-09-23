"use client";

import React from "react";
import { Building2, MapPin, Clock, ShieldCheck } from "lucide-react";
import { LeadershipContext } from "../actions/leadership-actions";

interface LeadershipHeaderBarProps {
  context: LeadershipContext;
}

export function LeadershipHeaderBar({ context }: LeadershipHeaderBarProps) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Chapter Console</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
            <ShieldCheck className="h-3 w-3" /> {context.position}
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mt-1">{context.chapterName}</h2>
        <div className="mt-2 flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5 text-primary" /> {context.chapterCode}</span>
          <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-primary" /> {context.location}</span>
          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-primary" /> {context.meetingDay?.endsWith("s") ? context.meetingDay : `${context.meetingDay}s`} @ {context.meetingTime}</span>
        </div>
      </div>
    </div>
  );
}
