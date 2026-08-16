"use client";

import React, { useEffect, useState } from "react";
import {
  Building2,
  Users,
  UserCheck,
  UserPlus,
  Calendar,
  ClipboardCheck,
  Handshake,
  CreditCard,
  BarChart3,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { getDirectorOverview, getDirectorMembers, getDirectorLeadership, ChapterSummary } from "../actions/director-actions";
import Link from "next/link";

interface ChapterDetailViewProps {
  chapterId: string;
}

export function ChapterDetailView({ chapterId }: ChapterDetailViewProps) {
  const [chapter, setChapter] = useState<ChapterSummary | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "members" | "leadership" | "meetings" | "visitors" | "referrals" | "payments"
  >("overview");
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const overview = await getDirectorOverview(chapterId);
        if (overview.chapters.length > 0) {
          setChapter(overview.chapters[0]);
        }
        const mems = await getDirectorMembers({ chapterId });
        setMembers(mems);
      } catch (err) {
        console.error("Failed to load chapter detail", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [chapterId]);

  if (loading) {
    return <div className="h-64 rounded-xl bg-muted animate-pulse" />;
  }

  if (!chapter) {
    return (
      <div className="rounded-xl border bg-card p-12 text-center">
        <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-bold">Chapter Not Found</h3>
        <p className="text-sm text-muted-foreground">The requested chapter is not under your assigned scope.</p>
        <Link href="/dashboard/director/chapters" className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground font-semibold">
          Return to Chapters List
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-xl border bg-card p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Director Scope</span>
            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
              chapter.status === "HEALTHY" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
            }`}>
              {chapter.status === "HEALTHY" ? <CheckCircle2 className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
              {chapter.status}
            </span>
          </div>
          <h2 className="text-3xl font-bold text-foreground mt-1">{chapter.name}</h2>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" /> Code: {chapter.chapterCode}</span>
            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {chapter.location} ({chapter.region})</span>
            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {chapter.meetingDay}s @ {chapter.meetingTime}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/director/members"
            className="rounded-md border bg-background px-3 py-1.5 text-xs font-semibold hover:bg-accent"
          >
            Manage Roster
          </Link>
          <Link
            href="/dashboard/director/leadership"
            className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Assign Leadership
          </Link>
        </div>
      </div>

      {/* Detail Tabs */}
      <div className="flex border-b overflow-x-auto space-x-4">
        {[
          { id: "overview", label: "Overview", icon: Building2 },
          { id: "members", label: "Members Roster", icon: Users },
          { id: "leadership", label: "Leadership Team", icon: UserCheck },
          { id: "meetings", label: "Meetings", icon: Calendar },
          { id: "visitors", label: "Visitors", icon: UserPlus },
          { id: "referrals", label: "Referrals & Business", icon: Handshake },
          { id: "payments", label: "Payments", icon: CreditCard },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 pb-3 pt-2 text-sm font-medium border-b-2 transition-all shrink-0 ${
                isActive
                  ? "border-primary text-primary font-bold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4 md:col-span-2">
            <h3 className="font-bold text-base text-foreground">Chapter Metrics Summary</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="rounded-lg border p-3 bg-muted/30">
                <span className="text-muted-foreground">Active Members</span>
                <p className="text-xl font-bold text-foreground mt-1">{chapter.memberCount}</p>
              </div>
              <div className="rounded-lg border p-3 bg-muted/30">
                <span className="text-muted-foreground">Attendance Rate</span>
                <p className="text-xl font-bold text-foreground mt-1">{chapter.attendanceRate}%</p>
              </div>
              <div className="rounded-lg border p-3 bg-muted/30">
                <span className="text-muted-foreground">Visitor Conversion</span>
                <p className="text-xl font-bold text-foreground mt-1">{chapter.visitorConversion}%</p>
              </div>
              <div className="rounded-lg border p-3 bg-muted/30">
                <span className="text-muted-foreground">Closed Business</span>
                <p className="text-xl font-bold text-emerald-600 mt-1">${(chapter.closedBusiness / 1000).toFixed(1)}k</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-5 shadow-sm space-y-3">
            <h3 className="font-bold text-base text-foreground">Leadership Officers</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">President:</span>
                <span className="font-semibold">{chapter.presidentName}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Vice President:</span>
                <span className="font-semibold">{chapter.vpName}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Treasurer:</span>
                <span className="font-semibold">{chapter.treasurerName}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "members" && (
        <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-base">Members Roster ({members.length})</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50 text-xs font-semibold uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Member</th>
                  <th className="px-4 py-3">Business / Industry</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {members.map((m) => (
                  <tr key={m.id}>
                    <td className="px-4 py-3 font-semibold">{m.firstName} {m.lastName}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{m.businessName} • {m.industry}</td>
                    <td className="px-4 py-3 font-medium text-xs">{m.currentRole}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600">
                        {m.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
