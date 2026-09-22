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

import { updateChapterDetails } from '@/features/director/actions/director-actions';

export function ChapterDetailsPage({ chapterId }: { chapterId: string }) {
  const [chapter, setChapter] = useState<ChapterDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'settings'>('overview');
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsForm, setSettingsForm] = useState({
    name: '',
    code: '',
    region: '',
    location: '',
    meetingDay: 'Wednesday',
    meetingTime: '07:30 AM',
    meetingFee: 800,
    upiId: '',
    upiName: '',
    themeColor: 'emerald',
  });

  useEffect(() => {
    AdminService.getChapters().then((data) => {
      const found = data.find(c => c.id === chapterId);
      if (found) {
        setChapter(found);
        setSettingsForm({
          name: found.name || '',
          code: found.code || '',
          region: found.region || '',
          location: found.location || '',
          meetingDay: found.meetingDay || 'Wednesday',
          meetingTime: found.meetingTime || '07:30 AM',
          meetingFee: found.meetingFee || 800,
          upiId: found.upiId || '',
          upiName: found.upiName || '',
          themeColor: found.themeColor || 'emerald',
        });
      }
      setLoading(false);
    });
  }, [chapterId]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsSaved(false);
    try {
      await updateChapterDetails({
        chapterId,
        name: settingsForm.name,
        chapterCode: settingsForm.code,
        region: settingsForm.region,
        meetingLocation: settingsForm.location,
        meetingDay: settingsForm.meetingDay,
        meetingTime: settingsForm.meetingTime,
        meetingFee: Number(settingsForm.meetingFee),
        upiId: settingsForm.upiId,
        upiName: settingsForm.upiName,
        themeColor: settingsForm.themeColor,
      });

      setChapter((prev) => prev ? ({
        ...prev,
        name: settingsForm.name,
        code: settingsForm.code,
        region: settingsForm.region,
        location: settingsForm.location,
        meetingDay: settingsForm.meetingDay,
        meetingTime: settingsForm.meetingTime,
        meetingFee: Number(settingsForm.meetingFee),
        upiId: settingsForm.upiId,
        upiName: settingsForm.upiName,
        themeColor: settingsForm.themeColor,
      }) : null);

      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 4000);
    } catch (err) {
      console.error("Failed to update chapter", err);
    } finally {
      setSavingSettings(false);
    }
  };

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
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
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
            <Button size="sm" variant="outline" className="text-xs cursor-pointer" onClick={() => setActiveTab('settings')}>
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
                  <Button variant="outline" className="justify-start text-xs h-9 cursor-pointer" onClick={() => setActiveTab('settings')}>
                    <Settings className="w-4 h-4 mr-2 text-muted-foreground" /> Chapter Settings
                  </Button>
                </div>
              </div>

            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-3xl border rounded-2xl bg-card p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-lg font-bold text-foreground">Chapter Settings & Customization</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Update regular meeting schedule, financial credentials, venue details, and theme color branding.
              </p>
            </div>

            {settingsSaved && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                Chapter configuration and meeting schedule saved successfully!
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Identity & Code</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">Chapter Name *</label>
                    <input
                      type="text"
                      required
                      value={settingsForm.name}
                      onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                      className="w-full p-2.5 text-sm border rounded-xl bg-background"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">Chapter Code</label>
                    <input
                      type="text"
                      value={settingsForm.code}
                      onChange={(e) => setSettingsForm({ ...settingsForm, code: e.target.value })}
                      className="w-full p-2.5 text-sm border rounded-xl bg-background font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Schedule & Location */}
              <div className="space-y-4 pt-2 border-t">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Meeting Schedule & Day</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">Regular Meeting Day *</label>
                    <select
                      value={settingsForm.meetingDay}
                      onChange={(e) => setSettingsForm({ ...settingsForm, meetingDay: e.target.value })}
                      className="w-full p-2.5 text-sm border rounded-xl bg-background"
                    >
                      {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">Meeting Time *</label>
                    <input
                      type="text"
                      value={settingsForm.meetingTime}
                      onChange={(e) => setSettingsForm({ ...settingsForm, meetingTime: e.target.value })}
                      className="w-full p-2.5 text-sm border rounded-xl bg-background"
                      placeholder="07:30 AM"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">Standard Fee (₹) *</label>
                    <input
                      type="number"
                      value={settingsForm.meetingFee}
                      onChange={(e) => setSettingsForm({ ...settingsForm, meetingFee: Number(e.target.value) })}
                      className="w-full p-2.5 text-sm border rounded-xl bg-background"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">Region</label>
                    <input
                      type="text"
                      value={settingsForm.region}
                      onChange={(e) => setSettingsForm({ ...settingsForm, region: e.target.value })}
                      className="w-full p-2.5 text-sm border rounded-xl bg-background"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">Meeting Location / Venue</label>
                    <input
                      type="text"
                      value={settingsForm.location}
                      onChange={(e) => setSettingsForm({ ...settingsForm, location: e.target.value })}
                      className="w-full p-2.5 text-sm border rounded-xl bg-background"
                    />
                  </div>
                </div>
              </div>

              {/* Financial & UPI */}
              <div className="space-y-4 pt-2 border-t">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Chapter UPI Collection</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">Chapter UPI VPA ID</label>
                    <input
                      type="text"
                      placeholder="e.g. chapter@okaxis"
                      value={settingsForm.upiId}
                      onChange={(e) => setSettingsForm({ ...settingsForm, upiId: e.target.value })}
                      className="w-full p-2.5 text-sm border rounded-xl bg-background font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">Payee Name</label>
                    <input
                      type="text"
                      placeholder="e.g. SSK Chapter Treasury"
                      value={settingsForm.upiName}
                      onChange={(e) => setSettingsForm({ ...settingsForm, upiName: e.target.value })}
                      className="w-full p-2.5 text-sm border rounded-xl bg-background"
                    />
                  </div>
                </div>
              </div>

              {/* Theme Color Customization */}
              <div className="space-y-4 pt-2 border-t">
                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Chapter Theme & Color</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Select a vibrant branding accent color for this chapter across member cards and badges.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {[
                    { id: "emerald", label: "Emerald Green", bg: "bg-emerald-500" },
                    { id: "indigo", label: "Indigo Royal", bg: "bg-indigo-500" },
                    { id: "purple", label: "Purple Velvet", bg: "bg-purple-500" },
                    { id: "amber", label: "Amber Gold", bg: "bg-amber-500" },
                    { id: "rose", label: "Rose Crimson", bg: "bg-rose-500" },
                    { id: "cyan", label: "Cyan Ocean", bg: "bg-cyan-500" },
                    { id: "orange", label: "Sunset Orange", bg: "bg-orange-500" },
                  ].map((color) => (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => setSettingsForm({ ...settingsForm, themeColor: color.id })}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all ${
                        settingsForm.themeColor === color.id
                          ? "border-primary ring-2 ring-primary/20 bg-primary/5 font-bold"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded-full ${color.bg}`} />
                      {color.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  type="submit"
                  disabled={savingSettings}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs h-10 px-5"
                >
                  <Save className="w-4 h-4 mr-1.5" /> {savingSettings ? "Saving Changes..." : "Save Chapter Settings"}
                </Button>
              </div>
            </form>
          </div>
        )}

        {activeTab !== 'overview' && activeTab !== 'settings' && (
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
