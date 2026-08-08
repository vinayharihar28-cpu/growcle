'use client';

import { Building2, Shield, Calendar, Users, Settings } from 'lucide-react';
import { MOCK_CHAPTERS } from '@/lib/mock/mock-store';
import { Button } from '@/shared/components/ui/button';

export function ChapterConfigCard() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-foreground">Active Chapters & Governance</h3>
          <p className="text-xs text-muted-foreground">Manage chapter officers, meeting slots, and membership capacities</p>
        </div>
        <Button size="sm" variant="outline" className="text-xs">
          + Create New Chapter
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_CHAPTERS.map((chap) => (
          <div key={chap.id} className="p-5 rounded-2xl border bg-card space-y-4 shadow-xs hover:border-indigo-500/40 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground">{chap.name}</h4>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-muted-foreground" />
                    Every {chap.meetingDay}s at {chap.meetingTime}
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                {chap.memberCount} Members
              </span>
            </div>

            <div className="space-y-2 pt-2 border-t text-xs">
              <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Chapter Officers</div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-lg border bg-accent/30">
                  <span className="text-[10px] text-muted-foreground block font-medium">President</span>
                  <span className="font-bold text-foreground block truncate">{chap.presidentName}</span>
                </div>
                <div className="p-2 rounded-lg border bg-accent/30">
                  <span className="text-[10px] text-muted-foreground block font-medium">Vice President</span>
                  <span className="font-bold text-foreground block truncate">{chap.vicePresidentName}</span>
                </div>
                <div className="p-2 rounded-lg border bg-accent/30">
                  <span className="text-[10px] text-muted-foreground block font-medium">Sec / Treas</span>
                  <span className="font-bold text-foreground block truncate">{chap.secretaryName}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-muted-foreground truncate max-w-[200px]">{chap.location}</span>
              <Button size="sm" variant="ghost" className="text-xs h-8 text-indigo-600 dark:text-indigo-400">
                <Settings className="w-3.5 h-3.5 mr-1" /> Configure Rules
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
