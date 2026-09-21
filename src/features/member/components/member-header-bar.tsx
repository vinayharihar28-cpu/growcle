"use client";

import React from "react";
import { User, Building2, MapPin, Calendar, Clock, CheckCircle2, ShieldCheck } from "lucide-react";
import { MemberContext } from "../actions/member-actions";

interface MemberHeaderBarProps {
  context: MemberContext;
}

export function MemberHeaderBar({ context }: MemberHeaderBarProps) {
  return (
    <div className="bg-gradient-to-r from-card via-card to-primary/5 border border-border rounded-2xl p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Member Identity & Chapter Details */}
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-lg flex-shrink-0">
            {context.firstName[0]}
            {context.lastName[0]}
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Welcome, {context.firstName}!
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="h-3 w-3" />
                Active Member
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                <ShieldCheck className="h-3 w-3" />
                {context.membershipNumber}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-1 text-foreground font-medium">
                <Building2 className="h-3.5 w-3.5 text-primary" />
                <span>{context.chapterName}</span>
                <span className="text-muted-foreground font-normal">({context.chapterCode})</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{context.meetingLocation}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Every {context.meetingDay}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{context.meetingTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Member Business Badge */}
        <div className="flex items-center gap-3 bg-muted/40 border border-border px-4 py-2.5 rounded-xl self-start md:self-auto">
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Representing</p>
            <p className="text-sm font-bold text-foreground">{context.businessName}</p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div>
            <span className="text-xs font-medium text-primary px-2 py-0.5 rounded-md bg-primary/10">
              {context.industry}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
