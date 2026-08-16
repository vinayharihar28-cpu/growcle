"use client";

import React from "react";
import {
  Building2,
  Users,
  UserPlus,
  ClipboardCheck,
  Handshake,
  DollarSign,
  CreditCard,
  TrendingUp,
} from "lucide-react";
import { DirectorKPIs } from "../actions/director-actions";

interface DirectorKPICardsProps {
  kpis: DirectorKPIs;
}

export function DirectorKPICards({ kpis }: DirectorKPICardsProps) {
  const cards = [
    {
      title: "Total Chapters",
      value: kpis.totalChapters,
      subText: `${kpis.activeChapters} Active • ${kpis.inactiveChapters} Inactive`,
      icon: Building2,
      color: "text-indigo-500 bg-indigo-500/10",
      border: "border-indigo-500/20",
    },
    {
      title: "Total Members",
      value: kpis.totalMembers,
      subText: `${kpis.activeMembers} Active • ${kpis.pendingMembers} Pending`,
      icon: Users,
      color: "text-blue-500 bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      title: "Visitor Conversion",
      value: `${kpis.convertedVisitors} Converted`,
      subText: `${kpis.upcomingVisitors} Upcoming • ${kpis.attendedVisitors} Attended`,
      icon: UserPlus,
      color: "text-emerald-500 bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      title: "Attendance Rate",
      value: `${kpis.attendancePercentage}%`,
      subText: `+${kpis.attendanceTrend}% vs previous period`,
      icon: ClipboardCheck,
      color: "text-purple-500 bg-purple-500/10",
      border: "border-purple-500/20",
    },
    {
      title: "Total Referrals",
      value: kpis.totalReferrals,
      subText: `${kpis.closedWonReferrals} Closed Won • ${kpis.pendingReferrals} Pending`,
      icon: Handshake,
      color: "text-amber-500 bg-amber-500/10",
      border: "border-amber-500/20",
    },
    {
      title: "Closed Business",
      value: `$${(kpis.totalClosedBusiness / 1000).toFixed(1)}k`,
      subText: `+${kpis.closedBusinessTrend}% growth this quarter`,
      icon: DollarSign,
      color: "text-emerald-600 bg-emerald-600/10",
      border: "border-emerald-600/20",
    },
    {
      title: "Payments Collected",
      value: `$${(kpis.totalCollected / 1000).toFixed(1)}k`,
      subText: `$${(kpis.pendingPayments / 1000).toFixed(1)}k Pending • $${(kpis.outstandingPayments / 1000).toFixed(1)}k Due`,
      icon: CreditCard,
      color: "text-cyan-500 bg-cyan-500/10",
      border: "border-cyan-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`relative overflow-hidden rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md ${card.border}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {card.title}
              </span>
              <div className={`rounded-lg p-2 ${card.color}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-bold tracking-tight text-foreground">
                {card.value}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              {card.subText}
            </p>
          </div>
        );
      })}
    </div>
  );
}
