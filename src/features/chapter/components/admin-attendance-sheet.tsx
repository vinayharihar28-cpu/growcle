"use client";

import * as React from "react";
import {
  UserCheck, Calendar, Search, Filter, CheckCircle2,
  XCircle, MinusCircle, Clock, ChevronDown, Loader2, AlertCircle, RefreshCw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Badge } from "@/shared/components/ui/badge";
import {
  getMeetingAttendanceSheet,
  getChapterMeetings,
  upsertMemberAttendance,
} from "@/features/chapter/actions/admin-dashboard";

type AttendanceStatus = "PRESENT" | "ABSENT" | "SUBSTITUTE" | "EXCUSED";

interface AttendanceSheetProps {
  chapterId: string;
}

const STATUS_CONFIG: Record<AttendanceStatus, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  PRESENT: {
    label: "Present",
    icon: CheckCircle2,
    color: "text-emerald-700 dark:text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
  ABSENT: {
    label: "Absent",
    icon: XCircle,
    color: "text-rose-700 dark:text-rose-400",
    bg: "bg-rose-500/10 border-rose-500/20",
  },
  SUBSTITUTE: {
    label: "Substitute",
    icon: UserCheck,
    color: "text-blue-700 dark:text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
  },
  EXCUSED: {
    label: "Excused",
    icon: Clock,
    color: "text-amber-700 dark:text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
  },
};

export function AdminAttendanceSheet({ chapterId }: AttendanceSheetProps) {
  const [meetings, setMeetings] = React.useState<any[]>([]);
  const [selectedMeetingId, setSelectedMeetingId] = React.useState<string>("");
  const [sheetData, setSheetData] = React.useState<any>(null);
  const [loadingMeetings, setLoadingMeetings] = React.useState(true);
  const [loadingSheet, setLoadingSheet] = React.useState(false);
  const [savingId, setSavingId] = React.useState<string | null>(null);
  const [savedIds, setSavedIds] = React.useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<AttendanceStatus | "ALL">("ALL");

  // Local optimistic attendance state
  const [localStatus, setLocalStatus] = React.useState<Record<string, AttendanceStatus>>({});

  React.useEffect(() => {
    if (!chapterId) return;
    getChapterMeetings(chapterId)
      .then((m) => {
        setMeetings(m);
        if (m.length > 0) setSelectedMeetingId(m[0].id);
      })
      .finally(() => setLoadingMeetings(false));
  }, [chapterId]);

  React.useEffect(() => {
    if (!selectedMeetingId) return;
    setLoadingSheet(true);
    setLocalStatus({});
    getMeetingAttendanceSheet(selectedMeetingId)
      .then((data) => {
        setSheetData(data);
        // Initialise local status from DB
        if (data?.members) {
          const init: Record<string, AttendanceStatus> = {};
          for (const m of data.members) {
            if (m.meetingAttendances?.[0]) {
              init[m.id] = m.meetingAttendances[0].status as AttendanceStatus;
            }
          }
          setLocalStatus(init);
        }
      })
      .finally(() => setLoadingSheet(false));
  }, [selectedMeetingId]);

  const handleStatusChange = async (memberId: string, status: AttendanceStatus) => {
    // Optimistic update
    setLocalStatus((prev) => ({ ...prev, [memberId]: status }));
    setSavingId(memberId);

    try {
      await upsertMemberAttendance(selectedMeetingId, memberId, status);
      setSavedIds((prev) => new Set(prev).add(memberId));
      setTimeout(() => setSavedIds((prev) => { const n = new Set(prev); n.delete(memberId); return n; }), 2000);
    } catch {
      // Revert on error
      setLocalStatus((prev) => {
        const reverted = { ...prev };
        delete reverted[memberId];
        return reverted;
      });
    } finally {
      setSavingId(null);
    }
  };

  const filteredMembers = React.useMemo(() => {
    if (!sheetData?.members) return [];
    return sheetData.members.filter((m: any) => {
      const name = `${m.firstName} ${m.lastName}`.toLowerCase();
      const business = (m.business?.businessName || "").toLowerCase();
      const matchesSearch = name.includes(searchQuery.toLowerCase()) || business.includes(searchQuery.toLowerCase());
      const currentStatus = localStatus[m.id] || "PRESENT";
      const matchesFilter = statusFilter === "ALL" || currentStatus === statusFilter;
      return matchesSearch && matchesFilter;
    });
  }, [sheetData?.members, searchQuery, statusFilter, localStatus]);

  // Summary counts
  const summary = React.useMemo(() => {
    const counts: Record<AttendanceStatus, number> = { PRESENT: 0, ABSENT: 0, SUBSTITUTE: 0, EXCUSED: 0 };
    if (!sheetData?.members) return counts;
    for (const m of sheetData.members) {
      const s = (localStatus[m.id] || "PRESENT") as AttendanceStatus;
      counts[s]++;
    }
    return counts;
  }, [sheetData?.members, localStatus]);

  if (loadingMeetings) {
    return <Skeleton className="h-96 w-full rounded-3xl" />;
  }

  if (meetings.length === 0) {
    return (
      <div className="p-12 text-center rounded-3xl border border-dashed">
        <AlertCircle className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
        <p className="font-semibold text-foreground">No Meetings Found</p>
        <p className="text-xs text-muted-foreground mt-1">Create a meeting from the Agenda tab first.</p>
      </div>
    );
  }

  const selectedMeeting = meetings.find((m) => m.id === selectedMeetingId);

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-slate-800 shadow-lg">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <UserCheck className="h-3.5 w-3.5" /> Weekly Roll Call
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold">Members Attendance Sheet</h2>
          <p className="text-xs text-slate-300">Mark attendance for each meeting. Changes save automatically.</p>
        </div>
        
        {/* Meeting Selector */}
        <div className="relative shrink-0">
          <select
            value={selectedMeetingId}
            onChange={(e) => setSelectedMeetingId(e.target.value)}
            className="h-10 pl-4 pr-10 rounded-xl text-xs font-semibold bg-slate-800 border border-slate-700 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[200px]"
          >
            {meetings.map((m) => (
              <option key={m.id} value={m.id}>
                {new Date(m.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                {m.title ? ` — ${m.title}` : ""}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Attendance Summary Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(Object.entries(STATUS_CONFIG) as [AttendanceStatus, typeof STATUS_CONFIG[AttendanceStatus]][]).map(([status, cfg]) => {
          const Icon = cfg.icon;
          return (
            <button
              key={status}
              onClick={() => setStatusFilter(statusFilter === status ? "ALL" : status)}
              className={`flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                statusFilter === status
                  ? `${cfg.bg} border-current ring-2 ring-current ring-offset-1 ring-offset-background`
                  : "border-border/60 hover:bg-muted/40"
              }`}
            >
              <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${cfg.bg}`}>
                <Icon className={`h-4.5 w-4.5 ${cfg.color}`} />
              </div>
              <div>
                <p className="text-xl font-extrabold text-foreground">{summary[status]}</p>
                <p className={`text-[11px] font-bold ${cfg.color}`}>{cfg.label}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Search & Filter Bar */}
      <Card className="rounded-3xl shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Calendar className="h-4 w-4 text-indigo-500" />
                {selectedMeeting
                  ? new Date(selectedMeeting.date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
                  : "Meeting Attendance"
                }
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                {sheetData?.members?.length ?? 0} members in chapter roster
                {statusFilter !== "ALL" && ` · Filtering: ${STATUS_CONFIG[statusFilter].label}`}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-56">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search member or business..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 pl-9 rounded-xl text-xs"
                />
              </div>
              {statusFilter !== "ALL" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStatusFilter("ALL")}
                  className="h-9 rounded-xl text-xs gap-1"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Clear
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loadingSheet ? (
            <div className="p-6 space-y-3">
              {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium">No members match your filter.</p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredMembers.map((member: any, idx: number) => {
                const currentStatus = (localStatus[member.id] || "PRESENT") as AttendanceStatus;
                const isSaving = savingId === member.id;
                const isSaved = savedIds.has(member.id);

                return (
                  <div
                    key={member.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 hover:bg-muted/20 transition-colors"
                  >
                    {/* Member Info */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-9 w-9 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center text-sm font-bold shrink-0">
                        {member.firstName[0]}{member.lastName[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {member.firstName} {member.lastName}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {member.business?.businessName || "No business listed"}
                          {member.business?.businessCategory ? ` · ${member.business.businessCategory}` : ""}
                        </p>
                      </div>
                    </div>

                    {/* Status Buttons */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {isSaving && <Loader2 className="h-4 w-4 text-muted-foreground animate-spin mr-1" />}
                      {isSaved && !isSaving && <CheckCircle2 className="h-4 w-4 text-emerald-500 mr-1" />}

                      {(Object.entries(STATUS_CONFIG) as [AttendanceStatus, typeof STATUS_CONFIG[AttendanceStatus]][]).map(
                        ([status, cfg]) => {
                          const Icon = cfg.icon;
                          const isSelected = currentStatus === status;
                          return (
                            <button
                              key={status}
                              onClick={() => handleStatusChange(member.id, status)}
                              disabled={isSaving}
                              title={cfg.label}
                              className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all border ${
                                isSelected
                                  ? `${cfg.bg} ${cfg.color} border-current shadow-sm`
                                  : "border-border/60 text-muted-foreground hover:border-current hover:bg-muted/50"
                              } ${isSaving ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                            >
                              <Icon className="h-4 w-4" />
                            </button>
                          );
                        }
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
