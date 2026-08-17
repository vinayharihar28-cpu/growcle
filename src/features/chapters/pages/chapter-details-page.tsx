'use client';

import { useState, useEffect } from 'react';
import { ChapterDetails } from '@/types/admin';
import { AdminService } from '@/features/admin/services/admin-service';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Button } from '@/shared/components/ui/button';
import { 
  Building2, Users, Calendar, MapPin, CheckCircle, Clock, 
  Settings, ChevronLeft, Briefcase, Award, TrendingUp,
  FileEdit, Ban, Save
} from 'lucide-react';
import Link from 'next/link';

export function ChapterDetailsPage({ chapterId }: { chapterId: string }) {
  const [chapter, setChapter] = useState<ChapterDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'settings'>('overview');

  useEffect(() => {
    // In a real app, we would fetch the specific chapter by ID
    AdminService.getChapters().then((data) => {
      const found = data.find(c => c.id === chapterId);
      if (found) setChapter(found);
      setLoading(false);
    });
  }, [chapterId]);

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-12 w-[300px]" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64 w-full md:col-span-2" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Chapter not found.
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6 p-2 animate-in fade-in duration-300">
      
      {/* Header and Back Link */}
      <div className="space-y-4 border-b pb-6">
        <Link href="/dashboard/chapters" className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Chapters
        </Link>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center border border-indigo-500/20 shrink-0">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">{chapter.name}</h1>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${chapter.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border-rose-500/20'}`}>
                  {chapter.status}
                </span>
              </div>
              <div className="text-sm font-medium text-muted-foreground mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1" /> {chapter.location} ({chapter.region})</span>
                <span className="flex items-center"><CheckCircle className="w-3.5 h-3.5 mr-1" /> Code: {chapter.code}</span>
              </div>
            </div>
          </div>
          
          {/* Admin Actions */}
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" className="text-xs">
              <FileEdit className="w-4 h-4 mr-1" /> Edit Chapter
            </Button>
            <Button size="sm" variant="outline" className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50">
              <Ban className="w-4 h-4 mr-1" /> Deactivate
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b">
        {['overview', 'members', 'leadership', 'meetings', 'referrals', 'settings'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === tab 
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="pt-2">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Main Stats Column */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Performance Mini-Dashboard */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl border bg-card text-center space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Active Members</span>
                  <div className="text-2xl font-extrabold text-indigo-600">{chapter.activeMembers}</div>
                </div>
                <div className="p-4 rounded-xl border bg-card text-center space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Attendance</span>
                  <div className="text-2xl font-extrabold text-emerald-600">{chapter.performance?.attendancePct}%</div>
                </div>
                <div className="p-4 rounded-xl border bg-card text-center space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Total Referrals</span>
                  <div className="text-2xl font-extrabold text-blue-600">{chapter.performance?.referrals}</div>
                </div>
                <div className="p-4 rounded-xl border bg-card text-center space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Closed Biz</span>
                  <div className="text-lg font-extrabold text-amber-600 flex items-center justify-center pt-1">{formatCurrency(chapter.performance?.closedBusiness || 0)}</div>
                </div>
              </div>

              {/* Leadership & Info */}
              <div className="p-6 rounded-2xl border bg-card">
                <h3 className="font-bold text-sm mb-4 border-b pb-2">Leadership Team</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                    <div className="p-2 bg-indigo-500/10 text-indigo-600 rounded-lg"><Briefcase className="w-4 h-4" /></div>
                    <div>
                      <div className="text-[10px] font-bold text-muted-foreground uppercase">Director</div>
                      <div className="text-sm font-semibold text-foreground">{chapter.directorName || 'Unassigned'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                    <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-lg"><Award className="w-4 h-4" /></div>
                    <div>
                      <div className="text-[10px] font-bold text-muted-foreground uppercase">President</div>
                      <div className="text-sm font-semibold text-foreground">{chapter.presidentName || 'Unassigned'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                    <div className="p-2 bg-blue-500/10 text-blue-600 rounded-lg"><TrendingUp className="w-4 h-4" /></div>
                    <div>
                      <div className="text-[10px] font-bold text-muted-foreground uppercase">Vice President</div>
                      <div className="text-sm font-semibold text-foreground">{chapter.vicePresidentName || 'Unassigned'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                    <div className="p-2 bg-amber-500/10 text-amber-600 rounded-lg"><CheckCircle className="w-4 h-4" /></div>
                    <div>
                      <div className="text-[10px] font-bold text-muted-foreground uppercase">Secretary / Treasurer</div>
                      <div className="text-sm font-semibold text-foreground">{chapter.secretaryName || 'Unassigned'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Column */}
            <div className="space-y-6">
              
              {/* Meeting Info */}
              <div className="p-5 rounded-2xl border bg-card space-y-4">
                <h3 className="font-bold text-sm border-b pb-2">Meeting Schedule</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground flex items-center"><Calendar className="w-4 h-4 mr-2" /> Day</span>
                    <span className="font-semibold">{chapter.meetingDay}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground flex items-center"><Clock className="w-4 h-4 mr-2" /> Time</span>
                    <span className="font-semibold">{chapter.meetingTime}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground flex items-center"><Building2 className="w-4 h-4 mr-2" /> Type</span>
                    <span className="font-semibold">{chapter.meetingType.replace('_', ' ')}</span>
                  </div>
                  {chapter.upcomingMeeting && (
                    <div className="pt-3 border-t">
                      <span className="text-xs text-muted-foreground block mb-1">Next Meeting</span>
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-500/10 px-2 py-1 rounded-md inline-block">
                        {new Date(chapter.upcomingMeeting).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions for this chapter */}
              <div className="p-5 rounded-2xl border bg-card space-y-4">
                <h3 className="font-bold text-sm border-b pb-2">Chapter Actions</h3>
                <div className="flex flex-col gap-2">
                  <Button variant="outline" className="justify-start text-xs h-9">
                    <Users className="w-4 h-4 mr-2 text-muted-foreground" /> View Member Directory
                  </Button>
                  <Button variant="outline" className="justify-start text-xs h-9">
                    <Calendar className="w-4 h-4 mr-2 text-muted-foreground" /> Schedule Meeting
                  </Button>
                  <Button variant="outline" className="justify-start text-xs h-9">
                    <Settings className="w-4 h-4 mr-2 text-muted-foreground" /> Chapter Settings
                  </Button>
                </div>
              </div>

            </div>
          </div>
        )}

        {activeTab !== 'overview' && (
          <div className="p-12 text-center border rounded-2xl bg-card border-dashed">
            <h3 className="text-lg font-bold text-foreground">Tab Content</h3>
            <p className="text-sm text-muted-foreground mt-2">
              The {activeTab} view for this chapter would be rendered here.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
