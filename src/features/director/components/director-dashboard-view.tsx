"use client";

import React, { useEffect, useState } from "react";
import { DirectorHeaderBar } from "./director-header-bar";
import { DirectorKPICards } from "./director-kpi-cards";
import { ChapterPerformanceTable } from "./chapter-performance-table";
import { MemberRoleModal } from "./member-role-modal";
import { AssignLeadershipModal } from "./assign-leadership-modal";
import { CreateChapterModal } from "./create-chapter-modal";
import { SendNotificationModal } from "./send-notification-modal";
import { getDirectorOverview, ChapterSummary, DirectorKPIs, getDirectorMembers } from "../actions/director-actions";
import { Building2, Users, Handshake, AlertTriangle, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

export function DirectorDashboardView() {
  const [selectedChapterId, setSelectedChapterId] = useState<string>("all");
  const [kpis, setKpis] = useState<DirectorKPIs | null>(null);
  const [chapters, setChapters] = useState<ChapterSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Modals state
  const [isCreateChapterOpen, setIsCreateChapterOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [assignLeadershipState, setAssignLeadershipState] = useState<{
    isOpen: boolean;
    chapterId: string;
    chapterName: string;
    position: "PRESIDENT" | "VICE_PRESIDENT" | "TREASURER";
  }>({
    isOpen: false,
    chapterId: "",
    chapterName: "",
    position: "PRESIDENT",
  });
  const [membersForLeadership, setMembersForLeadership] = useState<{ id: string; name: string; email: string }[]>([]);

  const loadData = async () => {
    setLoading(true);
    try {
      const overview = await getDirectorOverview(selectedChapterId);
      setKpis(overview.kpis);
      setChapters(overview.chapters);
    } catch (err) {
      console.error("Failed to load director overview", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedChapterId]);

  const handleOpenAssignLeadership = async (
    chapterId: string,
    position: "PRESIDENT" | "VICE_PRESIDENT" | "TREASURER"
  ) => {
    const chap = chapters.find((c) => c.id === chapterId);
    if (!chap) return;

    const mems = await getDirectorMembers({ chapterId });
    setMembersForLeadership(mems.map((m) => ({ id: m.id, name: `${m.firstName} ${m.lastName}`, email: m.email })));
    setAssignLeadershipState({
      isOpen: true,
      chapterId,
      chapterName: chap.name,
      position,
    });
  };

  if (loading && !kpis) {
    return (
      <div className="space-y-6 animate-pulse p-4">
        <div className="h-16 rounded-xl bg-muted" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 rounded-xl bg-muted" />
          ))}
        </div>
        <div className="h-64 rounded-xl bg-muted" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Scope Selector & Quick Actions */}
      <DirectorHeaderBar
        chapters={chapters}
        selectedChapterId={selectedChapterId}
        onSelectChapter={setSelectedChapterId}
        onOpenCreateChapter={() => setIsCreateChapterOpen(true)}
        onOpenSendNotification={() => setIsNotificationOpen(true)}
      />

      {/* KPI Cards Summary */}
      {kpis && <DirectorKPICards kpis={kpis} />}

      {/* Quick Alerts Section if Leadership Vacancies Exist */}
      {chapters.some((c) => c.status !== "HEALTHY") && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-800 dark:text-amber-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 shrink-0 text-amber-600 dark:text-amber-400" />
            <div>
              <h4 className="font-bold text-sm">Leadership Attention Required</h4>
              <p className="text-xs text-amber-700 dark:text-amber-400">
                One or more assigned chapters have unassigned leadership positions (President, VP, or Treasurer).
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/director/leadership"
            className="rounded-md bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-700 transition-colors shrink-0 flex items-center gap-1"
          >
            Manage Leadership <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {/* Chapters Performance & Comparison Table */}
      <ChapterPerformanceTable
        chapters={chapters}
        onAssignLeadership={handleOpenAssignLeadership}
      />

      {/* Modals */}
      <CreateChapterModal
        isOpen={isCreateChapterOpen}
        onClose={() => setIsCreateChapterOpen(false)}
        onSuccess={loadData}
      />

      <SendNotificationModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        chapters={chapters}
        onSuccess={loadData}
      />

      <AssignLeadershipModal
        isOpen={assignLeadershipState.isOpen}
        onClose={() => setAssignLeadershipState((prev) => ({ ...prev, isOpen: false }))}
        chapterId={assignLeadershipState.chapterId}
        chapterName={assignLeadershipState.chapterName}
        initialPosition={assignLeadershipState.position}
        availableMembers={membersForLeadership}
        onSuccess={loadData}
      />
    </div>
  );
}
