"use client";

import React from "react";
import { Building2, Plus, Bell, Search, ShieldCheck, Sparkles } from "lucide-react";
import { ChapterSummary } from "../actions/director-actions";

interface DirectorHeaderBarProps {
  chapters: ChapterSummary[];
  selectedChapterId: string;
  onSelectChapter: (id: string) => void;
  onOpenCreateChapter?: () => void;
  onOpenAddMember?: () => void;
  onOpenSendNotification?: () => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

export function DirectorHeaderBar({
  chapters,
  selectedChapterId,
  onSelectChapter,
  onOpenCreateChapter,
  onOpenAddMember,
  onOpenSendNotification,
  searchQuery = "",
  onSearchChange,
}: DirectorHeaderBarProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-sm md:flex-row md:items-center md:justify-between">
      {/* Scope & Selector */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Assigned Chapter Scope
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
              <Sparkles className="h-3 w-3" /> Director Mode
            </span>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <select
              value={selectedChapterId}
              onChange={(e) => onSelectChapter(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-1 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Assigned Chapters ({chapters.length})</option>
              {chapters.map((chap) => (
                <option key={chap.id} value={chap.id}>
                  {chap.name} ({chap.chapterCode})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Global Search & Quick Actions */}
      <div className="flex flex-wrap items-center gap-2">
        {onSearchChange && (
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search chapters, members..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        )}

        {onOpenAddMember && (
          <button
            onClick={onOpenAddMember}
            className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" /> Add Member
          </button>
        )}

        {onOpenCreateChapter && (
          <button
            onClick={onOpenCreateChapter}
            className="flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium hover:bg-accent transition-colors"
          >
            <Building2 className="h-4 w-4" /> Create Chapter
          </button>
        )}

        {onOpenSendNotification && (
          <button
            onClick={onOpenSendNotification}
            className="flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium hover:bg-accent transition-colors"
          >
            <Bell className="h-4 w-4" /> Send Announcement
          </button>
        )}
      </div>
    </div>
  );
}
