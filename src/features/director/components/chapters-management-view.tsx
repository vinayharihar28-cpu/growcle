"use client";

import React, { useEffect, useState } from "react";
import { DirectorHeaderBar } from "./director-header-bar";
import { ChapterPerformanceTable } from "./chapter-performance-table";
import { CreateChapterModal } from "./create-chapter-modal";
import { AssignLeadershipModal } from "./assign-leadership-modal";
import { getDirectorOverview, ChapterSummary, getDirectorMembers } from "../actions/director-actions";
import { Building2, Plus } from "lucide-react";

export function ChaptersManagementView() {
  const [chapters, setChapters] = useState<ChapterSummary[]>([]);
  const [selectedChapterId, setSelectedChapterId] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  const [isCreateChapterOpen, setIsCreateChapterOpen] = useState(false);
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
      setChapters(overview.chapters);
    } catch (err) {
      console.error("Failed to load chapters", err);
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Assigned Chapters</h2>
          <p className="text-muted-foreground">Manage and compare operations across all chapters in your assigned director region.</p>
        </div>
        <button
          onClick={() => setIsCreateChapterOpen(true)}
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="h-4 w-4" /> Create Chapter
        </button>
      </div>

      <DirectorHeaderBar
        chapters={chapters}
        selectedChapterId={selectedChapterId}
        onSelectChapter={setSelectedChapterId}
        onOpenCreateChapter={() => setIsCreateChapterOpen(true)}
      />

      {loading ? (
        <div className="h-64 rounded-xl bg-muted animate-pulse" />
      ) : (
        <ChapterPerformanceTable
          chapters={chapters}
          onAssignLeadership={handleOpenAssignLeadership}
        />
      )}

      <CreateChapterModal
        isOpen={isCreateChapterOpen}
        onClose={() => setIsCreateChapterOpen(false)}
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
