'use client';

import { useState } from 'react';
import { useAdmin } from '../hooks/use-admin';
import { Button } from '@/shared/components/ui/button';
import { Can } from '@/lib/permissions/can';
import {
  Users,
  Calendar,
  UserPlus,
  ShieldCheck,
  Building2,
  Search,
  Plus,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Clock,
  KeyRound,
  FileCheck,
} from 'lucide-react';
import { AddMemberModal } from '../components/add-member-modal';
import { ManageMeetingModal } from '../components/manage-meeting-modal';
import { AttendanceManagerModal } from '../components/attendance-manager-modal';
import { ChapterConfigCard } from '../components/chapter-config-card';
import { AdminMeeting, AdminMember } from '@/types/admin';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function AdminWorkspacePage() {
  const {
    members,
    meetings,
    stats,
    loading,
    searchQuery,
    setSearchQuery,
    addMember,
    updateMemberStatus,
    deleteMember,
    scheduleMeeting,
    updateMeetingStatus,
    refresh,
  } = useAdmin();

  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'meetings' | 'chapters'>('overview');
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isScheduleMeetingOpen, setIsScheduleMeetingOpen] = useState(false);
  const [selectedAttendanceMeeting, setSelectedAttendanceMeeting] = useState<AdminMeeting | null>(null);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Administration Workspace</h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Centralized hub for managing chapter members, scheduling meetings, attendance tracking, and RBAC governance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Can perform="members.create">
            <Button onClick={() => setIsAddMemberOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold">
              <UserPlus className="w-4 h-4 mr-1.5" /> Add Member
            </Button>
          </Can>

          <Can perform="meetings.create">
            <Button onClick={() => setIsScheduleMeetingOpen(true)} variant="outline" className="text-xs font-semibold">
              <Calendar className="w-4 h-4 mr-1.5 text-indigo-500" /> Schedule Meeting
            </Button>
          </Can>
        </div>
      </div>

      {/* Stats Summary Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="p-4 rounded-2xl border bg-card space-y-1">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-indigo-500" /> Total Members
          </span>
          <div className="text-2xl font-extrabold text-foreground">{stats?.totalMembers || 0}</div>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +12% this month
          </span>
        </div>

        <div className="p-4 rounded-2xl border bg-card space-y-1">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-amber-500" /> Active Chapters
          </span>
          <div className="text-2xl font-extrabold text-foreground">{stats?.activeChapters || 0}</div>
          <span className="text-[10px] text-muted-foreground">Across all regions</span>
        </div>

        <div className="p-4 rounded-2xl border bg-card space-y-1">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-blue-500" /> Scheduled Meetings
          </span>
          <div className="text-2xl font-extrabold text-foreground">{stats?.scheduledMeetings || 0}</div>
          <span className="text-[10px] text-blue-600 font-semibold">Next: Thursday 7:30 AM</span>
        </div>

        <div className="p-4 rounded-2xl border bg-card space-y-1">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <FileCheck className="w-3.5 h-3.5 text-emerald-500" /> Avg Attendance
          </span>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {stats?.averageAttendancePct || 0}%
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold">High Engagement</span>
        </div>

        <div className="p-4 rounded-2xl border bg-card space-y-1 col-span-2 lg:col-span-1">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-rose-500" /> Pending Invites
          </span>
          <div className="text-2xl font-extrabold text-foreground">{stats?.pendingInvites || 0}</div>
          <span className="text-[10px] text-muted-foreground">Awaiting acceptance</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b text-xs font-semibold space-x-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={cn('pb-3 border-b-2 transition-colors', activeTab === 'overview' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-muted-foreground hover:text-foreground')}
        >
          Overview & Quick Actions
        </button>
        <button
          onClick={() => setActiveTab('members')}
          className={cn('pb-3 border-b-2 transition-colors', activeTab === 'members' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-muted-foreground hover:text-foreground')}
        >
          Member Management ({members.length})
        </button>
        <button
          onClick={() => setActiveTab('meetings')}
          className={cn('pb-3 border-b-2 transition-colors', activeTab === 'meetings' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-muted-foreground hover:text-foreground')}
        >
          Meetings & Attendance ({meetings.length})
        </button>
        <button
          onClick={() => setActiveTab('chapters')}
          className={cn('pb-3 border-b-2 transition-colors', activeTab === 'chapters' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-muted-foreground hover:text-foreground')}
        >
          Chapter Governance
        </button>
      </div>

      {/* TAB CONTENT: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-foreground">Recent Member Directory</h3>
              <Button size="sm" variant="ghost" onClick={() => setActiveTab('members')} className="text-xs text-indigo-500">
                View All →
              </Button>
            </div>

            <div className="border rounded-2xl bg-card divide-y overflow-hidden">
              {members.slice(0, 4).map((m) => (
                <div key={m.id} className="p-4 flex items-center justify-between hover:bg-accent/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-600/10 text-indigo-600 font-bold flex items-center justify-center text-xs border border-indigo-500/20">
                      {m.firstName[0]}
                      {m.lastName[0]}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-foreground">
                        {m.firstName} {m.lastName}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {m.businessName} • {m.industry}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-600 border border-indigo-500/20">
                      {m.roleName}
                    </span>
                    <span className="text-[11px] text-muted-foreground hidden sm:inline">{m.chapterName}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick RBAC Banner & Help */}
          <div className="space-y-4">
            <div className="p-5 rounded-2xl border bg-gradient-to-br from-indigo-900/90 to-slate-900 text-white space-y-3 shadow-lg">
              <div className="p-2 rounded-xl bg-white/10 w-fit text-indigo-300">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Role-Based Access Control</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Configure global and chapter permissions matrix, assign custom roles, and grant user overrides.
                </p>
              </div>
              <Link
                href="/dashboard/rbac"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors shadow-md"
              >
                Open RBAC Matrix →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Members Management */}
      {activeTab === 'members' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, company, industry..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border bg-card text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
              />
            </div>
            <Can perform="members.create">
              <Button onClick={() => setIsAddMemberOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold w-full sm:w-auto">
                <UserPlus className="w-4 h-4 mr-1.5" /> Add Member
              </Button>
            </Can>
          </div>

          <div className="border rounded-2xl bg-card overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-b text-[11px] font-bold text-muted-foreground uppercase">
                <tr>
                  <th className="p-3.5">Member Name</th>
                  <th className="p-3.5">Company & Industry</th>
                  <th className="p-3.5">Chapter</th>
                  <th className="p-3.5">Assigned Role</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {members.map((m) => (
                  <tr key={m.id} className="hover:bg-accent/40 transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-foreground">
                        {m.firstName} {m.lastName}
                      </div>
                      <div className="text-[11px] text-muted-foreground">{m.email}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-medium text-foreground">{m.businessName || 'N/A'}</div>
                      <div className="text-[11px] text-muted-foreground">{m.industry}</div>
                    </td>
                    <td className="p-3.5 text-muted-foreground font-medium">{m.chapterName || 'Unassigned'}</td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-600 border border-indigo-500/20">
                        {m.roleName}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded-full text-[10px] font-bold border',
                          m.status === 'ACTIVE' && 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
                          m.status === 'PENDING' && 'bg-amber-500/10 text-amber-600 border-amber-500/20',
                          m.status === 'SUSPENDED' && 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                        )}
                      >
                        {m.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <Can perform="members.edit">
                        <select
                          value={m.status}
                          onChange={(e) => updateMemberStatus(m.id, e.target.value as any)}
                          className="px-2 py-1 rounded-lg border text-[11px] bg-background outline-hidden cursor-pointer"
                        >
                          <option value="ACTIVE">Mark Active</option>
                          <option value="PENDING">Mark Pending</option>
                          <option value="SUSPENDED">Suspend Access</option>
                        </select>
                      </Can>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Meetings & Attendance */}
      {activeTab === 'meetings' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-base text-foreground">Scheduled Meetings & Attendance Sheets</h3>
            <Can perform="meetings.create">
              <Button onClick={() => setIsScheduleMeetingOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold">
                <Calendar className="w-4 h-4 mr-1.5" /> Schedule New Meeting
              </Button>
            </Can>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {meetings.map((meet) => (
              <div key={meet.id} className="p-5 rounded-2xl border bg-card space-y-4 shadow-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-indigo-500 tracking-wider block">
                      {meet.chapterName}
                    </span>
                    <h4 className="font-bold text-sm text-foreground">{meet.agenda}</h4>
                  </div>
                  <span
                    className={cn(
                      'px-2.5 py-0.5 text-[10px] font-bold rounded-full border',
                      meet.status === 'SCHEDULED' && 'bg-blue-500/10 text-blue-600 border-blue-500/20',
                      meet.status === 'COMPLETED' && 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
                      meet.status === 'CANCELLED' && 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                    )}
                  >
                    {meet.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground pt-2 border-t">
                  <div>📅 Date: <strong className="text-foreground">{meet.date}</strong></div>
                  <div>⏰ Time: <strong className="text-foreground">{meet.time}</strong></div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="text-xs text-muted-foreground">
                    Present: <strong className="text-emerald-600 dark:text-emerald-400">{meet.presentCount}</strong> | Visitors:{' '}
                    <strong className="text-amber-600 dark:text-amber-400">{meet.visitorCount}</strong>
                  </div>

                  <Can perform="meetings.attendance">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedAttendanceMeeting(meet)}
                      className="text-xs font-semibold border-indigo-500/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10"
                    >
                      <FileCheck className="w-3.5 h-3.5 mr-1" /> Open Attendance Sheet
                    </Button>
                  </Can>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Chapter Governance */}
      {activeTab === 'chapters' && <ChapterConfigCard />}

      {/* MODALS */}
      <AddMemberModal isOpen={isAddMemberOpen} onClose={() => setIsAddMemberOpen(false)} onSubmit={addMember} />
      <ManageMeetingModal isOpen={isScheduleMeetingOpen} onClose={() => setIsScheduleMeetingOpen(false)} onSubmit={scheduleMeeting} />
      <AttendanceManagerModal
        meeting={selectedAttendanceMeeting}
        isOpen={!!selectedAttendanceMeeting}
        onClose={() => setSelectedAttendanceMeeting(null)}
        onSaved={refresh}
      />
    </div>
  );
}
